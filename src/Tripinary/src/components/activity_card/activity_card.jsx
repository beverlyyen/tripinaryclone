import React, { useContext, useState } from "react"
import { Rating, ThinRoundedStar } from '@smastrom/react-rating'
import '@smastrom/react-rating/style.css'
import "./activity_card.css"
import ItineraryContext from "../../context/ItineraryContext"
import PoisContext from "../../context/PoisContext"

const priceLevels = {
  PRICE_LEVEL_INEXPENSIVE: '$',
  PRICE_LEVEL_MODERATE: '$$',
  PRICE_LEVEL_EXPENSIVE: '$$$',
  PRICE_LEVEL_VERY_EXPENSIVE: '$$$$'
};

const getPriceLevel = (level) => priceLevels[level] || '';

function Activity_Card({id, img, title, desc, rating, price_level, location}) {

  const { itineraryForm, addSelectedPlace, removeSelectedPlace, isPlaceInForm } = useContext(ItineraryContext)
  const { showNotification } = useContext(PoisContext);
  const isSelected = itineraryForm.selectedPlaces.some(place => place.id === id);
  
  const handleClickPlace = (id, title, location) => {
    let msg;
    if(isPlaceInForm(id)) {
      removeSelectedPlace(id)
      msg = `${title} removed from itinerary`
    } else {
      addSelectedPlace({ 
        "id": id,
        "name" : title,
        "location": {
          "lat": location.latitude,
          "lng": location.longitude
        }
      })
      msg = `${title} added to itinerary`
    }
    showNotification(msg);
  }

  return (
    <div className={`activity_card ${isSelected ? 'selected_card' : ''}`} onClick={() => handleClickPlace(id, title, location)}>
      <div className="img_container">
        <img src={img} alt={`Image for ${title}`} />
      </div>

      <div className="card_details">
        <h2>{title}</h2>
        <h3>{desc}</h3>
        <div className="ratings_pricelevel">
          <Rating
            className="ratings"
            value={rating}
            readOnly
            itemStyles={{
              itemShapes: ThinRoundedStar,
              activeFillColor: '#000',
              inactiveFillColor: '#fff',
            }}
            style={{
              width: 100
            }}
          />

          <p>{getPriceLevel(price_level)}</p>
        </div>
      </div>
    </div>
  )
}

export default Activity_Card;