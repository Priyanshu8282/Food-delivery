import React, { useContext } from 'react';
import { assets } from '../../assets/assets';
import './FoodItem.css';
import { StoreContext } from '../../context/StoreContext';

function FoodItem({ id, name, price, description, image }) {
  const { cartItems, addToCart, removeFromCart, url } = useContext(StoreContext);

  // Check if cartItems is defined and if the item exists in the cart
  const itemQuantity = cartItems?.[id] || 0;

  return (
    <div className='food-item'>
      <div className="food-item-img-container">
        <img src={url + "/images/" + image} alt={name} className='food-item-image' />
        {
          itemQuantity === 0 ? (
            <img
              src={assets.add_icon_white}
              onClick={() => addToCart(id)}
              className='add'
              alt="Add to cart"
            />
          ) : (
            <div className='food-item-counter'>
              <img
                src={assets.remove_icon_red}
                alt="Remove"
                onClick={() => removeFromCart(id)}
              />
              <p>{itemQuantity}</p>
              <img
                src={assets.add_icon_green}
                alt="Add"
                onClick={() => addToCart(id)}
              />
            </div>
          )
        }
      </div>
      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p>{name}</p>
          <img src={assets.rating_starts} alt="Rating" />
        </div>
        <p className="food-item-desc">{description}</p>
        <p className='food-item-price'>${price}</p>
      </div>
    </div>
  );
}

export default FoodItem;
