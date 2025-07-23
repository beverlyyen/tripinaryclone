// backend
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
// const helmet = require('helmet'); // Security headers
const rateLimit = require('express-rate-limit'); // Rate limiting
require('dotenv').config(); // Load environment variables from .env

const app = express();
const PORT = process.env.PORT || 5000; // Backend will run on port 5000 by default

// --- Middleware Setup ---
// app.use(helmet());
// app.disable('x-powered-by');

// 2. CORS Configuration
// In development, allow all origins.
// In production, **STRICTLY** specify your frontend domain(s) for security.
const corsOptions = {
    origin: 'http://localhost:5173', // Allow your React dev server
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

const AI_MODEL = "openai/gpt-3.5-turbo"; // ??? might change

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

    const promptContent = `You are an expert travel planner. Given the following list of specific places/activities (by name), create a 3-day travel itinerary for a tourist visiting Surrey, British Columbia, Canada.`

});