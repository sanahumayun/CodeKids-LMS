"use client"

import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

const CreateTutor = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "tutor", // fixed role
  })

  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post("http://localhost:5000/api/auth/signup", form)
      alert(res.data.message || "Tutor created successfully!")
    } catch (err) {
      alert(err.response?.data?.error || "Error creating tutor")
    }
  }

  return (
    <div>
      <button onClick={() => navigate("/admin-dashboard")}>BACK</button>
      <form onSubmit={handleSubmit}>
        <h2>Create Tutor Profile</h2>
        <input name="username" placeholder="Name" value={form.username} onChange={handleChange} />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} />
        <button type="submit">Create Tutor</button>
      </form>
    </div>
  )
}

export default CreateTutor
