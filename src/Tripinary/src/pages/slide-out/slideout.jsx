import React, { useState, useEffect } from 'react';
import './slideout.css';
import duckImage from '../../pages/slide-out/duck.jpeg';
import magnifierIcon from '../../pages/slide-out/search.png';

const APIKEY = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;


function SidePanel({ isOpen, searchQuery, onClose , placeId }) {

  const [mapSource, setMapSource] = useState("");

  const [searchInputValue, setSearchInputValue] = useState("");

  const [placeDetails, setPlaceDetails] = useState(null);

  useEffect(() => {
      if (searchQuery) {
      setSearchInputValue(searchQuery);
      updateMapSource(searchQuery);
    }
  }, [searchQuery]);

  const updateMapSource = (query) => {
  const encodedQuery = encodeURIComponent(query);
  const newLocation = `https://www.google.com/maps/embed/v1/place?key=${APIKEY}&q=${encodedQuery}`;
  setMapSource(newLocation);
  }

  const handleSearch = () => {
  updateMapSource(searchInputValue);
};

  const reviews = [
    {
      name: 'Alice',
      stars: 5,
      date: 'July 12, 2025',
      text: 'Amazing spot. Would definitely visit again!',
    },
    {
      name: 'Bob',
      stars: 4,
      date: 'July 10, 2025',
      text: 'Great atmosphere and friendly staff.',
    },
    {
      name: 'Charlie',
      stars: 3,
      date: 'July 9, 2025',
      text: 'It was okay. A bit crowded.',
    },
    {
      name: 'Diana',
      stars: 2,
      date: 'July 7, 2025',
      text: 'Not what I expected. Service could be better.',
    },
    {
      name: 'Ethan',
      stars: 1,
      date: 'July 5, 2025',
      text: 'Disappointing experience. Would not recommend.',
    },
  ];


  return (
    <div className={`side-panel-full ${isOpen ? 'open' : ''}`}>
      <div className="inner-panel">
        <button className="close-button" onClick={onClose}>&times;</button>
        <div className="left-panel">
          <div className="search-bar">
            <input type="text" className="search-bar-input" placeholder="search places!!!" value={searchInputValue} onChange={e => setSearchInputValue(e.target.value)} ></input>
            <button type="button" className="search-button" onClick={handleSearch}><img src={magnifierIcon} alt="Search" className="search-icon"></img></button>
          </div>
          <iframe
            className="map-placeholder"
            src={mapSource || "https://maps.google.com/maps?q=Simon+Fraser+University&output=embed"}
            allowFullScreen
            title="Map"
          ></iframe>
        </div>

        <div className="right-panel">
          <div className="info-card">  {/* use sfu loc for now*/}
            <div className="info-text">
              <h3>Simon Fraser University</h3>
              <p className="star">☆☆☆☆☆</p>  {/* put in revs from google api */}
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor</p>
            </div>
            <div className="image-placeholder"><img src={duckImage}></img></div>
          </div>

          <div className="review-card">
            <h4>User Reviews</h4>
            <div className="review-scroll">
              {reviews.map((review, i) => (
                <div className="review" key={i}>
                  <p>{review.name}<span className="review-star">{'★'.repeat(review.stars)}{'☆'.repeat(5 - review.stars)}</span></p>
                  <p className="review-date">{review.date}</p>
                  <p>{review.text}</p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}

export default SidePanel;
