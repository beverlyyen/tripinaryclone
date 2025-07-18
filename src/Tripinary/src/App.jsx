import React from "react";
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/navbar/navbar.jsx'
import Footer from './components/footer/footer.jsx'
import TripinaryMain from './pages/home-page/TripinaryMain.jsx'
import ItineraryPage from "./pages/itinerary-page/itinerary";
import './App.css'

function App() {
  return (
    <>
      <Navbar />
        <Routes>
          <Route path="/" element={<TripinaryMain/>}/>
          <Route path="/itinerary" element={<ItineraryPage/>} />
        </Routes>
      <Footer />

    </>
  );
}

export default App;