import React, { useState } from 'react'; 
import SidePanel from './pages/slide-out/slideout';
import './pages/slide-out/slideout.css'; 

import ItineraryPage from './pages/itinerary-page/itinerary';
import DayCard from './pages/itinerary-page/day-card'; 
import './App.css'; 
import Navbar from './pages/home-page/NavBar/navbar';
import Footer from './pages/home-page/Footer/footer';
import TripinaryMain from './pages/home-page/TripinaryMain/TripinaryMain';
import Activity_Suggestions from './pages/activity-suggestions/activity_suggestions'; 

function App() {
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false); 

  return (
    <>
      <Navbar />
      <TripinaryMain />
      <ItineraryPage />
      <Activity_Suggestions /> 

    
      <div className="app-container"> 
        <button className="open-panel-btn" onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}>
          {isSidePanelOpen ? 'Close Panel' : 'Open Panel'}
        </button>
        <SidePanel isOpen={isSidePanelOpen} />
      </div>

      <Footer />
    </>
  );
}

export default App;