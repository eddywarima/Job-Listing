import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const JobCard = ({ job, compact = false }) => {
  const [isHovered, setIsHovered] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1}d ago`;
    if (diffDays <= 30) return `${Math.floor(diffDays / 7)}w ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const truncateDescription = (description, maxLength = 150) => {
    if (!description) return '';
    if (description.length <= maxLength) return description;
    return description.substring(0, maxLength) + '...';
  };

  const getJobTypeColor = (type) => {
    const colors = {
      'Full-time': 'bg-green-100 text-green-800 border-green-200',
      'Part-time': 'bg-blue-100 text-blue-800 border-blue-200',
      'Contract': 'bg-purple-100 text-purple-800 border-purple-200',
      'Remote': 'bg-orange-100 text-orange-800 border-orange-200',
      'Internship': 'bg-pink-100 text-pink-800 border-pink-200',
    };
    return colors[type] || 'bg-gray-100 text-gray-800 border-gray-200';
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

  if (compact) {
    return (
      <div 
        className={`relative bg-white rounded-xl border border-gray-200 transition-all duration-300 group overflow-hidden ${
          isHovered ? 'shadow-xl border-blue-200 transform -translate-y-1' : 'shadow-sm hover:shadow-md'
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Shine Effect */}
        {isHovered && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 animate-shine" />
        )}

        <div className="relative p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors mb-1">
                {job.title}
              </h3>
              <p className="text-gray-600 text-sm truncate mb-1">{job.company}</p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  {job.location}
                </span>
                <span>•</span>
                <span>{formatDate(job.createdAt)}</span>
              </div>
            </div>
            <span className={`text-xs font-medium px-2 py-1 rounded-full border ${getJobTypeColor(job.type)} ml-2 flex-shrink-0`}>
              {job.type}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-1">
              {job.skills && job.skills.slice(0, 2).map((skill, index) => (
                <span
                  key={index}
                  className={`text-xs px-2 py-1 rounded-full border ${getSkillColor(index)}`}
                >
                  {skill}
                </span>
              ))}
              {job.skills && job.skills.length > 2 && (
                <span className="text-xs text-gray-500 px-2 py-1">
                  +{job.skills.length - 2}
                </span>
              )}
            </div>
            <Link
              to={`/jobs/${job._id}`}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1 group/link transition-colors"
            >
              View
              <svg className="w-4 h-4 transform group-hover/link:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`relative bg-white rounded-2xl border border-gray-200 transition-all duration-300 group overflow-hidden ${
        isHovered ? 'shadow-2xl border-blue-300 transform -translate-y-2' : 'shadow-lg hover:shadow-xl'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Shine Effect */}
      {isHovered && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent transform -skew-x-12 animate-shine z-10" />
      )}

      {/* Gradient Border Effect */}
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none`} />

      <div className="relative p-6 z-20">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center shadow-sm">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1 mb-1">
                  {job.title}
                </h3>
                <p className="text-gray-600 font-medium">{job.company}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                {job.location}
              </span>
              {job.salary && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    {job.salary}
                  </span>
                </>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className={`text-sm font-semibold px-3 py-1.5 rounded-full border-2 ${getJobTypeColor(job.type)}`}>
              {job.type}
            </span>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {formatDate(job.createdAt)}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-700 mb-6 leading-relaxed line-clamp-3">
          {truncateDescription(job.description, 120)}
        </p>

        {/* Skills and CTA */}
        <div className="flex justify-between items-center">
          <div className="flex flex-wrap gap-2">
            {job.skills && job.skills.slice(0, 4).map((skill, index) => (
              <span
                key={index}
                className={`text-sm px-3 py-1.5 rounded-full border font-medium transition-all duration-200 group-hover:scale-105 ${getSkillColor(index)}`}
              >
                {skill}
              </span>
            ))}
            {job.skills && job.skills.length > 4 && (
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full border border-gray-200">
                +{job.skills.length - 4} more
              </span>
            )}
          </div>

          <Link
            to={`/jobs/${job._id}`}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform group-hover:scale-105 flex items-center gap-2"
          >
            View Details
            <svg className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>

      <style jsx>{`
        @keyframes shine {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(200%) skewX(-12deg); }
        }
        .animate-shine {
          animation: shine 1.5s ease-in-out;
        }
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default JobCard;