import React from "react";
import ItineraryPage from "./pages/itinerary-page/itinerary";
import DayCard from "./pages/itinerary-page/day-card"; 

import './App.css'
import Navbar from './pages/home-page/NavBar/navbar'
import Footer from './pages/home-page/Footer/footer'
import TripinaryMain from './pages/home-page/TripinaryMain/TripinaryMain'
import Activity_Suggestions from './pages/activity-suggestions/activity_suggestions' // ADDED THIS IMPORT FROM MAIN


function App() {
  return (
    <>
      <Navbar />
      <TripinaryMain />
      <ItineraryPage/>
      {/* <Activity_Suggestions /> */}
      <Footer />
    </>
  );
}

export default App;