// import React from "react";
import './App.css';
import Header from "/src/components/header";
import Todos from "./pages/Todos";
import Wrapper from "./pages/Wrapper";

import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Wrapper>
        <Header />
        <div className="container">
          <Routes>
            <Route path="/todos" element={<Todos />} />
          </Routes>
        </div>
      </Wrapper>
    </>
  );
}

export default App;
