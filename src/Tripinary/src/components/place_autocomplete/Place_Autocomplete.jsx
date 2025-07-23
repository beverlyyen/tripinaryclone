import React, { useRef } from "react";
import { LoadScript, Autocomplete } from '@react-google-maps/api'

const libraries = ['places']

const options = {
  types: ['(cities)']
}

const Place_AutoComplete = ({ onPlaceSelected }) => {
  const autocompleteRef = useRef(null)

  const handleLoad = (autocomplete) => {
    autocompleteRef.current = autocomplete
  }

  const handlePlaceChanged = () => {
    const place = autocompleteRef.current.getPlace();
    if (place && place.geometry) {
      onPlaceSelected(place);
    }
  };

  return (
    <LoadScript
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
      libraries={libraries}
    >
      <Autocomplete
        onLoad={handleLoad}
        onPlaceChanged={handlePlaceChanged}
        options={options}
      >
        <input
          type="text"
          placeholder="Enter a city"
          style={{
            width: '200px',
            // height: '17px',
            padding: '5px',
            fontSize: '14px',
          }}
        />
      </Autocomplete>
    </LoadScript>
  )

}

export default Place_AutoComplete