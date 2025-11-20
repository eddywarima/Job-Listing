import request from 'supertest';
import app from '../../src/app.js';
import jwt from 'jsonwebtoken';
import { createTestUser, createTestEmployer, getAuthToken } from '../helpers/testHelpers.js';

describe('Auth Middleware', () => {
  describe('protect middleware', () => {
    it('should allow access with valid token', async () => {
      const user = await createTestUser();
      const token = getAuthToken(user._id);

      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should deny access without token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .expect(401);

      expect(response.body.message).toContain('Not authorized, no token');
    });

    it('should deny access with invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token-here')
        .expect(401);

      expect(response.body.message).toContain('token failed');
    });

    it('should deny access with expired token', async () => {
      const user = await createTestUser();
      const expiredToken = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET || 'test-secret',
        { expiresIn: '-1h' }
      );

      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${expiredToken}`)
        .expect(401);

      expect(response.body.message).toContain('token failed');
    });

    it('should deny access with token for non-existent user', async () => {
      const fakeUserId = '507f1f77bcf86cd799439011';
      const token = getAuthToken(fakeUserId);

      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(401);

      expect(response.body.message).toContain('User not found');
    });
  });

  describe('admin middleware', () => {
    it('should allow admin access', async () => {
      const admin = await createTestUser({ role: 'admin' });
      const token = getAuthToken(admin._id);

      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should deny non-admin access', async () => {
      const user = await createTestUser({ role: 'job_seeker' });
      const token = getAuthToken(user._id);

      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${token}`)
        .expect(403);

      expect(response.body.message).toContain('Admin only');
    });
  });

  describe('employer middleware', () => {
    it('should allow employer access', async () => {
      const employer = await createTestEmployer();
      const token = getAuthToken(employer._id);

      const response = await request(app)
        .post('/api/jobs')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Test Job',
          description: 'Test',
          company: 'Test Company',
          category: 'Technology',
          location: 'Remote',
        })
        .expect(201);

      expect(response.body.success).toBe(true);
    });

    it('should allow admin to access employer routes', async () => {
      const admin = await createTestUser({ role: 'admin' });
      const token = getAuthToken(admin._id);

      const response = await request(app)
        .post('/api/jobs')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Test Job',
          description: 'Test',
          company: 'Test Company',
          category: 'Technology',
          location: 'Remote',
        })
        .expect(201);

      expect(response.body.success).toBe(true);
    });

    it('should deny job seeker access to employer routes', async () => {
      const jobSeeker = await createTestUser({ role: 'job_seeker' });
      const token = getAuthToken(jobSeeker._id);

      const response = await request(app)
        .post('/api/jobs')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Test Job',
          description: 'Test',
          company: 'Test Company',
          category: 'Technology',
          location: 'Remote',
        })
        .expect(403);

      expect(response.body.message).toContain('Employer only');
    });
  });
});

