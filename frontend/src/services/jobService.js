import axiosClient from '../api/axiosClient';

const jobService = {
  // Get all jobs with filters and pagination
  getJobs: async (params = {}) => {
    const response = await axiosClient.get('/jobs', { params });
    return response;
  },

  // Get job by ID
  getJobById: async (id) => {
    const response = await axiosClient.get(`/jobs/${id}`);
    return response;
  },

  // Create new job (employer only)
  createJob: async (jobData) => {
    const response = await axiosClient.post('/jobs', jobData);
    return response;
  },

  // Update job (employer only)
  updateJob: async (id, jobData) => {
    const response = await axiosClient.put(`/jobs/${id}`, jobData);
    return response;
  },

  // Delete job (employer only)
  deleteJob: async (id) => {
    const response = await axiosClient.delete(`/jobs/${id}`);
    return response;
  },

  // Get jobs posted by current employer
  getEmployerJobs: async () => {
    const response = await axiosClient.get('/jobs/my-jobs');
    return response;
  },

  // Apply to a job (job seeker only) - sends resume file
  applyToJob: async (jobId, applicationData = {}, resumeFile = null) => {
    const formData = new FormData();
    formData.append('jobId', jobId);
    if (applicationData.coverLetter) {
      formData.append('coverLetter', applicationData.coverLetter);
    }
    if (resumeFile) {
      formData.append('resume', resumeFile);
    }
    
    const response = await axiosClient.post('/applications', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  },

  // Get applications for current user (job seeker)
  getMyApplications: async (status = null) => {
    const params = status ? { status } : {};
    const response = await axiosClient.get('/applications/my-applications', { params });
    return response;
  },

  // Get applications for a specific job (employer only)
  getJobApplications: async (jobId) => {
    const response = await axiosClient.get(`/applications/job/${jobId}`);
    return response;
  },

  // Update application status (employer only)
  updateApplicationStatus: async (applicationId, status) => {
    const response = await axiosClient.put(`/applications/${applicationId}/status`, { status });
    return response;
  },
};

export { jobService };
