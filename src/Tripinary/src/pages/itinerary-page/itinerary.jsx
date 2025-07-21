import React, { useState, useEffect } from "react";
import DayCard from "../../components/day_card/day_card";
import "./itinerary.css";
import SidePanel from "../slide-out/slideout";

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

function Itinerary() {

    const [mapLocation, setupMapLocation] = useState("");

    const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const handleItemClick = (activity) => {
        setSearchQuery(activity);
        setIsSidePanelOpen(true);
    };


    return (
        <div className="itinerary-container">
            <SidePanel isOpen={isSidePanelOpen} searchQuery={searchQuery} onClose={() => setIsSidePanelOpen(false)} />
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
                    onItemClick={handleItemClick}
                />
            ))}

            <div className="itinerary-button">
                <button className="regenerate-button">Regenerate ↺</button>
            </div>
        </div>
    );
}

export default Itinerary;