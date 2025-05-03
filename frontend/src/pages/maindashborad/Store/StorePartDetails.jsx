// src/components/storeParts/StorePartDetails.jsx
import { useState, useEffect } from 'react';

const StorePartDetailsModal = ({ 
  storePart, 
  onClose, 
  onEdit, 
  onDelete,
  onUpdateQuantity,
  onUploadImage,
  onUploadFile,
  setError,
  setSuccess
}) => {
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [selectedDocFile, setSelectedDocFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [quantityToUpdate, setQuantityToUpdate] = useState(1);
  const [updateAction, setUpdateAction] = useState('add');
  
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
  
  const getImageUrl = (path) => {
    if (!path) return null;
    
    // Make sure we have a properly formatted path
    if (path.startsWith('http')) {
      return path;
    } else {
      // Ensure there's only one slash between server and path
      return `http://localhost:5000${path.startsWith('/') ? '' : '/'}${path}`;
    }
  };

  const getFileUrl = (path) => {
    if (!path) return null;
    
    if (path.startsWith('http')) {
      return path;
    } else {
      return `http://localhost:5000${path.startsWith('/') ? '' : '/'}${path}`;
    }
  };

  if (!storePart) {
    return null;
  }
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  // Handle image file selection
  const handleImageFileChange = (e) => {
    setSelectedImageFile(e.target.files[0]);
  };
  
  // Handle doc file selection
  const handleDocFileChange = (e) => {
    setSelectedDocFile(e.target.files[0]);
  };
  
  // Upload image
  const handleUploadImage = async () => {
    if (!selectedImageFile) {
      setError('Please select an image file first');
      return;
    }
    
    try {
      setIsUploading(true);
      await onUploadImage(storePart.id, selectedImageFile);
      setSelectedImageFile(null);
      setIsUploading(false);
      setSuccess('Image uploaded successfully');
    } catch (error) {
      setIsUploading(false);
      console.error('Upload error:', error);
      setError('Failed to upload image. Please try again.');
    }
  };
  
  // Upload documentation file
  const handleUploadFile = async () => {
    if (!selectedDocFile) {
      setError('Please select a file first');
      return;
    }
    
    try {
      setIsUploading(true);
      await onUploadFile(storePart.id, selectedDocFile);
      setSelectedDocFile(null);
      setIsUploading(false);
      setSuccess('Documentation file uploaded successfully');
    } catch (error) {
      setIsUploading(false);
      console.error('Upload error:', error);
      setError('Failed to upload file. Please try again.');
    }
  };
  
  // Handle quantity update
  const handleQuantityUpdate = async () => {
    if (quantityToUpdate <= 0) {
      setError('Quantity must be greater than zero');
      return;
    }
    
    try {
      await onUpdateQuantity(storePart.id, quantityToUpdate, updateAction);
      setSuccess(`Quantity ${updateAction === 'add' ? 'added' : 'subtracted'} successfully`);
    } catch (error) {
      console.error('Quantity update error:', error);
      setError('Failed to update quantity. Please try again.');
    }
  };
  
  // Handle delete
  const handleDelete = () => {
    onDelete(storePart.id);
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
            Store Part Details
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
                {storePart.image ? (
                  <img 
                    src={getImageUrl(storePart.image)}
                    alt={storePart.name} 
                    className="w-full h-64 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                    </svg>
                  </div>
                )}
                
                <div className="mt-6 flex items-center gap-3">
                  <input 
                    type="file" 
                    id="upload-image" 
                    className="hidden" 
                    onChange={handleImageFileChange}
                    accept="image/*"
                  />
                  <label 
                    htmlFor="upload-image" 
                    className="cursor-pointer text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md border border-gray-300"
                  >
                    Change Image
                  </label>
                  {selectedImageFile && (
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
              
              {/* Documentation File Section */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-700 mb-3">Documentation</h3>
                {storePart.file ? (
                  <div className="flex flex-col gap-2">
                    <a 
                      href={getFileUrl(storePart.file)} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      View Documentation
                    </a>
                  </div>
                ) : (
                  <p className="text-gray-500">No documentation file attached</p>
                )}
                
                <div className="mt-4 flex items-center gap-3">
                  <input 
                    type="file" 
                    id="upload-doc" 
                    className="hidden" 
                    onChange={handleDocFileChange}
                  />
                  <label 
                    htmlFor="upload-doc" 
                    className="cursor-pointer text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md border border-gray-300"
                  >
                    {storePart.file ? 'Change File' : 'Upload File'}
                  </label>
                  {selectedDocFile && (
                    <button
                      onClick={handleUploadFile}
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
                    storePart.isDeleted ? 'bg-red-500' : 'bg-green-500'
                  }`}></span>
                  <span className="text-base text-gray-600">
                    {storePart.isDeleted ? 'Deleted' : 'Active'}
                  </span>
                </div>
              </div>
              
              {/* Quantity Management Section */}
              <div className="mb-8 p-4 bg-gray-50 rounded-md">
                <h3 className="text-lg font-medium text-gray-700 mb-3">Quantity Management</h3>
                <div className="text-xl font-semibold text-[#02245B] mb-4">
                  Current Stock: {storePart.quantity}
                </div>
                
                <div className="flex flex-col gap-3">
                  <div className="flex gap-2">
                    <input 
                      type="number" 
                      min="1" 
                      value={quantityToUpdate}
                      onChange={(e) => setQuantityToUpdate(parseInt(e.target.value))}
                      className="w-20 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#02245B]"
                    />
                    
                    <select 
                      value={updateAction}
                      onChange={(e) => setUpdateAction(e.target.value)}
                      className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#02245B]"
                    >
                      <option value="add">Add</option>
                      <option value="subtract">Remove</option>
                      <option value="set">Set to</option>
                    </select>
                    
                    <button
                      onClick={handleQuantityUpdate}
                      className="px-3 py-1 bg-[#02245B] hover:bg-blue-800 text-white rounded-md"
                    >
                      Update
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="md:w-2/3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-base font-medium text-gray-500">Name</h3>
                  <p className="text-lg font-medium text-gray-900">{storePart.name}</p>
                </div>
                
                <div>
                  <h3 className="text-base font-medium text-gray-500">Part Number</h3>
                  <p className="text-lg font-medium text-gray-900">{storePart.partNumber || 'N/A'}</p>
                </div>
                
                <div>
                  <h3 className="text-base font-medium text-gray-500">Category</h3>
                  <p className="text-lg font-medium text-gray-900">{storePart.category || 'N/A'}</p>
                </div>
                
                <div>
                  <h3 className="text-base font-medium text-gray-500">Location</h3>
                  <p className="text-lg font-medium text-gray-900">{storePart.location || 'N/A'}</p>
                </div>
                
                <div className="md:col-span-2">
                  <h3 className="text-base font-medium text-gray-500">Description</h3>
                  <p className="text-lg text-gray-900">{storePart.description || 'No description available'}</p>
                </div>
                
                <div className="md:col-span-2">
                  <h3 className="text-base font-medium text-gray-500">Notes</h3>
                  <p className="text-lg text-gray-900">{storePart.notes || 'No notes available'}</p>
                </div>
                
                <div>
                  <h3 className="text-base font-medium text-gray-500">Created At</h3>
                  <p className="text-lg text-gray-900">{formatDate(storePart.createdAt)}</p>
                </div>
                
                <div>
                  <h3 className="text-base font-medium text-gray-500">Updated At</h3>
                  <p className="text-lg text-gray-900">{formatDate(storePart.updatedAt)}</p>
                </div>
              </div>
              
              <div className="mt-10 pt-6 border-t border-gray-200">
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={onEdit}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md border border-gray-300"
                  >
                    Edit
                  </button>
                  
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StorePartDetailsModal;