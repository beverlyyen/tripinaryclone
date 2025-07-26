import './footer.css'
import logo from '../../assets/Tripinary.png'
import React from 'react'

const Footer = () => {
  return (
    <div className = "footer-container">
        <div className = "footer-section">
            <h4>CONTRIBUTORS</h4>  
            <ul>
            <li><a href = "https://jcmno.github.io">John Camino</a></li>
            <li><a href = "https://github.com/lilian-pham">Lilian Pham</a></li>
            <li><a href = "https://github.com/beverlyyen">Beverly Yen</a></li>
            <li><a href = "https://github.com/renzgabrinao">Renz Gabrinao</a></li>
            </ul>
        </div>

        

        <div className = "footer-section">
            <h4>PROJECT LINKS</h4>
            <ul>
            <li><a href = "https://github.com/CMPT-276-SUMMER-2025/final-project-02-peak">Tripinary GitHub</a></li>
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