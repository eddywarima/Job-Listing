import axiosClient from '../api/axiosClient';

const userService = {
  // Get current user profile
  getProfile: async () => {
    const response = await axiosClient.get('/users/profile');
    return response;
  },

  // Update user profile
  updateProfile: async (userData) => {
    const response = await axiosClient.put('/users/profile', userData);
    return response;
  },
  // Other user endpoints are not implemented in backend; keep only profile operations here.
};

export { userService };
