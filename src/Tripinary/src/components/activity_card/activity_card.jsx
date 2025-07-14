import React from "react"
import "./activity_card.css"
import Rating from 'react-rating'

/*
  How to Use:

    <Activity_card 
      img={"test"}
      title={"Botanist"}
      desc={"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non  placerat risus. Praesent orci libero, pharetra et pretium a, rutrum."}
      rating={4.5}
      price_lvl={4}
    />
*/

function Activity_card({img, title, desc, rating, price_lvl}) {

  return (
    <div className={"activity_card"}>
      <div className="img_container">
        <img src={img} alt={`Image for ${title}`} />
      </div>

      <div className="card_details">
        <h2>{title}</h2>
        <h3>{desc}</h3>
        <div className="ratings_pricelvl">
          <Rating
            initialRating={rating}
            readonly
            emptySymbol={<span style={{ color: '#000', fontSize: 15, paddingLeft: 1, paddingRight: 1 }}>☆</span>}
            fullSymbol={<span style={{ color: '#000', fontSize: 15, paddingLeft: 1, paddingRight: 1 }}>★</span>}
            fractions={2} // allow half star ratings

          />
          <Rating
            initialRating={price_lvl}
            readonly
            emptySymbol={<span style={{ color: '#000', fontSize: 15, paddingLeft: 1, paddingRight: 1 }}>$</span>}
            fullSymbol={<span style={{ color: '#000', fontSize: 15, paddingLeft: 1, paddingRight: 1  }}>$</span>}
            fractions={1}
          />
        </div>
        
      </div>

    </div>
  )

}

export default Activity_card;