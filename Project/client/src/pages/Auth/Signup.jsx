"use client"

import { useState } from "react"
import axios from "axios"
import { toast } from 'react-toastify';

const Signup = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "student" })

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/auth/signup`, form)
      toast.success(res.data.message || 'Signup successful!')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error during signup!');
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Signup</h2>
      <input name="name" placeholder="Name" onChange={handleChange} />
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
