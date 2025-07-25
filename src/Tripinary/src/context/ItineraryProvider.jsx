import React, { useState, useCallback, useEffect } from 'react';
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
  const [itineraryForm, setItineraryForm] = useState(() => {
    try {
      const savedItineraryForm = sessionStorage.getItem('tripinaryItineraryForm');
      return savedItineraryForm ? JSON.parse(savedItineraryForm) : initialItineraryForm;
    } catch (error) {
      console.error("Failed to load itineraryForm from sessionStorage:", error);
      return initialItineraryForm;
    }
  });

  // Save itineraryForm to session storage whenever 'itineraryForm' changes
  useEffect(() => {
    try {
      sessionStorage.setItem('tripinaryItineraryForm', JSON.stringify(itineraryForm));
    } catch (error) {
      console.error("Failed to save itineraryForm to sessionStorage:", error);
    }
  }, [itineraryForm]);
  
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
    setItineraryForm(prevForm => {
      if (prevForm.selectedPlaces.some(p => p.id === place.id)) {
        return prevForm; // current place already exists
      }
      return {
        ...prevForm,
        selectedPlaces: [...prevForm.selectedPlaces, place]
      };
    });
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

  const clearItineraryForm = useCallback(() => {
    setItineraryForm(initialItineraryForm);
    sessionStorage.removeItem('tripinaryItineraryForm');
  }, []);
  

  const contextValue = {
    itineraryForm,
    setItineraryForm,
    updateDestinationName,
    updateDuration,
    addSelectedPlace,
    removeSelectedPlace,
    isPlaceInForm,
    clearItineraryForm
  };

  return (
    <ItineraryContext.Provider value={contextValue}>
      {children}
    </ItineraryContext.Provider>
  );
}

export default ItineraryProvider;