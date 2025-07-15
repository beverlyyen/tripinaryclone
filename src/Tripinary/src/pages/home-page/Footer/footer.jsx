import './footer.css'
import logo from '../../../../../Tripinary/src/assets/Tripinary.png'
import React from 'react'

const Footer = () => {
  return (
    <div className = "footer-container">
        <div className = "footer-section">
            <h4>Contributors</h4>  
            <ul>
            <li>John Camino</li>
            <li>Lilian Pham</li>
            <li>Beverly Yen</li>
            <li>Renz Gabrinao</li>
            </ul>
        </div>

        <div className = "footer-section">
            <h4>Links</h4>
            <ul>
            <li>GitHub</li>
            </ul>
        </div>

        <div className = "footer-section">
            <h4>Date Last Modified</h4>
            <ul>
            <li>August 01, 2025</li>
            </ul>

        </div>

        <div className = "footer-section">
            <h4>Logo Designed by Beverly Yen</h4>
            <img src={logo} alt = "logo" className = 'logowrap'/>
           

        </div>

    </div>
  )
}

export default Footer;