// src/components/ProfileModal.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';

const ProfileModal = ({ isOpen, onClose, user, onUpdate }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    role: '',
    workStatus: 'On Shift',
    profilePicture: null
  });
  
  const [previewImage, setPreviewImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Initialize form data when user data is available
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        role: user.role || '',
        workStatus: user.workStatus || 'On Shift',
        profilePicture: null
      });
      
      if (user.profilePicture) {
        setPreviewImage(user.profilePicture);
      }
    }
  }, [user]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        profilePicture: file
      }));
      
      // Create a preview of the selected image
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      // Create form data object for file upload
      const submitData = new FormData();
      submitData.append('firstName', formData.firstName);
      submitData.append('lastName', formData.lastName);
      submitData.append('phoneNumber', formData.phoneNumber);
      submitData.append('workStatus', formData.workStatus);
      
      if (formData.profilePicture) {
        submitData.append('profilePicture', formData.profilePicture);
      }
      
      // Send update request to the server - replace with your actual API endpoint
      const response = await axios.put('http://localhost:5000/api/users/profile', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Call the onUpdate callback with updated user data
      if (onUpdate && response.data) {
        onUpdate(response.data);
      }
      
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while updating your profile');
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl overflow-hidden">
        <div className="flex justify-between items-center bg-[#02245B] text-white px-6 py-4">
          <h2 className="text-xl font-semibold">Edit Profile</h2>
          <button 
            onClick={onClose}
            className="text-white hover:text-gray-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="flex flex-col md:flex-row md:space-x-8">
            {/* Left Column - Profile Picture */}
            <div className="md:w-1/4 flex flex-col items-center">
              <div className="relative w-32 h-32 mb-3">
                {previewImage ? (
                  <img 
                    src={previewImage} 
                    alt="Profile" 
                    className="w-32 h-32 rounded-full object-cover border-2 border-[#FF5E14]"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-[#02245B] flex items-center justify-center text-white text-3xl font-bold">
                    {formData.firstName?.charAt(0) || 'U'}
                  </div>
                )}
                <label htmlFor="profilePicture" className="absolute bottom-0 right-0 bg-[#FF5E14] text-white p-2 rounded-full cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                  </svg>
                </label>
                <input 
                  type="file" 
                  id="profilePicture" 
                  name="profilePicture" 
                  accept="image/*" 
                  onChange={handleFileChange} 
                  className="hidden"
                />
              </div>
              <p className="text-sm text-gray-500 text-center">Click the camera icon to change your profile picture</p>
              
              {/* Work Status */}
              <div className="mt-6 w-full">
                <label htmlFor="workStatus" className="block text-sm font-medium text-gray-700 mb-1">Work Status</label>
                <select
                  id="workStatus"
                  name="workStatus"
                  value={formData.workStatus}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF5E14] focus:border-transparent"
                >
                  <option value="On Shift">On Shift</option>
                  <option value="On Call">On Call</option>
                  <option value="End Shift">End Shift</option>
                </select>
              </div>
              
              {/* Status Indicator */}
              <div className="mt-4 flex items-center justify-center">
                <span className={`h-3 w-3 rounded-full ${
                  formData.workStatus === 'On Shift' ? 'bg-green-500' : 
                  formData.workStatus === 'On Call' ? 'bg-yellow-500' : 'bg-gray-400'
                } mr-2`}></span>
                <span className="text-sm text-gray-600">{formData.workStatus}</span>
              </div>
            </div>
            
            {/* Right Column - Form Fields */}
            <div className="md:w-3/4 mt-6 md:mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* First Name */}
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF5E14] focus:border-transparent"
                    required
                  />
                </div>
                
                {/* Last Name */}
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF5E14] focus:border-transparent"
                    required
                  />
                </div>
              
                {/* Email - Read Only */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    className="w-full border border-gray-200 bg-gray-100 rounded-md px-3 py-2 cursor-not-allowed"
                    disabled
                  />
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>
                
                {/* Phone Number */}
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF5E14] focus:border-transparent"
                  />
                </div>
                
                {/* Role - Read Only */}
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <input
                    type="text"
                    id="role"
                    name="role"
                    value={formData.role}
                    className="w-full border border-gray-200 bg-gray-100 rounded-md px-3 py-2 cursor-not-allowed"
                    disabled
                  />
                  <p className="text-xs text-gray-500 mt-1">Role cannot be changed</p>
                </div>
              </div>
              
              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
                  {error}
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-[#FF5E14] text-white rounded-md hover:bg-[#e05313] focus:outline-none focus:ring-2 focus:ring-[#FF5E14] focus:ring-offset-2"
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileModal;