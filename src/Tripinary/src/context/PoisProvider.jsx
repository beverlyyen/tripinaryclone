import React, { useState, useCallback, useEffect } from 'react';
import PoisContext from './PoisContext';

const poisFormat = {
  food_drinks: [],
  attractions_sightseeing: [],
  activities_recreation: [],
  shopping: [],
};

function PoisProvider({ children }) {
  const [pois, setPois] = useState(() => {
    try {
      const savedPois = sessionStorage.getItem('tripinaryPois');
      return savedPois ? JSON.parse(savedPois) : poisFormat;
    } catch (error) {
      console.error("Failed to load POIs from sessionStorage:", error);
      return poisFormat;
    }
  });

  // Save POIs to local storage whenever 'pois' change
  useEffect(() => {
    try {
      sessionStorage.setItem('tripinaryPois', JSON.stringify(pois));
    } catch (error) {
      console.error("Failed to save POIs to sessionStorage:", error);
    }
  }, [pois]);

  const findNearbyPlaces = async (location, category, types) => {
    const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
    const url = "https://places.googleapis.com/v1/places:searchNearby"

    const reqBody = {
      includedTypes: types.includedTypes,
      excludedTypes: types.excludedTypes,
      maxResultCount: 20,
      locationRestriction: {
        circle: {
          center: {
            latitude: location.lat,
            longitude: location.lng
          },
          radius: 5000
        },
      }
    }

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": API_KEY,
        "X-Goog-FieldMask": "places.id,places.displayName,places.types,places.formattedAddress,places.location,places.photos,places.generativeSummary,places.editorialSummary,places.rating,places.priceLevel",
      },
      body: JSON.stringify(reqBody),
    };
    try {
      const response = await fetch(url, options);
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      setPois((prevPois) => ({
        ...prevPois,
        [category]: [...prevPois[category], ...(data.places || [])],
      }))

    } catch (error) {
      console.error("Could not fetch nearby places:", error);
      return null;
    }
  }

  const findPois = useCallback((location, category, types) => {
    findNearbyPlaces(location, category, types)
  }, []);

  const deletePois = useCallback(() => {
    setPois(poisFormat)
  }, []);

  const isPoisEmpty = useCallback(() => {
    return Object.values(pois).every(arr => arr.length === 0);
  }, [pois]);

  const contextValue = {
    pois,
    findPois,
    deletePois,
    isPoisEmpty
  }

  return (
    <PoisContext.Provider value={contextValue}>
      {children}
    </PoisContext.Provider>
  )
}

export default PoisProvider