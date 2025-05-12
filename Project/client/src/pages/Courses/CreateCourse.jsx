import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

const CreateCourse = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [instructorId, setInstructorId] = useState("");
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(false);

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
        toast.error("Failed to load instructors");
      }
    };

    fetchInstructors();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/courses/admin/courses/create`,
        { title, description, instructorId },
        config
      );

      setTitle("");
      setDescription("");
      setInstructorId("");
      toast.success("Course and chatroom created successfully!");
    } catch (err) {
      console.error("Course creation failed:", err);
      toast.error(err.response?.data?.message || "Failed to create course");
    } finally {
      setLoading(false);
    }
  };

  const navigate = useNavigate();

  return (
    <div className="container">
      <button 
        className="button button-secondary" 
        onClick={() => navigate(-1)}
        disabled={loading}
      >
        ← Back
      </button>

      <div className="card auth-container">
        <h2 className="auth-title">Create a New Course</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Title</label>
            <input
              type="text"
              className="form-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              disabled={loading}
              rows={4}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Assign Instructor</label>
            <select
              className="form-input"
              value={instructorId}
              onChange={(e) => setInstructorId(e.target.value)}
              required
              disabled={loading}
            >
              <option value="">Select an instructor</option>
              {instructors.map((inst) => (
                <option key={inst._id} value={inst._id}>
                  {inst.name} ({inst.email})
                </option>
              ))}
            </select>
          </div>

          <button 
            type="submit" 
            className="button button-primary"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Course"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateCourse;