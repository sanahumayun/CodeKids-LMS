"use client"

import { useState } from "react"
import axios from "axios"

const Signup = () => {
  const [form, setForm] = useState({ username: "", email: "", password: "", role: "student" })

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post("http://localhost:5000/api/auth/signup", form)
      alert(res.data.message)
    } catch (err) {
      alert(err.response.data.error || "Error")
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Signup</h2>
      <input name="username" placeholder="Name" onChange={handleChange} />
      <input name="email" placeholder="Email" onChange={handleChange} />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} />
      <select name="role" onChange={handleChange}>
        <option value="student">Student</option>
        <option value="tutor">Tutor</option>
        <option value="admin">Admin</option>
      </select>
      <button type="submit">Sign Up</button>
    </form>
  )
}

export default Signup
