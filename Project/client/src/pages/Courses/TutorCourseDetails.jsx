import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const TutorCourseDetailPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [grades, setGrades] = useState({});
  const [course, setCourse] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    maxScore: "",
    file: null,
  });
  const [materialForm, setMaterialForm] = useState({
    title: "",
    description: "",
    file: null,
  });
  const [submissions, setSubmissions] = useState({});
  const [visibleSubmissions, setVisibleSubmissions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAssignmentForm, setShowAssignmentForm] = useState(false);
  const [showMaterialForm, setShowMaterialForm] = useState(false);
  const toastId = useRef(null);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        console.log("Fetching course details for id:", courseId);
        const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/courses/tutor/courses/${courseId}`, {
          withCredentials: true,
        });

         console.log("Course details response:", res.data);
        setCourse(res.data);
        setLoading(false);

        const enrolledStudents = res.data.studentsEnrolled || [];
        const reviews = res.data.reviews || [];

        const studentsWithFeedback = new Set(
          reviews.map(review => review.studentId?._id || review.studentId)
        );

        const hasStudentsWithoutFeedback = enrolledStudents.some(student => 
          !studentsWithFeedback.has(student._id)
        );

        const statusName = typeof res.data.status === "string" ? res.data.status : res.data.status?.name

        if (statusName === "complete" && hasStudentsWithoutFeedback && !toastId.current) {
          toastId.current = toast.info(
            <div>
              This course is completed. Give feedback to your students!&nbsp;
              <button
                onClick={() => {
                  toast.dismiss(toastId.current);
                  navigate(`/tutor/feedback`, { state: { courseId: res.data._id } });
                }}
                style={{
                  color: "#4f46e5",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                Give Feedback
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

      } catch (err) {
        console.error("Error fetching course detail:", err);
        setError("Failed to load course.");
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  const handleMaterialInputChange = (e) => {
    const { name, value } = e.target;
    setMaterialForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMaterialFileChange = (e) => {
    setMaterialForm((prev) => ({
      ...prev,
      file: e.target.files[0],
    }));
  };

  const handleGradeChange = (submissionId, value) => {
    setGrades((prev) => ({
      ...prev,
      [submissionId]: value,
    }));
  };

  const saveGrade = async (assignmentId, submissionId) => {
    const gradeValue = grades[submissionId];

    // Validate grade is a number >= 0
    const gradeNumber = Number(gradeValue);
    if (isNaN(gradeNumber) || gradeNumber < 0) {
      toast.error("Please enter a valid non-negative number for grade.");
      return;
    }

    try {
      await axios.patch(
        `${process.env.REACT_APP_API_BASE_URL}/courses/tutor/courses/assignments/${assignmentId}/submissions/${submissionId}/grade`,
        { grade: gradeNumber },
        { withCredentials: true }
      );
      toast.success("Grade updated!");

      // Optionally, refresh the submissions for updated data
      fetchSubmissionsForAssignment(assignmentId);
    } catch (error) {
      console.error("Failed to update grade:", error);
      toast.error("Failed to update grade.");
    }
  };

  const handleMaterialUpload = async () => {
    const { title, description, file } = materialForm;

    if (!title || !file) {
      toast.error("Please provide a title and file.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("materialFile", file);

    try {
      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/courses/tutor/courses/${courseId}/upload-material`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      toast.success("Material uploaded!");
      setMaterialForm({ title: "", description: "", file: null });

      // Refresh course data to reflect new material
      const updatedCourse = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/courses/tutor/courses/${courseId}`,
        { withCredentials: true }
      );
      setCourse(updatedCourse.data);
    } catch (err) {
      console.error("Material upload failed:", err);
      toast.error("Failed to upload material.");
    }
  };


  const fetchSubmissionsForAssignment = async (assignmentId) => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/courses/assignments/${assignmentId}/submissions`);
      setSubmissions((prev) => ({
        ...prev,
        [assignmentId]: res.data.submissions,
      }));

      const gradesInit = {};
      res.data.submissions.forEach((sub) => {
        gradesInit[sub._id] = sub.grade ?? ""; 
      });
      setGrades((prev) => ({
        ...prev,
        ...gradesInit,
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
    const { title, description, dueDate, maxScore, file } = formData;

    if (!title || !description || !dueDate || !maxScore) {
      toast.error("Please fill all assignment fields.");
      return;
    }

    const data = new FormData();
    data.append("title", title);
    data.append("description", description);
    data.append("dueDate", dueDate);
    data.append("maxScore", maxScore);
    if (file) data.append("assignmentFile", file);

    try {
      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/courses/tutor/courses/${courseId}/upload-assignment`,
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      toast.success("Assignment uploaded!");
      setFormData({
        title: "",
        description: "",
        dueDate: "",
        maxScore: "",
        file: null,
      })
      const updatedCourse = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/courses/tutor/courses/${courseId}`,
        { withCredentials: true }
      );
      setCourse(updatedCourse.data);
    } catch (err) {
      console.error("Upload failed:", err);
      toast.error("Failed to upload assignment.");
    }
  };

  if (loading) return <p className="loading-message">Loading course details...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="container">
      <button className="button button-secondary" onClick={() => navigate(-1)}>← Back</button>

      <h2 className="page-title">{course.title}</h2>
      <p className="card-body">{course.description}</p>

      {/* Enrolled Students */}
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

      {/* Assignments */}
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
                <p><strong>Due Date:</strong> {new Date(assignment.dueDate).toLocaleDateString()}</p>
                <a href={assignment.fileUrl} target="_blank" rel="noreferrer" className="link">
                  Download
                </a>
                <button className="button" onClick={() => toggleSubmissionsVisibility(assignment._id)}>
                  {visibleSubmissions[assignment._id] ? "Hide Submissions" : "View Submissions"}
                </button>

                {/* Submissions */}
                {visibleSubmissions[assignment._id] && submissions[assignment._id] && (
                  <div className="submissions-list">
                    <h6>Submissions</h6>
                    <ul>
                      {submissions[assignment._id].map((submission) => (
                        <li key={submission._id} className="submission-entry">
                          <p><strong>Student:</strong> {submission.studentId?.name}</p>
                          <p>
                            <strong>File:</strong> <a href={submission.fileUrl} target="_blank" rel="noopener noreferrer">📄 View Submission</a>
                          </p>
                          <p><strong>Submitted At:</strong> {new Date(submission.submittedAt).toLocaleString()}</p>

                          <div className="grade-input">
                            <label>
                              Grade:
                              <input
                                type="number"
                                min="0"
                                step="any"
                                value={grades[submission._id] || ""}
                                onChange={(e) => handleGradeChange(submission._id, e.target.value)}
                                placeholder="Enter grade"
                              />
                            </label>
                            <button className="button" onClick={() => saveGrade(assignment._id, submission._id)}>Save Grade</button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}

        <button className="button" onClick={() => setShowAssignmentForm(true)}>Upload Assignment</button>
        {showAssignmentForm && (
          <div className="modal-overlay">
            <div className="modal-box">
              <h4>Upload Assignment</h4>
              <label>Title</label>
              <input
                type="text"
                name="title"
                placeholder="Assignment Title"
                value={formData.title}
                onChange={handleInputChange}
              />

              <label>Description</label>
              <textarea
                name="description"
                placeholder="Assignment Description"
                value={formData.description}
                onChange={handleInputChange}
              />

              <label>Due Date</label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleInputChange}
              />

              <label>Max Score</label>
              <input
                type="number"
                name="maxScore"
                placeholder="e.g., 100"
                value={formData.maxScore}
                onChange={handleInputChange}
                min="1"
              />

              <label>Upload File</label>
              <input
                type="file"
                name="assignmentFile"
                onChange={(e) => setFormData((prev) => ({ ...prev, file: e.target.files[0] }))}
                accept=".pdf,.doc,.docx,.txt"
              />

              <div className="form-actions">
                <button onClick={handleAssignmentUpload}>Submit</button>
                <button className="button-secondary" onClick={() => setShowAssignmentForm(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Course Materials */}
      <div className="card materials-section">
        <h4>Course Materials</h4>
        {course.materials && course.materials.length > 0 ? (
          <ul>
            {course.materials.map((material) => (
              <li key={material._id}>
                <strong>{material.title}</strong>
                {material.description && ` - ${material.description}`}<br />
                <a href={material.fileUrl} target="_blank" rel="noopener noreferrer">📄 View Material</a><br />
                <small>Uploaded on {new Date(material.createdAt).toLocaleDateString()}</small>
              </li>
            ))}
          </ul>
        ) : (
          <p>No materials uploaded yet.</p>
        )}
        <button className="button" onClick={() => setShowMaterialForm(true)}>Upload Material</button>
        {showMaterialForm && (
          <div className="modal-overlay">
            <div className="modal-box">
              <h4>Upload Course Material</h4>

              <label>Title</label>
              <input
                type="text"
                name="title"
                placeholder="Material Title"
                value={materialForm.title}
                onChange={handleMaterialInputChange}
              />

              <label>Description</label>
              <textarea
                name="description"
                placeholder="Material Description (optional)"
                value={materialForm.description}
                onChange={handleMaterialInputChange}
              />

              <label>Upload File</label>
              <input
                type="file"
                name="materialFile"
                onChange={handleMaterialFileChange}
                accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
              />

              <div className="form-actions">
                <button onClick={handleMaterialUpload}>Submit</button>
                <button className="button-secondary" onClick={() => setShowMaterialForm(false)}>Cancel</button>
              </div>
            </div>
          </div>

        )}
      </div>

      {/* Feedback */}
      <div className="card feedback-section">
        <h4>Student Feedback</h4>
        {course.reviews && course.reviews.length > 0 ? (
          <ul>
            {course.reviews.map((review, index) => (
              <li key={index} className="feedback-entry">
                <p><strong>Ratings:</strong></p>
                <ul>
                  {review.responses.map((response, i) => (
                    <li key={i}>
                      {response.question}: {response.rating}/5
                    </li>
                  ))}
                </ul>
                {review.comment && <p><strong>Comment:</strong> {review.comment}</p>}
                <hr />
              </li>
            ))}
          </ul>
        ) : (
          <p>No feedback submitted yet.</p>
        )}
      </div>
    </div>

  );
};

export default TutorCourseDetailPage;
