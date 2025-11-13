import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { jobService } from '../services/jobService';
import JobForm from '../components/JobForm';
import Loader from '../components/Loader';

const Dashboard = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showJobForm, setShowJobForm] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0
  });

  useEffect(() => {
    if (user?.role === 'employer') {
      fetchEmployerJobs();
      fetchStats();
    } else {
      fetchJobSeekerJobs();
    }
  }, [user]);

  const fetchEmployerJobs = async () => {
    try {
      const response = await jobService.getEmployerJobs();
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchJobSeekerJobs = async () => {
    try {
      const response = await jobService.getMyApplications();
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // Get jobs and applications for stats
      const jobsResponse = await jobService.getEmployerJobs();
      const appsResponse = await jobService.getMyApplications();
      
      setStats({
        totalJobs: jobsResponse.data?.length || 0,
        activeJobs: jobsResponse.data?.filter(j => j.status === 'active')?.length || 0,
        totalApplications: appsResponse.data?.length || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleCreateJob = () => {
    setEditingJob(null);
    setShowJobForm(true);
  };

  const handleEditJob = (job) => {
    setEditingJob(job);
    setShowJobForm(true);
  };

  const handleJobSubmit = async (jobData) => {
    try {
      if (editingJob) {
        await jobService.updateJob(editingJob._id, jobData);
      } else {
        await jobService.createJob(jobData);
      }
      
      setShowJobForm(false);
      setEditingJob(null);
      fetchEmployerJobs();
      fetchStats();
    } catch (error) {
      console.error('Error saving job:', error);
      alert('Failed to save job. Please try again.');
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;

    try {
      await jobService.deleteJob(jobId);
      fetchEmployerJobs();
      fetchStats();
    } catch (error) {
      console.error('Error deleting job:', error);
      alert('Failed to delete job. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return <Loader text="Loading dashboard..." />;
  }

  if (showJobForm) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">
                {editingJob ? 'Edit Job' : 'Create New Job'}
              </h1>
              <p className="text-gray-600">
                {editingJob ? 'Update the job details below' : 'Fill in the details to post a new job'}
              </p>
            </div>
            
            <JobForm
              job={editingJob}
              onSubmit={handleJobSubmit}
              onCancel={() => {
                setShowJobForm(false);
                setEditingJob(null);
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name?.split(' ')[0]}!
          </h1>
          <p className="text-gray-600">
            {user?.role === 'employer' 
              ? 'Manage your job postings and track applications'
              : 'Track your job applications'
            }
          </p>
        </div>

        {user?.role === 'employer' && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Jobs</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.totalJobs}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Active Jobs</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.activeJobs}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Applications</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.totalApplications}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Create Job Button */}
            <div className="mb-8">
              <button
                onClick={handleCreateJob}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Post New Job
              </button>
            </div>
          </>
        )}

        {/* Jobs List */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              {user?.role === 'employer' ? 'Your Job Postings' : 'Your Applications'}
            </h2>
          </div>

          {jobs.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {jobs.map((job) => (
                <div key={job._id} className="p-6 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {job.title}
                      </h3>
                      <p className="text-gray-600 mb-2">{job.company}</p>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        <span>{job.location}</span>
                        <span>{job.type}</span>
                        <span>Posted {formatDate(job.createdAt)}</span>
                        {user?.role === 'employer' && job.applications && (
                          <span>{job.applications.length} applications</span>
                        )}
                      </div>
                    </div>
                    
                    {user?.role === 'employer' && (
                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => handleEditJob(job)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteJob(job._id)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {user?.role === 'employer' ? 'No jobs posted yet' : 'No applications yet'}
              </h3>
              <p className="text-gray-500 mb-4">
                {user?.role === 'employer' 
                  ? 'Get started by posting your first job opportunity.'
                  : 'Start applying to jobs to see them here.'
                }
              </p>
              {user?.role === 'employer' && (
                <button
                  onClick={handleCreateJob}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Post Your First Job
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
