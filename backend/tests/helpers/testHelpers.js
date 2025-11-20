import User from '../../src/models/User.js';
import Job from '../../src/models/Job.js';
import Application from '../../src/models/Application.js';
import { generateToken } from '../../src/utils/generateToken.js';

/**
 * Create a test user with specified role
 */
export const createTestUser = async (userData = {}) => {
  const defaultUser = {
    name: 'Test User',
    email: `test${Date.now()}@example.com`,
    password: 'password123',
    role: 'job_seeker',
  };

  const user = await User.create({ ...defaultUser, ...userData });
  return user;
};

/**
 * Create a test employer
 */
export const createTestEmployer = async (employerData = {}) => {
  return await createTestUser({
    role: 'employer',
    companyName: 'Test Company',
    ...employerData,
  });
};

/**
 * Create a test admin
 */
export const createTestAdmin = async (adminData = {}) => {
  return await createTestUser({
    role: 'admin',
    ...adminData,
  });
};

/**
 * Create a test job
 */
export const createTestJob = async (jobData = {}) => {
  const employer = jobData.employer || (await createTestEmployer());
  
  const defaultJob = {
    title: 'Software Engineer',
    description: 'We are looking for a skilled software engineer',
    company: employer.companyName || 'Test Company',
    category: 'Technology',
    location: 'Remote',
    salary: '$80,000 - $100,000',
    type: 'Full-time',
    requirements: ['JavaScript', 'React', 'Node.js'],
    employer: employer._id,
    status: 'active',
  };

  const job = await Job.create({ ...defaultJob, ...jobData });
  return job;
};

/**
 * Create a test application
 */
export const createTestApplication = async (applicationData = {}) => {
  const job = applicationData.job || (await createTestJob());
  const applicant = applicationData.applicant || (await createTestUser());

  const defaultApplication = {
    job: job._id,
    applicant: applicant._id,
    coverLetter: 'I am interested in this position',
    resume: 'resume.pdf',
    status: 'pending',
  };

  const application = await Application.create({ ...defaultApplication, ...applicationData });
  return application;
};

/**
 * Get authentication token for a user
 */
export const getAuthToken = (userId) => {
  return generateToken(userId);
};

/**
 * Create authenticated request headers
 */
export const getAuthHeaders = (userId) => {
  const token = getAuthToken(userId);
  return {
    Authorization: `Bearer ${token}`,
  };
};

/**
 * Generate random email for testing
 */
export const randomEmail = () => {
  return `test${Date.now()}${Math.random().toString(36).substring(7)}@example.com`;
};



