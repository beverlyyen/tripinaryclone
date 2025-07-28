import { useState, useEffect } from "react";
import Activity_Carousel from "../../components/activity_carousel/activity_carousel.jsx";
import "./activity_suggestions.css";

const getCategory = (cat) => {
  switch(cat) {
    case "food_drinks":
      return "Food & Drinks"
    case "attractions_sightseeing":
      return "Attractions & Sightseeing"
    case "activities_recreation":
      return "Activities & Recreation"
    case "shopping":
      return "Shopping"
    default:
      return "" 
  }
}

function Activity_Suggestions({ pois, destination }) {

  const [tips, setTips] = useState("");

// 🔌 Fetch travel tip from Qwen (OpenRouter)
  async function fetchTips(destination) {
    try {
       console.log("Sending Qwen request for:", destination)
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer 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`,        // 🔐 Replace with your actual API key
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:5173/"                 // 🌐 Required for free-tier users

          
        },
         body: JSON.stringify({
          model: "qwen/qwen3-coder:free",                     
          messages: [
            {
              role: "user",
              content: `Give a short one-liner helpful travel tip for someone visiting ${destination}. Keep it under 15 words, and make it witty, practical, or surprising.`
            }
          ]
        })
      });

      const data = await response.json();
       console.log("Qwen response:", data);
      const tip = data.choices?.[0]?.message?.content;
      setTips(tip || "No tip available, but adventure awaits!");
    } catch (error) {
      console.error("Failed to fetch tip:", error);
      setTips("Oops! Couldn't fetch your travel tip.");
    }
  }

  // 🚀 Run when destination changes
  useEffect(() => {
    if (destination) {
      fetchTips(destination);
    }
  }, [destination]);

  return (
    <div className="activity_suggestions">
      <h1>
        Plan a trip in <span>{destination}</span>
      </h1>
      <div className = "tips-container">
      <p className="tips-label">HELPFUL TRAVEL TIP TO {destination}</p>
      <p className="tips-desc">{tips}</p>
      </div>
      <div>
        {Object.entries(pois).map(([category, places]) => (
          <>
            <Activity_Carousel key={category} category={getCategory(category)} list={places} />
          </>
        ))}
      </div>
    </div>
  );
}

export default Activity_Suggestions;
