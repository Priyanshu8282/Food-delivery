import "./LoginPopup.css";
import { useContext, useState,useEffect } from "react";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function LoginPopup({ setShowLogin }) {
  const { url, setToken } = useContext(StoreContext);
  const [currState, setCurrState] = useState("Login");
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const onLogin = async (event) => {
    event.preventDefault();
    let newUrl = url;
    try{
    if (currState === "Login") {
      newUrl += "/api/user/login";
      toast.success("Logged in successfully");
    }
    
     else {
      newUrl += "/api/user/register";
      toast.success("Registered successfully");
    }
  }
  catch (error) {
    toast.error(error.response.data.message || 'Login failed');
  }
    const response = await axios.post(newUrl, data);

    
    if (response.data.success) {
      setToken(response.data.token);
      localStorage.setItem("token", response.data.token);
      setShowLogin(false); // Close the login popup on success
    } else {
      alert(response.data.message);
    }
  };



  return (
    <div className="login-popup">
      <ToastContainer/>
      <form className="login-popup-container" onSubmit={onLogin}>
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <img
            src={assets.cross_icon}
            alt="close"
            onClick={() => setShowLogin(false)} // Properly close the popup
          />
        </div>
        <div className="login-popup-inputs">
          {currState === "Login" ? null : (
            <input
              type="text"
              name="name"
              onChange={onChangeHandler}
              value={data.name} // Correct value binding for name
              placeholder="Your name"
              required
            />
          )}
          <input
            type="email"
            placeholder="Your email"
            name="email"
            onChange={onChangeHandler}
            value={data.email}
            required
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={onChangeHandler}
            value={data.password}
            required
          />
        </div>
        <button className="btn" type="submit">
          {currState === "Sign Up" ? "Create account" : "Login"}
        </button>
        <div className="login-popup-condition">
          <input type="checkbox" required id="checkbox" />
          <label htmlFor="checkbox">
            <p>
              By continuing, I agree to the terms of use & privacy policy.
            </p>
          </label>
        </div>
        {currState === "Login" ? (
          <p>
            Create a new account?{" "}
            <span onClick={() => setCurrState("Sign Up")}>Click here</span>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <span onClick={() => setCurrState("Login")}>Login here</span>
          </p>
        )}
      </form>
    </div>
  );
}

export default LoginPopup;
