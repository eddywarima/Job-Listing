import request from 'supertest';
import app from '../../src/app.js';
import Job from '../../src/models/Job.js';
import { createTestUser, createTestEmployer, createTestJob, getAuthToken } from '../helpers/testHelpers.js';

describe('Job Controller', () => {
  describe('GET /api/jobs', () => {
    it('should get all active jobs', async () => {
      await createTestJob();
      await createTestJob({ title: 'Frontend Developer' });

      const response = await request(app)
        .get('/api/jobs')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.jobs).toHaveLength(2);
      expect(response.body.data).toHaveProperty('totalPages');
      expect(response.body.data).toHaveProperty('currentPage');
    });

    it('should filter jobs by title', async () => {
      await createTestJob({ title: 'Software Engineer' });
      await createTestJob({ title: 'Product Manager' });

      const response = await request(app)
        .get('/api/jobs?title=Software')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.jobs.length).toBeGreaterThan(0);
      expect(response.body.data.jobs[0].title).toContain('Software');
    });

    it('should filter jobs by category', async () => {
      await createTestJob({ category: 'Technology' });
      await createTestJob({ category: 'Marketing' });

      const response = await request(app)
        .get('/api/jobs?category=Technology')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.jobs.every(job => job.category === 'Technology')).toBe(true);
    });

    it('should filter jobs by location', async () => {
      await createTestJob({ location: 'Remote' });
      await createTestJob({ location: 'New York' });

      const response = await request(app)
        .get('/api/jobs?location=Remote')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.jobs.every(job => job.location === 'Remote')).toBe(true);
    });

    it('should paginate jobs', async () => {
      // Create multiple jobs
      for (let i = 0; i < 5; i++) {
        await createTestJob({ title: `Job ${i}` });
      }

      const response = await request(app)
        .get('/api/jobs?page=1&limit=2')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.jobs).toHaveLength(2);
      expect(response.body.data.currentPage).toBe(1);
    });
  });

  describe('GET /api/jobs/:id', () => {
    it('should get a single job by ID', async () => {
      const job = await createTestJob();

      const response = await request(app)
        .get(`/api/jobs/${job._id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data._id.toString()).toBe(job._id.toString());
      expect(response.body.data).toHaveProperty('employer');
    });

    it('should return 404 for non-existent job', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await request(app)
        .get(`/api/jobs/${fakeId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('not found');
    });
  });

  describe('POST /api/jobs', () => {
    it('should create a job as employer', async () => {
      const employer = await createTestEmployer();
      const token = getAuthToken(employer._id);

      const jobData = {
        title: 'Senior Developer',
        description: 'We need a senior developer',
        company: employer.companyName,
        category: 'Technology',
        location: 'Remote',
        salary: '$100,000 - $120,000',
        type: 'Full-time',
        requirements: ['Node.js', 'React'],
      };

      const response = await request(app)
        .post('/api/jobs')
        .set('Authorization', `Bearer ${token}`)
        .send(jobData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(jobData.title);
      expect(response.body.data.employer.toString()).toBe(employer._id.toString());
    });

    it('should not create job without authentication', async () => {
      const jobData = {
        title: 'Test Job',
        description: 'Test description',
        company: 'Test Company',
        category: 'Technology',
        location: 'Remote',
      };

      const response = await request(app)
        .post('/api/jobs')
        .send(jobData)
        .expect(401);

      expect(response.body.message).toContain('Not authorized');
    });

    it('should not create job as job seeker', async () => {
      const jobSeeker = await createTestUser();
      const token = getAuthToken(jobSeeker._id);

      const jobData = {
        title: 'Test Job',
        description: 'Test description',
        company: 'Test Company',
        category: 'Technology',
        location: 'Remote',
      };

      const response = await request(app)
        .post('/api/jobs')
        .set('Authorization', `Bearer ${token}`)
        .send(jobData)
        .expect(403);

      expect(response.body.message).toContain('Employer only');
    });
  });

  describe('PUT /api/jobs/:id', () => {
    it('should update job by owner', async () => {
      const employer = await createTestEmployer();
      const job = await createTestJob({ employer: employer._id });
      const token = getAuthToken(employer._id);

      const updateData = {
        title: 'Updated Job Title',
        salary: '$90,000 - $110,000',
      };

      const response = await request(app)
        .put(`/api/jobs/${job._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(updateData.title);
      expect(response.body.data.salary).toBe(updateData.salary);
    });

    it('should not update job by non-owner', async () => {
      const employer1 = await createTestEmployer();
      const employer2 = await createTestEmployer();
      const job = await createTestJob({ employer: employer1._id });
      const token = getAuthToken(employer2._id);

      const response = await request(app)
        .put(`/api/jobs/${job._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Unauthorized Update' })
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Not authorized');
    });

    it('should allow admin to update any job', async () => {
      const employer = await createTestEmployer();
      const admin = await createTestUser({ role: 'admin' });
      const job = await createTestJob({ employer: employer._id });
      const token = getAuthToken(admin._id);

      const response = await request(app)
        .put(`/api/jobs/${job._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Admin Updated Title' })
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('DELETE /api/jobs/:id', () => {
    it('should delete job by owner', async () => {
      const employer = await createTestEmployer();
      const job = await createTestJob({ employer: employer._id });
      const token = getAuthToken(employer._id);

      const response = await request(app)
        .delete(`/api/jobs/${job._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);

      // Verify job is deleted
      const deletedJob = await Job.findById(job._id);
      expect(deletedJob).toBeNull();
    });

    it('should not delete job by non-owner', async () => {
      const employer1 = await createTestEmployer();
      const employer2 = await createTestEmployer();
      const job = await createTestJob({ employer: employer1._id });
      const token = getAuthToken(employer2._id);

      const response = await request(app)
        .delete(`/api/jobs/${job._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/jobs/my-jobs', () => {
    it('should get jobs created by employer', async () => {
      const employer = await createTestEmployer();
      await createTestJob({ employer: employer._id });
      await createTestJob({ employer: employer._id });
      const token = getAuthToken(employer._id);

      const response = await request(app)
        .get('/api/jobs/my-jobs')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
    });
  });
});



