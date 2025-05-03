// src/components/locations/LocationForm.jsx
import { useState } from 'react';

const LocationForm = ({ 
  location, 
  onSubmit, 
  onClose, 
  onUploadImage,
  setError,
  setSuccess 
}) => {
  const [formData, setFormData] = useState({
    name: location?.name || '',
    address: location?.address || '',
    notes: location?.notes || ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(location?.image || null);
  
  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      setError('Please enter the location name');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      let result;
      if (location) {
        // Update existing location
        result = await onSubmit(location.id, formData);
      } else {
        // Create new location
        result = await onSubmit(formData);
      }
      
      // If there's a file to upload and we have a location ID
      if (selectedFile && result?.data?.id) {
        try {
          await onUploadImage(result.data.id, selectedFile);
          setSuccess('Location and image saved successfully');
        } catch (imageError) {
          setError('Location saved but image upload failed');
        }
      }
      
      setIsSubmitting(false);
      window.location.reload();
    } catch (error) {
      setIsSubmitting(false);
      console.error('Form submission error:', error);
      setError('Failed to save location data');
    }
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-[#02245B]">
          {location ? 'Edit Location' : 'Add New Location'}
        </h2>
        <button 
          type="button"
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200 ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter location name"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">
            Address
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            placeholder="Enter location address"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="notes">
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            placeholder="Enter any additional notes"
          ></textarea>
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
            Location Image
          </label>
          <div className="flex items-center space-x-4">
            {imagePreview && (
              <div className="w-16 h-16 rounded-md overflow-hidden">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            <label 
              htmlFor="image" 
              className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md border border-gray-300"
            >
              {imagePreview ? 'Change Image' : 'Upload Image'}
            </label>
            {imagePreview && (
              <button
                type="button"
                onClick={() => {
                  setSelectedFile(null);
                  setImagePreview(null);
                }}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">Supported formats: JPG, PNG, GIF</p>
        </div>
        
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-[#FF5E14] text-white rounded-md hover:bg-[#e05413] disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : location ? 'Update Location' : 'Create Location'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LocationForm;