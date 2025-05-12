"use client"

import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { toast } from 'react-toastify';

const CreateTutor = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "tutor",
  })

  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/auth/signup`, form)
      toast.success(res.data.message || "Tutor created successfully!")
    } catch (err) {
      toast.error(err.response?.data?.error || "Error creating tutor")
    }
  }

  return (
    <div className="container">
      <button 
        onClick={() => navigate("/admin-dashboard")} 
        className="button button-secondary"
      >
        ← Back
      </button>

      <form onSubmit={handleSubmit} className="card">
        <h2 className="auth-title">Create Tutor Profile</h2>
        <div className="form-group">
          <input
            name="name"
            placeholder="Name"
            value={form.username}
            onChange={handleChange}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <input name="email" placeholder="Email" value={form.email} onChange={handleChange} className="form-input" />
        </div>
        <div className="form-group">
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="form-input"
          />
        </div>
        <button type="submit" className="button button-primary">
          Create Tutor
        </button>
      </form>
    </div>
  )
}

export default CreateTutor;
