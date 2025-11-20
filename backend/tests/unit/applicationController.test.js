import request from 'supertest';
import app from '../../src/app.js';
import Application from '../../src/models/Application.js';
import { createTestUser, createTestEmployer, createTestJob, getAuthToken } from '../helpers/testHelpers.js';
import path from 'path';
import fs from 'fs';

describe('Application Controller', () => {
  describe('POST /api/applications', () => {
    it('should apply to a job with resume', async () => {
      const jobSeeker = await createTestUser();
      const job = await createTestJob();
      const token = getAuthToken(jobSeeker._id);

      // Create a mock resume file
      const resumePath = path.join(process.cwd(), 'tests', 'fixtures', 'resume.pdf');
      const resumeDir = path.dirname(resumePath);
      if (!fs.existsSync(resumeDir)) {
        fs.mkdirSync(resumeDir, { recursive: true });
      }
      fs.writeFileSync(resumePath, 'Mock resume content');

      const response = await request(app)
        .post('/api/applications')
        .set('Authorization', `Bearer ${token}`)
        .field('jobId', job._id.toString())
        .field('coverLetter', 'I am very interested in this position')
        .attach('resume', resumePath)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('job');
      expect(response.body.data).toHaveProperty('applicant');
      expect(response.body.data.status).toBe('pending');

      // Cleanup
      if (fs.existsSync(resumePath)) {
        fs.unlinkSync(resumePath);
      }
    });

    it('should not apply without resume file', async () => {
      const jobSeeker = await createTestUser();
      const job = await createTestJob();
      const token = getAuthToken(jobSeeker._id);

      const response = await request(app)
        .post('/api/applications')
        .set('Authorization', `Bearer ${token}`)
        .send({
          jobId: job._id.toString(),
          coverLetter: 'Test cover letter',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Resume file is required');
    });

    it('should not apply to non-existent job', async () => {
      const jobSeeker = await createTestUser();
      const token = getAuthToken(jobSeeker._id);
      const fakeJobId = '507f1f77bcf86cd799439011';

      // Create a mock resume file for this test
      const resumePath = path.join(process.cwd(), 'tests', 'fixtures', 'resume-test.pdf');
      const resumeDir = path.dirname(resumePath);
      if (!fs.existsSync(resumeDir)) {
        fs.mkdirSync(resumeDir, { recursive: true });
      }
      fs.writeFileSync(resumePath, 'Mock resume content');

      const response = await request(app)
        .post('/api/applications')
        .set('Authorization', `Bearer ${token}`)
        .field('jobId', fakeJobId)
        .field('coverLetter', 'Test cover letter')
        .attach('resume', resumePath)
        .expect(404);

      expect(response.body.success).toBe(false);

      // Cleanup
      if (fs.existsSync(resumePath)) {
        fs.unlinkSync(resumePath);
      }
    });

    it('should not allow duplicate applications', async () => {
      const jobSeeker = await createTestUser();
      const job = await createTestJob();
      const token = getAuthToken(jobSeeker._id);

      // Create a mock resume file
      const resumePath = path.join(process.cwd(), 'tests', 'fixtures', 'resume-duplicate.pdf');
      const resumeDir = path.dirname(resumePath);
      if (!fs.existsSync(resumeDir)) {
        fs.mkdirSync(resumeDir, { recursive: true });
      }
      fs.writeFileSync(resumePath, 'Mock resume content');

      // Create first application
      await Application.create({
        job: job._id,
        applicant: jobSeeker._id,
        resume: 'resume1.pdf',
        coverLetter: 'First application',
      });

      // Try to apply again with resume file
      const response = await request(app)
        .post('/api/applications')
        .set('Authorization', `Bearer ${token}`)
        .field('jobId', job._id.toString())
        .field('coverLetter', 'Second application')
        .attach('resume', resumePath)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('already applied');

      // Cleanup
      if (fs.existsSync(resumePath)) {
        fs.unlinkSync(resumePath);
      }
    });

    it('should not apply without authentication', async () => {
      const job = await createTestJob();

      const response = await request(app)
        .post('/api/applications')
        .send({
          jobId: job._id.toString(),
          coverLetter: 'Test cover letter',
        })
        .expect(401);

      expect(response.body.message).toContain('Not authorized');
    });
  });

  describe('GET /api/applications/my-applications', () => {
    it('should get user applications', async () => {
      const jobSeeker = await createTestUser();
      const job1 = await createTestJob();
      const job2 = await createTestJob();
      const token = getAuthToken(jobSeeker._id);

      await Application.create({
        job: job1._id,
        applicant: jobSeeker._id,
        resume: 'resume1.pdf',
      });
      await Application.create({
        job: job2._id,
        applicant: jobSeeker._id,
        resume: 'resume2.pdf',
      });

      const response = await request(app)
        .get('/api/applications/my-applications')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
    });

    it('should filter applications by status', async () => {
      const jobSeeker = await createTestUser();
      const job = await createTestJob();
      const token = getAuthToken(jobSeeker._id);

      await Application.create({
        job: job._id,
        applicant: jobSeeker._id,
        resume: 'resume.pdf',
        status: 'pending',
      });

      const response = await request(app)
        .get('/api/applications/my-applications?status=pending')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.every(app => app.status === 'pending')).toBe(true);
    });
  });

  describe('GET /api/applications/job/:jobId', () => {
    it('should get applications for a job by employer', async () => {
      const employer = await createTestEmployer();
      const job = await createTestJob({ employer: employer._id });
      const applicant1 = await createTestUser();
      const applicant2 = await createTestUser();
      const token = getAuthToken(employer._id);

      await Application.create({
        job: job._id,
        applicant: applicant1._id,
        resume: 'resume1.pdf',
      });
      await Application.create({
        job: job._id,
        applicant: applicant2._id,
        resume: 'resume2.pdf',
      });

      const response = await request(app)
        .get(`/api/applications/job/${job._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
    });

    it('should not allow non-owner to view applications', async () => {
      const employer1 = await createTestEmployer();
      const employer2 = await createTestEmployer();
      const job = await createTestJob({ employer: employer1._id });
      const token = getAuthToken(employer2._id);

      const response = await request(app)
        .get(`/api/applications/job/${job._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/applications/:id/status', () => {
    it('should update application status by employer', async () => {
      const employer = await createTestEmployer();
      const job = await createTestJob({ employer: employer._id });
      const applicant = await createTestUser();
      const token = getAuthToken(employer._id);

      const application = await Application.create({
        job: job._id,
        applicant: applicant._id,
        resume: 'resume.pdf',
        status: 'pending',
      });

      const response = await request(app)
        .put(`/api/applications/${application._id}/status`)
        .set('Authorization', `Bearer ${token}`)
        .send({ status: 'reviewed' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('reviewed');
    });

    it('should not allow non-owner to update application', async () => {
      const employer1 = await createTestEmployer();
      const employer2 = await createTestEmployer();
      const job = await createTestJob({ employer: employer1._id });
      const applicant = await createTestUser();
      const token = getAuthToken(employer2._id);

      const application = await Application.create({
        job: job._id,
        applicant: applicant._id,
        resume: 'resume.pdf',
      });

      const response = await request(app)
        .put(`/api/applications/${application._id}/status`)
        .set('Authorization', `Bearer ${token}`)
        .send({ status: 'accepted' })
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });
});

