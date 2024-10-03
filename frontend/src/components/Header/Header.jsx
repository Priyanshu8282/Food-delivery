import React from 'react'
import "./Header.css"

function Header() {
  return (
    <div className='header'> 
    <div className="header-contents"> 
        <h2>Order your favorite food here</h2>
        <p>Order your favorite food from our website and get it delivered hot and fresh right to your door!.</p>
       <a href='#explore-menu'><button>View Menu</button></a> 
    </div>

    </div>
  )
}

export default Header