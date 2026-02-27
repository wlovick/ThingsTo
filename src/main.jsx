import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import './App.css'
import App from './App.jsx'
import { BrowserRouter } from "react-router-dom";

import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";


createRoot(document.getElementById('root')).render(
  <StrictMode>
      <BrowserRouter>
          <App />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
          </Routes>
      </BrowserRouter>
  </StrictMode>,
)
