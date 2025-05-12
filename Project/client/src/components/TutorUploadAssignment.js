import React, { useState, useEffect } from 'react';
import { getCourses } from '../api/courseApi';
import { createAssignment } from '../api/assignmentApi';

const TutorUploadAssignment = () => {
  const [courses, setCourses] = useState([]);
  const [courseId, setCourseId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    getCourses().then(res => setCourses(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createAssignment({ courseId, title, description, dueDate });
      toast.success('Assignment uploaded!');
    } catch (err) {
      toast.error('Error uploading assignment: ' + err.message);
    }
  };

  return (
    <div>
      <h2>Upload Assignment</h2>
      <form onSubmit={handleSubmit}>
        <select value={courseId} onChange={e => setCourseId(e.target.value)} required>
          <option value="">Select Course</option>
          {courses.map(course => (
            <option key={course._id} value={course._id}>
              {course.name}
            </option>
          ))}
        </select>
        <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
        <input type="text" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
        <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} required />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
};

export default TutorUploadAssignment;
