import { React, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Place_AutoComplete from "../../components/place_autocomplete/Place_Autocomplete";
import Activity_Suggestions from "../activity-suggestions/activity_suggestions";
import "./TripinaryMain.css";
import categoryTypes from "../../assets/category_types.json"

const formObject = {
  place: null,
  hours: null,
};

const poisFormat = {
  food_drinks: [],
  attractions_sightseeing: [],
  activities_recreation: [],
  shopping: [],
};

const TripinaryMain = () => {
  const [clicked, setClick] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [pois, setPois] = useState(poisFormat);

  const findNearbyPlaces = async (location, category, types) => {
    const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
    const url = "https://places.googleapis.com/v1/places:searchNearby"

    const reqBody = {
      includedTypes: types.includedTypes,
      excludedTypes: types.excludedTypes,
      maxResultCount: 20,
      locationRestriction: {
        circle: {
          center: {
            latitude: location.lat,
            longitude: location.lng
          },
          radius: 5000
        },
      }
    }

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": API_KEY,
        "X-Goog-FieldMask": "places.displayName,places.types,places.formattedAddress,places.location,places.photos,places.generativeSummary,places.editorialSummary,places.rating,places.priceLevel",
      },
      body: JSON.stringify(reqBody),
    };
    try {
      const response = await fetch(url, options);
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log(data.places)
      setPois((prevPois) => ({
        ...prevPois,
        [category]: [...prevPois[category], ...(data.places || [])],
      }))

    } catch (error) {
      console.error("Could not fetch nearby places:", error);
      return null;
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setClick(true);

    if (selectedPlace && selectedPlace.geometry) {
      const location = {
        lat: selectedPlace.geometry.location.lat(),
        lng: selectedPlace.geometry.location.lng()
      };

      for (const category in categoryTypes) {
        if (categoryTypes.hasOwnProperty(category)) {
          // grab all nearby places for this category 
          findNearbyPlaces(location, category, categoryTypes[category])
        }
      }  
    } else {
      console.warn("No place selected.");
    }

  };
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
              type="text"
              className="number-input"
              placeholder="Enter a number"
            />
            <select defaultValue="Days" className="drop-down">
              <option value="hours">Hours</option>
              <option value="days">Days</option>
              <option value="weeks">Weeks</option>
            </select>
          </div>
          <div className="itinerary-button">
            <button
              type="button"
              className="enter-button"
              onClick={(e) => handleSubmit(e)}
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
              <Activity_Suggestions pois={pois} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TripinaryMain;