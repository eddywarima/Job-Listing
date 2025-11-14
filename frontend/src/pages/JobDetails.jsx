import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { jobService } from '../services/jobService';
import { useAuth } from '../hooks/useAuth';
import Loader from '../components/Loader';
import Confetti from 'react-confetti';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [applicationData, setApplicationData] = useState({
    coverLetter: '',
    resume: null
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchJobDetails();
    setDimensions({ width: window.innerWidth, height: window.innerHeight });
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      const payload = await jobService.getJobById(id);
      setJob(payload);
    } catch (error) {
      console.error('Error fetching job details:', error);
      navigate('/jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: `/jobs/${id}` } } });
      return;
    }

    if (user.role !== 'jobseeker' && user.role !== 'job_seeker') {
      alert('Only job seekers can apply to jobs');
      return;
    }

    // Validate form
    const newErrors = {};
    if (!applicationData.resume) {
      newErrors.resume = 'Resume is required';
    }
    if (!applicationData.coverLetter.trim()) {
      newErrors.coverLetter = 'Cover letter is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setApplying(true);
    try {
      await jobService.applyToJob(id, applicationData, applicationData.resume);
      setApplied(true);
      setShowApplyForm(false);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    } catch (error) {
      console.error('Error applying to job:', error);
      const errorMsg = error.response?.data?.message || 'Failed to apply to job. Please try again.';
      alert(errorMsg);
    } finally {
      setApplying(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDaysRemaining = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getSkillColor = (index) => {
    const colors = [
      'bg-blue-50 text-blue-700 border-blue-200',
      'bg-emerald-50 text-emerald-700 border-emerald-200',
      'bg-purple-50 text-purple-700 border-purple-200',
      'bg-amber-50 text-amber-700 border-amber-200',
      'bg-rose-50 text-rose-700 border-rose-200',
      'bg-indigo-50 text-indigo-700 border-indigo-200'
    ];
    return colors[index % colors.length];
  };

  if (loading) {
    return <Loader text="Loading job details..." />;
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 text-gray-300">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Job Not Found</h2>
          <p className="text-gray-600 mb-8 max-w-md">
            The job you're looking for doesn't exist or may have been removed.
          </p>
          <Link
            to="/jobs"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
          >
            Browse All Jobs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {showConfetti && <Confetti width={dimensions.width} height={dimensions.height} recycle={false} />}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Jobs
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          {/* Job Header */}
          <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white p-8 lg:p-10">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h1 className="text-3xl lg:text-4xl font-bold mb-2 leading-tight">{job.title}</h1>
                    <p className="text-xl text-blue-100 font-semibold">{job.company}</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-4 text-blue-100">
                  <span className="flex items-center bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {job.location}
                  </span>
                  <span className="flex items-center bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {job.type}
                  </span>
                  {job.salary && (
                    <span className="flex items-center bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                      {job.salary}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-3">
                <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-xl backdrop-blur-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm font-medium">Posted {formatDate(job.createdAt)}</span>
                </div>
                {job.deadline && (
                  <div className="group relative">
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-sm ${
                      getDaysRemaining(job.deadline) <= 7 ? 'bg-rose-500/20 text-rose-100' : 'bg-emerald-500/20 text-emerald-100'
                    }`}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm font-medium">
                        Apply by {formatDate(job.deadline)}
                      </span>
                    </div>
                    <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 hidden group-hover:block bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
                      {getDaysRemaining(job.deadline)} days remaining
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Job Content */}
          <div className="p-8 lg:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-10">
                {/* Divider */}
                <div className="border-b border-gray-200"></div>

                {/* Job Description */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full"></div>
                    <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Job Description</h2>
                  </div>
                  <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                    <div className="whitespace-pre-wrap text-lg leading-8 space-y-4">
                      {job.description.split('\n').map((paragraph, index) => (
                        <p key={index} className={paragraph.trim() ? 'mb-4' : ''}>
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-b border-gray-200"></div>

                {/* Requirements */}
                {job.requirements && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-8 bg-gradient-to-b from-emerald-500 to-green-600 rounded-full"></div>
                      <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Requirements</h2>
                    </div>
                    <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                      <div className="whitespace-pre-wrap text-lg leading-8 space-y-4">
                        {job.requirements.split('\n').map((paragraph, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full mt-3 flex-shrink-0"></div>
                            <p className={paragraph.trim() ? 'mb-3' : ''}>
                              {paragraph}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Divider */}
                {(job.requirements || job.skills?.length > 0) && <div className="border-b border-gray-200"></div>}

                {/* Skills */}
                {job.skills && job.skills.length > 0 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-8 bg-gradient-to-b from-purple-500 to-indigo-600 rounded-full"></div>
                      <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Required Skills</h2>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {job.skills.map((skill, index) => (
                        <span
                          key={index}
                          className={`inline-flex items-center px-4 py-2.5 rounded-xl border-2 font-medium text-sm transition-all hover:scale-105 hover:shadow-md ${getSkillColor(index)}`}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Apply Card */}
                <div className="sticky top-8 bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl shadow-lg border border-gray-200">
                  {user ? (
                    applied ? (
                      <div className="text-center space-y-4">
                        <div className="relative">
                          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3 animate-bounce">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Application Submitted!</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          Thank you for your interest! The employer will review your application and contact you if you're a good fit.
                        </p>
                        <div className="pt-4 border-t border-gray-200">
                          <button
                            onClick={() => navigate('/jobs')}
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
                          >
                            Browse More Jobs
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {!showApplyForm ? (
                          <>
                            <h3 className="text-xl font-bold text-gray-900 text-center">Ready to Apply?</h3>
                            <button
                              onClick={() => setShowApplyForm(true)}
                              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Apply Now
                            </button>
                            <p className="text-xs text-gray-500 text-center">
                              Upload your resume and cover letter to apply
                            </p>
                          </>
                        ) : (
                          <div className="space-y-4">
                            <h3 className="text-lg font-bold text-gray-900">Submit Application</h3>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Cover Letter *
                              </label>
                              <textarea
                                value={applicationData.coverLetter}
                                onChange={(e) => {
                                  setApplicationData({ ...applicationData, coverLetter: e.target.value });
                                  if (errors.coverLetter) setErrors({ ...errors, coverLetter: '' });
                                }}
                                placeholder="Tell us why you're interested in this position..."
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
                                  errors.coverLetter ? 'border-red-500' : 'border-gray-300'
                                }`}
                                rows={4}
                              />
                              {errors.coverLetter && (
                                <p className="text-red-500 text-xs mt-1">{errors.coverLetter}</p>
                              )}
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Resume (PDF, DOC, DOCX) *
                              </label>
                              <input
                                type="file"
                                onChange={(e) => {
                                  setApplicationData({ ...applicationData, resume: e.target.files?.[0] || null });
                                  if (errors.resume) setErrors({ ...errors, resume: '' });
                                }}
                                accept=".pdf,.doc,.docx"
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
                                  errors.resume ? 'border-red-500' : 'border-gray-300'
                                }`}
                              />
                              {applicationData.resume && (
                                <p className="text-green-600 text-xs mt-1">✓ {applicationData.resume.name}</p>
                              )}
                              {errors.resume && (
                                <p className="text-red-500 text-xs mt-1">{errors.resume}</p>
                              )}
                            </div>

                            <div className="flex gap-2 pt-2">
                              <button
                                onClick={handleApply}
                                disabled={applying}
                                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 text-sm"
                              >
                                {applying ? (
                                  <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Submitting...
                                  </>
                                ) : (
                                  'Submit Application'
                                )}
                              </button>
                              <button
                                onClick={() => {
                                  setShowApplyForm(false);
                                  setApplicationData({ coverLetter: '', resume: null });
                                  setErrors({});
                                }}
                                className="flex-1 border border-gray-300 text-gray-700 py-2.5 px-4 rounded-lg font-semibold hover:bg-gray-50 transition-all text-sm"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  ) : (
                    <div className="text-center space-y-4">
                      <h3 className="text-xl font-bold text-gray-900">Interested in this job?</h3>
                      <p className="text-gray-600 text-sm">
                        Sign in to apply and track your applications
                      </p>
                      <Link
                        to="/login"
                        state={{ from: { pathname: `/jobs/${id}` } }}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl inline-block"
                      >
                        Sign In to Apply
                      </Link>
                      <p className="text-xs text-gray-500">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium">
                          Sign up
                        </Link>
                      </p>
                    </div>
                  )}
                </div>

                {/* Job Details Card */}
                <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Job Details
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-sm font-medium text-gray-500">Job Type</span>
                      <p className="text-gray-900 font-medium">{job.type}</p>
                    </div>
                    {job.experience && (
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-sm font-medium text-gray-500">Experience</span>
                        <p className="text-gray-900 font-medium">{job.experience}</p>
                      </div>
                    )}
                    {job.salary && (
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-sm font-medium text-gray-500">Salary</span>
                        <p className="text-gray-900 font-medium">{job.salary}</p>
                      </div>
                    )}
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-sm font-medium text-gray-500">Location</span>
                      <p className="text-gray-900 font-medium">{job.location}</p>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-sm font-medium text-gray-500">Posted</span>
                      <p className="text-gray-900 font-medium">{formatDate(job.createdAt)}</p>
                    </div>
                    {job.deadline && (
                      <div className="flex justify-between items-center py-2">
                        <span className="text-sm font-medium text-gray-500">Deadline</span>
                        <p className="text-gray-900 font-medium">{formatDate(job.deadline)}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Company Info Card */}
                <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    About {job.company}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Learn more about {job.company}'s mission, culture, and values. 
                    This company is looking for talented individuals to join their team.
                  </p>
                  <button className="w-full mt-4 bg-gray-100 text-gray-700 py-2.5 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                    View Company Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;