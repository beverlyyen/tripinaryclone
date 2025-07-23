import React, { useState, useEffect } from "react";
import "./slideout.css";
import duckImage from "../../pages/slide-out/duck.jpeg";
import magnifierIcon from "../../pages/slide-out/search.png";

const APIKEY = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;

function SidePanel({ isOpen, searchQuery, onClose, placeId }) {
  const [mapSource, setMapSource] = useState("");

  const [searchInputValue, setSearchInputValue] = useState("");

  const [placeDetails, setPlaceDetails] = useState(null);

  useEffect(() => {
    if (searchQuery) {
      setSearchInputValue(searchQuery);
      updateMapSource(searchQuery);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (placeId) {
      fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${APIKEY}`
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.result) setPlaceDetails(data.result);
        });
    }
  }, [placeId]);

  const updateMapSource = (query) => {
    const encodedQuery = encodeURIComponent(query);
    const newLocation = `https://www.google.com/maps/embed/v1/place?key=${APIKEY}&q=${encodedQuery}`;
    setMapSource(newLocation);
  };
  const getPhotoUrl = (photoRef) =>
    `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoRef}&key=${APIKEY}`;

  const handleSearch = () => {
    updateMapSource(searchInputValue);
  };

  const reviews = [
    {
      name: "Alice",
      stars: 5,
      date: "July 12, 2025",
      text: "Amazing spot. Would definitely visit again!",
    },
    {
      name: "Bob",
      stars: 4,
      date: "July 10, 2025",
      text: "Great atmosphere and friendly staff.",
    },
    {
      name: "Charlie",
      stars: 3,
      date: "July 9, 2025",
      text: "It was okay. A bit crowded.",
    },
    {
      name: "Diana",
      stars: 2,
      date: "July 7, 2025",
      text: "Not what I expected. Service could be better.",
    },
    {
      name: "Ethan",
      stars: 1,
      date: "July 5, 2025",
      text: "Disappointing experience. Would not recommend.",
    },
  ];

  return (
    <div className={`side-panel-full ${isOpen ? "open" : ""}`}>
      <div className="inner-panel">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <div className="left-panel">
          <div className="search-bar">
            <input
              type="text"
              className="search-bar-input"
              placeholder="search places!!!"
              value={searchInputValue}
              onChange={(e) => setSearchInputValue(e.target.value)}
            ></input>
            <button
              type="button"
              className="search-button"
              onClick={handleSearch}
            >
              <img
                src={magnifierIcon}
                alt="Search"
                className="search-icon"
              ></img>
            </button>
          </div>
          <iframe
            className="map-placeholder"
            src={
              mapSource ||
              "https://maps.google.com/maps?q=Simon+Fraser+University&output=embed"
            }
            allowFullScreen
            title="Map"
          ></iframe>
        </div>

        <div className="right-panel">
          <div className="info-card">
            <div className="info-text">
              <h3>{placeDetails && placeDetails.name ? placeDetails.name : "Simon Fraser University"}</h3>
              <p className="star">
                {placeDetails && placeDetails.rating
                  ? "★".repeat(Math.round(placeDetails.rating)) + "☆".repeat(5 - Math.round(placeDetails.rating))
                  : "☆☆☆☆☆"}
              </p>
              <p>
                {placeDetails && placeDetails.formatted_address
                  ? placeDetails.formatted_address
                  : "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor"}
              </p>
            </div>
            <div className="image-placeholder">
              {(placeDetails && placeDetails.photos && placeDetails.photos.length > 0)
                ? <img src={getPhotoUrl(placeDetails.photos[0].photo_reference)} alt="Place" />
                : <img src={duckImage} alt="Default" />}
            </div>
          </div>

          <div className="review-card">
            <h4>User Reviews</h4>
            <div className="review-scroll">
              {reviews.map((review, i) => (
                <div className="review" key={i}>
                  <p>
                    {review.name}
                    <span className="review-star">
                      {"★".repeat(review.stars)}
                      {"☆".repeat(5 - review.stars)}
                    </span>
                  </p>
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
