import React, { useEffect, useState } from 'react';
import { getCourses } from '../api/courseApi';
import { getTutorProgress } from '../api/progressApi';

const TutorProgress = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    getCourses()
      .then(res => setCourses(res.data))
      .catch(() => alert('Failed to load courses'));
  }, []);

  const handleSelect = async (e) => {
    const courseId = e.target.value;
    setSelectedCourse(courseId);
    try {
      const res = await getTutorProgress(courseId);
      setSubmissions(res.data);
    } catch {
      alert('Failed to load submissions');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>View Student Progress</h2>

      <select onChange={handleSelect} value={selectedCourse} style={{ padding: '8px', marginBottom: '20px' }}>
        <option value="">Select a Course</option>
        {courses.map(c => (
          <option key={c._id} value={c._id}>{c.name}</option>
        ))}
      </select>

      {submissions.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {submissions.map(sub => (
            <div
              key={sub._id}
              style={{
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '15px',
                backgroundColor: '#f9f9f9',
                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.05)'
              }}
            >
              <strong>Student:</strong> {sub.studentId?.name || 'Unknown'} <br />
              <strong>Assignment:</strong> {sub.assignmentId?.title || 'N/A'} <br />
              <strong>Grade:</strong> {sub.grade || 'Not graded'} <br />
              <strong>Feedback:</strong> {sub.feedback || 'No feedback yet'}
            </div>
          ))}
        </div>
      ) : (
        selectedCourse && <p>No submissions found for this course.</p>
      )}
    </div>
  );
};

export default TutorProgress;
