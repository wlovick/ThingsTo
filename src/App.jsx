// import React from "react";
import './App.css';
import Wrapper from "./pages/Wrapper";

import Header from "/src/components/header";
import Footer from './components/Footer';

import Todos from "./pages/Todos";
import Logs from "./pages/Logs";

import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Wrapper>
        <Header />
        <div className="container">
          <Routes>
            <Route path="/todos" element={<Todos />} />
            <Route path="/logs" element={<Logs />} />
          </Routes>
        </div>
        <div className="footer">
          <Footer />
        </div>
      </Wrapper>
    </>
  );
}

export default App;
