import { useState } from "react";
import Activity_Carousel from "../../components/activity_carousel/activity_carousel.jsx";
import "./activity_suggestions.css";

const getCategory = (cat) => {
  switch(cat) {
    case "food_drinks":
      return "Food & Drinks"
    case "attractions_sightseeing":
      return "Attractions & Sightseeing"
    case "activities_recreation":
      return "Activities & Recreation"
    case "shopping":
      return "Shopping"
    default:
      return "" 
  }
}

function Activity_Suggestions({ pois, destination }) {
  return (
    <div className="activity_suggestions">
      <h1>
        Plan a trip in <span>{destination}</span>
      </h1>
      <div>
        {Object.entries(pois).map(([category, places]) => (
          <>
            <Activity_Carousel key={category} category={getCategory(category)} list={places} />
          </>
        ))}
      </div>
    </div>
  );
}

export default Activity_Suggestions;
