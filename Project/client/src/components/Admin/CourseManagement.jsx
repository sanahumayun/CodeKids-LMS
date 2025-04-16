"use client"

import { useState, useEffect } from "react"
import axios from "axios"

const CourseManagement = () => {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    tutorId: "",
  })
  const [tutors, setTutors] = useState([])

  useEffect(() => {
    fetchCourses()
    fetchTutors()
  }, [])

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get("/api/courses", {
        headers: { Authorization: `Bearer ${token}` },
      })
      setCourses(response.data)
      setLoading(false)
    } catch (err) {
      setError("Failed to fetch courses")
      setLoading(false)
    }
  }

  const fetchTutors = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get("/api/users?role=tutor", {
        headers: { Authorization: `Bearer ${token}` },
      })
      setTutors(response.data)
    } catch (err) {
      setError("Failed to fetch tutors")
    }
  }

  const handleInputChange = (e) => {
    setNewCourse({
      ...newCourse,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem("token")
      await axios.post("/api/courses", newCourse, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setShowModal(false)
      setNewCourse({
        title: "",
        description: "",
        tutorId: "",
      })
      fetchCourses()
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create course")
    }
  }

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        const token = localStorage.getItem("token")
        await axios.delete(`/api/courses/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        fetchCourses()
      } catch (err) {
        setError("Failed to delete course")
      }
    }
  }

  if (loading) return <div className="text-center py-10">Loading...</div>

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Course Management</h2>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Add New Course
        </button>
      </div>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tutor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {courses.map((course) => (
              <tr key={course._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{course.title}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-500">{course.description}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{course.tutor?.name || "Not assigned"}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleDeleteCourse(course._id)}
                    className="text-red-600 hover:text-red-900 ml-4"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Add New Course</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={newCourse.title}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={newCourse.description}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="tutorId">
                  Tutor
                </label>
                <select
                  id="tutorId"
                  name="tutorId"
                  value={newCourse.tutorId}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                >
                  <option value="">Select a tutor</option>
                  {tutors.map((tutor) => (
                    <option key={tutor._id} value={tutor._id}>
                      {tutor.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Create Course
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default CourseManagement
