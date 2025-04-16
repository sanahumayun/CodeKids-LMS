"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import "./StudentCourseView.css"

const StudentCourseView = () => {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const authToken = localStorage.getItem("authToken")
        console.log("Using auth token:", authToken) // Check the token
        const res = await axios.get("http://localhost:5000/api/courses/student-course-view", {
          headers: { Authorization: `Bearer ${authToken}` },
        })
        setCourses(res.data)
        setLoading(false) // Set loading to false after data is fetched
      } catch (err) {
        console.error("Failed to fetch student courses:", err.response ? err.response.data : err.message)
        setError("Failed to load your courses.")
        setLoading(false) // Set loading to false in case of an error
      }
    }

    fetchEnrolledCourses()
  }, [])

  if (loading) return <p className="loading-message">Loading your courses...</p>
  if (error) return <p className="error-message">{error}</p>

  return (
    <div className="student-course-container">
      <h2 className="page-title">My Enrolled Courses</h2>
      {courses.length === 0 ? (
        <p className="empty-message">You are not enrolled in any courses yet.</p>
      ) : (
        <ul className="course-list">
          {courses.map((course) => (
            <li key={course._id} className="course-item">
              <h3 className="course-title">{course.title}</h3>
              <p className="course-description">{course.description}</p>
              <p className="instructor-info">
                Instructor: {course.instructorId?.name} ({course.instructorId?.email})
              </p>
              <p className="student-count">Enrolled Students: {course.studentCount}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default StudentCourseView
