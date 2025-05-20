import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from 'react-toastify';

const StudentCourseDetail = () => {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submission, setSubmission] = useState({});
  const [files, setFiles] = useState({});
  const { courseId } = useParams();
  const navigate = useNavigate();
  const toastId = useRef(null);

  const fetchCourseDetails = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        const res = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/courses/student/courses/${courseId}`,
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );
        setCourse(res.data);

        const statusName = typeof res.data.status === "string" ? res.data.status : res.data.status?.name;

        if (statusName === "complete" && !toastId.current) {
          const reviewCheck = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/courses/student/courses/${courseId}/reviews/check`,
          { headers: { Authorization: `Bearer ${authToken}` } }
        );

        const { hasReview } = reviewCheck.data;

        if (!hasReview && !toastId.current) {
          toastId.current = toast.info(
            <div>
              🎓 You've completed this course!&nbsp;
              <button
                onClick={() => {
                  toast.dismiss(toastId.current);
                  navigate(`/student/courses/${res.data._id}/reviews`);
                }}
                style={{
                  color: "#4f46e5",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                Leave a review
              </button>
            </div>,
            {
              position: "top-center",
              autoClose: false,
              closeOnClick: false,
              closeButton: true,
            }
          );
        }
      }

        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch course details:", err.response ? err.response.data : err.message);
        setError("Failed to load course details.");
        setLoading(false);
      }
    };

  useEffect(() => {
    toastId.current = null;

    fetchCourseDetails();

    // Clean up toast on unmount or courseId change
    return () => {
      if (toastId.current) {
        toast.dismiss(toastId.current);
        toastId.current = null;
      }
    };
  }, [courseId, navigate]);


  const handleSubmissionChange = (e, assignmentId) => {
    setSubmission((prev) => ({
      ...prev,
      [assignmentId]: e.target.value,
    }));
  };

  const handleSubmitAssignment = async (assignmentId) => {
    const content = submission[assignmentId] || "";
    const file = files[assignmentId];

    if (!content && !file) {
      toast.error("Please provide your submission text or upload a file.");
      return;
    }

    try {
      const authToken = localStorage.getItem("authToken");
      if (!authToken) {
        toast.error("You are not logged in!");
        return;
      }

      const formData = new FormData();
      formData.append("content", content);
      if (file) formData.append("submissionFile", file);

      const res = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/courses/assignments/${assignmentId}/submissions`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Assignment submitted successfully!");
      setSubmission((prev) => ({ ...prev, [assignmentId]: "" }));
      setFiles((prev) => ({ ...prev, [assignmentId]: null }));
      fetchCourseDetails();
    } catch (err) {
      console.error("Error submitting assignment:", err.response ? err.response.data : err.message);
      toast.error("Failed to submit assignment.");
    }
  };


  const handleFileChange = (e, assignmentId) => {
    const file = e.target.files[0]; // get the selected file (or undefined)
    setFiles((prev) => ({
      ...prev,
      [assignmentId]: file,
    }));
  };

  if (loading) return <div className="loader">Loading course details...</div>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="page-wrapper container">
      <button className="button button-primary" onClick={() => navigate('/student-dashboard')}>
        ← Back
      </button>

      <h2 className="page-title">{course.title}</h2>
      <p>{course.description}</p>

      <div className="course-layout-grid">
        {/* Center Column: Course Materials */}
        <div className="course-main-content">
          <h3>Course Materials</h3>
          {course.materials && course.materials.length > 0 ? (
            <ul className="materials-list">
              {course.materials.map((material) => (
                <li key={material._id} className="card material-item">
                  <strong>{material.title}</strong>{" "}
                  {material.description && `- ${material.description}`} <br />
                  <a
                    href={material.fileUrl || material.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Material
                  </a>
                  <br />
                  <small>
                    Uploaded on {new Date(material.createdAt || material.uploadedAt).toLocaleDateString()}
                  </small>
                </li>
              ))}
            </ul>
          ) : (
            <p>No materials available.</p>
          )}
        </div>


        {/* Right Column: Assignments */}
        <aside className="course-sidebar">
          <h3>Assignments</h3>
          {course.assignments.length === 0 ? (
            <p className="empty-message">No assignments available.</p>
          ) : (
            <ul className="assignment-list">
              {course.assignments.map((assignment) => (
                <li key={assignment._id} className="card assignment-item">
                  <strong>{assignment.title}</strong>{" "}
                  {assignment.description && `- ${assignment.description}`} <br />
                  <a
                    href={assignment.fileUrl || assignment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Assignment
                  </a>
                  <br />
                  <p><strong>Due Date:</strong> {new Date(assignment.dueDate).toLocaleDateString()}</p>

                  {assignment.submissions?.length > 0 ? (
                    <div className="submission-preview">
                      <p><strong>Your previous submissions:</strong></p>
                      {assignment.submissions.map((sub, idx) => (
                        <div key={sub._id || idx} className="submission-entry">
                          {sub.content && <p>{sub.content}</p>}
                          {sub.fileUrl && (
                            <p><a href={sub.fileUrl} target="_blank" rel="noopener noreferrer">View submitted file</a></p>
                          )}
                          <p className="submission-date">Submitted on: {new Date(sub.createdAt).toLocaleString()}</p>
                          {sub.grade !== undefined && (
                            <p className="submission-grade">Grade: {sub.grade}</p>
                          )}
                          <hr />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="empty-message">You haven't submitted this assignment yet.</p>
                  )}

                  <textarea
                    placeholder="Enter your submission here"
                    value={submission[assignment._id] || ""}
                    onChange={(e) => handleSubmissionChange(e, assignment._id)}
                    rows="3"
                    className="submission-textarea"
                  />

                  <input
                    type="file"
                    accept="*/*"
                    onChange={(e) => handleFileChange(e, assignment._id)}
                    className="file-input"
                  />

                  <button
                    onClick={() => handleSubmitAssignment(assignment._id)}
                    className="button button-primary"
                  >
                    Submit
                  </button>
                </li>
              ))}
            </ul>
          )}
        </aside>
      </div>
    </div>

  );
};

export default StudentCourseDetail;
