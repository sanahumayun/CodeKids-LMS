// src/components/LoginPage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/login", {
        email,
        password,
      });

      // Store the token in localStorage or a cookie
      localStorage.setItem("authToken", response.data.token);

      // Based on the role, navigate to the corresponding dashboard
      if (response.data.role === "admin") {
        navigate("/admin/dashboard");
      } else if (response.data.role === "tutor") {
        navigate("/tutor/dashboard");
      } else if (response.data.role === "student") {
        navigate("/student/dashboard");
      }
    } catch (error) {
      setError("Invalid credentials, please try again.");
    }
  };

  return (
    <div className="login-page">
      <h1>Login</h1>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleLogin}>
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      <p>
        Don't have an account? <a href="/signup">Sign up</a>
      </p>
    </div>
  );
};

export default LoginPage;
