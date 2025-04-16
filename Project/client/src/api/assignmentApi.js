import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE_URL + '/courses';

export const createAssignment = async (assignmentData) => {
  return axios.post(API_BASE, assignmentData);
};

export const getAssignmentsByCourse = async (courseId) => {
  return axios.get(`${API_BASE}/${courseId}`);
};
