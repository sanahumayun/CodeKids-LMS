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
      const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/auth/login`, form)
      const token = res.data.token 
      const user = res.data.user 

      
      localStorage.setItem("authToken", token)
      localStorage.setItem("user", JSON.stringify(user))

      
      if (user.role === "admin") {
        window.location.href = "/admin-dashboard"
      } else if (user.role === "tutor") {
        window.location.href = "/tutor-dashboard"
      } else if (user.role === "student") {
        window.location.href = "/student-dashboard"
      }
    } catch (err) {
      toast.error(err.response.data.error || "Error")
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
