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

  // Get user by ID
  getUserById: async (id) => {
    const response = await axiosClient.get(`/users/${id}`);
    return response;
  },

  // Upload profile picture
  uploadProfilePicture: async (file) => {
    const formData = new FormData();
    formData.append('profilePicture', file);
    
    const response = await axiosClient.post('/users/upload-picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  },

  // Delete profile picture
  deleteProfilePicture: async () => {
    const response = await axiosClient.delete('/users/profile-picture');
    return response;
  },

  // Get user's job applications
  getApplications: async () => {
    const response = await axiosClient.get('/users/applications');
    return response;
  },

  // Get user's saved jobs
  getSavedJobs: async () => {
    const response = await axiosClient.get('/users/saved-jobs');
    return response;
  },

  // Get user's job postings (for employers)
  getJobPostings: async () => {
    const response = await axiosClient.get('/users/job-postings');
    return response;
  },

  // Update user preferences
  updatePreferences: async (preferences) => {
    const response = await axiosClient.put('/users/preferences', preferences);
    return response;
  },

  // Get user notifications
  getNotifications: async () => {
    const response = await axiosClient.get('/users/notifications');
    return response;
  },

  // Mark notification as read
  markNotificationRead: async (notificationId) => {
    const response = await axiosClient.put(`/users/notifications/${notificationId}/read`);
    return response;
  },

  // Mark all notifications as read
  markAllNotificationsRead: async () => {
    const response = await axiosClient.put('/users/notifications/read-all');
    return response;
  },

  // Delete user account
  deleteAccount: async () => {
    const response = await axiosClient.delete('/users/account');
    return response;
  },

  // Change password
  changePassword: async (currentPassword, newPassword) => {
    const response = await axiosClient.post('/users/change-password', {
      currentPassword,
      newPassword
    });
    return response;
  },

  // Get user activity
  getActivity: async () => {
    const response = await axiosClient.get('/users/activity');
    return response;
  }
};

export { userService };
