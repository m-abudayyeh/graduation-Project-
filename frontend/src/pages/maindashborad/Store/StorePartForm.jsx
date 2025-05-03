// src/components/storeParts/StorePartForm.jsx
import { useState } from 'react';

const StorePartForm = ({ 
  storePart, 
  onSubmit, 
  onClose, 
  onUploadImage,
  onUploadFile,
  categories,
  setError,
  setSuccess 
}) => {
  const [formData, setFormData] = useState({
    name: storePart?.name || '',
    partNumber: storePart?.partNumber || '',
    category: storePart?.category || '',
    location: storePart?.location || '',
    description: storePart?.description || '',
    quantity: storePart?.quantity || 0,
    notes: storePart?.notes || ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [selectedDocFile, setSelectedDocFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(storePart?.image || null);
  const [newCategory, setNewCategory] = useState('');
  
  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle quantity as a number
    if (name === 'quantity') {
      setFormData({
        ...formData,
        [name]: parseInt(value) || 0
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
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
      setError('Please enter the part name');
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
      if (storePart) {
        // Update existing store part
        result = await onSubmit(storePart.id, formData);
      } else {
        // Create new store part
        result = await onSubmit(formData);
      }
      
      let partId = result?.data?.id || storePart?.id;
      
      // If there's an image file to upload and we have a part ID
      if (selectedImageFile && partId) {
        try {
          await onUploadImage(partId, selectedImageFile);
        } catch (imageError) {
          console.error('Image upload error:', imageError);
          setError('Part saved but image upload failed');
        }
      }
      
      // If there's a doc file to upload and we have a part ID
      if (selectedDocFile && partId) {
        try {
          await onUploadFile(partId, selectedDocFile);
        } catch (fileError) {
          console.error('File upload error:', fileError);
          setError('Part saved but documentation file upload failed');
        }
      }
      
      setIsSubmitting(false);
      setSuccess('Store part saved successfully');
      onClose();
    } catch (error) {
      setIsSubmitting(false);
      console.error('Form submission error:', error);
      setError('Failed to save store part data');
    }
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-[#02245B]">
          {storePart ? 'Edit Store Part' : 'Add New Store Part'}
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
              placeholder="Enter part name"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="partNumber">
              Part Number
            </label>
            <input
              type="text"
              id="partNumber"
              name="partNumber"
              value={formData.partNumber}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
              placeholder="Enter part number"
            />
          </div>
          
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
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="location">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
              placeholder="Enter storage location"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="quantity">
              Quantity
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              min="0"
              value={formData.quantity}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
              placeholder="Enter quantity"
            />
          </div>
        </div>
        
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
            placeholder="Enter part description"
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
              Part Image
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
              {storePart?.file && !selectedDocFile && (
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
                {storePart?.file ? 'Change File' : 'Upload File'}
              </label>
              {(selectedDocFile || storePart?.file) && (
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
            {isSubmitting ? 'Saving...' : storePart ? 'Update Part' : 'Create Part'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StorePartForm;