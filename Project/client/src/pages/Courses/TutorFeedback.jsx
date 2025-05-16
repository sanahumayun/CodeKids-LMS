import React, { useEffect, useState } from "react";
import axios from "axios";

const TutorFeedbackPage = () => {
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [formData, setFormData] = useState({
    comments: "",
    ratings: {
      understanding: 0,
      participation: 0,
      interest: 0,
      homework: 0,
    },
  });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        const headers = { Authorization: `Bearer ${authToken}` };

        const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/courses/tutor/courses`, { headers });
        setCourses(res.data);
      } catch (error) {
        console.error("Error fetching tutor courses:", error);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    const course = courses.find((c) => c._id === selectedCourse);
    if (course) {
        setStudents(course.studentsEnrolled);
    } else {
        setStudents([]);
    }
    }, [selectedCourse, courses]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name in formData.ratings) {
      setFormData({
        ...formData,
        ratings: { ...formData.ratings, [name]: Number(value) },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCourse || !selectedStudent) {
      return alert("Please select both course and student.");
    }

    try {
      const authToken = localStorage.getItem("authToken");
      const headers = { Authorization: `Bearer ${authToken}` };

      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/courses/tutor/feedback/submit`,
        {
          courseId: selectedCourse,
          studentId: selectedStudent,
          comments: formData.comments,
          ratings: formData.ratings,
        },
        { headers }
      );

      alert("Feedback submitted!");
      setSelectedStudent("");
      setFormData({
        comments: "",
        ratings: {
          understanding: 0,
          participation: 0,
          interest: 0,
          homework: 0,
        },
      });
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Failed to submit feedback.");
    }
  };

  return (
    <div className="container">
      <h2>Submit Feedback</h2>

      <form className="form" onSubmit={handleSubmit}>
        <label>Select Course:</label>
        <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}>
          <option value="">-- Select Course --</option>
          {courses.map((course) => (
            <option key={course._id} value={course._id}>
              {course.title}
            </option>
          ))}
        </select>

        {selectedCourse && (
          <>
            <label>Select Student:</label>
            <select value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)}>
              <option value="">-- Select Student --</option>
              {students.map((student) => (
                <option key={student._id} value={student._id}>
                  {student.name}
                </option>
              ))}
            </select>
          </>
        )}

        {selectedStudent && (
          <>
            <label>Comments:</label>
            <textarea name="comments" value={formData.comments} onChange={handleChange} />

            <label>Understanding (0–5):</label>
            <input type="number" name="understanding" min="0" max="5" value={formData.ratings.understanding} onChange={handleChange} />

            <label>Participation (0–5):</label>
            <input type="number" name="participation" min="0" max="5" value={formData.ratings.participation} onChange={handleChange} />

            <label>Interest (0–5):</label>
            <input type="number" name="interest" min="0" max="5" value={formData.ratings.interest} onChange={handleChange} />

            <label>Homework (0–5):</label>
            <input type="number" name="homework" min="0" max="5" value={formData.ratings.homework} onChange={handleChange} />

            <button type="submit">Submit Feedback</button>
          </>
        )}
      </form>
    </div>
  );
};

export default TutorFeedbackPage;
