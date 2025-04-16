"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import "./TutorCourseView.css"

const TutorCourseView = () => {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({})
  const [successMsg, setSuccessMsg] = useState({})

  useEffect(() => {
    const fetchTeachingCourses = async () => {
      try {
        const res = await axios.get("/api/courses/tutor-course-view", { withCredentials: true })
        setCourses(res.data)
        setLoading(false)
      } catch (err) {
        console.error("Failed to fetch tutor courses:", err.response?.data || err.message)
        setError("Failed to load your courses.")
        setLoading(false)
      }
    }

    fetchTeachingCourses()
  }, [])

  const handleInputChange = (e, courseId) => {
    setFormData((prev) => ({
      ...prev,
      [courseId]: {
        ...prev[courseId],
        [e.target.name]: e.target.value,
      },
    }))
  }

  const handleAssignmentUpload = async (courseId) => {
    try {
      const { title, description, dueDate } = formData[courseId] || {}

      if (!title || !description || !dueDate) {
        alert("Please fill all assignment fields.")
        return
      }

      const res = await axios.post(
        `/api/courses/tutor-upload-assignment/${courseId}`,
        { title, description, dueDate },
        { withCredentials: true },
      )

      setSuccessMsg((prev) => ({ ...prev, [courseId]: "Assignment uploaded!" }))
      setFormData((prev) => ({ ...prev, [courseId]: {} })) // Clear form
    } catch (err) {
      console.error("Upload failed:", err.response?.data || err.message)
      alert("Failed to upload assignment.")
    }
  }

  if (loading) return <p className="loading-message">Loading your teaching courses...</p>
  if (error) return <p className="error-message">{error}</p>

  return (
    <div className="tutor-course-container">
      <h2 className="page-title">My Teaching Courses</h2>

      {courses.length === 0 ? (
        <p className="empty-message">You are not teaching any courses yet.</p>
      ) : (
        <ul className="course-list">
          {courses.map((course) => (
            <li key={course._id} className="course-item">
              <h3 className="course-title">{course.title}</h3>
              <p className="course-description">{course.description}</p>

              <div className="student-list">
                <strong>Enrolled Students:</strong>
                <ul>
                  {course.studentsEnrolled.map((student) => (
                    <li key={student._id}>
                      {student.name} ({student.email})
                    </li>
                  ))}
                </ul>
              </div>

              <div className="assignment-upload-form">
                <h4>Upload Assignment</h4>
                <input
                  type="text"
                  name="title"
                  placeholder="Assignment Title"
                  value={formData[course._id]?.title || ""}
                  onChange={(e) => handleInputChange(e, course._id)}
                />
                <textarea
                  name="description"
                  placeholder="Assignment Description"
                  value={formData[course._id]?.description || ""}
                  onChange={(e) => handleInputChange(e, course._id)}
                />
                <input
                  type="date"
                  name="dueDate"
                  value={formData[course._id]?.dueDate || ""}
                  onChange={(e) => handleInputChange(e, course._id)}
                />
                <button onClick={() => handleAssignmentUpload(course._id)}>Submit Assignment</button>
                {successMsg[course._id] && <p className="success-message">{successMsg[course._id]}</p>}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default TutorCourseView
