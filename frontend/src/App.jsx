import React, { useState } from "react";
import Navbar from "./components/Navbar/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Cart from "./pages/Cart/Cart";
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder";
import Footer from "./components/footer/Footer";
import LoginPopup from "./components/LoginPopup/LoginPopup";
import Verify from "./pages/Verify/Verify";
import MyOrder from "./pages/MyOrder/MyOrder";

const App = () => {
  const [showLogin,setShowLogin]=useState(false)
  return (
    <>
   {showLogin?<LoginPopup setShowLogin={setShowLogin}/>:<></>}
    <div className="app">
      <Navbar setShowLogin={setShowLogin}/>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/order" element={<PlaceOrder />} />
        <Route path='/verify' element={<Verify/>}/>
        <Route path="/myorders" element={<MyOrder/>}/>
      </Routes>   
    </div>
    <Footer/>
    </>
  );
};

export default App;
