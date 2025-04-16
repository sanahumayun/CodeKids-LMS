import React, { useEffect, useState } from 'react';
import { getCourses } from '../api/courseApi';
import { getAssignmentsByCourse } from '../api/assignmentApi';
import axios from 'axios';

const StudentSubmitAssignment = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState('');
  const [fileUrl, setFileUrl] = useState('');

  useEffect(() => {
    getCourses().then(res => setCourses(res.data));
  }, []);

  const handleCourseChange = async (e) => {
    const courseId = e.target.value;
    setSelectedCourse(courseId);
    const res = await getAssignmentsByCourse(courseId);
    setAssignments(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/submissions', {
        assignmentId: selectedAssignment,
        fileUrl, // For now this is just a URL; file upload can come later
      });
      alert('Assignment submitted!');
    } catch (err) {
      alert('Submission failed: ' + err.message);
    }
  };

  return (
    <div>
      <h2>Submit Assignment</h2>
      <form onSubmit={handleSubmit}>
        <select onChange={handleCourseChange}>
          <option value="">Select Course</option>
          {courses.map(c => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>

        <select value={selectedAssignment} onChange={e => setSelectedAssignment(e.target.value)}>
          <option value="">Select Assignment</option>
          {assignments.map(a => (
            <option key={a._id} value={a._id}>{a.title}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="File URL (for now)"
          value={fileUrl}
          onChange={e => setFileUrl(e.target.value)}
          required
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default StudentSubmitAssignment;
