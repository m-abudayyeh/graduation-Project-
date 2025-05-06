// src/components/Equipment/EquipmentForm.jsx
import { useState } from 'react';

const EquipmentForm = ({ 
  equipment, 
  onSubmit, 
  onClose, 
  onUploadImage,
  onUploadFile,
  categories,
  locations,
  statuses,
  setError,
  setSuccess 
}) => {
  const [formData, setFormData] = useState({
    name: equipment?.name || '',
    description: equipment?.description || '',
    model: equipment?.model || '',
    manufacturer: equipment?.manufacturer || '',
    serialNumber: equipment?.serialNumber || '',
    category: equipment?.category || '',
    locationId: equipment?.locationId || '',
    notes: equipment?.notes || '',
    status: equipment?.status || 'running',
    purchaseDate: equipment?.purchaseDate ? new Date(equipment.purchaseDate).toISOString().split('T')[0] : '',
    installationDate: equipment?.installationDate ? new Date(equipment.installationDate).toISOString().split('T')[0] : '',
    warranty: equipment?.warranty || '',
    lastMaintenanceDate: equipment?.lastMaintenanceDate ? new Date(equipment.lastMaintenanceDate).toISOString().split('T')[0] : '',
    nextMaintenanceDate: equipment?.nextMaintenanceDate ? new Date(equipment.nextMaintenanceDate).toISOString().split('T')[0] : ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [selectedDocFile, setSelectedDocFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(equipment?.image || null);
  const [newCategory, setNewCategory] = useState('');

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Handle file selection
  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImageFile(file);
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Handle doc file selection
  const handleDocFileChange = (e) => {
    setSelectedDocFile(e.target.files[0]);
  };
  
  // Add a new category
  const handleAddCategory = () => {
    if (newCategory.trim()) {
      setFormData({
        ...formData,
        category: newCategory.trim()
      });
      setNewCategory('');
    }
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      setError('Please enter the equipment name');
    }
    
    if (!formData.locationId) {
      newErrors.locationId = 'Location is required';
      setError('Please select a location');
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
      if (equipment) {
        // Update existing equipment
        result = await onSubmit(equipment.id, formData);
      } else {
        // Create new equipment
        result = await onSubmit(formData);
      }
      
      let equipmentId = result?.data?.id || equipment?.id;
      
      // If there's an image file to upload and we have an equipment ID
      if (selectedImageFile && equipmentId) {
        try {
          await onUploadImage(equipmentId, selectedImageFile);
        } catch (imageError) {
          console.error('Image upload error:', imageError);
          setError('Equipment saved but image upload failed');
        }
      }
      
      // If there's a doc file to upload and we have an equipment ID
      if (selectedDocFile && equipmentId) {
        try {
          await onUploadFile(equipmentId, selectedDocFile);
        } catch (fileError) {
          console.error('File upload error:', fileError);
          setError('Equipment saved but documentation file upload failed');
        }
      }
      
      setIsSubmitting(false);
      setSuccess('Equipment saved successfully');
      onClose();
    } catch (error) {
      setIsSubmitting(false);
      console.error('Form submission error:', error);
      setError('Failed to save equipment data');
    }
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-[#02245B]">
          {equipment ? 'Edit Equipment' : 'Add New Equipment'}
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
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-medium text-gray-700 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
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
                  placeholder="Enter equipment name"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="model">
                  Model
                </label>
                <input
                  type="text"
                  id="model"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                  placeholder="Enter model"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="manufacturer">
                  Manufacturer
                </label>
                <input
                  type="text"
                  id="manufacturer"
                  name="manufacturer"
                  value={formData.manufacturer}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                  placeholder="Enter manufacturer"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="serialNumber">
                  Serial Number
                </label>
                <input
                  type="text"
                  id="serialNumber"
                  name="serialNumber"
                  value={formData.serialNumber}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                  placeholder="Enter serial number"
                />
              </div>
            </div>
          </div>
          
          {/* Category and Location */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
              Category
            </label>
            <div className="flex gap-2">
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
              >
                <option value="">Select a category</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <div className="mt-2 flex gap-2">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Add new category"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
              />
              <button
                type="button"
                onClick={handleAddCategory}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md border border-gray-300"
              >
                Add
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="locationId">
              Location *
            </label>
            <select
              id="locationId"
              name="locationId"
              value={formData.locationId}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200 ${
                errors.locationId ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select a location</option>
              {locations.map((location) => (
                <option key={location.id} value={location.id}>{location.name}</option>
                
              ))}
            </select>
            {errors.locationId && <p className="text-red-500 text-xs mt-1">{errors.locationId}</p>}
          </div>
          
          {/* Status */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            >
              {statuses.map((status, index) => (
                <option key={index} value={status}>{status.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}</option>
              ))}
            </select>
          </div>
          
          {/* Dates */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-medium text-gray-700 mb-4 mt-6">Dates & Warranty</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="purchaseDate">
                  Purchase Date
                </label>
                <input
                  type="date"
                  id="purchaseDate"
                  name="purchaseDate"
                  value={formData.purchaseDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="installationDate">
                  Installation Date
                </label>
                <input
                  type="date"
                  id="installationDate"
                  name="installationDate"
                  value={formData.installationDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="warranty">
                  Warranty (months)
                </label>
                <input
                  type="number"
                  id="warranty"
                  name="warranty"
                  min="0"
                  value={formData.warranty}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                  placeholder="Enter warranty period in months"
                />
              </div>
            </div>
          </div>
          
          {/* Maintenance Dates */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-medium text-gray-700 mb-4">Maintenance Schedule</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastMaintenanceDate">
                  Last Maintenance Date
                </label>
                <input
                  type="date"
                  id="lastMaintenanceDate"
                  name="lastMaintenanceDate"
                  value={formData.lastMaintenanceDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nextMaintenanceDate">
                  Next Maintenance Date
                </label>
                <input
                  type="date"
                  id="nextMaintenanceDate"
                  name="nextMaintenanceDate"
                  value={formData.nextMaintenanceDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                />
              </div>
            </div>
          </div>
          
          {/* Description and Notes */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-medium text-gray-700 mb-4">Additional Information</h3>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                placeholder="Enter equipment description"
              ></textarea>
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
          </div>
          
          {/* Images and Files */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-medium text-gray-700 mb-4">Media</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
                  Equipment Image
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
                    onChange={handleImageFileChange}
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
                        setSelectedImageFile(null);
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
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="docFile">
                  Documentation File
                </label>
                <div className="flex items-center space-x-4">
                  {equipment?.file && !selectedDocFile && (
                    <span className="text-sm text-gray-600">
                      File attached
                    </span>
                  )}
                  {selectedDocFile && (
                    <span className="text-sm text-gray-600">
                      {selectedDocFile.name}
                    </span>
                  )}
                  <input
                    type="file"
                    id="docFile"
                    name="docFile"
                    onChange={handleDocFileChange}
                    className="hidden"
                  />
                  <label 
                    htmlFor="docFile" 
                    className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md border border-gray-300"
                  >
                    {equipment?.file ? 'Change File' : 'Upload File'}
                  </label>
                  {(selectedDocFile || equipment?.file) && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedDocFile(null);
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">Upload manuals, specifications, or other related documents</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
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
            {isSubmitting ? 'Saving...' : equipment ? 'Update Equipment' : 'Create Equipment'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EquipmentForm;