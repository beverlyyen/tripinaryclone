require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000; 

app.use(cors());

const APIKEY = process.env.GOOGLE_PLACES_API_KEY;
console.log("API KEY:", APIKEY);


app.get('/api/place-details', async (req, res) => {
  const { place_id } = req.query;
  if (!place_id) return res.status(400).json({ error: 'Missing place_id' });

  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&key=${APIKEY}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.status !== "OK") {
      console.error("Google API error:", data);
      return res.status(500).json({ error: "Google API error", details: data });
    }
    res.json(data);
  } catch (err) {
    console.error("Error fetching from Google Places API:", err);
    res.status(500).json({ error: 'Failed to fetch from Google Places API', details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});