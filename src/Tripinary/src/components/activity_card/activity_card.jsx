import React from "react"
import "./activity_card.css"

import { Rating, ThinRoundedStar } from '@smastrom/react-rating'
import '@smastrom/react-rating/style.css'

function Activity_Card({img, title, desc, rating, price_level}) {
  const priceLevels = {
    PRICE_LEVEL_INEXPENSIVE: '$',
    PRICE_LEVEL_MODERATE: '$$',
    PRICE_LEVEL_EXPENSIVE: '$$$',
    PRICE_LEVEL_VERY_EXPENSIVE: '$$$$'
  };

  const getPriceLevel = (level) => priceLevels[level] || '';

  return (
    <div className={"activity_card"}>
      <div className="img_container">
        <img src={img} alt={`Image for ${img.name}`} />
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