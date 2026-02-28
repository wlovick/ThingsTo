// import React from "react";
import { useState } from "react";
import supabase from "../helper/supabaseClient";
import { Link, useNavigate } from "react-router-dom";
import './login-logout.css';


function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      setMessage(error.message);
      setEmail("");
      setPassword("");
      return;
    }

    if (data) {
      navigate("/todos");
      return null;
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <br></br>
      {message && <span>{message}</span>}
      <form className="login-register" onSubmit={handleSubmit}>
        <input
          className="username-input"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          type="email"
          placeholder="Email"
          required
        />
        <input
          className="password-input"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          type="password"
          placeholder="Password"
          required
        />
        <button className="login-button" type="submit">Log in</button>
      </form>
      <span>Don&rsquo;t have an account? </span>
      <Link className="Link" to="/register">Register.</Link>
    </div>
  );
}

export default Login;
