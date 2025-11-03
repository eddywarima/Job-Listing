import Job from '../models/Job.js';
import { successResponse, errorResponse } from '../utils/handleResponse.js';

export const getJobs = async (req, res) => {
  try {
    const { title, category, location, page = 1, limit = 10 } = req.query;
    const query = { status: 'active' };

    if (title) {
      query.title = { $regex: title, $options: 'i' };
    }
    if (category) {
      query.category = { $regex: category, $options: 'i' };
    }
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    const skip = (page - 1) * limit;
    const jobs = await Job.find(query)
      .populate('employer', 'name companyName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Job.countDocuments(query);

    successResponse(res, 200, {
      jobs,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total,
    }, 'Jobs retrieved successfully');
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};

export const getJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('employer', 'name companyName email bio location');

    if (!job) {
      return errorResponse(res, 404, 'Job not found');
    }

    successResponse(res, 200, job, 'Job retrieved successfully');
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};

export const createJob = async (req, res) => {
  try {
    const {
      title,
      description,
      company,
      category,
      location,
      salary,
      type,
      requirements,
    } = req.body;

    const job = await Job.create({
      title,
      description,
      company,
      category,
      location,
      salary,
      type,
      requirements: requirements ? (Array.isArray(requirements) ? requirements : [requirements]) : [],
      employer: req.user._id,
    });

    successResponse(res, 201, job, 'Job created successfully');
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};

export const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return errorResponse(res, 404, 'Job not found');
    }

    if (job.employer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return errorResponse(res, 403, 'Not authorized to update this job');
    }

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    successResponse(res, 200, updatedJob, 'Job updated successfully');
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};

export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return errorResponse(res, 404, 'Job not found');
    }

    if (job.employer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return errorResponse(res, 403, 'Not authorized to delete this job');
    }

    await Job.findByIdAndDelete(req.params.id);

    successResponse(res, 200, null, 'Job deleted successfully');
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};

export const getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ employer: req.user._id })
      .sort({ createdAt: -1 });

    successResponse(res, 200, jobs, 'Jobs retrieved successfully');
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};


