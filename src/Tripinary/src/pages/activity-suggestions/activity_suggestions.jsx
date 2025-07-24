import { useState } from "react";
import Activity_Carousel from "../../components/activity_carousel/activity_carousel.jsx";
import "./activity_suggestions.css";
import dummy_data from "../../assets/activity_dummy_data.json";

function Activity_Suggestions({ pois }) {
  const dummy_num_destinations = 6;

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(pois);
  };

  return (
    <div className="activity_suggestions">
      <h1>
        Plan a trip in <span>{dummy_data.destination}</span>
      </h1>
      <div>
        {Object.entries(pois).map(([category, places]) => (
          <>
            <Activity_Carousel category={category} list={places} />
          </>
        ))}
      </div>

      <div className="submit_area">
        <p>{dummy_num_destinations} Destinations Selected</p>
        <button onClick={(e) => handleSubmit(e)}>Generate Itinerary</button>
      </div>
    </div>
  );
}

export default Activity_Suggestions;
