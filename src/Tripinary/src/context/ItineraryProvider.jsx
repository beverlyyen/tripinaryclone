import React, { useState, useCallback } from 'react';
import ItineraryContext from './ItineraryContext.jsx';

// Define the initial state structure (can be imported from ItineraryContext.js too)
const initialItineraryForm = {
  destinationName: null,
  duration: {
    num: 0,
    timeType: null // could be "Hours", "Days", "Weeks"
  },
  selectedPlaces: []
};

function ItineraryProvider({ children }) {
  const [itineraryForm, setItineraryForm] = useState(initialItineraryForm);

  const updateDestinationName = useCallback((name) => {
    setItineraryForm(prevForm => ({
      ...prevForm,
      destinationName: name
    }));
  }, []);

  const updateDuration = useCallback((num, timeType) => {
    setItineraryForm(prevForm => ({
      ...prevForm,
      duration: {
        num: num,
        timeType: timeType
      }
    }));
  }, []);

  const addSelectedPlace = useCallback((place) => {
    setItineraryForm(prevForm => ({
      ...prevForm,
      selectedPlaces: [...prevForm.selectedPlaces, place]
    }));
  }, []);

  const removeSelectedPlace = useCallback((placeId) => {
    setItineraryForm(prevForm => ({
      ...prevForm,
      selectedPlaces: prevForm.selectedPlaces.filter(place => place.id !== placeId)
    }));
  }, []);

  const isPlaceInForm = useCallback((placeId) => {
    return itineraryForm.selectedPlaces.some(place => place.id === placeId);
  }, [itineraryForm.selectedPlaces]);

  const contextValue = {
    itineraryForm,
    setItineraryForm,
    updateDestinationName,
    updateDuration,
    addSelectedPlace,
    removeSelectedPlace,
    isPlaceInForm
  };

  return (
    <ItineraryContext.Provider value={contextValue}>
      {children}
    </ItineraryContext.Provider>
  );
}

export default ItineraryProvider;