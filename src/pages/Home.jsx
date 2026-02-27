// import React from "react";
import { Link } from "react-router-dom";

// This is the not signed in home page. It has links to the login and register pages.
function Home() {
  return (
    <div>
      <h1>Welcome to ThingsTo</h1>
      <p>Your all-in-one productivity app to manage your tasks, notes, logs, and memories.</p>
      <p>Get started by creating an account or logging in.</p>
      <div className="loginRegisterLinks">
        <Link to="/register">Register</Link>
        <br></br>
        <Link to="/login">Login</Link>
      </div>
    </div>
  );
}

export default Home;
