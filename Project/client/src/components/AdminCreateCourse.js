import React, { useState } from 'react';
import { createCourse } from '../api/courseApi';
import { toast } from 'react-toastify';

const AdminCreateCourse = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [tutorId, setTutorId] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await createCourse({ name, description, tutorId });
      toast.success('Course created!');
    } catch (err) {
      toast.error('Error creating course: ' + err.message);
    }
  };

  return (
    <div>
      <h2>Create Course</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Course Name" value={name} onChange={e => setName(e.target.value)} required />
        <input type="text" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
        <input type="text" placeholder="Tutor ID" value={tutorId} onChange={e => setTutorId(e.target.value)} required />
        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export default AdminCreateCourse;
