import React, { useContext, useEffect, useState } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe("pk_test_51Q1PDXRxtuQAB4ULDzE4tIwxApkd7mhc9mBwhahTrQ9cpXUS7JBQN1WXfPyCjLIQMLuICrPMXpWTML6yyPBFdmVU00RbzEBqCF");

function PlaceOrder() {
  const { getTotalCartAmount, token, cartItems, url, food_list } = useContext(StoreContext);
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
  }, [token, getTotalCartAmount, navigate]);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    try {
      let orderItems = [];
      food_list.forEach((item) => {
        if (cartItems[item._id] > 0) {
          let iteminfo = { ...item, quantity: cartItems[item._id] };
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
        const stripe = await stripePromise;
        const { error } = await stripe.redirectToCheckout({
          sessionId: response.data.sessionId,
        });
        if (error) {
          console.error('Stripe Checkout error:', error);
          toast.error('Error redirecting to Stripe Checkout');
        }
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Error creating order');
    }
  };

  return (
    <form className="place-order" onSubmit={handleCheckout}>
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
            <button type="submit">Pay with Stripe</button>
          </div>
        </div>
      </div>
    </form>
  );
}

export default PlaceOrder;
