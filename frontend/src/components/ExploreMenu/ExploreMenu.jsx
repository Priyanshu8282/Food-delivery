import React from 'react'
import './ExploreMenu.css'
import { menu_list } from '../../assets/assets'

function ExploreMenu({category,setCategory}) {
  return (
    <div className='explore-menu  ' id='explore-menu' > 
    <h1>Explore our menu</h1>
    <p className='explore-menu-text'>Indulge in a culinary journey like no other. Our menu is crafted with the finest ingredients, offering a delightful selection of dishes that cater to every palate. </p>                                             
    <div className="explore-menu-list"> 
      {menu_list.map((item,index)=>{ 
        return ( 
          <div className="explore-menu-list-item" key={index} onClick={()=>setCategory(prev=>prev===item.menu_name?"All":item.menu_name)}> 
          <img src={item.menu_image} alt="" className={category===item.menu_name?"active":""}/>
          <p>{item.menu_name}</p>
          </div>
        )
      })}
    </div>
    <hr />


    </div>
  )
}

export default ExploreMenu