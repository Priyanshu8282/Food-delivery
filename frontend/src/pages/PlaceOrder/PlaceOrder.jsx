import React, { useContext, useEffect, useState } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import PayPalButton from "./PayPalButton"; // Correct import path for PayPalButton

function PlaceOrder() {
  const { getTotalCartAmount, token, cartItems, url, food_list } =
    useContext(StoreContext);
  const navigate = useNavigate();

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    phone: "",
  });

  useEffect(() => {
    if (!token) {
      navigate('/cart');
    } else if (getTotalCartAmount() === 0) {
      navigate('/cart');
    }
  }, [token]);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const createOrder = async () => {
    let orderItems = [];
    food_list.map((item) => {
      if (cartItems[item._id] > 0) {
        let iteminfo = item;
        iteminfo["quantity"] = cartItems[item._id];
        orderItems.push(iteminfo);
      }
    });
    let orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + 2,
    };
    let response = await axios.post(url + "/api/order/place", orderData, {
      headers: { token },
    });
    if (response.data.success) {
      return response.data.orderID; // Return the order ID for PayPal
    } else {
      toast.error(response.data.message);
      throw new Error("Order creation failed");
    }
  };

  const onApprove = async (orderID) => {
    let response = await axios.post(url + "/api/order/verify", { orderID, success: true }, {
      headers: { token },
    });
    if (response.data.success) {
      toast.success("Order placed successfully!");
      navigate('/orders'); // Redirect to orders page or any other page
    } else {
      toast.error(response.data.message);
    }
  };

  return (
    <form className="place-order" onSubmit={(e) => e.preventDefault()}>
      <ToastContainer />
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input
            required
            type="text"
            placeholder="First name"
            name="firstName"
            onChange={onChangeHandler}
            value={data.firstName}
          />
          <input
            required
            type="text"
            placeholder="Last name"
            name="lastName"
            onChange={onChangeHandler}
            value={data.lastName}
          />
        </div>
        <input
          required
          type="email"
          placeholder="Email address"
          name="email"
          onChange={onChangeHandler}
          value={data.email}
        />
        <input
          required
          type="text"
          placeholder="Street"
          name="street"
          onChange={onChangeHandler}
          value={data.street}
        />
        <div className="multi-fields">
          <input
            required
            type="text"
            placeholder="City"
            name="city"
            onChange={onChangeHandler}
            value={data.city}
          />
          <input
            required
            type="text"
            placeholder="State"
            name="state"
            onChange={onChangeHandler}
            value={data.state}
          />
        </div>
        <div className="multi-fields">
          <input
            required
            type="text"
            placeholder="Zip code"
            name="zipCode"
            onChange={onChangeHandler}
            value={data.zipCode}
          />
          <input
            required
            type="text"
            placeholder="Country"
            name="country"
            onChange={onChangeHandler}
            value={data.country}
          />
        </div>
        <input
          required
          type="tel"
          placeholder="Phone"
          name="phone"
          onChange={onChangeHandler}
          value={data.phone}
        />
      </div>
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>${getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>${getTotalCartAmount() === 0 ? 0 : 2}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <h2>Total</h2>
              <b>
                ${getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}
              </b>
            </div>
            <PayPalButton createOrder={createOrder} onApprove={onApprove} />
          </div>
        </div>
      </div>
    </form>
  );
}

export default PlaceOrder;