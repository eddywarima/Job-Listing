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

  // Verify token
  verifyToken: async () => {
    const response = await axiosClient.get('/auth/verify');
    return response;
  },

  // Logout user
  logout: async () => {
    const response = await axiosClient.post('/auth/logout');
    return response;
  },

  // Forgot password
  forgotPassword: async (email) => {
    const response = await axiosClient.post('/auth/forgot-password', { email });
    return response;
  },

  // Reset password
  resetPassword: async (token, password) => {
    const response = await axiosClient.post('/auth/reset-password', { token, password });
    return response;
  },

  // Change password
  changePassword: async (currentPassword, newPassword) => {
    const response = await axiosClient.post('/auth/change-password', {
      currentPassword,
      newPassword
    });
    return response;
  }
};

export { authService };
