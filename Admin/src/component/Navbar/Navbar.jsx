import React from 'react';
import "./Navbar.css";
import { assets } from '../../assets/assets'

function Navbar() {
  return (
    <div className='navbar'>
      <img src={assets.logo} alt="Logo" className='logo' />
      <img src={assets.profile_image} alt="Profile Icon"className="profile" />
    </div>
  );
}

export default Navbar;