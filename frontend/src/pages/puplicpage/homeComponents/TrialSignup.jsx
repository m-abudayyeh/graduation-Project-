// src/components/home/TrialSignup.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const TrialSignup = () => {
  return (
    <section className="trial-signup py-16 bg-[#FF5E14] text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-2/3 mb-8 md:mb-0">
            <h2 className="text-3xl font-bold mb-4">Ready to Streamline Your Factory Maintenance?</h2>
            <p className="text-xl opacity-90">
              Start your 7-day free trial today. No credit card required.
            </p>
            <ul className="mt-4 space-y-2">
              <li className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
                <span>Full access to all features</span>
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
                <span>Easy setup process</span>
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
                <span>Technical support included</span>
              </li>
            </ul>
          </div>
          
          <div className="md:w-1/3">
            <div className="bg-white text-[#02245B] p-8 rounded-lg shadow-xl">
              <h3 className="text-2xl font-bold mb-6 text-center">Start Your Free Trial</h3>
              
              <form className="space-y-4">
                <div>
                  <label htmlFor="company-name" className="block text-sm font-medium text-[#5F656F] mb-1">Company Name</label>
                  <input 
                    type="text" 
                    id="company-name" 
                    placeholder="Your company name" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5E14] focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[#5F656F] mb-1">Email Address</label>
                  <input 
                    type="email" 
                    id="email" 
                    placeholder="you@company.com" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5E14] focus:border-transparent"
                  />
                </div>
                
                <Link 
                  to="/register" 
                  className="block w-full bg-[#FF5E14] hover:bg-[#e65512] text-white font-bold py-3 px-4 rounded-lg text-center transition"
                >
                  Start 7-Day Free Trial
                </Link>
                
                <p className="text-xs text-center text-[#5F656F] mt-4">
                  By signing up, you agree to our Terms of Service and Privacy Policy.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrialSignup;