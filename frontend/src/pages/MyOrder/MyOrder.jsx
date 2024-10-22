import React, { useState, useContext, useEffect } from 'react';
import './MyOrder.css';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { assets } from '../../assets/assets';

function MyOrder() {
  const { url, token } = useContext(StoreContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrder = async () => {
    try {
      const response = await axios.post(url + "/api/order/userorders", {}, { headers: { Authorization: `Bearer ${token}` } });
      console.log('API Response:', response.data);
      
      if (response.data.success) {
        setData(response.data.orders);
      } else {
        setError(response.data.message);
      }
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      setError("Failed to fetch orders. Please try again later.");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrder();
    }
  }, [token]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

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
            <p><span>&#x25cf;</span> {order.status}</p>
            <button onClick={() => alert('Tracking order...')}>Track Order</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyOrder;