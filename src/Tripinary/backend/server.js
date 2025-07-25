const express = require('express');
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config(); // Ensure dotenv is loaded to access .env variables
const fetch = require('node-fetch'); // You might need to install 'node-fetch' if you haven't: npm install node-fetch

const app = express();
const PORT = process.env.PORT || 5000; // Backend will run on port 5000 

const corsOptions = {
    origin: 'http://localhost:5173', // Your frontend port
    methods: 'POST', // Only allow POST requests for this API
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions)); // Apply CORS middleware

app.use(bodyParser.json()); // Use body-parser to parse JSON request bodies

// Rate limiting to prevent abuse
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per 15 minutes
    message: 'Too many requests from this IP, please try again after 15 minutes.'
});
app.use('/api/generate-itinerary', apiLimiter); // Apply rate limiter to the itinerary endpoint

// OpenRouter API Configuration 
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY; 
const OPENROUTER_API_URL = "[https://openrouter.ai/api/v1/chat/completions](https://openrouter.ai/api/v1/chat/completions)";

// NOTE: It worked when you tested with "openai/gpt-3.5-turbo". Keep this model for now.
const AI_MODEL = "qwen/qwen3-coder:free";

// API Endpoint for itinerary generation
app.post('/api/generate-itinerary', async (req, res) => {
    // Destructure data sent from your frontend's Itinerary.jsx
    const { selectedPlaces, destinationName, duration } = req.body;

    // --- Input Validation ---
    if (!selectedPlaces || !Array.isArray(selectedPlaces) || selectedPlaces.length === 0) {
        return res.status(400).json({ message: 'No places selected for itinerary. Please select at least one place.' });
    }
    if (!destinationName) {
        return res.status(400).json({ message: 'Destination name is required.' });
    }
    if (!duration || !duration.num || !duration.timeType) {
        return res.status(400).json({ message: 'Trip duration (number and type) is required.' });
    }

    // Helper to format places for the AI prompt
    const formattedPlaces = selectedPlaces.map(place => {
        // Use displayName.text if available, otherwise fallback to name or a generic "Unnamed Place"
        const name = place.displayName?.text || place.name || 'Unnamed Place';
        const address = place.formattedAddress ? ` (${place.formattedAddress})` : '';
        return `- ${name}${address}`; 
    }).join('\n');

    // --- Construct the AI Prompt ---
    const promptContent = `You are an expert travel planner. 
    Generate a ${duration.num} ${duration.timeType} itinerary for a trip to ${destinationName}.
    The itinerary MUST include the following specific places/activities:
    ${formattedPlaces}

    For each day, assign a reasonable time to each activity.
    If there are not enough activities for the duration, or if a day has fewer than 3 activities,
    suggest additional appropriate activities (e.g., morning (around 8 AM), mid-morning (around 9 AM),
    lunch (around 12 PM), afternoon, evening) to make the day feel complete. Make sure these suggested
    activities are relevant to the area and complement the provided places.
    Try to group geographically close activities and consider travel time between places.

    Format the entire output strictly as a JSON array of daily itinerary objects.
    Each daily object MUST have a "day" string (e.g., "Day 1", "Day 2") and an "items" array.
    Each item in the "items" array MUST have a "time" string (e.g., "08:00", "12:30") and an "activity" string.
    
    DO NOT include any introductory or concluding text, explanations, or conversational filler.
    DO NOT wrap the JSON in markdown code blocks (e.g., NO \`\`\`json\`\`\` or similar).
    Ensure the JSON is perfectly valid and ready for direct parsing.`;

    try {
        // Make the request to OpenRouter API
        const openRouterResponse = await fetch(OPENROUTER_API_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: AI_MODEL,
                messages: [{ role: "user", content: promptContent }]
            })
        });

        // Check if the OpenRouter API call itself failed
        if (!openRouterResponse.ok) {
            const errorText = await openRouterResponse.text(); // Read as text in case it's not JSON
            console.error("OpenRouter API error (status %d):", openRouterResponse.status, errorText);
            throw new Error(`OpenRouter API error: ${openRouterResponse.status} - ${errorText}`);
        }

        const openRouterJson = await openRouterResponse.json();
        const aiOutput = openRouterJson.choices[0].message.content;

        // --- IMPORTANT FIX: Extract pure JSON from AI's markdown wrapper ---
        let cleanJsonResponse = aiOutput;
        if (cleanJsonResponse.startsWith('```json')) {
            // Find the start of the JSON (after '```json\n')
            const jsonStart = cleanJsonResponse.indexOf('\n');
            // Find the end of the JSON (before the last '```')
            const jsonEnd = cleanJsonResponse.lastIndexOf('```');
            
            if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
                cleanJsonResponse = cleanJsonResponse.substring(jsonStart + 1, jsonEnd).trim();
            } else {
                // If the markdown format is unexpected, log and try to parse the original, or throw
                console.warn("AI response started with ```json but could not find proper closing ```. Attempting to parse original.");
            }
        }
        // --- END IMPORTANT FIX ---

        console.log("--- RAW AI RESPONSE ---");
        console.log(aiOutput);
        console.log("--- CLEANED JSON RESPONSE ---");
        console.log(cleanJsonResponse);

        let itineraryData;
        try {
            itineraryData = JSON.parse(cleanJsonResponse); // This is where the parsing happens
        } catch (parseError) {
            console.error("Failed to parse AI's JSON response:", parseError);
            console.error("AI Response that caused parsing error:", cleanJsonResponse);
            return res.status(500).json({
                message: "Backend error! Status: 500 - AI generated an unparseable response (JSON parsing failed).",
                rawResponse: cleanJsonResponse // Send the cleaned response to frontend for debugging
            });
        }

        // Return the parsed itinerary data to the frontend
        res.json(itineraryData);

    } catch (error) {
        console.error('Error in /api/generate-itinerary endpoint:', error);
        res.status(500).json({ 
            message: 'Internal server error while generating itinerary.', 
            details: error.message 
        });
    }
});

// Generic error handling middleware for the server side
app.use((err, req, res, next) => {
    console.error(err.stack); // Log the full error stack to the server console
    res.status(500).send('Something went wrong on the server!');
});

// Start the backend server
app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});

// const express = require('express');
// const rateLimit = require('express-rate-limit');

// const bodyParser = require('body-parser');
// const cors = require('cors');
// require('dotenv').config();

// const app = express();
// const PORT = process.env.PORT || 5000; // Backend will run on port 5000 

// const corsOptions = {
//     origin: 'http://localhost:5173', // this is frontend port
//     methods: 'POST',
//     optionsSuccessStatus: 200
// };
// app.use(cors(corsOptions));

// app.use(bodyParser.json());

// // This will limit 100 requests/15 minutes so people don't mess with it
// const apiLimiter = rateLimit({
//     windowMs: 15 * 60 * 1000,
//     max: 100,
//     message: 'Too many requests from this IP, please try again after 15 minutes.'
// });
// app.use('/api/generate-itinerary', apiLimiter);

// // OpenRouter API Configuration 
// const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY; // fyi I stored this in backend folder
// const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

// // NOTE it worked when I tested it with "openai/gpt-3.5-turbo" will have to find other ones later
// const AI_MODEL = "openai/gpt-3.5-turbo";

// // API Endpoint for itinerary generation
// app.post('/api/generate-itinerary', async (req, res) => {
//     const { places, destinationName, duration } = req.body;

//     const promptContent = `Generate a ${duration.num} ${duration.timeType} itinerary for ${destinationName} including the following places: ${JSON.stringify(places)}. The response MUST be a JSON array of daily itinerary objects. Each daily object must have a "day" property (e.g., "Day 1") and an "items" property which is an array of activities. Each activity item must have "time" and "activity" properties. DO NOT include any introductory or concluding text, and DO NOT wrap the JSON in markdown code blocks (e.g., no \`\`\`json\`\`\`).`;

//     try {
//         // Assuming your AI model call looks something like this:
//         const result = await model.generateContent(promptContent); // Or whatever your AI library uses
//         const aiResponseText = result.response.text(); // Get the raw text from AI

//         // --- NEW CODE: Extract JSON from markdown if present ---
//         let cleanJsonResponse = aiResponseText;
//         if (cleanJsonResponse.startsWith('```json')) {
//             cleanJsonResponse = cleanJsonResponse.substring(
//                 cleanJsonResponse.indexOf('\n') + 1,
//                 cleanJsonResponse.lastIndexOf('```')
//             ).trim();
//         }

//     // NOTE will have to change this logic once renz formats the data
//     if (!places || !Array.isArray(places) || places.length === 0) {
//         return res.status(400).json({ message: 'A list of places is required in the request body.' });
//     }

//     // ask AI to prompt me a response which then I will use on itinerary
//     const placeNamesForAI = places.map(place => {
//         return `- ${place.name || 'Unnamed Place'}`; // extract only name of place from AI prompt which opens slide view
//     }).join('\n');

//     const promptContent = `You are an expert travel planner. Given the following list of specific
//     places/activities (by name), create a 3-day travel itinerary for a tourist visiting the
//     provided destination. For each day, assign a reasonable time to each activity.
//     If there are not enough places/activities for the number of days, or if a day has fewer than 3 activities,
//     suggest additional appropriate activities (e.g., morning (around 8 AM), mid-morning (around 9 AM),
//     lunch (around 12 PM), afternoon, evening) to make the day feel complete. Make sure these suggested
//     activities are relevant to the area and complement the provided places.
//     Try to group geographically close activities and consider travel time between places.

//     Here are the specific places/activities to include:
//     ${placeNamesForAI}

//     Format the output strictly as a JSON array of objects, where each object represents a day.
//     Each day object should have a 'day' string (e.g., 'Day 1') and an 'items' array.
//     Each item in 'items' should have a 'time' string (e.g., '08:00') and an 'activity' string.

//     Example of how I want an output to be formatted:
//     [
//     {
//         "day": "Day 1",
//         "items": [
//         { "time": "08:00", "activity": "Start at Stanley Park" },
//         { "time": "09:00", "activity": "Explore Gastown" },
//         { "time": "10:00", "activity": "Coffee at Tim Hortons" }
//         ]
//     },
//     {
//         "day": "Day 2",
//         "items": [
//         { "time": "08:00", "activity": "Visit Science World" },
//         { "time": "12:00", "activity": "Lunch at Granville Island Market" },
//         { "time": "15:00", "activity": "Walk along Kitsilano Beach" }
//         ]
//     },
//     {
//         "day": "Day 3",
//         "items": [
//         { "time": "09:00", "activity": "Hike Burnaby Mountain" },
//         { "time": "13:00", "activity": "Explore Simon Fraser University Campus" },
//         { "time": "18:00", "activity": "Dinner at a local restaurant on Burnaby Mountain" }
//         ]
//     }
//     ]`;

//     try {
//         const openRouterResponse = await fetch(OPENROUTER_API_URL, {
//             method: "POST",
//             headers: {
//                 "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//                 model: AI_MODEL,
//                 messages: [{ role: "user", content: promptContent }]
//             })
//         });

//         if (!openRouterResponse.ok) {
//             const errorData = await openRouterResponse.json().catch(() => ({ message: 'No error message from OpenRouter.' }));
//             console.error("OpenRouter API error (status %d):", openRouterResponse.status, errorData);
//             throw new Error(`OpenRouter API error: ${openRouterResponse.status} - ${errorData.message || JSON.stringify(errorData)}`);
//         }

//         const openRouterJson = await openRouterResponse.json();
//         const aiOutput = openRouterJson.choices[0].message.content;

//         let itineraryMain; // this is the one that gets returned after parsing

//         try {
//             itineraryMain = JSON.parse(aiOutput);
//         } catch (parseError) {
//             console.error("Failed to parse AI's JSON response:", aiOutput, parseError);
//             return res.status(500).json({
//                 message: "AI generated an unparseable response. Please try to regenerate",
//                 rawResponse: aiOutput
//             });
//         }

//         res.json(itineraryMain);

//     } catch (error) {
//         console.error('Error in /api/generate-itinerary endpoint:', error);
//         res.status(500).json({ message: 'Internal server error while generating itinerary.', details: error.message });
//     }
// });

// // error handling for the server side
// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).send('Something went wrong on the server!');
// });

// // this will start backend hopefully
// app.listen(PORT, () => {
//     console.log(`Backend server running on http://localhost:${PORT}`);
// });