import React, { useState } from 'react';
import SidePanel from './pages/slide-out/slideout';
import './pages/slide-out/slideout.css';

function App() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="app-container">
      <button className="open-panel-btn" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? 'Close Panel' : 'Open Panel'}
      </button>

      <SidePanel isOpen={isOpen} />
    </div>
  );
}

export default App;
