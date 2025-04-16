import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE_URL + '/courses';

export const createCourse = async (courseData) => {
  return axios.post(API_BASE, courseData);
};

export const getCourses = async () => {
  return axios.get(API_BASE);
};
