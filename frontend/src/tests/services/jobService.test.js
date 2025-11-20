import { describe, it, expect, vi, beforeEach } from 'vitest';
import { jobService } from '../../services/jobService';
import axiosClient from '../../api/axiosClient';

// Mock axiosClient
vi.mock('../../api/axiosClient', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('JobService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getJobs', () => {
    it('should fetch jobs with default parameters', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            jobs: [],
            totalPages: 1,
            currentPage: 1,
            total: 0,
          },
        },
      };

      axiosClient.get.mockResolvedValue(mockResponse);

      const result = await jobService.getJobs();

      expect(axiosClient.get).toHaveBeenCalledWith('/jobs', { params: {} });
      expect(result).toEqual(mockResponse.data.data);
    });

    it('should fetch jobs with filters', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            jobs: [],
            totalPages: 1,
            currentPage: 1,
            total: 0,
          },
        },
      };

      axiosClient.get.mockResolvedValue(mockResponse);

      const params = {
        title: 'Developer',
        category: 'Technology',
        location: 'Remote',
      };

      await jobService.getJobs(params);

      expect(axiosClient.get).toHaveBeenCalledWith('/jobs', { params });
    });
  });

  describe('getJobById', () => {
    it('should fetch a single job by ID', async () => {
      const mockJob = {
        _id: '123',
        title: 'Software Engineer',
        company: 'Tech Corp',
      };

      const mockResponse = {
        data: {
          success: true,
          data: mockJob,
        },
      };

      axiosClient.get.mockResolvedValue(mockResponse);

      const result = await jobService.getJobById('123');

      expect(axiosClient.get).toHaveBeenCalledWith('/jobs/123');
      expect(result).toEqual(mockJob);
    });
  });

  describe('createJob', () => {
    it('should create a new job', async () => {
      const jobData = {
        title: 'Software Engineer',
        description: 'We need a developer',
        company: 'Tech Corp',
        category: 'Technology',
        location: 'Remote',
      };

      const mockResponse = {
        data: {
          success: true,
          data: { ...jobData, _id: '123' },
        },
      };

      axiosClient.post.mockResolvedValue(mockResponse);

      const result = await jobService.createJob(jobData);

      expect(axiosClient.post).toHaveBeenCalledWith('/jobs', jobData);
      expect(result).toEqual(mockResponse.data.data);
    });
  });

  describe('updateJob', () => {
    it('should update an existing job', async () => {
      const updateData = {
        title: 'Updated Title',
        salary: '$100,000',
      };

      const mockResponse = {
        data: {
          success: true,
          data: { ...updateData, _id: '123' },
        },
      };

      axiosClient.put.mockResolvedValue(mockResponse);

      const result = await jobService.updateJob('123', updateData);

      expect(axiosClient.put).toHaveBeenCalledWith('/jobs/123', updateData);
      expect(result).toEqual(mockResponse.data.data);
    });
  });

  describe('deleteJob', () => {
    it('should delete a job', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: null,
        },
      };

      axiosClient.delete.mockResolvedValue(mockResponse);

      const result = await jobService.deleteJob('123');

      expect(axiosClient.delete).toHaveBeenCalledWith('/jobs/123');
      expect(result).toEqual(mockResponse.data.data);
    });
  });

  describe('applyToJob', () => {
    it('should apply to a job with resume', async () => {
      const mockFile = new File(['resume content'], 'resume.pdf', { type: 'application/pdf' });
      const applicationData = {
        coverLetter: 'I am interested',
      };

      const mockResponse = {
        data: {
          success: true,
          data: {
            _id: 'app123',
            job: 'job123',
            applicant: 'user123',
          },
        },
      };

      axiosClient.post.mockResolvedValue(mockResponse);

      const result = await jobService.applyToJob('job123', applicationData, mockFile);

      expect(axiosClient.post).toHaveBeenCalledWith(
        '/applications',
        expect.any(FormData),
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      expect(result).toEqual(mockResponse.data.data);
    });
  });
});



