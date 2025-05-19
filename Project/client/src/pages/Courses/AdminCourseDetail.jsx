import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const AdminCourseDetail = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [allStudents, setAllStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const navigate = useNavigate();

  const authToken = localStorage.getItem("authToken");
  const headers = { Authorization: `Bearer ${authToken}` };

  const fetchCourse = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/courses/admin/courses/${courseId}`,
        { headers }
      );
      setCourse(res.data.course);
    } catch (err) {
      console.error("Failed to fetch course detail:", err);
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/users?role=student`,
        { headers }
      );
      setAllStudents(res.data);
    } catch (err) {
      console.error("Failed to fetch students:", err);
    }
  };

  useEffect(() => {
    fetchCourse();
    fetchStudents();
  }, []);

  const handleEnroll = async () => {
    toast.info("Enrolling student...");
    try {
      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/courses/admin/courses/${courseId}/enroll`,
        { studentId: selectedStudent },
        { headers }
      );
      toast.success("Student enrolled successfully!");
      await fetchCourse();
      setSelectedStudent("");
    } catch (err) {
      toast.error(
        err.response?.data?.error || "Failed to enroll student"
      );
    }
  };

  const handleRemove = async (studentId) => {
    toast.info("Removing student...");
    try {
      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/courses/admin/courses/${courseId}/remove`,
        { studentId },
        { headers }
      );
      toast.success("Student removed successfully!");
      await fetchCourse();
    } catch (err) {
      toast.error(
        err.response?.data?.error || "Failed to remove student"
      );
    }
  };

  const handleDeleteAssignment = async (assignmentId) => {
  toast.info("Deleting assignment...");
  try {
    await axios.delete(
      `${process.env.REACT_APP_API_BASE_URL}/courses/courses/${courseId}/${assignmentId}/delete-assignment`,
      { headers }
    );
    toast.success("Assignment deleted successfully!");
    await fetchCourse();
  } catch (err) {
    toast.error(
      err.response?.data?.error || "Failed to delete assignment"
    );
  }
};

const handleDeleteMaterial = async (materialId) => {
  toast.info("Deleting material...");
  try {
    await axios.delete(
      `${process.env.REACT_APP_API_BASE_URL}/courses/courses/${courseId}/${materialId}/delete-material`,
      { headers }
    );
    toast.success("Material deleted successfully!");
    await fetchCourse();
  } catch (err) {
    toast.error(
      err.response?.data?.error || "Failed to delete material"
    );
  }
};

const handleStatusChange = async (newStatus) => {
    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_API_BASE_URL}/courses/admin/courses/${courseId}/status`,
        { status: newStatus },
        { headers }
      );

      if (response.data.course) {
      setCourse(response.data.course); // ✅ Fully update the course state
      toast.success("Status updated!");
    } else {
      toast.error("No course data returned.");
    }
    } catch (err) {
      console.error("Error updating status:", err);
      toast.error("Failed to update status.");
    }
  };



  if (!course) return <p>Loading course details...</p>;

  const unenrolledStudents = allStudents.filter(
    (s) => !course.studentsEnrolled.some((e) => e._id === s._id)
  );

  return (
    <div className="container">
    <button className="button button-secondary" onClick={() => navigate('/admin/courses')}>← Back</button>
      <h1 className="heading">{course.title}</h1>

      <div className="card">
        <p><strong>Description:</strong> {course.description}</p>
        <p><strong>Instructor:</strong> {course.instructorId?.name} ({course.instructorId?.email})</p>
        <p><strong>Status:</strong> {course.status}</p>
      </div>

      {/* Course Status */}
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

      <div className="card">
        <h2>Enrolled Students</h2>
        {course.studentsEnrolled.length === 0 ? (
          <p>No students enrolled yet.</p>
        ) : (
          <ul className="list">
            {course.studentsEnrolled.map((student) => (
              <li key={student._id} className="list-item">
                {student.name} ({student.email})
                <button
                  className="button danger small"
                  onClick={() => handleRemove(student._id)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="card">
        <h3>Enroll New Student</h3>
        <div className="input-group">
          <select
            className="select"
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
          >
            <option value="">Select a student</option>
            {unenrolledStudents.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name} ({s.email})
              </option>
            ))}
          </select>
          <button
            className="button primary"
            onClick={handleEnroll}
            disabled={!selectedStudent}
          >
            Enroll
          </button>
        </div>
      </div>

      <div className="card">
        <h2>Assignments</h2>
        {course.assignments.length === 0 ? (
          <p>No assignments uploaded yet.</p>
        ) : (
          <ul className="list">
            {course.assignments.map((a) => (
              <li key={a._id} className="list-item">
                <strong>{a.title}</strong> – {a.description} <br />
                Due: {new Date(a.dueDate).toLocaleDateString()} | Max Score: {a.maxScore} <br />
                <a href={a.fileUrl} target="_blank" rel="noreferrer" className="link">
                  Download
                </a>
                <button
                    className="button danger small"
                    onClick={() => handleDeleteAssignment(a._id)}
                    >
                    Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="card">
        <h2>Materials</h2>
        {course.materials.length === 0 ? (
          <p>No materials uploaded yet.</p>
        ) : (
          <ul className="list">
            {course.materials.map((m) => (
              <li key={m._id} className="list-item">
                <strong>{m.title}</strong>: {m.description} <br />
                <a href={m.fileUrl} target="_blank" rel="noreferrer" className="link">
                  Download
                </a>
                <button
                    className="button danger small"
                    onClick={() => handleDeleteMaterial(m._id)}
                    >
                    Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AdminCourseDetail;
