import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WorkOrders = ({ userId, onSuccess }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Fetch user data when component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/users/${userId}`, {
          withCredentials: true
        });
        
        const userData = response.data.data || response.data;
        setFormData({
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          phoneNumber: userData.phoneNumber || ''
        });
        
        setError(null);
      } catch (err) {
        setError('Failed to load user data. Please try again.');
        console.error('Error fetching user:', err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.phoneNumber.trim()) {
      setError('All fields are required');
      return;
    }
    
    try {
      setLoading(true);
      await axios.put(`http://localhost:5000/api/users/${userId}`, formData, {
        withCredentials: true
      });
      
      setSuccess(true);
      setError(null);
      
      // Call onSuccess callback if provided
      if (onSuccess && typeof onSuccess === 'function') {
        onSuccess();
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update profile';
      setError(errorMessage);
      console.error('Error updating user:', err);
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const handleReset = () => {
    setSuccess(false);
    setError(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">تعديل الملف الشخصي</h2>
      
      {success ? (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          <p>تم تحديث الملف الشخصي بنجاح!</p>
          <button 
            onClick={handleReset}
            className="mt-2 bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded text-sm"
          >
            تعديل مرة أخرى
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          <div>
            <label htmlFor="firstName" className="block text-gray-700 font-medium mb-1">
              الاسم الأول
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="أدخل الاسم الأول"
              dir="rtl"
            />
          </div>
          
          <div>
            <label htmlFor="lastName" className="block text-gray-700 font-medium mb-1">
              اسم العائلة
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="أدخل اسم العائلة"
              dir="rtl"
            />
          </div>
          
          <div>
            <label htmlFor="phoneNumber" className="block text-gray-700 font-medium mb-1">
              رقم الهاتف
            </label>
            <input
              type="text"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="أدخل رقم الهاتف"
              dir="rtl"
            />
          </div>
          
          <div className="flex justify-end space-x-4 pt-2">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none"
              disabled={loading}
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 focus:outline-none"
              disabled={loading}
            >
              {loading ? 'جاري التحديث...' : 'تحديث'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default WorkOrders;