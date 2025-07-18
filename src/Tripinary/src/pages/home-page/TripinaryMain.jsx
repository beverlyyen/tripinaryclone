import React from 'react'
import './TripinaryMain.css'

const TripinaryMain = () => {
  return (
    <div className = 'tripinarymain'>
        <h1>TRIPINARY</h1>
        <h4>EASY. PERSONALIZED. EFFICIENT.</h4>
        <p>First, tell us your target city and trip duration.</p>
        <p>Then click the “Plan My Trip!” button to kick off your adventure!</p>
        <div className = 'user-input'>
          <div className = 'city-box'>
            <h5>Destination</h5>
            <input type= 'city' className= "city-input" placeholder = "Enter name of city" />
          </div>
          <div className = 'number-box'>
            <h5>Trip Duration</h5>
            <input type="text"  className = "number-input" placeholder = "Enter a number" />
            <select defaultValue = "Days" className = "drop-down">
              <option value = "hours">Hours</option>
              <option value = "days">Days</option>
              <option value = "weeks">Weeks</option>
            </select>
          </div>
          <div className = "itinerary-button">
          <button type = "button" className= "enter-button">Plan My Trip!</button>
          </div>

        </div>
        

    </div>
  )
}

export default TripinaryMain