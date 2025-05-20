// src/pages/maindashborad/WorkOrders/WorkOrderImagesSection.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Alert from './Alert';

const WorkOrderImagesSection = ({ workOrder }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [showImageUploadForm, setShowImageUploadForm] = useState(false);
  const [expandedImage, setExpandedImage] = useState(null);
  const [images, setImages] = useState(workOrder?.images || []);

  // Reset success message after delay
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  // Handle ESC to close expanded image
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setExpandedImage(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle file selection
  const handleFileChange = (e) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);

      const oversized = files.filter(file => file.size > 5 * 1024 * 1024);
      if (oversized.length > 0) {
        setError('Each file must be 5MB or less.');
        return;
      }

      if (files.length > 5) {
        setError('You can upload up to 5 images at a time.');
        return;
      }

      setSelectedFiles(files);
    }
  };

  // Upload images
  const handleUploadImages = async (e) => {
    e.preventDefault();

    if (selectedFiles.length === 0) {
      setError('Please select at least one image to upload');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    selectedFiles.forEach(file => {
      formData.append('images', file);
    });

    try {
      const response = await axios.post(`http://localhost:5000/api/work-orders/${workOrder.id}/images`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data && response.data.data) {
        setSuccess('Images uploaded successfully');
        setSelectedFiles([]);
        setShowImageUploadForm(false);
        setImages(response.data.data.images || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error uploading images');
      console.error('Error uploading images:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-[#02245B]">Images</h3>
        <button
          onClick={() => setShowImageUploadForm(!showImageUploadForm)}
          className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-[#02245B] hover:bg-[#021d4a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#02245B]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
          </svg>
          {showImageUploadForm ? 'Cancel' : 'Upload Images'}
        </button>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} />}

      {/* Image Upload Form */}
      {showImageUploadForm && (
        <div className="mb-4 bg-gray-50 p-4 rounded-md">
          <form onSubmit={handleUploadImages}>
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Images (up to 5 files, max 5MB each)
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-[#02245B] file:text-white hover:file:bg-[#021d4a]"
                required
              />
            </div>

            {selectedFiles.length > 0 && (
              <div className="mb-3">
                <p className="text-sm text-gray-500 mb-2">Selected Files:</p>
                <ul className="text-sm text-gray-700 space-y-1 ml-4 list-disc">
                  {selectedFiles.map((file, index) => (
                    <li key={index}>
                      {file.name} ({(file.size / 1024).toFixed(2)} KB)
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#FF5E14] hover:bg-[#e05413] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF5E14]"
              >
                {loading ? (
                  <>
                    <span className="animate-spin inline-block h-4 w-4 mr-2 border-t-2 border-b-2 border-white rounded-full"></span>
                    Uploading...
                  </>
                ) : 'Upload'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Images Gallery */}
      {images.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {images.map((image, index) => (
            <div key={index} className="group relative">
              <img
                src={image}
                alt={`Work order image ${index + 1}`}
                className="h-32 w-full object-cover rounded-md cursor-pointer"
                onClick={() => setExpandedImage(image)}
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-200 rounded-md"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-sm text-gray-500 italic">
          No images uploaded for this work order yet.
        </div>
      )}

      {/* Image Modal */}
      {expandedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4"
          onClick={() => setExpandedImage(null)}
        >
          <div 
            className="relative max-w-4xl max-h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-0 right-0 -mt-10 -mr-10 bg-transparent text-white hover:text-gray-300"
              onClick={() => setExpandedImage(null)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img 
              src={expandedImage} 
              alt="Expanded work order image"
              className="max-h-[80vh] max-w-full rounded-lg object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkOrderImagesSection;
