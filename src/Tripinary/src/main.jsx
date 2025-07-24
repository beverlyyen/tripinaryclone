import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from 'react-router-dom';
import App from "./App";
import ItineraryProvider from "./context/ItineraryProvider.jsx";
import PoisProvider from "./context/PoisProvider.jsx";

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PoisProvider>
      <ItineraryProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ItineraryProvider>
    </PoisProvider>
  </React.StrictMode>
);