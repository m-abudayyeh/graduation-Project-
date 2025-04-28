import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { X, Upload, Eye, EyeOff } from 'lucide-react';

const EmployeeForm = ({ employee, onClose, onSuccess }) => {
  // Check if we're editing or adding
  const isEditing = !!employee;
  
  // Initial form state
  const initialState = {
    firstName: employee?.firstName || '',
    lastName: employee?.lastName || '',
    email: employee?.email || '',
    phoneNumber: employee?.phoneNumber || '',
    password: '',
    confirmPassword: '',
    role: employee?.role || 'requester'
  };

  // Form state
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(employee?.profilePicture || null);
  
  // Current user state
  const [currentUser, setCurrentUser] = useState(null);
  
  // Fetch current user
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/auth/me', { withCredentials: true });
        console.log('Current user data:', res.data); // للتشخيص
        setCurrentUser(res.data.data);
      } catch (error) {
        console.error('Failed to fetch user data', error);
      }
    };
    
    fetchCurrentUser();
  }, []);

  // Auto-generate password when firstName changes
  useEffect(() => {
    if (!isEditing && formData.firstName && !formData.password) {
      const generatedPassword = `${formData.firstName}@123`;
      setFormData(prev => ({
        ...prev,
        password: generatedPassword,
        confirmPassword: generatedPassword
      }));
    }
  }, [formData.firstName, isEditing]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is changed
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setProfileImagePreview(URL.createObjectURL(file));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First Name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone Number is required';
    }
    
    if (!isEditing) {
      // Password validation only for new employees
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
      
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      let response;
      
      // Remove confirmPassword from data to be sent
      const { confirmPassword, ...dataToSend } = formData;
      
      // If editing and password is empty, remove it from data
      if (isEditing && !dataToSend.password) {
        delete dataToSend.password;
      }
      
      console.log('Submitting data:', dataToSend); // للتشخيص
      
      if (isEditing) {
        // Update existing employee
        response = await axios.put(`http://localhost:5000/api/users/${employee.id}`, dataToSend, { withCredentials: true });
        
        // If there's a new profile image, upload it
        if (profileImage) {
          const formData = new FormData();
          formData.append('profilePicture', profileImage);
          await axios.put(`http://localhost:5000/api/users/${employee.id}/profile-picture`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            },
            withCredentials: true
          });
        }
        
        toast.success('Employee updated successfully');
      } else {
        // Create new employee
        response = await axios.post('http://localhost:5000/api/users', dataToSend, { withCredentials: true });
        console.log('New employee response:', response.data); // للتشخيص
        
        // If there's a profile image, upload it
        if (profileImage && response.data && response.data.data && response.data.data.id) {
          const formData = new FormData();
          formData.append('profilePicture', profileImage);
          await axios.put(`http://localhost:5000/api/users/${response.data.data.id}/profile-picture`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            },
            withCredentials: true
          });
        }
        
        toast.success('Employee added successfully');
      }
      
      onSuccess(response.data.data);
    } catch (error) {
      console.error('Error in form submission:', error);
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">
            {isEditing ? 'Edit Employee' : 'Add New Employee'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          {/* Profile Image */}
          <div className="mb-6 flex flex-col items-center">
            <div className="mb-2 relative">
              {profileImagePreview ? (
                <img
                  src={profileImagePreview}
                  alt="Profile Preview"
                  className="h-24 w-24 rounded-full object-cover"
                />
              ) : (
                <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                  {formData.firstName && formData.lastName 
                    ? formData.firstName[0] + formData.lastName[0]
                    : 'Profile'}
                </div>
              )}
              <label
                htmlFor="profilePicture"
                className="absolute bottom-0 right-0 bg-[#FF5E14] text-white p-1 rounded-full cursor-pointer hover:bg-[#e65412]"
                title="Upload profile picture"
              >
                <Upload size={16} />
              </label>
            </div>
            <input
              type="file"
              id="profilePicture"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <label
              htmlFor="profilePicture"
              className="text-sm text-[#FF5E14] cursor-pointer hover:underline"
            >
              {isEditing ? 'Change profile picture' : 'Upload profile picture'}
            </label>
          </div>
          
          {/* First Name */}
          <div className="mb-4">
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
              First Name *
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${
                errors.firstName ? 'border-red-500' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF5E14] focus:border-transparent`}
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
            )}
          </div>
          
          {/* Last Name */}
          <div className="mb-4">
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
              Last Name *
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${
                errors.lastName ? 'border-red-500' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF5E14] focus:border-transparent`}
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
            )}
          </div>
          
          {/* Email */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF5E14] focus:border-transparent`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>
          
          {/* Phone Number */}
          <div className="mb-4">
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number *
            </label>
            <input
              type="text"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${
                errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF5E14] focus:border-transparent`}
            />
            {errors.phoneNumber && (
              <p className="mt-1 text-sm text-red-500">{errors.phoneNumber}</p>
            )}
          </div>
          
          {/* Role */}
          <div className="mb-4">
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
              Role *
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF5E14] focus:border-transparent"
            >
              <option value="admin">Admin</option>
              <option value="supervisor">Supervisor</option>
              <option value="technician">Technician</option>
              <option value="requester">Requester</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>
          
          {/* Password field - only required when adding a new employee */}
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password {!isEditing && '*'}
              {isEditing && <span className="text-xs text-gray-500"> (Leave blank to keep current)</span>}
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF5E14] focus:border-transparent`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password}</p>
            )}
            {!isEditing && formData.firstName && (
              <p className="mt-1 text-xs text-gray-500">
                Password auto-generated from first name. You can edit if needed.
              </p>
            )}
          </div>
          
          {/* Confirm Password field - only required when adding a new employee */}
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password {!isEditing && '*'}
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF5E14] focus:border-transparent`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
            )}
          </div>
          
          {/* Submit Buttons */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#FF5E14] text-white rounded-md hover:bg-[#e65412] disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Saving...' : isEditing ? 'Update Employee' : 'Add Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeForm;