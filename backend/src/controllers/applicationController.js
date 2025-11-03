import Application from '../models/Application.js';
import Job from '../models/Job.js';
import { successResponse, errorResponse } from '../utils/handleResponse.js';

export const applyToJob = async (req, res) => {
  try {
    const { jobId, coverLetter } = req.body;

    if (!req.file) {
      return errorResponse(res, 400, 'Resume file is required');
    }

    const job = await Job.findById(jobId);

    if (!job) {
      return errorResponse(res, 404, 'Job not found');
    }

    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: req.user._id,
    });

    if (existingApplication) {
      return errorResponse(res, 400, 'You have already applied to this job');
    }

    const application = await Application.create({
      job: jobId,
      applicant: req.user._id,
      resume: req.file.path,
      coverLetter,
    });

    const populatedApplication = await Application.findById(application._id)
      .populate('job', 'title company')
      .populate('applicant', 'name email');

    successResponse(res, 201, populatedApplication, 'Application submitted successfully');
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};

export const getApplications = async (req, res) => {
  try {
    const { status } = req.query;
    const query = { applicant: req.user._id };

    if (status) {
      query.status = status;
    }

    const applications = await Application.find(query)
      .populate('job', 'title company location category type')
      .sort({ createdAt: -1 });

    successResponse(res, 200, applications, 'Applications retrieved successfully');
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};

export const getJobApplications = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return errorResponse(res, 404, 'Job not found');
    }

    if (job.employer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return errorResponse(res, 403, 'Not authorized to view applications for this job');
    }

    const applications = await Application.find({ job: req.params.jobId })
      .populate('applicant', 'name email phone bio location')
      .sort({ createdAt: -1 });

    successResponse(res, 200, applications, 'Job applications retrieved successfully');
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const application = await Application.findById(id).populate('job');

    if (!application) {
      return errorResponse(res, 404, 'Application not found');
    }

    if (application.job.employer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return errorResponse(res, 403, 'Not authorized to update this application');
    }

    application.status = status;
    await application.save();

    const updatedApplication = await Application.findById(id)
      .populate('job', 'title company')
      .populate('applicant', 'name email');

    successResponse(res, 200, updatedApplication, 'Application status updated successfully');
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};


