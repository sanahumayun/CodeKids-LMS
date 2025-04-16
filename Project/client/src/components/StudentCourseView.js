// src/components/StudentCourseView.js
import React, { useEffect, useState } from 'react';
import { getCourses } from '../api/courseApi'; 

const StudentCourseView = () => {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState('');

  // Fetch courses when the component mounts
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await getCourses(); // This calls the function from the API file
        setCourses(response.data); // Save the courses data to the state
      } catch (err) {
        setError('Error fetching courses: ' + err.message);
      }
    };

    fetchCourses();
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  return (
    <div>
      <h2>Courses for Student</h2>
      
      {/* Show error message if something went wrong */}
      {error && <p>{error}</p>}

      {/* Render courses */}
      <ul>
        {courses.length > 0 ? (
          courses.map(course => (
            <li key={course._id}>
              <h3>{course.name}</h3>
              <p>{course.description}</p>
            </li>
          ))
        ) : (
          <p>No courses available.</p>
        )}
      </ul>
    </div>
  );
};

export default StudentCourseView;
