import './navbar.css'
import React from 'react'
import logo from '../../assets/Tripinary.png'

const navbar = () => {
  return (
    <div className = 'navbar'>

      <a href = "/">
      <img src={logo} alt = "logo" className = 'logowrap'/>
      </a> 
  
        <ul className = "nav-links">
           <li> <a href = "/"> TRIPINARY </a> </li>
        </ul>
      
    </div>
  )
}

export default navbar