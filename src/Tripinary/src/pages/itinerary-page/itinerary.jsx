import React, { useState, useEffect } from "react";
import DayCard from "../../components/day_card/day_card";
import "./itinerary.css";
import SidePanel from "../slide-out/slideout";

// INITIAL DATA (WILL REMOVE LATER)-Bev i think your implementation may be based on this one rn
// const itineraryData = {
//     destination: "Vancouver",
//     days: [
//         {
//             day: "Day 1",
//             items: [
//                 { time: "08:00", activity: "Visit Stanley Park" },
//                 { time: "09:00", activity: "Explore Gastown" },
//                 { time: "10:00", activity: "Coffee at Tim Hortons" },
//             ],
//         },
//         {
//             day: "Day 2",
//             items: [
//                 { time: "08:00", activity: "Visit Burnaby Park Conservation" },
//                 { time: "09:00", activity: "SFU Mountain Hike" },
//                 { time: "10:00", activity: "Lunch at Cactus Club" },
//             ],
//         },
//         {
//             day: "Day 3",
//             items: [
//                 { time: "08:00", activity: "Kitsilano Beach Morning Walk" },
//                 { time: "09:00", activity: "Yoga by the ocean" },
//                 { time: "10:00", activity: "Brunch at Local" },
//             ],
//         },
//     ],
// };

const waitingForData = [ // will change once i get from renz
    {
        "name": "Stanley Park",
        "vicinity": "Vancouver, BC, Canada",
        "types": ["park", "point_of_interest", "establishment"],
        "geometry": { "location": { "lat": 49.3000, "lng": -123.1440 } }
    },
    {
        "name": "Gastown",
        "vicinity": "Vancouver, BC, Canada",
        "types": ["neighborhood", "political", "point_of_interest", "establishment"],
        "geometry": { "location": { "lat": 49.2838, "lng": -123.1098 } }
    },
    {
        "name": "Fairmont Hotel Vancouver",
        "vicinity": "900 West Georgia Street, Vancouver",
        "types": ["lodging", "restaurant", "point_of_interest", "establishment"],
        "geometry": { "location": { "lat": 49.2837, "lng": -123.1211 } }
    },
    {
        "name": "Tim Hortons",
        "vicinity": "Various locations, Vancouver",
        "types": ["cafe", "food", "point_of_interest", "establishment"]
    },
    {
        "name": "Kitsilano Beach",
        "vicinity": "Vancouver, BC, Canada",
        "types": ["park", "beach", "point_of_interest", "establishment"]
    },
    {
        "name": "Burnaby Mountain Park",
        "vicinity": "Burnaby, BC, Canada",
        "types": ["park", "point_of_interest", "establishment"]
    },
    {
        "name": "Simon Fraser University Campus",
        "vicinity": "Burnaby, BC, Canada",
        "types": ["university", "point_of_interest", "establishment"]
    },
    {
        "name": "Cactus Club Cafe (Burrard)",
        "vicinity": "1085 Burrard St, Vancouver, BC, Canada",
        "types": ["restaurant", "food", "point_of_interest", "establishment"]
    },
    {
        "name": "Local Public Eatery",
        "vicinity": "2210 Cornwall Ave, Vancouver, BC, Canada",
        "types": ["restaurant", "food", "point_of_interest", "establishment"]
    },
    {
        "name": "Vancouver Aquarium", // Added for more variety
        "vicinity": "845 Avison Way, Vancouver, BC, Canada",
        "types": ["aquarium", "point_of_interest", "establishment"]
    },
    {
        "name": "Science World", // Added for more variety
        "vicinity": "1455 Quebec St, Vancouver, BC, Canada",
        "types": ["museum", "point_of_interest", "establishment"]
    }
];

function Itinerary() {

    // Beverly's map stuff 
    const [mapLocation, setupMapLocation] = useState("");
    const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const handleItemClick = (activity) => {
        setSearchQuery(activity);
        setIsSidePanelOpen(true);
    };

    // This will be gotten by AI
    const [itinerary, setItinerary] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [placesToItinerize, setPlacesToItinerize] = useState(waitingForData);

    const fetchItinerary = async () => {
        setIsLoading(true);
        setError(null); 
        try {
            const apiURL = 'http://localhost:5000/api/generate-itinerary';

            // Prepare data to send and backend will extract only the 'name' for AI prompt
            const dataToSend = placesToItinerize.map(place => ({ // THIS WILL CHANGE DEPEDNING ON RENZ'S
                name: place.name,
                vicinity: place.vicinity,
                types: place.types,
                geometry: place.geometry ? { location: place.geometry.location } : undefined
            }));

            const response = await fetch(apiURL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json',},
                body: JSON.stringify({ places: dataToSend }), // Send the array of place objects
            });

            // Error handling for non-successful HTTP responses from BACKEND
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Unknown error from backend.' }));
                throw new Error(`Error in backend. Status Code: ${response.status} - ${errorData.message || response.statusText}`);
            }

            const data = await response.json(); // JSON response received from backend
            
            // Basic validation to ensure the AI returned expected itinerary structure
            if (!Array.isArray(data) || data.some(day => !day.day || !Array.isArray(day.items))) {
                 throw new Error("Generated itinerary is in an unexpected format from the AI.");
            }
            setItinerary(data); // Update React state with the new itinerary

        } catch (err) {
            console.error("Failed to get the generated itinerary:", err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // This runs when when  component mounts to get the initial itinerary or if input changes
    useEffect(() => {
        if (placesToItinerize && placesToItinerize.length > 0) {
            fetchItinerary();
        } else {
            setError("No places data provided to generate an itinerary initially. Please try again.");
        }
    }, [placesToItinerize]);

    // IMPORTANT - CHANGE THE Trip to... part later once renz sends the location with the maps data
    return (
        <div className="itinerary-container">
            <SidePanel isOpen={isSidePanelOpen} searchQuery={searchQuery} onClose={() => setIsSidePanelOpen(false)} />
            
            <div className="itinerary-header">
                <h1>Itinerary</h1>
                <p>Trip to... TEMPOARY THING HERE</p> 
            </div>

            {isLoading && <p>Generating your itinerary ...</p>}
            {error && <p className="error-message">Error: {error}</p>}

            {!isLoading && !error && itinerary && itinerary.map((day, index) => (
                <DayCard
                    key={index}
                    title={day.day}
                    times={day.items.sort((a, b) => a.time.localeCompare(b.time))}
                    place={"Vancouver"} // WILL CHANGE THIS LATER
                    onItemClick={handleItemClick}
                />
            ))}

            {!isLoading && !error && !itinerary && (
                <p>Click "Regenerate" to start generating your itinerary!</p>
            )}

            <div className="itinerary-button">
            <button
                    className="regenerate-button"
                    onClick={fetchItinerary}
                    disabled={isLoading || placesToItinerize.length === 0} // Disable if loading or no input places
                >
                    {isLoading ? "Regenerating..." : "Regenerate ↺"}
                </button>
            </div>
        </div>
    );
}

export default Itinerary;