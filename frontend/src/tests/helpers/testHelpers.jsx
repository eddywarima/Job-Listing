import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';

/**
 * Render component with all necessary providers
 */
export const renderWithProviders = (ui, { ...options } = {}) => {
  const Wrapper = ({ children }) => {
    return (
      <BrowserRouter>
        <AuthProvider>
          {children}
        </AuthProvider>
      </BrowserRouter>
    );
  };

  return render(ui, { wrapper: Wrapper, ...options });
};

/**
 * Mock user data for testing
 */
export const mockUser = {
  _id: '507f1f77bcf86cd799439011',
  name: 'Test User',
  email: 'test@example.com',
  role: 'job_seeker',
  token: 'mock-token-123',
};

export const mockEmployer = {
  _id: '507f1f77bcf86cd799439012',
  name: 'Test Employer',
  email: 'employer@example.com',
  role: 'employer',
  companyName: 'Test Company',
  token: 'mock-token-456',
};

export const mockAdmin = {
  _id: '507f1f77bcf86cd799439013',
  name: 'Test Admin',
  email: 'admin@example.com',
  role: 'admin',
  token: 'mock-token-789',
};

/**
 * Mock job data for testing
 */
export const mockJob = {
  _id: '507f1f77bcf86cd799439020',
  title: 'Software Engineer',
  description: 'We are looking for a skilled software engineer',
  company: 'Tech Corp',
  category: 'Technology',
  location: 'Remote',
  salary: '$80,000 - $100,000',
  type: 'Full-time',
  requirements: ['JavaScript', 'React', 'Node.js'],
  status: 'active',
  employer: mockEmployer._id,
  createdAt: new Date().toISOString(),
};

export const mockJobs = [
  mockJob,
  {
    ...mockJob,
    _id: '507f1f77bcf86cd799439021',
    title: 'Frontend Developer',
    category: 'Technology',
  },
  {
    ...mockJob,
    _id: '507f1f77bcf86cd799439022',
    title: 'Product Manager',
    category: 'Management',
  },
];

/**
 * Mock application data
 */
export const mockApplication = {
  _id: '507f1f77bcf86cd799439030',
  job: mockJob._id,
  applicant: mockUser._id,
  resume: 'resume.pdf',
  coverLetter: 'I am interested in this position',
  status: 'pending',
  createdAt: new Date().toISOString(),
};

/**
 * Wait for async operations
 */
export const waitForAsync = () => new Promise((resolve) => setTimeout(resolve, 0));

/**
 * Mock localStorage
 */
export const mockLocalStorage = () => {
  const store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      Object.keys(store).forEach((key) => delete store[key]);
    },
  };
};



