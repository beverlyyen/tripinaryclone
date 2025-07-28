import React, { useState, useCallback, useEffect } from 'react';
import ItineraryContext from './ItineraryContext.jsx';

const defaultItineraryForm = {
  destinationName: null,
  duration: {
    num: 0,
    timeType: null
  },
  selectedPlaces: [],
  generatedItinerary: null,  
  isLoadingItinerary: false,  
  itineraryError: null,     
};

function ItineraryProvider({ children }) {
  const [itineraryForm, setItineraryForm] = useState(() => {
    try {
      const storedForm = sessionStorage.getItem('tripinaryItineraryForm');
      return storedForm ? JSON.parse(storedForm) : defaultItineraryForm;
    } catch (error) {
      console.error("Failed to load itineraryForm from sessionStorage:", error);
      return defaultItineraryForm;
    }
  });

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
        return prevForm;
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
    setItineraryForm(defaultItineraryForm); 
    sessionStorage.removeItem('tripinaryItineraryForm');
  }, []);

  const setGeneratedItinerary = useCallback((itineraryData) => { // for itineraru data
    setItineraryForm(prevForm => ({
      ...prevForm,
      generatedItinerary: itineraryData,
      isLoadingItinerary: false,
      itineraryError: null,   
    }));
  }, []);

  const setIsLoadingItinerary = useCallback((isLoading) => {
    setItineraryForm(prevForm => ({
      ...prevForm,
      isLoadingItinerary: isLoading,
      itineraryError: null,
    }));
  }, []);

  const setItineraryError = useCallback((error) => {
    setItineraryForm(prevForm => ({
      ...prevForm,
      itineraryError: error,
      isLoadingItinerary: false,
      generatedItinerary: null,
    }));
  }, []);

  const contextValue = {
    itineraryForm,
    setItineraryForm, 
    updateDestinationName,
    updateDuration,
    addSelectedPlace,
    removeSelectedPlace,
    isPlaceInForm,
    clearItineraryForm,
    setGeneratedItinerary,   
    setIsLoadingItinerary, 
    setItineraryError
  };

  return (
    <ItineraryContext.Provider value={contextValue}>
      {children}
    </ItineraryContext.Provider>
  );
}

export default ItineraryProvider;
