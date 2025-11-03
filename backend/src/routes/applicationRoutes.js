import express from 'express';
import {
  applyToJob,
  getApplications,
  getJobApplications,
  updateApplicationStatus,
} from '../controllers/applicationController.js';
import { protect, employer } from '../middleware/authMiddleware.js';
import { uploadResume } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/', protect, uploadResume.single('resume'), applyToJob);
router.get('/my-applications', protect, getApplications);
router.get('/job/:jobId', protect, employer, getJobApplications);
router.put('/:id/status', protect, employer, updateApplicationStatus);

export default router;


