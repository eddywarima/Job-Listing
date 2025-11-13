import express from 'express';
import {
  getJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  getMyJobs,
} from '../controllers/jobController.js';
import { protect, employer } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getJobs);
router.get('/my-jobs', protect, employer, getMyJobs);
router.get('/:id', getJob);
router.post('/', protect, employer, createJob);
router.put('/:id', protect, employer, updateJob);
router.delete('/:id', protect, employer, deleteJob);

export default router;


