import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { jobService } from '../services/jobService';
import JobCard from '../components/JobCard';
import Loader from '../components/Loader';

const Home = () => {
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [stats, setStats] = useState({
    jobs: 0,
    companies: 0,
    seekers: 0
  });

  const statsRef = useRef(null);

  useEffect(() => {
    fetchFeaturedJobs();
    setupIntersectionObserver();
  }, []);

  const fetchFeaturedJobs = async () => {
    try {
      const payload = await jobService.getJobs({ limit: 6, featured: true });
      setFeaturedJobs(payload.jobs);
    } catch (error) {
      console.error('Error fetching featured jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupIntersectionObserver = () => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounters();
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }
  };

  const animateCounters = () => {
    const finalValues = {
      jobs: 10000,
      companies: 5000,
      seekers: 50000
    };

    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;

    Object.keys(finalValues).forEach((key) => {
      let current = 0;
      const increment = finalValues[key] / steps;

      const timer = setInterval(() => {
        current += increment;
        if (current >= finalValues[key]) {
          current = finalValues[key];
          clearInterval(timer);
        }
        setStats(prev => ({
          ...prev,
          [key]: Math.floor(current)
        }));
      }, stepDuration);
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm) params.append('search', searchTerm);
    if (searchLocation) params.append('location', searchLocation);
    
    window.location.href = `/jobs?${params.toString()}`;
  };

  const featuredCategories = [
    { name: 'Technology', icon: '💻', count: '2,340' },
    { name: 'Healthcare', icon: '🏥', count: '1,890' },
    { name: 'Finance', icon: '💰', count: '1,560' },
    { name: 'Marketing', icon: '📊', count: '1,230' },
    { name: 'Remote', icon: '🏠', count: '3,450' },
    { name: 'Engineering', icon: '⚙️', count: '1,980' }
  ];

  const topCompanies = [
    { name: 'TechCorp', logo: '🔷', jobs: '45' },
    { name: 'HealthPlus', logo: '➕', jobs: '32' },
    { name: 'FinancePro', logo: '💎', jobs: '28' },
    { name: 'MarketGuru', logo: '📈', jobs: '23' },
    { name: 'RemoteFirst', logo: '🌍', jobs: '67' },
    { name: 'BuildIt', logo: '🏗️', jobs: '39' }
  ];

  if (loading) {
    return <Loader text="Loading featured jobs..." />;
  }

  return (
    <div className="min-h-screen">
      {/* Enhanced Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-24 overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute inset-0">
          <div className="absolute -top-40 -right-32 w-96 h-96 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-indigo-500/20 rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500/10 rounded-full mix-blend-multiply filter blur-2xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Find Your
              <span className="block bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">
                Dream Job
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-12 text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Connect with top employers and discover opportunities that match your skills and aspirations
            </p>
            
            {/* Enhanced Search Form */}
            <form onSubmit={handleSearch} className="max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-2 border border-white/20 shadow-2xl">
                <div className="flex flex-col md:flex-row gap-2">
                  <div className="flex-1 relative">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="Job title, keywords, or company"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-6 py-5 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 border-0"
                    />
                  </div>
                  <div className="flex-1 relative">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="City, state, or remote"
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                      className="w-full pl-12 pr-6 py-5 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 border-0"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-8 py-5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2 min-w-[140px] justify-center"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Search Jobs
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Featured Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Popular Categories
            </h2>
            <p className="text-gray-600 text-lg">
              Explore jobs in high-demand fields
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {featuredCategories.map((category, index) => (
              <div
                key={category.name}
                className="bg-gray-50 hover:bg-blue-50 border border-gray-200 rounded-2xl p-6 text-center transition-all duration-200 hover:scale-105 hover:shadow-lg group cursor-pointer"
              >
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">
                  {category.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {category.count} jobs
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Stats Section */}
      <section ref={statsRef} className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-4xl font-bold text-gray-900 mb-2">
                {stats.jobs.toLocaleString()}+
              </h3>
              <p className="text-gray-600 font-medium">Active Jobs</p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-4xl font-bold text-gray-900 mb-2">
                {stats.companies.toLocaleString()}+
              </h3>
              <p className="text-gray-600 font-medium">Companies</p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <h3 className="text-4xl font-bold text-gray-900 mb-2">
                {stats.seekers.toLocaleString()}+
              </h3>
              <p className="text-gray-600 font-medium">Job Seekers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Top Companies Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Top Companies Hiring
            </h2>
            <p className="text-gray-600 text-lg">
              Join leading organizations across various industries
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {topCompanies.map((company) => (
              <div
                key={company.name}
                className="bg-gray-50 hover:bg-blue-50 border border-gray-200 rounded-2xl p-6 text-center transition-all duration-200 hover:scale-105 hover:shadow-lg group cursor-pointer"
              >
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">
                  {company.logo}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  {company.name}
                </h3>
                <p className="text-sm text-blue-600 font-medium">
                  {company.jobs} openings
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Featured Jobs
            </h2>
            <p className="text-gray-600 text-lg">
              Discover the latest opportunities from top companies
            </p>
          </div>

          {featuredJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredJobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No featured jobs available at the moment.</p>
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to="/jobs"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl font-bold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl inline-flex items-center gap-2"
            >
              View All Jobs
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-10 text-blue-100 max-w-2xl mx-auto">
            Join thousands of job seekers and employers who trust our platform to connect talent with opportunity
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl inline-flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Find Jobs
            </Link>
            <Link
              to="/register"
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold hover:bg-white hover:text-blue-600 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl inline-flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Post Jobs
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;