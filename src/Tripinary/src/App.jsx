import React from "react";
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/navbar/navbar.jsx'
import Footer from './components/footer/footer.jsx'
import TripinaryMain from './pages/home-page/TripinaryMain.jsx'
import ItineraryPage from "./pages/itinerary-page/itinerary.jsx";
import ItineraryProvider from "./context/ItineraryProvider.jsx";


import './App.css'

function App() {

  return (
    <>
      <Navbar />
      <ItineraryProvider>
        <Routes>
          <Route path="/" element={<TripinaryMain/>}/>
          <Route path="/itinerary" element={<ItineraryPage/>} />
        </Routes>
      </ItineraryProvider>
      <Footer />
    </>
  );
}

export default App;