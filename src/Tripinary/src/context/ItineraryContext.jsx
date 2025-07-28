import React from 'react';

const initialItineraryForm = {
  destination: {
    name: null, // ex. "Vancouver"
    address: null // ex. "Vancouver, B.C., Canada"
  },
  duration: {
    num: 0,
    timeType: null // could be "hours", "days", "weeks"
  },
  selectedPlaces: [],
  generatedItinerary: null,  
  isLoadingItinerary: false,  
  itineraryError: null,     
};

// Create the Context
const ItineraryContext = React.createContext({
  itineraryForm: initialItineraryForm,
  setItineraryForm: () => {},
  updateDestinationName: () => {},
  updateDuration: () => {},
  addSelectedPlace: () => {},
  removeSelectedPlace: () => {},
  isPlaceInForm: () => {},
  clearItineraryForm: () => {}
});

export default ItineraryContext;