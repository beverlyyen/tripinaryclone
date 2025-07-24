import React from 'react';

const initialItineraryForm = {
  destinationName: null,
  duration: {
    num: 0,
    timeType: null // could be "Hours", "Days", "Weeks"
  },
  selectedPlaces: []
};

// Create the Context
const ItineraryContext = React.createContext({
  itineraryForm: initialItineraryForm,
  setItineraryForm: () => {},
  updateDestinationName: () => {},
  updateDuration: () => {},
  addSelectedPlace: () => {},
  removeSelectedPlace: () => {},
  isPlaceInForm: () => {}
});

export default ItineraryContext;