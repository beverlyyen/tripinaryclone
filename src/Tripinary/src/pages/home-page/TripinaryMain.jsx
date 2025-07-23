import { React, useState } from "react";
import "./TripinaryMain.css";
import Activity_Suggestions from "../activity-suggestions/activity_suggestions";
import { motion, AnimatePresence } from "framer-motion";
import Place_AutoComplete from "../../components/place_autocomplete/Place_Autocomplete";

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

  const [form, setForm] = useState(formObject);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [pois, setPois] = useState(poisFormat);

  const handleSubmit = (e) => {
    e.preventDefault();
    setClick(true);

    // update form once destination and trip duration is picked
    form.place = selectedPlace;
    form.hours = 5;
    console.log(form);

    // transform POIs
    console.log(pois);
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
              onSetPois={(category, newPois) => {
                setPois((prevPois) => ({
                  ...prevPois,
                  [category]: [...prevPois[category], ...newPois],
                }));
                console.log(pois);
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
