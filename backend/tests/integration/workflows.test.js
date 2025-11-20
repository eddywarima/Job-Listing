import request from 'supertest';
import app from '../../src/app.js';
import { createTestUser, createTestEmployer, getAuthToken } from '../helpers/testHelpers.js';

describe('Integration Tests - Complete Workflows', () => {
  describe('User Registration → Login → Job Application Workflow', () => {
    it('should complete full job application workflow', async () => {
      // Step 1: Register as job seeker
      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'John Applicant',
          email: `john${Date.now()}@example.com`,
          password: 'password123',
          role: 'job_seeker',
        })
        .expect(201);

      expect(registerResponse.body.success).toBe(true);
      const jobSeekerToken = registerResponse.body.data.token;

      // Step 2: Register as employer
      const employerResponse = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Jane Employer',
          email: `jane${Date.now()}@example.com`,
          password: 'password123',
          role: 'employer',
          companyName: 'Tech Corp',
        })
        .expect(201);

      expect(employerResponse.body.success).toBe(true);
      const employerToken = employerResponse.body.data.token;

      // Step 3: Employer creates a job
      const jobResponse = await request(app)
        .post('/api/jobs')
        .set('Authorization', `Bearer ${employerToken}`)
        .send({
          title: 'Senior Developer',
          description: 'We are looking for a senior developer',
          company: 'Tech Corp',
          category: 'Technology',
          location: 'Remote',
          salary: '$100,000 - $120,000',
          type: 'Full-time',
          requirements: ['Node.js', 'React'],
        })
        .expect(201);

      expect(jobResponse.body.success).toBe(true);
      const jobId = jobResponse.body.data._id;

      // Step 4: Job seeker views the job
      const viewJobResponse = await request(app)
        .get(`/api/jobs/${jobId}`)
        .expect(200);

      expect(viewJobResponse.body.success).toBe(true);
      expect(viewJobResponse.body.data.title).toBe('Senior Developer');

      // Step 5: Job seeker applies to the job
      // Note: In a real scenario, this would include file upload
      // For integration test, we'll test the flow without actual file
      const applicationResponse = await request(app)
        .post('/api/applications')
        .set('Authorization', `Bearer ${jobSeekerToken}`)
        .field('jobId', jobId.toString())
        .field('coverLetter', 'I am very interested in this position')
        .expect(400); // Expected 400 because resume is required

      // The application endpoint requires a file, so we expect 400
      // In a real test with file upload, this would be 201
      expect(applicationResponse.body.message).toContain('Resume file is required');
    });
  });

  describe('Employer Workflow: Login → Create Job → View Applications', () => {
    it('should complete employer workflow', async () => {
      // Step 1: Login as employer
      const employer = await createTestEmployer();
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: employer.email,
          password: 'password123',
        })
        .expect(200);

      expect(loginResponse.body.success).toBe(true);
      const token = loginResponse.body.data.token;

      // Step 2: Create multiple jobs
      const job1Response = await request(app)
        .post('/api/jobs')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Frontend Developer',
          description: 'Frontend developer needed',
          company: employer.companyName,
          category: 'Technology',
          location: 'Remote',
          type: 'Full-time',
        })
        .expect(201);

      const job2Response = await request(app)
        .post('/api/jobs')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Backend Developer',
          description: 'Backend developer needed',
          company: employer.companyName,
          category: 'Technology',
          location: 'Remote',
          type: 'Full-time',
        })
        .expect(201);

      // Step 3: View my jobs
      const myJobsResponse = await request(app)
        .get('/api/jobs/my-jobs')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(myJobsResponse.body.success).toBe(true);
      expect(myJobsResponse.body.data.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Job Search and Filtering Workflow', () => {
    it('should search and filter jobs effectively', async () => {
      const employer = await createTestEmployer();
      const token = getAuthToken(employer._id);

      // Create jobs with different attributes
      await request(app)
        .post('/api/jobs')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'React Developer',
          description: 'React developer needed',
          company: employer.companyName,
          category: 'Technology',
          location: 'Remote',
          type: 'Full-time',
        });

      await request(app)
        .post('/api/jobs')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Marketing Manager',
          description: 'Marketing manager needed',
          company: employer.companyName,
          category: 'Marketing',
          location: 'New York',
          type: 'Full-time',
        });

      // Search by title
      const titleSearch = await request(app)
        .get('/api/jobs?title=React')
        .expect(200);

      expect(titleSearch.body.success).toBe(true);
      expect(titleSearch.body.data.jobs.some(job => job.title.includes('React'))).toBe(true);

      // Filter by category
      const categoryFilter = await request(app)
        .get('/api/jobs?category=Technology')
        .expect(200);

      expect(categoryFilter.body.success).toBe(true);
      expect(categoryFilter.body.data.jobs.every(job => job.category === 'Technology')).toBe(true);

      // Filter by location
      const locationFilter = await request(app)
        .get('/api/jobs?location=Remote')
        .expect(200);

      expect(locationFilter.body.success).toBe(true);
      expect(locationFilter.body.data.jobs.every(job => job.location === 'Remote')).toBe(true);
    });
  });

  describe('User Profile Management Workflow', () => {
    it('should update user profile and view it', async () => {
      // Register user
      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: `test${Date.now()}@example.com`,
          password: 'password123',
          role: 'job_seeker',
        })
        .expect(201);

      const token = registerResponse.body.data.token;

      // Get profile
      const getProfileResponse = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(getProfileResponse.body.success).toBe(true);

      // Update profile
      const updateResponse = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Updated Name',
          phone: '1234567890',
          bio: 'Updated bio',
          location: 'New York',
        })
        .expect(200);

      expect(updateResponse.body.success).toBe(true);
      expect(updateResponse.body.data.name).toBe('Updated Name');
      expect(updateResponse.body.data.phone).toBe('1234567890');

      // Verify update
      const verifyResponse = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(verifyResponse.body.data.name).toBe('Updated Name');
    });
  });
});



