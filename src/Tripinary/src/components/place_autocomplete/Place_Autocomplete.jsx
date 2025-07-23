import React, { useRef, useCallback } from "react";
import { LoadScript, Autocomplete, GoogleMap } from "@react-google-maps/api";

const libraries = ["places"];

const options = {
  types: ["(cities)"],
};

const categoryTypeMap = {
  food_drinks: [
    "restaurant",
    "cafe",
    "bar",
    "bakery",
    "meal_takeaway",
    "meal_delivery",
    "night_club",
    "food",
  ],
  attractions_sightseeing: [
    "tourist_attraction",
    "museum",
    "art_gallery",
    "zoo",
    "aquarium",
    "church",
    "hindu_temple",
    "mosque",
    "synagogue",
    "cemetery",
    "city_hall",
    "library",
  ],
  activities_recreation: [
    "park",
    "stadium",
    "gym",
    "spa",
    "bowling_alley",
    "casino",
    "movie_theater",
    "amusement_park",
    "campground",
    "swimming_pool",
    "bicycle_store",
  ],
  shopping: [
    "shopping_mall",
    "clothing_store",
    "department_store",
    "shoe_store",
    "jewelry_store",
    "book_store",
    "convenience_store",
    "supermarket",
    "electronics_store",
    "furniture_store",
    "store",
  ],
};

const mapContainerStyle = {
  width: "0px", // hidden map
  height: "0px",
};

const Place_AutoComplete = ({ onPlaceSelected, onSetPois }) => {
  const autocompleteRef = useRef(null);
  const mapRef = useRef(null); // reference to the hidden map

  const handleMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  const searchPlaces = (location) => {
    const service = new window.google.maps.places.PlacesService(mapRef.current);

    Object.entries(categoryTypeMap).forEach(([category, types]) => {
      types.forEach((type) => {
        service.nearbySearch(
          {
            location,
            radius: 1500,
            type,
          },
          (results, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
              onSetPois(category, results.slice(0, 5));
            } else {
              console.error(`Nearby search failed for type ${type}:`, status);
            }
          }
        );
      });
    });
  };

  const handlePlaceChanged = () => {
    const place = autocompleteRef.current.getPlace();
    if (place && place.geometry) {
      onPlaceSelected?.(place);

      const location = place.geometry.location;
      searchPlaces(location);
    }
  };

  return (
    <LoadScript
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
      libraries={libraries}
    >
      <Autocomplete
        onLoad={(auto) => (autocompleteRef.current = auto)}
        onPlaceChanged={handlePlaceChanged}
        options={options}
      >
        <input
          type="text"
          placeholder="Enter a city"
          style={{
            width: "200px",
            padding: "5px",
            fontSize: "14px",
          }}
        />
      </Autocomplete>

      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={{ lat: 0, lng: 0 }}
        zoom={1}
        onLoad={handleMapLoad}
      />
    </LoadScript>
  );
};

export default Place_AutoComplete;
