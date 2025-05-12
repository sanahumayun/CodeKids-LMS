import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const TutorCourseDetailPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [formData, setFormData] = useState({});
  const [successMsg, setSuccessMsg] = useState("");
  const [submissions, setSubmissions] = useState({});
  const [visibleSubmissions, setVisibleSubmissions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/courses/tutor/courses/${courseId}`, {
          withCredentials: true,
        });
        setCourse(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching course detail:", err);
        setError("Failed to load course.");
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  const fetchSubmissionsForAssignment = async (assignmentId) => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/courses/assignments/${assignmentId}/submissions`);
      setSubmissions((prev) => ({
        ...prev,
        [assignmentId]: res.data.submissions,
      }));
    } catch (err) {
      console.error("Failed to fetch submissions:", err);
    }
  };

  const toggleSubmissionsVisibility = (assignmentId) => {
    if (!submissions[assignmentId]) {
      fetchSubmissionsForAssignment(assignmentId);
    }

    setVisibleSubmissions((prev) => ({
      ...prev,
      [assignmentId]: !prev[assignmentId],
    }));
  };

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAssignmentUpload = async () => {
    const { title, description, dueDate } = formData;

    if (!title || !description || !dueDate) {
      toast.error("Please fill all assignment fields.");
      return;
    }

    try {
      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/courses/tutor/courses/${courseId}/upload-assignment`,
        { title, description, dueDate },
        { withCredentials: true }
      );

      setSuccessMsg("Assignment uploaded!");
      setFormData({});
      // Refetch course data to update the assignment list
      const updatedCourse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/courses/tutor/courses/${courseId}/course-detail`, {
        withCredentials: true,
      });
      setCourse(updatedCourse.data);
    } catch (err) {
      console.error("Upload failed:", err);
      toast.error("Failed to upload assignment.");
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_API_BASE_URL}/courses/${courseId}/status`,
        { status: newStatus },
        { withCredentials: true }
      );

      if (response.data.success) {
        setCourse((prev) => ({ ...prev, status: newStatus }));
        toast.success("Status updated!");
      }
    } catch (err) {
      console.error("Error updating status:", err);
      toast.error("Failed to update status.");
    }
  };

  if (loading) return <p className="loading-message">Loading course details...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="container">
      <button className="button button-secondary" onClick={() => navigate(-1)}>← Back</button>

      <h2 className="page-title">{course.title}</h2>
      <p className="card-body">{course.description}</p>

      <div className="card student-enrollment">
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

      <div className="card assignments-section">
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

      <div className="card assignment-upload-form">
        <h4>Upload Assignment</h4>
        <input
          type="text"
          name="title"
          placeholder="Assignment Title"
          value={formData.title || ""}
          onChange={handleInputChange}
        />
        <textarea
          name="description"
          placeholder="Assignment Description"
          value={formData.description || ""}
          onChange={handleInputChange}
        />
        <input
          type="date"
          name="dueDate"
          value={formData.dueDate || ""}
          onChange={handleInputChange}
        />
        <button onClick={handleAssignmentUpload}>Upload Assignment</button>
        {successMsg && <p className="success-message">{successMsg}</p>}
      </div>

      <div className="status-control">
        <label>Status:</label>
        <select
          value={course.status}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="course-status-dropdown"
        >
          <option value="in progress">In Progress</option>
          <option value="complete">Complete</option>
        </select>
      </div>
    </div>
  );
};

export default TutorCourseDetailPage;
