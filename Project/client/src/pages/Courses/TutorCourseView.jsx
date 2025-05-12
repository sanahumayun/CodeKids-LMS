"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import "./TutorCourseView.css";
import { toast } from 'react-toastify';

const TutorCourseView = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({});
  const [successMsg, setSuccessMsg] = useState({});
  const [submissions, setSubmissions] = useState({});
  const [visibleSubmissions, setVisibleSubmissions] = useState({}); // State to track visibility of submissions

  useEffect(() => {
    const fetchTeachingCourses = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/courses/tutor-course-view`, { withCredentials: true });
        setCourses(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch tutor courses:", err.response?.data || err.message);
        setError("Failed to load your courses.");
        setLoading(false);
      }
    };

    fetchTeachingCourses();
  }, []);

  const fetchSubmissionsForAssignment = async (assignmentId) => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/submission/${assignmentId}`);
      setSubmissions((prev) => ({
        ...prev,
        [assignmentId]: res.data.submissions,
      }));
    } catch (err) {
      console.error("Failed to fetch submissions:", err);
    }
  };

  const toggleSubmissionsVisibility = (assignmentId) => {
    // Fetch submissions if not already fetched
    if (!submissions[assignmentId]) {
      fetchSubmissionsForAssignment(assignmentId);
    }

    // Toggle visibility
    setVisibleSubmissions((prev) => ({
      ...prev,
      [assignmentId]: !prev[assignmentId],
    }));
  };

  const handleInputChange = (e, courseId) => {
    setFormData((prev) => ({
      ...prev,
      [courseId]: {
        ...prev[courseId],
        [e.target.name]: e.target.value,
      },
    }));
  };

  const handleAssignmentUpload = async (courseId) => {
    try {
      const { title, description, dueDate } = formData[courseId] || {};

      if (!title || !description || !dueDate) {
        toast.error("Please fill all assignment fields.");
        return;
      }

      const uploadRes = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/courses/${courseId}/tutor-upload-assignment`,
        { title, description, dueDate },
        { withCredentials: true }
      );

      setSuccessMsg((prev) => ({ ...prev, [courseId]: "Assignment uploaded!" }));
      setFormData((prev) => ({ ...prev, [courseId]: {} }));
    } catch (err) {
      console.error("Upload failed:", err.response?.data || err.message);
      toast.error("Failed to upload assignment.");
    }
  };

  const handleStatusChange = async (courseId, newStatus) => {
    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_API_BASE_URL}/courses/${courseId}/status`,
        { status: newStatus },
        { withCredentials: true }
      );

      if (response.data.success) {
        setCourses((prevCourses) =>
          prevCourses.map((course) =>
            course._id === courseId ? { ...course, status: newStatus } : course
          )
        );

        document.getElementById(`status-message-${courseId}`).classList.add("show");
        setTimeout(() => {
          document.getElementById(`status-message-${courseId}`).classList.remove("show");
        }, 3000);
      } else {
        console.error("Failed to update course status");
      }
    } catch (err) {
      console.error("Error updating course status:", err.response?.data || err.message);
    }
  };

  if (loading) return <p className="loading-message">Loading courses...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="course-list-container">
      <button className="back-button" onClick={() => window.history.back()}>
        ← Back
      </button>

      <h2 className="page-title">My Teaching Courses</h2>
      {courses.length === 0 ? (
        <p className="empty-message">You are not teaching any courses yet.</p>
      ) : (
        <div className="course-grid">
          {courses.map((course) => (
            <div key={course._id} className="course-card">
              <h3 className="course-title">{course.title}</h3>
              <p className="course-description">{course.description}</p>

              <div className="student-enrollment">
                <h4>Enrolled Students</h4>
                <ul>
                  {course.studentsEnrolled?.length ? (
                    course.studentsEnrolled.map((student) => (
                      <li key={student._id}>
                        {student.name} ({student.email})
                      </li>
                    ))
                  ) : (
                    <li>No students enrolled yet.</li>
                  )}
                </ul>
              </div>

              <div className="assignments-section">
                <h4>Assignments</h4>
                {course.assignments.length === 0 ? (
                  <p>No assignments uploaded yet.</p>
                ) : (
                  <ul>
                    {course.assignments.map((assignment) => (
                      <li key={assignment._id} className="assignment-item">
                        <h5>{assignment.title}</h5>
                        <p>{assignment.description}</p>
                        <p>
                          <strong>Due Date:</strong> {new Date(assignment.dueDate).toLocaleDateString()}
                        </p>

                        <button onClick={() => toggleSubmissionsVisibility(assignment._id)}>
                          {visibleSubmissions[assignment._id] ? "Hide Submissions" : "View Submissions"}
                        </button>

                        {visibleSubmissions[assignment._id] && submissions[assignment._id] && (
                          <div className="submissions-list">
                            <h6>Submissions:</h6>
                            <ul>
                              {submissions[assignment._id].map((submission) => (
                                <li key={submission._id} className="submission-entry">
                                  <p><strong>Student:</strong> {submission.studentId?.name}</p>
                                  <p><strong>Content:</strong> {submission.content}</p>
                                  <p><strong>Submitted At:</strong> {new Date(submission.submittedAt).toLocaleString()}</p>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
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
                <button onClick={() => handleAssignmentUpload(course._id)}>Upload Assignment</button>
                {successMsg[course._id] && <p className="success-message">{successMsg[course._id]}</p>}
              </div>

              <div className="status-control">
                <select
                  value={course.status}
                  onChange={(e) => handleStatusChange(course._id, e.target.value)}
                  className="course-status-dropdown"
                >
                  <option value="in progress">In Progress</option>
                  <option value="complete">Complete</option>
                </select>
                <p id={`status-message-${course._id}`} className="status-update-message">
                  Status updated successfully!
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TutorCourseView;
