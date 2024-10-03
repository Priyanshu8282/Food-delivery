import React from 'react'
import Navbar from './component/Navbar/Navbar'
import Sidebar from './component/Sidebar/Sidebar'
import {Routes, Route } from 'react-router-dom'
import List from './pages/List/List'
import Add from './pages/Add/Add'
import Orders from './pages/Orders/Order'
import "./App.css"
import { ToastContainer} from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div> 
      <ToastContainer/>
      <Navbar/>
      <hr/>
      <div className="app-content"> 
        <Sidebar/>
        <Routes> 
          <Route path="/add" element={<Add/>}></Route>
          <Route path="/list" element={<List/>}></Route>
          <Route path="/orders" element={<Orders/>}></Route>
        </Routes>
      </div>

    </div>
  )
}

export default App