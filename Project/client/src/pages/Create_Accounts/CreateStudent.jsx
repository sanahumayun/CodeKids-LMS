"use client"

import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import "./CreateStudent.css"

const CreateStudent = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "student", // fixed role
  })

  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post("http://localhost:5000/api/auth/signup", form)
      alert(res.data.message || "Student created successfully!")
    } catch (err) {
      alert(err.response?.data?.error || "Error creating student")
    }
  }

  return (
    <div className="create-student-container">
      <button onClick={() => navigate("/admin-dashboard")} className="back-button">
        BACK
      </button>
      <form onSubmit={handleSubmit} className="student-form">
        <h2 className="form-title">Create Student Profile</h2>
        <div className="form-group">
          <input
            name="username"
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
        <button type="submit" className="submit-button">
          Create Student
        </button>
      </form>
    </div>
  )
}

export default CreateStudent
