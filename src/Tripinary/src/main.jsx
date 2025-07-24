import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from 'react-router-dom';
import App from "./App";
import ItineraryProvider from "./context/ItineraryProvider.jsx";

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ItineraryProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ItineraryProvider>
  </React.StrictMode>
);