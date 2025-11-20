import request from 'supertest';
import app from '../../src/app.js';
import { createTestUser, createTestEmployer, getAuthToken } from '../helpers/testHelpers.js';

describe('User Controller', () => {
  describe('GET /api/users/profile', () => {
    it('should get user profile', async () => {
      const user = await createTestUser();
      const token = getAuthToken(user._id);

      const response = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data._id.toString()).toBe(user._id.toString());
      expect(response.body.data).not.toHaveProperty('password');
    });

    it('should not get profile without authentication', async () => {
      const response = await request(app)
        .get('/api/users/profile')
        .expect(401);

      expect(response.body.message).toContain('Not authorized');
    });
  });

  describe('PUT /api/users/profile', () => {
    it('should update user profile', async () => {
      const user = await createTestUser();
      const token = getAuthToken(user._id);

      const updateData = {
        name: 'Updated Name',
        phone: '1234567890',
        bio: 'Updated bio',
        location: 'New York',
      };

      const response = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${token}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(updateData.name);
      expect(response.body.data.phone).toBe(updateData.phone);
      expect(response.body.data.bio).toBe(updateData.bio);
    });

    it('should update employer company name', async () => {
      const employer = await createTestEmployer();
      const token = getAuthToken(employer._id);

      const response = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${token}`)
        .send({ companyName: 'Updated Company Name' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.companyName).toBe('Updated Company Name');
    });
  });

  describe('GET /api/users (Admin only)', () => {
    it('should get all users as admin', async () => {
      await createTestUser();
      await createTestUser();
      const admin = await createTestUser({ role: 'admin' });
      const token = getAuthToken(admin._id);

      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBeGreaterThanOrEqual(3);
    });

    it('should not allow non-admin to get all users', async () => {
      const user = await createTestUser();
      const token = getAuthToken(user._id);

      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${token}`)
        .expect(403);

      expect(response.body.message).toContain('Admin only');
    });
  });
});



