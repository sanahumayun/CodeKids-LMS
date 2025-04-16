import axios from 'axios';

const API_BASE = 'http://localhost:5000/api/progress';

// Get student progress (their own submissions)
export const getStudentProgress = async () => {
  return axios.get(`${API_BASE}/student`);
};

// Get tutor progress (submissions for a course)
export const getTutorProgress = async (courseId) => {
  return axios.get(`${API_BASE}/tutor/${courseId}`);
};