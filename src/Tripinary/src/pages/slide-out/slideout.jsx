import React, { useState, useEffect } from "react";
import "./slideout.css";
import tripImage from "../../pages/slide-out/Tripinary.png";
import magnifierIcon from "../../pages/slide-out/search.png";

const APIKEY = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;

function renderStars(rating) {
  const fullStars = Math.floor(rating);
  const halfStar = rating - fullStars >= 0.25 && rating - fullStars < 0.75;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <>
      {"★".repeat(fullStars)}
      {halfStar ? "⯨" : ""}
      {"☆".repeat(emptyStars)}
    </>
  );
}

function SidePanel({ isOpen, searchQuery, onClose, place, destinationName }) {
  
  const defaultPlaceId = "ChIJN1t_tDeuEmsRUsoyG83frY4"; 
  const effectivePlaceId = place?.place_id || defaultPlaceId;

  const [mapSource, setMapSource] = useState("");
  const [searchInputValue, setSearchInputValue] = useState("");
  const [placeDetails, setPlaceDetails] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");



  useEffect(() => {
    if (searchQuery) {
      setSearchInputValue(searchQuery);

      // Fetch place details for the search term + destination
      const fullQuery = destinationName ? `${searchQuery} ${destinationName}` : searchQuery;
          updateMapSource(fullQuery);
      fetchPlaceDetailsByQuery(fullQuery);
    }
  }, [searchQuery, destinationName]);

  useEffect(() => {
    if (placeDetails) {
      console.log("placeDetails updated:", placeDetails);
    }
  }, [placeDetails]);

  const updateMapSource = (query) => {
    const fullQuery = destinationName ? `${query} ${destinationName}` : query;
    const encodedQuery = encodeURIComponent(query);
    const newLocation = `https://www.google.com/maps/embed/v1/place?key=${APIKEY}&q=${encodedQuery}`;
    setMapSource(newLocation);
  };
  const getPhotoUrl = (photoRef) =>
    `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoRef}&key=${APIKEY}`;

  const handleSearch = () => {
     search
    const fullQuery = destinationName ? `${searchInputValue} ${destinationName}` : searchInputValue;
        updateMapSource(fullQuery);
    fetchPlaceDetailsByQuery(fullQuery);
  };

 
  const fetchPlaceDetailsByQuery = (query) => {
     setErrorMessage("");
    fetch(`api/place-details?query=${encodeURIComponent(query)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.result) {
          
          setPlaceDetails(data.result);
         
        } else {
          
          setPlaceDetails(null);
          setErrorMessage(`No place found for "${query}". Please try a different search term.`);
        }
      })
      .catch((err) => {
        console.error("Error fetching place details by query:", err);
        setPlaceDetails(null);
        setErrorMessage(`Error searching for "${query}". Please check your internet connection and try again.`);
      });
  };

   const fallbackReviews = [
    { name: "Alice", stars: 5, date: "July 12, 2025", text: "Amazing spot. Would definitely visit again!" },
    { name: "Bob", stars: 4, date: "July 10, 2025", text: "Great atmosphere and friendly staff." },
    { name: "Charlie", stars: 3, date: "July 9, 2025", text: "It was okay. A bit crowded." },
    { name: "Diana", stars: 2, date: "July 7, 2025", text: "Not what I expected. Service could be better." },
    { name: "Ethan", stars: 1, date: "July 5, 2025", text: "Disappointing experience. Would not recommend." },
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
              
            <button className="search-button" onClick={handleSearch}>
              <img src={magnifierIcon} alt="Magnifying glass icon for search" className="search-icon" />
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
         {errorMessage && <div className="error-message">{errorMessage}</div>}
          <div className="info-card">
            <div className="info-text">
                <h3>{placeDetails?.name ?? "Simon Fraser University"}</h3>
              <p className="star">
             {placeDetails?.rating ? (
                  <>
                    {renderStars(placeDetails.rating)}
                    <span style={{ marginLeft: "0.5em", fontWeight: 500 }}>{placeDetails.rating.toFixed(1)}</span>
                  </>
                ) : "☆☆☆☆☆"}
              </p>
               <p>{placeDetails?.formatted_address ?? "Lorem ipsum placeholder address."}</p>
            </div>
            <div className="image-placeholder">
                {placeDetails?.photos?.[0]
                ? <img src={getPhotoUrl(placeDetails.photos[0].photo_reference)}  alt={`Image of ${placeDetails.name || "the selected place"}`} />
                : <img src={tripImage}   alt="Logo placeholder for missing place image" />}
            </div>
          </div>

          <div className="review-card">
            <h4>User Reviews</h4>
            <div className="review-scroll">
               {(placeDetails?.reviews?.length ? placeDetails.reviews : fallbackReviews).map((review, i) => (
                <div className="review" key={i}>
                  <p>
                    {review.author_name ?? review.name}
                    <span className="review-star">
                      {"★".repeat(review.rating ?? review.stars)}
                      {"☆".repeat(5 - (review.rating ?? review.stars))}
                    </span>
                  </p>
                  <p className="review-date">{review.relative_time_description ?? review.date}</p>
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
