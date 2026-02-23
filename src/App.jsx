// import React from "react";
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Todos from "./pages/Todos";
import Wrapper from "./pages/Wrapper";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* home */}
        <Route path="/" element={<Home />} />

        {/* register */}
        <Route path="/register" element={<Register />} />

        {/* login */}
        <Route path="/login" element={<Login />} />

        {/* todos */}
        <Route
          path="/todos"
          element={
            <Wrapper>
              <Todos />
            </Wrapper>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
