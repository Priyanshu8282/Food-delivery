import React, { useState, useContext, useEffect } from 'react';
import './MyOrder.css';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { assets } from '../../assets/assets';

function MyOrder() {
  const { url, token } = useContext(StoreContext);
  const [data, setData] = useState([]);

  const fetchOrder = async () => {
    try {
      const response = await axios.post(url + "/api/order/userorders", {}, { headers: { token } });
      setData(response.data.data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrder();
    }
  }, [token]);

  return (
    <div className='my-orders'>
      <h2>My Orders</h2>
      <div className="container">
        {data.map((order, index) => (
          <div className="my-orders-order" key={index}>
            <img src={assets.parcel_icon} alt="Parcel Icon" />
            <p>
              {order.items && order.items.map((item, itemIndex) => (
                <span key={itemIndex}>
                  {item.name} x {item.quantity}
                  {itemIndex < order.items.length - 1 ? ', ' : ''}
                </span>
              ))}
            </p>
            <p>${order.amount}.00</p>
            <p>Items: {order.items ? order.items.length : 0}</p>
            <p><span>&#x25cf</span> {order.status}</p>
            <button onClick={fetchOrder}>Track Order</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyOrder;