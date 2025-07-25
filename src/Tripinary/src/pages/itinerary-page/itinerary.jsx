import React, { useState, useEffect, useContext } from "react";
import ItineraryContext from "../../context/ItineraryContext.jsx";
import DayCard from "../../components/day_card/day_card";
import "./itinerary.css";
import SidePanel from "../slide-out/slideout";

function Itinerary() {
    const { itineraryForm } = useContext(ItineraryContext);

    const itinerary = itineraryForm.generatedItinerary;
    const isLoading = itineraryForm.isLoadingItinerary;
    const error = itineraryForm.itineraryError;
    const placesToItinerize = itineraryForm.selectedPlaces; 

    const [selectedPlaceForPanel, setSelectedPlaceForPanel] = useState(null);
    const [isPanelOpen, setIsPanelOpen] = useState(false);

    const handleSelectPlaceForPanel = (place) => {
        setSelectedPlaceForPanel(place);
        setIsPanelOpen(true);
    };

    const handleClosePanel = () => {
        setIsPanelOpen(false);
        setSelectedPlaceForPanel(null);
    };

    return (
        <div className="itinerary-container">
            <h1>Your Trip Itinerary for {itineraryForm.destinationName || "Your Destination"}</h1>
            
            {isLoading && <p>Generating your itinerary...</p>}
            {error && <p className="error-message">Error: {error}</p>}

            {!isLoading && !error && !itinerary && (
                <p>No itinerary available. Please select destinations/activities on the previous screen to generate one!</p>
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
                        <p>Something went wrong or itinerary not yet generated. Please try again.</p>
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