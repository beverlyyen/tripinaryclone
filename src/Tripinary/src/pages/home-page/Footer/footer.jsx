import './footer.css'
import logo from '../../../../../Tripinary/src/assets/Tripinary.png'
import React from 'react'

const Footer = () => {
  return (
    <div className = "footer-container">
        <div className = "footer-section">
            <h4>CONTRIBUTORS</h4>  
            <ul>
            <li>John Camino</li>
            <li>Lilian Pham</li>
            <li>Beverly Yen</li>
            <li>Renz Gabrinao</li>
            </ul>
        </div>

         <div className = "footer-section">
            <h4>CONTACT US</h4>
            <p></p>
        </div>

        <div className = "footer-section">
            <h4>PROJECT LINKS</h4>
            <ul>
            <li>TRIPINARY GitHub</li>
            </ul>
        </div>

        <div className = "footer-section">
            <h4>DATE LAST MODIFIED</h4>
            <ul>
            <li>August 01, 2025</li>
            </ul>
        </div>

        <div className = "footer-section">
            <h4>LOGO BY BEVERLY YEN</h4>
            <img src={logo} alt = "logo" className = 'logowrap'/>
        </div>

        

    </div>
  )
}

export default Footer;