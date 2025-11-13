import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Footer = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  const footerLinks = {
    jobSeekers: [
      { path: '/jobs', label: 'Browse Jobs' },
      { path: '/register', label: 'Create Account' },
      { path: '/profile', label: 'Manage Profile' },
      { path: '/career-advice', label: 'Career Advice' },
      { path: '/resume-builder', label: 'Resume Builder' }
    ],
    employers: [
      { path: '/employer/dashboard', label: 'Post Jobs' },
      { path: '/employer/register', label: 'Get Started' },
      { path: '/employer/dashboard', label: 'Manage Listings' },
      { path: '/employer/pricing', label: 'Pricing Plans' },
      { path: '/employer/resources', label: 'Employer Resources' }
    ],
    company: [
      { path: '/about', label: 'About Us' },
      { path: '/careers', label: 'Careers' },
      { path: '/press', label: 'Press' },
      { path: '/blog', label: 'Blog' },
      { path: '/contact', label: 'Contact' }
    ],
    support: [
      { path: '/help', label: 'Help Center' },
      { path: '/faq', label: 'FAQ' },
      { path: '/privacy', label: 'Privacy Policy' },
      { path: '/terms', label: 'Terms of Service' },
      { path: '/cookies', label: 'Cookie Policy' }
    ]
  };

  const socialLinks = [
    {
      name: 'LinkedIn',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
        </svg>
      ),
      url: '#'
    },
    {
      name: 'Twitter',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
        </svg>
      ),
      url: '#'
    },
    {
      name: 'Facebook',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
      url: '#'
    },
    {
      name: 'Instagram',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      ),
      url: '#'
    }
  ];

  return (
    <>
      {/* Mobile Menu Sheet */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Menu Panel */}
          <div className="absolute bottom-0 left-0 right-0 bg-gray-900 rounded-t-2xl p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-white">Quick Links</h3>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-gray-400 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Mobile Menu Links */}
            <div className="space-y-4">
              {Object.entries(footerLinks).map(([category, links]) => (
                <div key={category}>
                  <h4 className="text-blue-400 font-semibold mb-3 capitalize">
                    {category.replace(/([A-Z])/g, ' $1').trim()}
                  </h4>
                  <ul className="space-y-2 mb-6">
                    {links.map((link) => (
                      <li key={link.path}>
                        <Link
                          to={link.path}
                          className={`block py-2 px-3 rounded-lg transition-all duration-200 ${
                            isActiveLink(link.path)
                              ? 'bg-blue-600 text-white'
                              : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                          }`}
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  JobBoard
                </h3>
              </div>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Find your dream job or hire the best talent. Connect employers and job seekers
                in one modern, intuitive platform designed for success.
              </p>
              
              {/* Social Links */}
              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110 group"
                    aria-label={social.name}
                  >
                    <span className="group-hover:scale-110 transition-transform">
                      {social.icon}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* Job Seekers */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-white relative inline-block">
                For Job Seekers
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 transform scale-x-0 transition-transform duration-200 group-hover:scale-x-100"></span>
              </h4>
              <ul className="space-y-3">
                {footerLinks.jobSeekers.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className={`group flex items-center text-gray-300 hover:text-white transition-all duration-200 ${
                        isActiveLink(link.path) ? 'text-blue-400 font-medium' : ''
                      }`}
                    >
                      <span className={`relative ${
                        isActiveLink(link.path) 
                          ? 'after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-blue-400' 
                          : 'group-hover:after:absolute group-hover:after:bottom-0 group-hover:after:left-0 group-hover:after:w-full group-hover:after:h-0.5 group-hover:after:bg-white group-hover:after:transition-all group-hover:after:duration-200'
                      }`}>
                        {link.label}
                      </span>
                      {isActiveLink(link.path) && (
                        <svg className="w-4 h-4 ml-1 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Employers */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-white">For Employers</h4>
              <ul className="space-y-3">
                {footerLinks.employers.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className={`group flex items-center text-gray-300 hover:text-white transition-all duration-200 ${
                        isActiveLink(link.path) ? 'text-blue-400 font-medium' : ''
                      }`}
                    >
                      <span className={`relative ${
                        isActiveLink(link.path) 
                          ? 'after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-blue-400' 
                          : 'group-hover:after:absolute group-hover:after:bottom-0 group-hover:after:left-0 group-hover:after:w-full group-hover:after:h-0.5 group-hover:after:bg-white group-hover:after:transition-all group-hover:after:duration-200'
                      }`}>
                        {link.label}
                      </span>
                      {isActiveLink(link.path) && (
                        <svg className="w-4 h-4 ml-1 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company & Support */}
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold mb-4 text-white">Company</h4>
                <ul className="space-y-3">
                  {footerLinks.company.map((link) => (
                    <li key={link.path}>
                      <Link
                        to={link.path}
                        className={`group text-gray-300 hover:text-white transition-all duration-200 ${
                          isActiveLink(link.path) ? 'text-blue-400 font-medium' : ''
                        }`}
                      >
                        <span className={`relative ${
                          isActiveLink(link.path) 
                            ? 'after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-blue-400' 
                            : 'group-hover:after:absolute group-hover:after:bottom-0 group-hover:after:left-0 group-hover:after:w-full group-hover:after:h-0.5 group-hover:after:bg-white group-hover:after:transition-all group-hover:after:duration-200'
                        }`}>
                          {link.label}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-4 text-white">Support</h4>
                <ul className="space-y-3">
                  {footerLinks.support.map((link) => (
                    <li key={link.path}>
                      <Link
                        to={link.path}
                        className={`group text-gray-300 hover:text-white transition-all duration-200 ${
                          isActiveLink(link.path) ? 'text-blue-400 font-medium' : ''
                        }`}
                      >
                        <span className={`relative ${
                          isActiveLink(link.path) 
                            ? 'after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-blue-400' 
                            : 'group-hover:after:absolute group-hover:after:bottom-0 group-hover:after:left-0 group-hover:after:w-full group-hover:after:h-0.5 group-hover:after:bg-white group-hover:after:transition-all group-hover:after:duration-200'
                        }`}>
                          {link.label}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Dark Footer Band */}
        <div className="bg-gray-950 border-t border-gray-800">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex items-center space-x-6">
                <p className="text-gray-400 text-sm">
                  © 2024 JobBoard. All rights reserved.
                </p>
                <div className="flex space-x-4 text-sm">
                  <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">
                    Privacy
                  </Link>
                  <Link to="/terms" className="text-gray-400 hover:text-white transition-colors">
                    Terms
                  </Link>
                  <Link to="/cookies" className="text-gray-400 hover:text-white transition-colors">
                    Cookies
                  </Link>
                </div>
              </div>

              {/* Mobile Menu Trigger */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                Quick Links
              </button>

              <div className="hidden md:flex items-center space-x-4 text-sm text-gray-400">
                <span>Made with ❤️ for job seekers worldwide</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;