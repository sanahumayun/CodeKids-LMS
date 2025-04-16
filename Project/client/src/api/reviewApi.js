import axios from 'axios';
// import { getToken } from '../utils/auth';

const API_URL = '/api/reviews';

// Create a new review
export const createReview = async (reviewData) => {
  const config = {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  };
  const response = await axios.post(API_URL, reviewData, config);
  return response.data;
};

// Get reviews for a specific instructor
export const getInstructorReviews = async (instructorId) => {
  const response = await axios.get(`${API_URL}/instructor/${instructorId}`);
  return response.data;
};

// Get all public reviews (for parent dashboard)
export const getPublicReviews = async () => {
  const response = await axios.get(`${API_URL}/public`);
  return response.data;
};

// Parent can flag a review as helpful
export const markHelpful = async (reviewId) => {
  const config = {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  };
  const response = await axios.put(`${API_URL}/${reviewId}/helpful`, {}, config);
  return response.data;
};
