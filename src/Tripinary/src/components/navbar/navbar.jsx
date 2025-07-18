import './navbar.css'
import React from 'react'
import logo from '../../assets/Tripinary.png'

const navbar = () => {
  return (
    <div className = 'navbar'>

      <img src={logo} alt = "logo" className = 'logowrap'/>
  
        <ul className = "nav-links">
           <li> <a href = "#"> Home </a> </li>
        </ul>
      
    </div>
  )
}

export default navbar