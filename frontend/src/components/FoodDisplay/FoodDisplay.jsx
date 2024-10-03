import React, { useContext } from 'react';
import './FoodDisplay.css';
import { StoreContext } from '../../context/StoreContext';
import FoodItem from '../FoodItem/FoodItem';

function FoodDisplay({ category }) {
    const { food_list } = useContext(StoreContext);


    // Ensure food_list is defined and is an array
    if (!food_list || !Array.isArray(food_list)) {
        return <div className='food-display' id='food-display'>No food items available</div>;
    }

    // Handle empty food_list
    if (food_list.length === 0) {
        return <div className='food-display' id='food-display'>No food items available</div>;
    }

    return (
        <div className='food-display' id='food-display'>
            <h2>Top dishes near</h2>
            <div className="food-display-list">
                {food_list.map((item, index) => {
                    if (category === "All" || category === item.category) {
                        return (
                            <FoodItem
                                key={index}
                                id={item._id}
                                name={item.name}
                                description={item.description}
                                image={item.image}
                                price={item.price}
                            />
                        );
                    }
                    return null; // Ensure map returns a value
                })}
            </div>
        </div>
    );
}

export default FoodDisplay;