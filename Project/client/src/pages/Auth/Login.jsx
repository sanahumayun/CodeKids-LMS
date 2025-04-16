"use client"

import { useState } from "react"
import axios from "axios"
import "./Login.css"

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" })

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", form)
      const token = res.data.token // The JWT token from the backend
      const user = res.data.user // User data from the backend

      // Store the token and user information in localStorage
      localStorage.setItem("authToken", token)
      localStorage.setItem("user", JSON.stringify(user))

      // Alert for debugging
      // alert(`Token: ${token}\nUser Info: ${JSON.stringify(user, null, 2)}`)

      // Redirect based on user role
      if (user.role === "admin") {
        window.location.href = "/admin-dashboard"
      } else if (user.role === "tutor") {
        window.location.href = "/tutor-dashboard"
      } else if (user.role === "student") {
        window.location.href = "/student-dashboard"
      }
    } catch (err) {
      alert(err.response.data.error || "Error")
    }
  }

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2 className="login-title">Login</h2>
        <div className="form-group">
          <input name="email" placeholder="Email" onChange={handleChange} className="form-input" />
        </div>
        <div className="form-group">
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            className="form-input"
          />
        </div>
        <button type="submit" className="login-button">
          Log In
        </button>
      </form>
    </div>
  )
}

export default Login
