import axiosClient from '../api/axiosClient';

const authService = {
  // Login user
  login: async (credentials) => {
    const response = await axiosClient.post('/auth/login', credentials);
    return response;
  },

  // Register user
  register: async (userData) => {
    const response = await axiosClient.post('/auth/register', userData);
    return response;
  },
  // Get current authenticated user (maps to backend `/auth/me`)
  getMe: async () => {
    const response = await axiosClient.get('/auth/me');
    return response;
  }
};

export { authService };
