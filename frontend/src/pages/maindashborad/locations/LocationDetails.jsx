// src/components/locations/LocationDetailsModal.jsx
import { useState, useEffect } from 'react';

const LocationDetailsModal = ({ 
  location, 
  onClose, 
  onEdit, 
  onDelete, 
  onPermanentDelete,
  onRestore,
  onUploadImage,
  setError,
  setSuccess
}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  
  // Add event listener to close modal when Escape key is pressed
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscapeKey);
    
    // Prevent scrolling on the body when modal is open
    document.body.style.overflow = 'hidden';
    
    // Cleanup function
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'auto';
    };
  }, [onClose]);
  
  // Close modal when clicking outside the content
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  
  const getlocationPictureUrl = (path) => {
    if (!path) return null;
    
    // Make sure we have a properly formatted path
    if (path.startsWith('http')) {
      return path;
    } else {
      // Ensure there's only one slash between server and path
      return `http://localhost:5000${path.startsWith('/') ? '' : '/'}${path}`;
    }
  };

  if (!location) {
    return null;
  }
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  // Handle file selection
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };
  
  // Upload image
  const handleUploadImage = async () => {
    if (!selectedFile) {
      setError('Please select an image file first');
      return;
    }
    
    try {
      setIsUploading(true);
      await onUploadImage(location.id, selectedFile);
      setSelectedFile(null);
      setIsUploading(false);
      setSuccess('Image uploaded successfully');
    } catch (error) {
      setIsUploading(false);
      console.error('Upload error:', error);
      setError('Failed to upload image. Please try again.');
    }
  };
  
  // Handle delete with custom confirmation dialog
  const handleDelete = () => {
    // Call the parent's onDelete which now has the custom confirmation dialog
    onDelete(location.id);
  };
  
  // Handle permanent delete with custom confirmation dialog
  const handlePermanentDelete = () => {
    // Call the parent's onPermanentDelete which now has the custom confirmation dialog
    onPermanentDelete(location.id);
  };
  
  // Handle restore
  const handleRestore = () => {
    onRestore(location.id);
  };
  
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto" 
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-white rounded-lg shadow-md overflow-hidden max-w-6xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-[#02245B]">
            Location Details
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3">
              <div className="mb-8">
                {location.image ? (
                  <img 
                    src={getlocationPictureUrl(location.image)}
                    alt={location.name} 
                    className="w-full h-64 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                    <svg className="h-20 w-20 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
                
                <div className="mt-6 flex items-center gap-3">
                  <input 
                    type="file" 
                    id="upload-image" 
                    className="hidden" 
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                  <label 
                    htmlFor="upload-image" 
                    className="cursor-pointer text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md border border-gray-300"
                  >
                    Change Image
                  </label>
                  {selectedFile && (
                    <button
                      onClick={handleUploadImage}
                      disabled={isUploading}
                      className="text-sm bg-[#02245B] hover:bg-blue-800 text-white px-4 py-2 rounded-md disabled:opacity-50"
                    >
                      {isUploading ? 'Uploading...' : 'Upload'}
                    </button>
                  )}
                </div>
              </div>
              
              {/* Status Section */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-700 mb-3">Status</h3>
                <div className="flex items-center">
                  <span className={`inline-flex h-4 w-4 rounded-full mr-3 ${
                    location.deletedAt ? 'bg-red-500' : 'bg-green-500'
                  }`}></span>
                  <span className="text-base text-gray-600">
                    {location.deletedAt ? 'Deleted' : 'Active'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="md:w-2/3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-base font-medium text-gray-500">Name</h3>
                  <p className="text-lg font-medium text-gray-900">{location.name}</p>
                </div>
                
                <div>
                  <h3 className="text-base font-medium text-gray-500">Address</h3>
                  <p className="text-lg font-medium text-gray-900">{location.address || 'N/A'}</p>
                </div>
                
                <div className="md:col-span-2">
                  <h3 className="text-base font-medium text-gray-500">Notes</h3>
                  <p className="text-lg text-gray-900">{location.notes || 'No notes available'}</p>
                </div>
                
                <div>
                  <h3 className="text-base font-medium text-gray-500">Created At</h3>
                  <p className="text-lg text-gray-900">{formatDate(location.createdAt)}</p>
                </div>
                
                <div>
                  <h3 className="text-base font-medium text-gray-500">Updated At</h3>
                  <p className="text-lg text-gray-900">{formatDate(location.updatedAt)}</p>
                </div>
                
                {location.deletedAt && (
                  <div>
                    <h3 className="text-base font-medium text-gray-500">Deleted At</h3>
                    <p className="text-lg text-gray-900">{formatDate(location.deletedAt)}</p>
                  </div>
                )}
              </div>
              
              <div className="mt-10 pt-6 border-t border-gray-200">
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={onEdit}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md border border-gray-300"
                  >
                    Edit
                  </button>
                  
                  {location.deletedAt ? (
                    <>
                      <button
                        onClick={handleRestore}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
                      >
                        Restore
                      </button>
                      <button
                        onClick={handlePermanentDelete}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
                      >
                        Permanently Delete
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={handleDelete}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationDetailsModal;