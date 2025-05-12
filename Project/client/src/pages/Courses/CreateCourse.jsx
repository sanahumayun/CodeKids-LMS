import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./CreateCourse.css";

const CreateCourse = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [instructorId, setInstructorId] = useState("");
  const [instructors, setInstructors] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");

  const token = localStorage.getItem("authToken");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/users?role=tutor`);
        setInstructors(res.data);
      } catch (err) {
        console.error("Error fetching instructors:", err.response?.data || err.message);
      }
    };

    fetchInstructors();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/courses`,
        { title, description, instructorId },
        config
      );

      setTitle("");
      setDescription("");
      setInstructorId("");
      setSuccessMessage("✅ Course and chatroom created successfully!");
    } catch (err) {
      console.error("Course creation failed:", err);
      setSuccessMessage("❌ Failed to create course.");
    }
  };

  const navigate = useNavigate();

  return (
    <div className="create-course-page">
      <div className="course-form-card">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h2 className="form-title">Create a New Course</h2>

        {successMessage && (
          <p className={`feedback-message ${successMessage.startsWith("✅") ? "success" : "error"}`}>
            {successMessage}
          </p>
        )}

        <form onSubmit={handleSubmit} className="course-form">
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Assign Instructor</label>
            <select
              value={instructorId}
              onChange={(e) => setInstructorId(e.target.value)}
              required
            >
              <option value="">Select an instructor</option>
              {instructors.map((inst) => (
                <option key={inst._id} value={inst._id}>
                  {inst.name} ({inst.email})
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="submit-button">
            Create Course
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateCourse;
