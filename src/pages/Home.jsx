// import React from "react";
import { Link } from "react-router-dom";
import './Home.css';


// This is the not signed in home page. It has links to the login and register pages.
function Home() {
  return (
    <div className="home">
      <h1>Welcome to<br/>ThingsTo:</h1>
      <p>Your all-in-one productivity app to manage your tasks, notes, logs, and memories.</p>
      <p>Get started by creating an account or logging in.</p>
      <div className="loginRegisterLinks">
        <Link className="button" to="/register">Register</Link>
        <Link className="button" to="/login">Login</Link>
      </div>
    </div>
  );
}

export default Home;
