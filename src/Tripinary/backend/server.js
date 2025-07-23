// backend/server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const rateLimit = require('express-rate-limit'); // Rate limiting
require('dotenv').config(); // Load environment variables from .env

const app = express();
const PORT = process.env.PORT || 5000; // Backend will run on port 5000 by default

// 2. CORS Configuration
// In development, allow 'http://localhost:5173'.
// In production, **STRICTLY** specify your frontend domain(s) for security (e.g., 'https://your-app.com').
const corsOptions = {
    origin: 'http://localhost:5173', // <--- IMPORTANT: This MUST match your frontend's port
    methods: 'POST', // Only allow POST requests to your API endpoint
    optionsSuccessStatus: 200 // For pre-flight requests
};
app.use(cors(corsOptions)); // Apply CORS middleware

// 3. JSON Body Parser: Parses incoming JSON request bodies
app.use(bodyParser.json());

// 4. Rate Limiting: Limit requests to prevent abuse (e.g., 100 requests per 15 mins per IP)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Max 100 requests
  message: 'Too many requests from this IP, please try again after 15 minutes.'
});

// Apply rate limiter only to your specific AI endpoint
app.use('/api/generate-itinerary', apiLimiter);

// --- OpenRouter API Configuration ---
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

// IMPORTANT: Choose an AI model that OpenRouter supports.
// "openai/gpt-3.5-turbo" is a valid choice. "google/gemini-pro" is another good one.
const AI_MODEL = "deepseek/deepseek-chat-v3-0324:free";

// --- API Endpoint for Itinerary Generation ---
// This is the endpoint your React frontend will call.
app.post('/api/generate-itinerary', async (req, res) => {
    // Your backend receives the 'places' array (with full Google Places objects) from the frontend
    const { places } = req.body;

    // --- Input Validation ---
    if (!places || !Array.isArray(places) || places.length === 0) {
        return res.status(400).json({ message: 'A list of places is required in the request body.' });
    }

    // --- Craft the Prompt for the AI ---
    // As requested, we will extract *only the name* of each place for the AI prompt.
    const placeNamesForAI = places.map(place => {
        // Ensure 'place.name' exists, provide a fallback if not
        return `- ${place.name || 'Unnamed Place'}`;
    }).join('\n'); // Join them with newlines to create a clean list for the AI

    const promptContent = `You are an expert travel planner. Given the following list of specific places/activities (by name), create a 3-day travel itinerary for a tourist visiting Surrey, British Columbia, Canada.

For each day, assign a reasonable time to each activity.
If there are not enough places/activities for 3 full days, or if a day has fewer than 3 activities, suggest additional appropriate activities (e.g., morning (around 8 AM), mid-morning (around 9 AM), lunch (around 12 PM), afternoon, evening) to make the day feel complete. Ensure these suggested activities are relevant to the Surrey/Vancouver area and complement the provided places.
Try to group geographically close activities and maintain a logical flow for the day, considering travel time between places.

Here are the specific places/activities to include:
${placeNamesForAI}

Format the output strictly as a JSON array of objects, where each object represents a day. Each day object should have a 'day' string (e.g., 'Day 1') and an 'items' array. Each item in 'items' should have a 'time' string (e.g., '08:00') and an 'activity' string.

Example of desired output format:
[
  {
    "day": "Day 1",
    "items": [
      { "time": "08:00", "activity": "Start at Stanley Park" },
      { "time": "09:00", "activity": "Explore Gastown" },
      { "time": "10:00", "activity": "Coffee at Tim Hortons" }
    ]
  },
  {
    "day": "Day 2",
    "items": [
      { "time": "08:00", "activity": "Visit Science World" },
      { "time": "12:00", "activity": "Lunch at Granville Island Market" },
      { "time": "15:00", "activity": "Walk along Kitsilano Beach" }
    ]
  },
  {
    "day": "Day 3",
    "items": [
      { "time": "09:00", "activity": "Hike Burnaby Mountain" },
      { "time": "13:00", "activity": "Explore Simon Fraser University Campus" },
      { "time": "18:00", "activity": "Dinner at a local restaurant in Surrey" }
    ]
  }
]

Ensure all provided places/activities are used where feasible and integrate new suggestions seamlessly if needed. Consider travel time between activities. Since the general location is Surrey, BC, feel free to include Vancouver attractions, as they are commonly visited together.`;

        try {
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

            if (!openRouterResponse.ok) {
                const errorData = await openRouterResponse.json().catch(() => ({ message: 'No detailed error message from OpenRouter.' }));
                console.error("OpenRouter API error (status %d):", openRouterResponse.status, errorData);
                throw new Error(`OpenRouter API error: ${openRouterResponse.status} - ${errorData.message || JSON.stringify(errorData)}`);
            }

            const openRouterJson = await openRouterResponse.json();
            const aiOutputText = openRouterJson.choices[0].message.content;

            let parsedItinerary;
            try {
                parsedItinerary = JSON.parse(aiOutputText);
            } catch (parseError) {
                console.error("Failed to parse AI's JSON response:", aiOutputText, parseError);
                return res.status(500).json({
                    message: "AI generated an unparseable response. Please try regenerating.",
                    rawResponse: aiOutputText
                });
            }

            res.json(parsedItinerary);

        } catch (error) {
            console.error('Error in /api/generate-itinerary endpoint:', error);
            res.status(500).json({ message: 'Internal server error while generating itinerary.', details: error.message });
        }
});

// --- Global Error Handler (catch any unhandled errors) ---
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong on the server!');
});

// --- Start the Backend Server ---
app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});