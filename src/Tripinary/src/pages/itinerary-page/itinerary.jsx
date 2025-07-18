import React from "react";
import DayCard from "./day-card";
import "./itinerary.css";

const itineraryData = {
  destination: "Vancouver",
  days: [
    { day: "Day 1", items: ["08:00", "09:00", "10:00"] },
    { day: "Day 2", items: ["08:00", "09:00", "10:00"] },
    { day: "Day 3", items: ["08:00", "09:00", "10:00"] },
  ],
};

export default function Itinerary() {
  return (
    <div className="itinerary-container">
      <div className="itinerary-header">
        <h1>Itinerary</h1>
        <p>Trip to... {itineraryData.destination}</p>
      </div>

      {itineraryData.days.map((day, index) => (
        <DayCard key={index} title={day.day} times={day.items} />
      ))}

      <div className="itinerary-button">
        <button className="regenerate-button">Regenerate ↺</button>
      </div>
    </div>
  );
}
