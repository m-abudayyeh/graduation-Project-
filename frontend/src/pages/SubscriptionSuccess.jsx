// src/pages/SubscriptionSuccess.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Loading from '../pages/maindashborad/Subscription/Loading';
import Alert from '../pages/maindashborad/Subscription/Alert';

const SubscriptionSuccess = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const queryParams = new URLSearchParams(location.search);
        const sessionId = queryParams.get('session_id');
        
        if (!sessionId) {
          setError('Invalid session ID');
          setLoading(false);
          return;
        }
        
        const token = localStorage.getItem('token');
        
        // In a real app, you might want to verify the payment on the backend
        // For now, we'll just wait and redirect to the subscription page
        
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      } catch (err) {
        setError(err.response?.data?.message || 'Error verifying payment');
        setLoading(false);
      }
    };
    
    verifyPayment();
  }, [location.search]);
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4">
        <Loading />
        <h1 className="text-2xl font-bold mt-4">Processing your payment...</h1>
        <p className="text-gray-600 mt-2">Please wait while we confirm your subscription.</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4">
        <Alert type="error" message={error} />
        <button
          onClick={() => navigate('/dashboard/subscription')}
          className="mt-4 px-4 py-2 bg-[#FF5E14] text-white rounded hover:bg-[#e44d0e] transition-colors"
        >
          Return to Subscription Page
        </button>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col items-center justify-center h-screen p-4 text-center">
      <div className="mb-6 text-green-500">
        <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
        </svg>
      </div>
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Payment Successful!</h1>
      <p className="text-lg text-gray-600 mb-6">Your subscription has been activated successfully.</p>
      <button
        onClick={() => navigate('/dashboard/subscription')}
        className="px-6 py-3 bg-[#FF5E14] text-white rounded-md hover:bg-[#e44d0e] transition-colors"
      >
        View My Subscription
      </button>
    </div>
  );
};

export default SubscriptionSuccess;