// src/pages/SubscriptionCancel.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const SubscriptionCancel = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center justify-center h-screen p-4 text-center">
      <div className="mb-6 text-yellow-500">
        <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd"></path>
        </svg>
      </div>
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Payment Cancelled</h1>
      <p className="text-lg text-gray-600 mb-6">Your subscription payment was cancelled. No charges were made.</p>
      <button
        onClick={() => navigate('/dashboard/subscription')}
        className="px-6 py-3 bg-[#FF5E14] text-white rounded-md hover:bg-[#e44d0e] transition-colors"
      >
        Return to Subscription Page
      </button>
    </div>
  );
};

export default SubscriptionCancel;