// import React from "react";
import { Link } from "react-router-dom";

// This is the not signed in home page. It has links to the login and register pages.
function Home() {
  return (
    <div>
      <Link to="/register">Register</Link>
      <br></br>
      <Link to="/login">Login</Link>
    </div>
  );
}

export default Home;
