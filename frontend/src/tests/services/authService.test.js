import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authService } from '../../services/authService';
import axiosClient from '../../api/axiosClient';

// Mock axiosClient
vi.mock('../../api/axiosClient', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
  },
}));

describe('AuthService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('login', () => {
    it('should login user with valid credentials', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            _id: '123',
            email: 'test@example.com',
            token: 'mock-token',
          },
        },
      };

      axiosClient.post.mockResolvedValue(mockResponse);

      const credentials = {
        email: 'test@example.com',
        password: 'password123',
      };

      const result = await authService.login(credentials);

      expect(axiosClient.post).toHaveBeenCalledWith('/auth/login', credentials);
      expect(result).toEqual(mockResponse);
    });

    it('should handle login errors', async () => {
      const mockError = {
        response: {
          data: {
            success: false,
            message: 'Invalid credentials',
          },
        },
      };

      axiosClient.post.mockRejectedValue(mockError);

      await expect(
        authService.login({ email: 'test@example.com', password: 'wrong' })
      ).rejects.toEqual(mockError);
    });
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            _id: '123',
            email: 'newuser@example.com',
            token: 'mock-token',
          },
        },
      };

      axiosClient.post.mockResolvedValue(mockResponse);

      const userData = {
        name: 'New User',
        email: 'newuser@example.com',
        password: 'password123',
        role: 'job_seeker',
      };

      const result = await authService.register(userData);

      expect(axiosClient.post).toHaveBeenCalledWith('/auth/register', userData);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getMe', () => {
    it('should get current authenticated user', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            _id: '123',
            email: 'test@example.com',
            name: 'Test User',
          },
        },
      };

      axiosClient.get.mockResolvedValue(mockResponse);

      const result = await authService.getMe();

      expect(axiosClient.get).toHaveBeenCalledWith('/auth/me');
      expect(result).toEqual(mockResponse);
    });
  });
});



