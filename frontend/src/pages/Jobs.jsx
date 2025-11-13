import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { jobService } from '../services/jobService';
import JobCard from '../components/JobCard';
import Loader from '../components/Loader';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    location: searchParams.get('location') || '',
    type: searchParams.get('type') || '',
    experience: searchParams.get('experience') || '',
    salary: searchParams.get('salary') || ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0
  });
  const [expandedSections, setExpandedSections] = useState({
    keywords: true,
    location: true,
    jobType: true,
    experience: true,
    salary: true
  });

  useEffect(() => {
    fetchJobs();
  }, [searchParams]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = Object.fromEntries(searchParams);
      const response = await jobService.getJobs(params);
      
      setJobs(response.data.jobs);
      setPagination({
        page: response.data.page,
        limit: response.data.limit,
        total: response.data.total,
        totalPages: response.data.totalPages
      });
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      }
    });
    
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      location: '',
      type: '',
      experience: '',
      salary: ''
    });
    setSearchParams({});
  };

  const removeFilter = (filterName) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: ''
    }));
    const newParams = new URLSearchParams(searchParams);
    newParams.delete(filterName);
    setSearchParams(newParams);
  };

  const handlePageChange = (newPage) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage);
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const activeFilters = Object.entries(filters).filter(([_, value]) => value);

  // Skeleton loader component
  const JobCardSkeleton = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-32"></div>
            <div className="h-3 bg-gray-200 rounded w-24"></div>
          </div>
        </div>
        <div className="w-6 h-6 bg-gray-200 rounded"></div>
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-5 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="h-6 bg-gray-200 rounded-full w-20"></div>
        <div className="h-6 bg-gray-200 rounded-full w-16"></div>
        <div className="h-6 bg-gray-200 rounded-full w-24"></div>
      </div>
      <div className="flex justify-between items-center">
        <div className="h-4 bg-gray-200 rounded w-20"></div>
        <div className="h-9 bg-gray-200 rounded-lg w-24"></div>
      </div>
    </div>
  );

  if (loading && jobs.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </div>
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-1/4">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8 space-y-6">
                {[1, 2, 3, 4, 5].map((item) => (
                  <div key={item} className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:w-3/4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Array.from({ length: 6 }).map((_, index) => (
                  <JobCardSkeleton key={index} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Discover Your Dream Job
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore {pagination.total} opportunities that match your skills and aspirations
          </p>
        </div>

        {/* Active Filters Chips */}
        {activeFilters.length > 0 && (
          <div className="mb-6 bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Active Filters:</span>
              <button
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear All
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {activeFilters.map(([key, value]) => (
                <div
                  key={key}
                  className="inline-flex items-center px-3 py-1.5 rounded-full bg-blue-100 text-blue-800 text-sm font-medium"
                >
                  <span className="capitalize">{key}: {value}</span>
                  <button
                    onClick={() => removeFilter(key)}
                    className="ml-2 hover:text-blue-600 focus:outline-none"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Filters</h3>
                {activeFilters.length > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Clear All
                  </button>
                )}
              </div>
              
              <form onSubmit={handleSearch} className="space-y-6">
                {/* Keywords Section */}
                <div className="border-b border-gray-200 pb-4">
                  <button
                    type="button"
                    onClick={() => toggleSection('keywords')}
                    className="flex items-center justify-between w-full text-left"
                  >
                    <span className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                      Keywords
                    </span>
                    <svg 
                      className={`w-4 h-4 text-gray-500 transform transition-transform ${
                        expandedSections.keywords ? 'rotate-180' : ''
                      }`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {expandedSections.keywords && (
                    <div className="mt-3">
                      <div className="relative">
                        <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" 
                             fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                          type="text"
                          name="search"
                          value={filters.search}
                          onChange={handleFilterChange}
                          placeholder="Job title, keywords, company..."
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Search by job title, skills, or company</p>
                    </div>
                  )}
                </div>

                {/* Location Section */}
                <div className="border-b border-gray-200 pb-4">
                  <button
                    type="button"
                    onClick={() => toggleSection('location')}
                    className="flex items-center justify-between w-full text-left"
                  >
                    <span className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                      Location
                    </span>
                    <svg 
                      className={`w-4 h-4 text-gray-500 transform transition-transform ${
                        expandedSections.location ? 'rotate-180' : ''
                      }`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {expandedSections.location && (
                    <div className="mt-3">
                      <div className="relative">
                        <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" 
                             fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <input
                          type="text"
                          name="location"
                          value={filters.location}
                          onChange={handleFilterChange}
                          placeholder="City, state, or remote..."
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Job Type Section */}
                <div className="border-b border-gray-200 pb-4">
                  <button
                    type="button"
                    onClick={() => toggleSection('jobType')}
                    className="flex items-center justify-between w-full text-left"
                  >
                    <span className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                      Job Type
                    </span>
                    <svg 
                      className={`w-4 h-4 text-gray-500 transform transition-transform ${
                        expandedSections.jobType ? 'rotate-180' : ''
                      }`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {expandedSections.jobType && (
                    <div className="mt-3">
                      <div className="relative">
                        <select
                          name="type"
                          value={filters.type}
                          onChange={handleFilterChange}
                          className="w-full pl-3 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none transition-all"
                        >
                          <option value="">All Job Types</option>
                          <option value="Full-time">Full-time</option>
                          <option value="Part-time">Part-time</option>
                          <option value="Contract">Contract</option>
                          <option value="Remote">Remote</option>
                          <option value="Internship">Internship</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Experience Section */}
                <div className="border-b border-gray-200 pb-4">
                  <button
                    type="button"
                    onClick={() => toggleSection('experience')}
                    className="flex items-center justify-between w-full text-left"
                  >
                    <span className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                      Experience
                    </span>
                    <svg 
                      className={`w-4 h-4 text-gray-500 transform transition-transform ${
                        expandedSections.experience ? 'rotate-180' : ''
                      }`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {expandedSections.experience && (
                    <div className="mt-3">
                      <div className="relative">
                        <select
                          name="experience"
                          value={filters.experience}
                          onChange={handleFilterChange}
                          className="w-full pl-3 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none transition-all"
                        >
                          <option value="">All Experience Levels</option>
                          <option value="Entry Level">Entry Level</option>
                          <option value="Mid Level">Mid Level</option>
                          <option value="Senior Level">Senior Level</option>
                          <option value="Executive">Executive</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Salary Section */}
                <div className="border-b border-gray-200 pb-4">
                  <button
                    type="button"
                    onClick={() => toggleSection('salary')}
                    className="flex items-center justify-between w-full text-left"
                  >
                    <span className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                      Salary Range
                    </span>
                    <svg 
                      className={`w-4 h-4 text-gray-500 transform transition-transform ${
                        expandedSections.salary ? 'rotate-180' : ''
                      }`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {expandedSections.salary && (
                    <div className="mt-3">
                      <div className="relative">
                        <select
                          name="salary"
                          value={filters.salary}
                          onChange={handleFilterChange}
                          className="w-full pl-3 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none transition-all"
                        >
                          <option value="">All Salary Ranges</option>
                          <option value="0-30000">$0 - $30,000</option>
                          <option value="30000-50000">$30,000 - $50,000</option>
                          <option value="50000-75000">$50,000 - $75,000</option>
                          <option value="75000-100000">$75,000 - $100,000</option>
                          <option value="100000+">$100,000+</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Annual salary in USD</p>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all shadow-md hover:shadow-lg"
                >
                  Apply Filters
                </button>
              </form>
            </div>
          </div>

          {/* Jobs List */}
          <div className="lg:w-3/4">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Array.from({ length: 6 }).map((_, index) => (
                  <JobCardSkeleton key={index} />
                ))}
              </div>
            ) : jobs.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {jobs.map((job) => (
                    <JobCard key={job._id} job={job} />
                  ))}
                </div>

                {/* Enhanced Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="mt-8">
                    <nav className="flex items-center justify-between border-t border-gray-200 px-4 sm:px-0">
                      <div className="flex flex-1 w-0">
                        <button
                          onClick={() => handlePageChange(pagination.page - 1)}
                          disabled={pagination.page === 1}
                          className="inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                          <span className="ml-1 hidden sm:inline">Previous</span>
                        </button>
                      </div>
                      
                      <div className="hidden md:flex">
                        {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                          let pageNum;
                          if (pagination.totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (pagination.page <= 3) {
                            pageNum = i + 1;
                          } else if (pagination.page >= pagination.totalPages - 2) {
                            pageNum = pagination.totalPages - 4 + i;
                          } else {
                            pageNum = pagination.page - 2 + i;
                          }

                          return (
                            <button
                              key={pageNum}
                              onClick={() => handlePageChange(pageNum)}
                              className={`inline-flex items-center px-4 py-2 text-sm font-medium border transition-colors ${
                                pageNum === pagination.page
                                  ? 'bg-blue-600 text-white border-blue-600'
                                  : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-50'
                              } ${pageNum === 1 ? 'rounded-l-lg' : ''} ${
                                pageNum === pagination.totalPages ? 'rounded-r-lg' : ''
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                      </div>

                      <div className="flex justify-end flex-1 w-0">
                        <button
                          onClick={() => handlePageChange(pagination.page + 1)}
                          disabled={pagination.page === pagination.totalPages}
                          className="inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <span className="mr-1 hidden sm:inline">Next</span>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    </nav>
                    
                    {/* Mobile pagination info */}
                    <div className="mt-4 text-center md:hidden">
                      <p className="text-sm text-gray-700">
                        Page <span className="font-medium">{pagination.page}</span> of{' '}
                        <span className="font-medium">{pagination.totalPages}</span>
                      </p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="max-w-md mx-auto">
                  <div className="w-48 h-48 mx-auto mb-6 text-gray-300">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">No jobs found</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    We couldn't find any opportunities matching your criteria. Try adjusting your filters 
                    or explore different search terms to discover more opportunities.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                      onClick={clearFilters}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
                    >
                      Clear All Filters
                    </button>
                    <Link
                      to="/jobs"
                      className="bg-white text-gray-700 px-6 py-3 rounded-lg font-semibold border border-gray-300 hover:bg-gray-50 transition-all"
                    >
                      Browse All Jobs
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jobs;