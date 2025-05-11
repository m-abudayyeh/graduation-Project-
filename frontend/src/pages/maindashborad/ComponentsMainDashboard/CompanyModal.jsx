import { useState, useEffect } from 'react';
import axios from 'axios';

const CompanyModal = ({ isOpen, onClose, user, company, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    address: '',
    website: '',
    logo: null,
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(null);
  const [imageSuccess, setImageSuccess] = useState(false);
  
  // Check if user is admin
  const isAdmin = user?.role === 'admin';
  
  // Calculate remaining days if subscription data exists
  const calculateRemainingDays = () => {
    if (!user?.company?.subscriptionEndDate) return null;
    
    const endDate = new Date(user.company.subscriptionEndDate);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const remainingDays = calculateRemainingDays();

  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name || '',
        email: company.email || '',
        phoneNumber: company.phoneNumber || '',
        address: company.address || '',
        website: company.website || '',
        logo: null,
      });
      if (company.logo) {
        setPreviewImage(company.logo);
      }
    }
  }, [company]);

  const handleChange = (e) => {
    // Only process changes if user is admin
    if (!isAdmin) return;
    
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    // Only process file changes if user is admin
    if (!isAdmin) return;
    
    const file = e.target.files[0];
    if (file) {
      // Reset image states
      setImageError(null);
      setImageSuccess(false);
      
      setFormData((prev) => ({
        ...prev,
        logo: file,
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
      
      // Automatically upload the image when selected
      handleImageUpload(file);
    }
  };

  const handleImageUpload = async (file) => {
    if (!file || !isAdmin) return;
    
    setImageLoading(true);
    setImageError(null);
    
    const imageFormData = new FormData();
    imageFormData.append('logo', file);
    
    try {
      const response = await axios.put(
        `http://localhost:5000/api/companies/${company.id}/logo`,
        imageFormData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true
        }
      );
      
      setImageSuccess(true);
      
      // If the update was successful and includes new logo URL
      if (response.data && response.data.data && response.data.data.logo) {
        // Update the preview with the actual URL from server
        setPreviewImage(response.data.data.logo);
        
        // Call the onUpdate if provided to update parent component
        if (onUpdate) {
          onUpdate({
            ...company,
            logo: response.data.data.logo
          });
        }
      }
    } catch (err) {
      setImageError(
        err.response?.data?.message ||
          'An error occurred while uploading company logo'
      );
      // Reset the form data for logo
      setFormData(prev => ({
        ...prev,
        logo: null
      }));
    } finally {
      setImageLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Only allow submission if user is admin
    if (!isAdmin) return;
    
    setIsLoading(true);
    setError(null);

    try {

      const companyData = {
        name: formData.name,
        email: formData.email, 
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        website: formData.website
      };

      const response = await axios.put(
        `http://localhost:5000/api/companies/${company.id}`,
        companyData,
        {
          withCredentials: true
        }
      );

      if (onUpdate && response.data) {
        const updatedData = response.data.data || response.data;
        
        // Preserve the logo in the update
        onUpdate({
          ...updatedData,
          logo: previewImage // Use the current preview image
        });
      }

      onClose();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'An error occurred while updating company information'
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  // Helper function to get the image URL
  const getImageUrl = () => {
    if (!company || !company.logo) return null;
    
    // Check if logo URL already contains the base URL
    if (company.logo.startsWith('http')) {
      return company.logo;
    }
    
    // Otherwise, prepend the base URL
    return `http://localhost:5000/${company.logo}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-md shadow-lg w-full max-w-3xl">
        {/* Header */}
        <div className="flex justify-between items-center bg-[#02245B] text-white px-4 py-3">
          <h2 className="text-lg font-medium flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            Company Profile
          </h2>
          <button 
            onClick={onClose} 
            className="text-white hover:text-gray-200"
            aria-label="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <div className="flex flex-col md:flex-row">
            {/* Left - Company Logo and Subscription Info */}
            <div className="md:w-1/3 md:pr-6">
              <div className="flex flex-col items-center">
                <div className="relative w-36 h-36 mb-2">
                  {previewImage || company?.logo ? (
                    <div className="relative">
                      <img
                        src={getImageUrl() ||previewImage  }
                        alt="Company Logo"
                        className="w-36 h-36 rounded-full object-cover border-2 border-[#FF5E14]"
                        onError={(e) => {
                          // Fallback if image fails to load
                          e.target.onerror = null;
                          e.target.src = '';
                          e.target.classList.add('bg-[#02245B]');
                          e.target.classList.add('flex');
                          e.target.classList.add('items-center');
                          e.target.classList.add('justify-center');
                          e.target.classList.add('text-white');
                          e.target.classList.add('text-4xl');
                          e.target.classList.add('font-bold');
                          e.target.textContent = formData.name?.charAt(0) || 'C';
                        }}
                      />
                      {imageLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                          <div className="animate-spin h-8 w-8 border-4 border-white border-t-transparent rounded-full"></div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-36 h-36 rounded-full bg-[#02245B] flex items-center justify-center text-white text-4xl font-bold">
                      {formData.name?.charAt(0) || 'C'}
                    </div>
                  )}
                  {isAdmin && (
                    <label
                      htmlFor="logo"
                      className="absolute bottom-2 right-2 p-2 rounded-full cursor-pointer bg-[#FF5E14] text-white"
                    >
                      {imageLoading ? (
                        <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                          <circle 
                            className="opacity-25" 
                            cx="12" 
                            cy="12" 
                            r="10" 
                            stroke="currentColor" 
                            strokeWidth="4"
                            fill="none"
                          ></circle>
                          <path 
                            className="opacity-75" 
                            fill="currentColor" 
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      )}
                    </label>
                  )}
                  <input
                    type="file"
                    id="logo"
                    name="logo"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={imageLoading || !isAdmin}
                  />
                </div>
                <p className="text-sm text-gray-500 text-center mb-4">
                  Click the camera icon to change company logo
                </p>
                
                {imageError && (
                  <div className="my-2 p-2 bg-red-100 text-red-700 rounded-md text-sm w-full">
                    {imageError}
                  </div>
                )}
                
                {imageSuccess && (
                  <div className="my-2 p-2 bg-green-100 text-green-700 rounded-md text-sm w-full">
                    Logo updated successfully
                  </div>
                )}

                {/* Subscription Information */}
                <div className="w-full mt-2">
                  <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
                    <h3 className="text-[#02245B] font-medium text-md mb-2 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                      Subscription Info
                    </h3>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <p className="text-sm font-medium text-gray-600">Status:</p>
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-md text-xs font-medium">
                          {user?.company?.subscriptionStatus || 'trial'}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <p className="text-sm font-medium text-gray-600">Plan:</p>
                        <p className="text-sm text-gray-800">{user?.company?.subscriptionType || 'none'}</p>
                      </div>
                      
                      {remainingDays !== null && (
                        <div>
                          <div className="flex justify-between items-center">
                            <p className="text-sm font-medium text-gray-600">Days Remaining:</p>
                            <p className={`text-sm font-medium ${remainingDays < 7 ? 'text-red-600' : 'text-gray-800'}`}>
                              {remainingDays} days
                            </p>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                            <div 
                              className="h-2 rounded-full bg-red-500" 
                              style={{ width: `${Math.min(100, (remainingDays / 30) * 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                      
                      {remainingDays !== null && remainingDays < 7 && (
                        <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-md text-xs">
                          <div className="flex items-start">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <span>Your subscription will expire soon. Please renew to avoid service interruption.</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Form Fields */}
            <div className="md:w-2/3 mt-4 md:mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-[#FF5E14]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full border ${isAdmin ? 'border-gray-300' : 'border-gray-200'} rounded-md px-3 py-2 ${
                      isAdmin 
                        ? 'focus:outline-none focus:ring-1 focus:ring-[#FF5E14] focus:border-[#FF5E14]' 
                        : 'bg-gray-50 cursor-not-allowed'
                    }`}
                    required
                    disabled={!isAdmin}
                    readOnly={!isAdmin}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-[#FF5E14]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full border ${isAdmin ? 'border-gray-300' : 'border-gray-200'} rounded-md px-3 py-2 ${
                      isAdmin 
                        ? 'focus:outline-none focus:ring-1 focus:ring-[#FF5E14] focus:border-[#FF5E14]' 
                        : 'bg-gray-50 cursor-not-allowed'
                    }`}
                    required
                    disabled={!isAdmin}
                    readOnly={!isAdmin}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-[#FF5E14]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className={`w-full border ${isAdmin ? 'border-gray-300' : 'border-gray-200'} rounded-md px-3 py-2 ${
                      isAdmin 
                        ? 'focus:outline-none focus:ring-1 focus:ring-[#FF5E14] focus:border-[#FF5E14]' 
                        : 'bg-gray-50 cursor-not-allowed'
                    }`}
                    disabled={!isAdmin}
                    readOnly={!isAdmin}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-[#FF5E14]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                    Website
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    className={`w-full border ${isAdmin ? 'border-gray-300' : 'border-gray-200'} rounded-md px-3 py-2 ${
                      isAdmin 
                        ? 'focus:outline-none focus:ring-1 focus:ring-[#FF5E14] focus:border-[#FF5E14]' 
                        : 'bg-gray-50 cursor-not-allowed'
                    }`}
                    placeholder="https://example.com"
                    disabled={!isAdmin}
                    readOnly={!isAdmin}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-[#FF5E14]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows="4"
                    className={`w-full border ${isAdmin ? 'border-gray-300' : 'border-gray-200'} rounded-md px-3 py-2 ${
                      isAdmin 
                        ? 'focus:outline-none focus:ring-1 focus:ring-[#FF5E14] focus:border-[#FF5E14]' 
                        : 'bg-gray-50 cursor-not-allowed'
                    }`}
                    disabled={!isAdmin}
                    readOnly={!isAdmin}
                  ></textarea>
                </div>
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
                  <div className="flex">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{error}</span>
                  </div>
                </div>
              )}

              {/* Info and Buttons */}
              <div className="flex items-center justify-between mt-6">
                <div className="text-xs text-gray-500 italic flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Changes will be applied immediately
                </div>
                
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Cancel
                  </button>
                  {isAdmin && (
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-4 py-2 bg-[#FF5E14] text-white rounded-md hover:bg-[#e05313] flex items-center"
                    >
                      {isLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Saving...
                        </>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Save Changes
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>
        
        {/* Footer */}
        <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-[#5F656F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {isAdmin ? 'You have full edit permissions.' : 'View only mode'}
          </div>
          <span>Last updated: {new Date().toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

export default CompanyModal;