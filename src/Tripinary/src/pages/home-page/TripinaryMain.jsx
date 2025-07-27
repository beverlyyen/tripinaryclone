import { React, useState, useContext, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import Place_AutoComplete from "../../components/place_autocomplete/Place_Autocomplete";
import Activity_Suggestions from "../activity-suggestions/activity_suggestions";

import ItineraryContext from "../../context/ItineraryContext";
import PoisContext from "../../context/PoisContext";

import categoryTypes from "../../assets/category_types.json";
import "./TripinaryMain.css";

const TripinaryMain = () => {
  const { itineraryForm, updateDestinationName, updateDuration } = useContext(ItineraryContext);
  const { pois, findPois, deletePois, isPoisEmpty, notification, isVisible } = useContext(PoisContext);

  const [clicked, setClick] = useState(false);
  const [duration, setDuration] = useState(0);
  const [timeType, setTimeType] = useState("days");
  const [selectedPlace, setSelectedPlace] = useState(null);



  useEffect(() => {
    if (!isPoisEmpty()) {
      setClick(true); // Show suggestions if POIs exist from previous session
    }
  }, [isPoisEmpty]);

  const handleSubmitDestination = (e) => {
    e.preventDefault();

    if(selectedPlace === null && duration === 0) {
      alert("Please enter a city or increase the trip duration.");
      return;
    }


    setClick(true);
    
    if (selectedPlace && selectedPlace.geometry) {
      const location = {
        lat: selectedPlace.geometry.location.lat(),
        lng: selectedPlace.geometry.location.lng()
      };

      // delete current pois otherwise new destination search will append to current pois
      deletePois()

      for (const category in categoryTypes) {
        if (categoryTypes.hasOwnProperty(category)) {
          findPois(location, category, categoryTypes[category])
        }
      }  

      updateDestinationName(selectedPlace.name)
      updateDuration(duration, timeType)
    } else {
      console.warn("No place selected.");
    }
  };

  const handleSubmitItinerary = (e) => {
    e.preventDefault()
    
    // MAKE AI API CALLS HERE TO TRANSFORM itineraryForm INTO AN ITINERARY
  }


  return (
    <div className="tripinarymain">
      <div className="form">
        <h1>TRIPINARY</h1>
        <h4>EASY. PERSONALIZED. EFFICIENT.</h4>
        <p>First, tell us your target city and trip duration.</p>
        <p>Then click the “Plan My Trip!” button to kick off your adventure!</p>

        <div className="user-input">
          <div className="city-box">
            <h5>Destination</h5>
            <Place_AutoComplete
              onPlaceSelected={(place) => {
                setSelectedPlace(place);
              }}
            />
          </div>
          <div className="number-box">
            <h5>Trip Duration</h5>
            <input
              type="number"
              className="number-input"
              placeholder="Enter a number"
              min={1}
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
            <select 
              className="drop-down"
              value={timeType}
              onChange={(e) => setTimeType(e.target.value)}
            >
              <option value="hours">Hours</option>
              <option value="days">Days</option>
              <option value="weeks">Weeks</option>
            </select>
          </div>
          <div className="itinerary-button">
            <button
              type="button"
              className="enter-button"
              onClick={(e) => handleSubmitDestination(e)}
            >
              Plan My Trip!
            </button>
          </div>
        </div>
      </div>
      <div className="activity-suggestions-wrapper">
        <AnimatePresence>
          {clicked && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
              style={{ overflow: "hidden", width: "100%" }}
            >
              <Activity_Suggestions key={"activity_suggestions"} pois={pois} destination={itineraryForm.destinationName} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="submit_area">
        <p>{itineraryForm.selectedPlaces.length} Destinations Selected</p>
        <button className="enter-button" onClick={(e) => handleSubmitItinerary(e)}>Generate Itinerary</button>
      </div>

      <div className={`global-notification ${isVisible ? 'show' : ''} ${notification.type}`}>
      {notification.message}
      </div>
    </div>
  );
};

export default TripinaryMain;