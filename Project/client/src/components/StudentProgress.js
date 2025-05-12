import React, { useEffect, useState } from 'react';
import { getStudentProgress } from '../api/progressApi';
//import axios from 'axios';

const StudentProgress = () => {
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    getStudentProgress()
      .then(res => setSubmissions(res.data))
      .catch(() => toast.error("Failed to fetch student progress"));
  }, []);
 
  return (
    <div style={{ padding: '20px' }}>
      <h2>Your Progress</h2>

      {submissions.length === 0 ? (
        <p>No submissions found</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {submissions.map((s) => (
            <div
              key={s._id}
              style={{
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '15px',
                backgroundColor: '#f9f9f9',
                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.05)'
              }}
            >
              <strong>Assignment:</strong> {s.assignmentId?.title || 'N/A'} <br />
              <strong>Course:</strong> {s.assignmentId?.courseId?.name || 'N/A'} <br />
              <strong>Grade:</strong> {s.grade || 'Pending'} <br />
              <strong>Feedback:</strong> {s.feedback || 'No feedback yet'}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentProgress;
