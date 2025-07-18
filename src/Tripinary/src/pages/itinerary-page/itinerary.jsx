import React from "react";
import DayCard from "./day-card";
import "./itinerary.css";
const itineraryData = {
    destination: "Vancouver",
    days: [
        {
            day: "Day 1",
            items: [
                { time: "08:00", activity: "Visit Stanley Park" },
                { time: "09:00", activity: "Explore Gastown" },
                { time: "10:00", activity: "Coffee at Tim Hortons" },
            ],
        },
        {
            day: "Day 2",
            items: [
                { time: "08:00", activity: "Visit Burnaby Park Conservation" },
                { time: "09:00", activity: "SFU Mountain Hike" },
                { time: "10:00", activity: "Lunch at Cactus Club" },
            ],
        },
        {
            day: "Day 3",
            items: [
                { time: "08:00", activity: "Kitsilano Beach Morning Walk" },
                { time: "09:00", activity: "Yoga by the ocean" },
                { time: "10:00", activity: "Brunch at Local" },
            ],
        },
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
                <DayCard
                    key={index}
                    title={day.day}
                    times={day.items}
                    place={itineraryData.destination}
                />
            ))}

            <div className="itinerary-button">
                <button className="regenerate-button">Regenerate ↺</button>
            </div>
        </div>
    );
}
