import "./LoginPopup.css";
import { useContext, useState } from "react";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { toast } from 'react-toastify';

function LoginPopup() {
  const { url, setToken } = useContext(StoreContext);
  const [isLogin, setIsLogin] = useState(true); // Use boolean state for login/register
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const onLogin = async (event) => {
    event.preventDefault();
    let newUrl = url;
    try {
      if (isLogin) {
        newUrl += "/api/user/login";
      } else {
        newUrl += "/api/user/register";
      }

      const response = await axios.post(newUrl, data);

      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
        setShowLogin(false); // Close the login popup on success
        toast.success(isLogin ? "Logged in successfully" : "Registered successfully");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || (isLogin ? 'Login failed' : 'Registration failed'));
    }
  };

  return (
    <div className="login-popup">
      <form className="login-popup-container" onSubmit={onLogin}>
        <div className="login-popup-title">
          <h2>{isLogin ? "Login" : "Sign Up"}</h2>
          <img
            src={assets.cross_icon}
            alt="close"
            onClick={() => setShowLogin(false)} // Properly close the popup
          />
        </div>
        <div className="login-popup-inputs">
          {!isLogin && (
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
          {isLogin ? "Login" : "Create account"}
        </button>
        <div className="login-popup-condition">
          <input type="checkbox" required id="checkbox" />
          <label htmlFor="checkbox">
            <p>
              By continuing, I agree to the terms of use & privacy policy.
            </p>
          </label>
        </div>
        {isLogin ? (
          <p>
            Create a new account?{" "}
            <span onClick={() => setIsLogin(false)}>Click here</span>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <span onClick={() => setIsLogin(true)}>Login here</span>
          </p>
        )}
      </form>
    </div>
  );
}

export default LoginPopup;