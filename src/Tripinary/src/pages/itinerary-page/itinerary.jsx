// FRONT END ITINERARY
import React, { useState, useEffect, useContext } from "react"; // Add useContext
import ItineraryContext from "../../context/ItineraryContext.jsx"; // Import ItineraryContext
import DayCard from "../../components/day_card/day_card";
import "./itinerary.css";
import SidePanel from "../slide-out/slideout";

function Itinerary() {
    // --- Get ItineraryForm from Context ---
    const { itineraryForm } = useContext(ItineraryContext);

    // Use selectedPlaces from context, defaulting to an empty array if not available
    const [placesToItinerize, setPlacesToItinerize] = useState(itineraryForm.selectedPlaces || []);
    const [itinerary, setItinerary] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedPlaceForPanel, setSelectedPlaceForPanel] = useState(null);
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    
    // --- fetchItinerary Function ---
    const fetchItinerary = async () => {
        setIsLoading(true);
        setError(null); // Clear previous errors

        // Ensure we have places to send
        if (!placesToItinerize || placesToItinerize.length === 0) {
            setError("Please select places to generate an itinerary.");
            setIsLoading(false);
            setItinerary(null); // Clear previous itinerary
            return;
        }

        // --- Construct Prompt based on itineraryForm context ---
        // Change ItineraryForm to itineraryForm below
        const destinationName = itineraryForm.destinationName || "Surrey, British Columbia, Canada";
        const durationNum = itineraryForm.duration?.num || 3; // Default to 3 days if not set
        const durationType = itineraryForm.duration?.timeType || "days"; // Default to 'days'

        let promptStart = `You are an expert travel planner. Given the following list of specific places/activities (by name), create a ${durationNum}-${durationType} travel itinerary`;

        if (destinationName && durationType === "days") {
            promptStart += ` for a tourist visiting ${destinationName}.`;
        } else {
            promptStart += `.`;
        }

        const placeNamesForAI = placesToItinerize.map(place => {
            return `- ${place.name || 'Unnamed Place'}`;
        }).join('\n');

        let promptContent = `${promptStart}

For each day, assign a reasonable time to each activity.
If there are not enough places/activities for ${durationNum} full ${durationType}, or if a day has fewer than 3 activities, suggest additional appropriate activities (e.g., morning (around 8 AM), mid-morning (around 9 AM), lunch (around 12 PM), afternoon, evening) to make the day feel complete. Ensure these suggested activities are relevant to the ${destinationName} area and complement the provided places.
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
            const response = await fetch("http://localhost:5000/api/generate-itinerary", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ places: placesToItinerize, prompt: promptContent }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Backend error! Status: ${response.status} - ${errorData.message || 'Unknown error'}`);
            }

            const data = await response.json();
            setItinerary(data);
        } catch (err) {
            console.error("Failed to fetch itinerary:", err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // --- useEffect Hook for Automatic Loading ---
    useEffect(() => {
        // Update local state when context places change
        // Change ItineraryForm to itineraryForm below
        setPlacesToItinerize(itineraryForm.selectedPlaces || []); 

        // Only fetch if there are selected places
        // Change ItineraryForm to itineraryForm below
        if (itineraryForm.selectedPlaces && itineraryForm.selectedPlaces.length > 0) {
            fetchItinerary();
        } else {
            setItinerary(null);
            setError("Please select destinations/activities on the previous screen to generate an itinerary.");
        }
    }, [itineraryForm.selectedPlaces, itineraryForm.destinationName, itineraryForm.duration]); // Change ItineraryForm to itineraryForm below

    const handleSelectPlaceForPanel = (place) => {
        setSelectedPlaceForPanel(place);
        setIsPanelOpen(true);
    };

    const handleClosePanel = () => {
        setIsPanelOpen(false);
        setSelectedPlaceForPanel(null);
    };

    return (
        // Change ItineraryForm to itineraryForm below
        <div className="itinerary-container">
            <h1>Your Trip Itinerary for {itineraryForm.destinationName || "Surrey, BC"}</h1>
            {isLoading && <p>Generating your itinerary...</p>}
            {error && <p className="error-message">Error: {error}</p>}

            {!isLoading && !error && !itinerary && (
                <p>Select destinations from the previous page to generate an itinerary!</p>
            )}

            {itinerary && itinerary.length > 0 ? (
                <div className="itinerary-days-container">
                    {itinerary.map((dayData, index) => (
                        <DayCard
                            key={index}
                            day={dayData.day}
                            items={dayData.items}
                            onSelectPlace={handleSelectPlaceForPanel}
                        />
                    ))}
                </div>
            ) : (
                placesToItinerize.length > 0 && !isLoading && !error && (
                    <div className="itinerary-button">
                        <button
                            className="regenerate-button"
                            onClick={fetchItinerary}
                            disabled={isLoading || placesToItinerize.length === 0}
                        >
                            {isLoading ? "Regenerating..." : "Regenerate ↺"}
                        </button>
                    </div>
                )
            )}

            <SidePanel
                isOpen={isPanelOpen}
                onClose={handleClosePanel}
                place={selectedPlaceForPanel}
            />
        </div>
    );
}

export default Itinerary;

// import React, { useState, useEffect } from "react";
// import DayCard from "../../components/day_card/day_card";
// import "./itinerary.css";
// import SidePanel from "../slide-out/slideout";

// // INITIAL DATA (WILL REMOVE LATER)-Bev i think your implementation may be based on this one rn
// // const itineraryData = {
// //     destination: "Vancouver",
// //     days: [
// //         {
// //             day: "Day 1",
// //             items: [
// //                 { time: "08:00", activity: "Visit Stanley Park" },
// //                 { time: "09:00", activity: "Explore Gastown" },
// //                 { time: "10:00", activity: "Coffee at Tim Hortons" },
// //             ],
// //         },
// //         {
// //             day: "Day 2",
// //             items: [
// //                 { time: "08:00", activity: "Visit Burnaby Park Conservation" },
// //                 { time: "09:00", activity: "SFU Mountain Hike" },
// //                 { time: "10:00", activity: "Lunch at Cactus Club" },
// //             ],
// //         },
// //         {
// //             day: "Day 3",
// //             items: [
// //                 { time: "08:00", activity: "Kitsilano Beach Morning Walk" },
// //                 { time: "09:00", activity: "Yoga by the ocean" },
// //                 { time: "10:00", activity: "Brunch at Local" },
// //             ],
// //         },
// //     ],
// // };

// const waitingForData = [ // will change once i get from renz
//     {
//         "name": "Stanley Park",
//         "vicinity": "Vancouver, BC, Canada",
//         "types": ["park", "point_of_interest", "establishment"],
//         "geometry": { "location": { "lat": 49.3000, "lng": -123.1440 } }
//     },
//     {
//         "name": "Gastown",
//         "vicinity": "Vancouver, BC, Canada",
//         "types": ["neighborhood", "political", "point_of_interest", "establishment"],
//         "geometry": { "location": { "lat": 49.2838, "lng": -123.1098 } }
//     },
//     {
//         "name": "Fairmont Hotel Vancouver",
//         "vicinity": "900 West Georgia Street, Vancouver",
//         "types": ["lodging", "restaurant", "point_of_interest", "establishment"],
//         "geometry": { "location": { "lat": 49.2837, "lng": -123.1211 } }
//     },
//     {
//         "name": "Tim Hortons",
//         "vicinity": "Various locations, Vancouver",
//         "types": ["cafe", "food", "point_of_interest", "establishment"]
//     },
//     {
//         "name": "Kitsilano Beach",
//         "vicinity": "Vancouver, BC, Canada",
//         "types": ["park", "beach", "point_of_interest", "establishment"]
//     },
//     {
//         "name": "Burnaby Mountain Park",
//         "vicinity": "Burnaby, BC, Canada",
//         "types": ["park", "point_of_interest", "establishment"]
//     },
//     {
//         "name": "Simon Fraser University Campus",
//         "vicinity": "Burnaby, BC, Canada",
//         "types": ["university", "point_of_interest", "establishment"]
//     },
//     {
//         "name": "Cactus Club Cafe (Burrard)",
//         "vicinity": "1085 Burrard St, Vancouver, BC, Canada",
//         "types": ["restaurant", "food", "point_of_interest", "establishment"]
//     },
//     {
//         "name": "Local Public Eatery",
//         "vicinity": "2210 Cornwall Ave, Vancouver, BC, Canada",
//         "types": ["restaurant", "food", "point_of_interest", "establishment"]
//     },
//     {
//         "name": "Vancouver Aquarium", // Added for more variety
//         "vicinity": "845 Avison Way, Vancouver, BC, Canada",
//         "types": ["aquarium", "point_of_interest", "establishment"]
//     },
//     {
//         "name": "Science World", // Added for more variety
//         "vicinity": "1455 Quebec St, Vancouver, BC, Canada",
//         "types": ["museum", "point_of_interest", "establishment"]
//     }
// ];

// function Itinerary() {

//     // Beverly's map stuff 
//     const [mapLocation, setupMapLocation] = useState("");
//     const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
//     const [searchQuery, setSearchQuery] = useState("");
//     const handleItemClick = (activity) => {
//         setSearchQuery(activity);
//         setIsSidePanelOpen(true);
//     };

//     // This will be gotten by AI
//     const [itinerary, setItinerary] = useState(null);
//     const [isLoading, setIsLoading] = useState(false);
//     const [error, setError] = useState(null);
//     const [placesToItinerize, setPlacesToItinerize] = useState(waitingForData);

//     const fetchItinerary = async () => {
//         setIsLoading(true);
//         setError(null);
//         try {
//             const apiURL = 'http://localhost:5000/api/generate-itinerary';

//             // Prepare data to send and backend will extract only the 'name' for AI prompt
//             const dataToSend = placesToItinerize.map(place => ({ // THIS WILL CHANGE DEPEDNING ON RENZ'S
//                 name: place.name,
//                 vicinity: place.vicinity,
//                 types: place.types,
//                 geometry: place.geometry ? { location: place.geometry.location } : undefined
//             }));

//             const response = await fetch(apiURL, {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json', },
//                 body: JSON.stringify({ places: dataToSend }), // Send the array of place objects
//             });

//             // Error handling for non-successful HTTP responses from BACKEND
//             if (!response.ok) {
//                 const errorData = await response.json().catch(() => ({ message: 'Unknown error from backend.' }));
//                 throw new Error(`Issue in the backend. Status Code: ${response.status}: ${errorData.message || response.statusText}`);
//             }

//             const data = await response.json(); // JSON response received from backend

//             // Basic validation to ensure the AI returned expected itinerary structure
//             if (!Array.isArray(data) || data.some(day => !day.day || !Array.isArray(day.items))) {
//                 throw new Error("Generated itinerary is in an unexpected format from the AI.");
//             }
//             setItinerary(data); // Update React state with the new itinerary

//         } catch (err) {
//             console.error("Failed to get the generated itinerary:", err);
//             setError(err.message);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     // This runs when when  component mounts to get the initial itinerary or if input changes
//     useEffect(() => {
//         if (placesToItinerize && placesToItinerize.length > 0) {
//             fetchItinerary();
//         } else {
//             setError("No places data provided to generate an itinerary initially. Please try again.");
//         }
//     }, [placesToItinerize]);

//     // IMPORTANT - CHANGE THE Trip to... part later once renz sends the location with the maps data
//     return (
//         <div className="itinerary-container">
//             <SidePanel isOpen={isSidePanelOpen} searchQuery={searchQuery} onClose={() => setIsSidePanelOpen(false)} />

//             <div className="itinerary-header">
//                 <h1>Itinerary</h1>
//                 <p>Trip to... I'LL ADD THIS IN LATER</p>
//             </div>

//             {isLoading && <p>Generating your itinerary ...</p>}
//             {error && <p className="error-message">Error: {error}</p>}

//             {!isLoading && !error && itinerary && itinerary.map((day, index) => (
//                 <DayCard
//                     key={index}
//                     title={day.day}
//                     times={day.items.sort((a, b) => a.time.localeCompare(b.time))}
//                     place={"Vancouver"} // WILL CHANGE THIS LATER
//                     onItemClick={handleItemClick}
//                 />
//             ))}

//             {!isLoading && !error && !itinerary && ( // shows when
//                 <p>Click "Regenerate" to start regenerate your itinerary!</p>
//             )}

//             <div className="itinerary-button">
//                 <button
//                     className="regenerate-button"
//                     onClick={fetchItinerary}
//                     disabled={isLoading || placesToItinerize.length === 0} // Disable if loading or no input places
//                 >
//                     {isLoading ? "Generating..." : "Regenerate ↺"}
//                 </button>
//             </div>
//         </div>
//     );
// }

// export default Itinerary;