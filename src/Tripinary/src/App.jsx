import React from "react";
import ItineraryPage from "./pages/itinerary-page/itinerary";
import DayCard from "./pages/itinerary-page/day-card"; // Keep if DayCard is still used/needed directly in App.jsx, otherwise remove.

import './App.css'
import Navbar from './pages/home-page/NavBar/navbar'
import Footer from './pages/home-page/Footer/footer'
import TripinaryMain from './pages/home-page/TripinaryMain/TripinaryMain'


function App() {
  return (
    <>
      <Navbar />
      <TripinaryMain />
      {/*ItineraryPage component */}
      <ItineraryPage/>
      <Footer />
    </>
  );
}

export default App;