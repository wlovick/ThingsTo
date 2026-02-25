// import React from "react";
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "/src/components/header";

import Home from "./pages/Login";
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
              <Header />
              <Todos />
            </Wrapper>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
