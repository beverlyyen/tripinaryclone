import { React, useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Place_AutoComplete from "../../components/place_autocomplete/Place_Autocomplete";
import Activity_Suggestions from "../activity-suggestions/activity_suggestions";
import "./TripinaryMain.css";
import categoryTypes from "../../assets/category_types.json"
import ItineraryContext from "../../context/ItineraryContext";


const poisFormat = {
  food_drinks: [],
  attractions_sightseeing: [],
  activities_recreation: [],
  shopping: [],
};

const TripinaryMain = () => {
  const [clicked, setClick] = useState(false);
  const [duration, setDuration] = useState(0);
  const [timeType, setTimeType] = useState("days");
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [pois, setPois] = useState(poisFormat);
  const { itineraryForm } = useContext(ItineraryContext);


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
        "X-Goog-FieldMask": "places.id,places.displayName,places.types,places.formattedAddress,places.location,places.photos,places.generativeSummary,places.editorialSummary,places.rating,places.priceLevel",
      },
      body: JSON.stringify(reqBody),
    };
    try {
      const response = await fetch(url, options);
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      setPois((prevPois) => ({
        ...prevPois,
        [category]: [...prevPois[category], ...(data.places || [])],
      }))

    } catch (error) {
      console.error("Could not fetch nearby places:", error);
      return null;
    }
  }

  const handleSubmitDestination = (e) => {
    e.preventDefault();
    setClick(true);

    console.log(selectedPlace)

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

  const handleSubmitItinerary = (e) => {
    e.preventDefault()
    
    if(!!!selectedPlace)
      window.alert("There is no destination selected yet!")
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
              <Activity_Suggestions pois={pois} destination={selectedPlace.name} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="submit_area">
        <p>{itineraryForm.selectedPlaces.length} Destinations Selected</p>
        <button onClick={(e) => handleSubmitItinerary(e)}>Generate Itinerary</button>
      </div>

    </div>
  );
};

export default TripinaryMain;