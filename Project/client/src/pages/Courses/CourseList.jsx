"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import "./CourseList.css"

const CourseList = () => {
  const [courses, setCourses] = useState([])
  const [students, setStudents] = useState([]) // all students
  const [loading, setLoading] = useState(true)
  const [enrollSelection, setEnrollSelection] = useState({})
  const [removeSelection, setRemoveSelection] = useState({})

  useEffect(() => {
    const fetchData = async () => {
      try {
        const courseRes = await axios.get("/api/courses/course-list")
        const studentRes = await axios.get("/api/users?role=student")
        setCourses(courseRes.data)
        setStudents(studentRes.data)
      } catch (err) {
        console.error("Failed to fetch data", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleEnroll = async (courseId, studentId) => {
    const confirm = window.confirm("Are you sure you want to enroll this student in the course?")
    if (!confirm) return

    console.log("📩 Enrolling student...")
    console.log("🧾 Course ID:", courseId)
    console.log("🎓 Student ID:", studentId)

    try {
      const response = await axios.post(`/api/courses/${courseId}/enroll`, { studentId })
      console.log("✅ Enrollment successful! Server response:", response.data)

      alert("✅ Student successfully enrolled!")
      // fetchData(); // Refresh the course list
    } catch (err) {
      console.error("❌ Enrollment failed:", err.response?.data || err.message)
      alert("❌ Failed to enroll student. Please try again.")
    }
  }

  const handleRemove = async (courseId) => {
    const studentId = removeSelection[courseId]
    if (!studentId) {
      alert("❗ Please select a student to remove.")
      return
    }

    const confirm = window.confirm("Are you sure you want to remove this student from the course?")
    if (!confirm) return

    console.log("📩 Removing student...")
    console.log("🧾 Course ID:", courseId)
    console.log("🎓 Student ID:", studentId)

    try {
      console.log("📤 Sending removal request:", { courseId, studentId })
      await axios.post(
        `/api/courses/${courseId}/remove-student`, // fixed endpoint to match enroll style
        { studentId },
      )

      alert("✅ Student successfully removed!")
      // fetchData(); // reload data like you did in enroll
    } catch (err) {
      console.error("❌ Failed to remove student", err)
      alert("❌ Failed to remove student. Please try again.")
    }
  }

  if (loading) return <p className="loading-message">Loading courses...</p>

  return (
    <div className="course-list-container">
      <h2 className="page-title">Available Courses</h2>
      {courses.length === 0 ? (
        <p className="empty-message">No courses found.</p>
      ) : (
        <ul className="course-list">
          {courses.map((course) => (
            <li key={course._id} className="course-item">
              <h3 className="course-title">{course.title}</h3>
              <p className="course-description">{course.description}</p>
              <p className="instructor-info">
                Instructor: {course.instructorId?.name} ({course.instructorId?.email})
              </p>

              <div className="student-enrollment">
                <h4>Enrolled Students</h4>
                <ul>
                  {course.studentsEnrolled && course.studentsEnrolled.length > 0 ? (
                    course.studentsEnrolled.map((s) => (
                      <li key={s._id}>
                        {s.name} ({s.email})
                      </li>
                    ))
                  ) : (
                    <li>No students enrolled yet.</li>
                  )}
                </ul>

                {/* Enroll Dropdown */}
                <div className="enroll-form">
                  <select
                    value={enrollSelection[course._id] || ""}
                    onChange={(e) => setEnrollSelection({ ...enrollSelection, [course._id]: e.target.value })}
                  >
                    <option value="">Select student to enroll</option>
                    {students.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.name} ({s.email})
                      </option>
                    ))}
                  </select>
                  <button onClick={() => handleEnroll(course._id, enrollSelection[course._id])}>Enroll</button>
                </div>

                {/* Remove Dropdown */}
                <div className="enroll-form">
                  <select
                    value={removeSelection[course._id] || ""}
                    onChange={(e) => setRemoveSelection({ ...removeSelection, [course._id]: e.target.value })}
                  >
                    <option value="">Select student to remove</option>
                    {course.studentsEnrolled &&
                      course.studentsEnrolled.map((s) => (
                        <option key={s._id} value={s._id}>
                          {s.name} ({s.email})
                        </option>
                      ))}
                  </select>
                  <button className="remove-btn" onClick={() => handleRemove(course._id)}>
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default CourseList
