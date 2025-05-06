// src/components/Equipment/EquipmentDetails.jsx
import { useState, useEffect } from 'react';

const EquipmentDetailsModal = ({ 
  equipment, 
  onClose, 
  onEdit, 
  onDelete,
  onRestore,
  onUpdateStatus,
  onUpdateMaintenanceDates,
  onUploadImage,
  onUploadFile,
  statuses,
  setError,
  setSuccess
}) => {
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [selectedDocFile, setSelectedDocFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [lastMaintenanceDate, setLastMaintenanceDate] = useState(
    equipment?.lastMaintenanceDate ? new Date(equipment.lastMaintenanceDate).toISOString().split('T')[0] : ''
  );
  const [nextMaintenanceDate, setNextMaintenanceDate] = useState(
    equipment?.nextMaintenanceDate ? new Date(equipment.nextMaintenanceDate).toISOString().split('T')[0] : ''
  );
  
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
  
  // Update date values when equipment changes
  useEffect(() => {
    if (equipment) {
      setLastMaintenanceDate(
        equipment.lastMaintenanceDate ? new Date(equipment.lastMaintenanceDate).toISOString().split('T')[0] : ''
      );
      setNextMaintenanceDate(
        equipment.nextMaintenanceDate ? new Date(equipment.nextMaintenanceDate).toISOString().split('T')[0] : ''
      );
    }
  }, [equipment]);
  
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

  if (!equipment) {
    return null;
  }
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  // Format status for display
  const formatStatus = (status) => {
    if (!status) return 'N/A';
    return status.replace('_', ' ').replace(/\b\w/g, char => char.toUpperCase());
  };
  
  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'running':
        return 'bg-green-100 text-green-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      case 'out_of_service':
        return 'bg-red-100 text-red-800';
      case 'standby':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Handle status change
  const handleStatusChange = async (status) => {
    setStatusUpdating(true);
    try {
      await onUpdateStatus(equipment.id, status);
      setStatusUpdating(false);
      setSuccess('Status updated successfully');
    } catch (error) {
      setStatusUpdating(false);
      console.error('Status update error:', error);
      setError('Failed to update status. Please try again.');
    }
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
      await onUploadImage(equipment.id, selectedImageFile);
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
      await onUploadFile(equipment.id, selectedDocFile);
      setSelectedDocFile(null);
      setIsUploading(false);
      setSuccess('Documentation file uploaded successfully');
    } catch (error) {
      setIsUploading(false);
      console.error('Upload error:', error);
      setError('Failed to upload file. Please try again.');
    }
  };
  
  // Update maintenance dates
  const handleUpdateMaintenanceDates = async () => {
    try {
      await onUpdateMaintenanceDates(equipment.id, {
        lastMaintenanceDate,
        nextMaintenanceDate
      });
      setSuccess('Maintenance dates updated successfully');
    } catch (error) {
      console.error('Maintenance dates update error:', error);
      setError('Failed to update maintenance dates. Please try again.');
    }
  };
  
  // Handle delete
  const handleDelete = () => {
    onDelete(equipment.id);
  };
  
  // Handle restore
  const handleRestore = () => {
    onRestore(equipment.id);
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
            Equipment Details
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
                {equipment.image ? (
                  <img 
                    src={getImageUrl(equipment.image)}
                    alt={equipment.name} 
                    className="w-full h-64 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z" />
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
                {equipment.file ? (
                  <div className="flex flex-col gap-2">
                    <a 
                      href={getFileUrl(equipment.file)} 
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
                    {equipment.file ? 'Change File' : 'Upload File'}
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
              {!equipment.isDeleted && (
                <div className="mb-8 p-4 bg-gray-50 rounded-md">
                  <h3 className="text-lg font-medium text-gray-700 mb-3">Status</h3>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(equipment.status)}`}>
                        {formatStatus(equipment.status)}
                      </span>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Update Status
                      </label>
                      <div className="flex gap-2">
                        <select 
                          value={equipment.status || ''}
                          onChange={(e) => handleStatusChange(e.target.value)}
                          disabled={statusUpdating}
                          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#02245B]"
                        >
                          {statuses.map((status, index) => (
                            <option key={index} value={status}>
                              {formatStatus(status)}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Maintenance Schedule Section */}
              {!equipment.isDeleted && (
                <div className="mb-8 p-4 bg-gray-50 rounded-md">
                  <h3 className="text-lg font-medium text-gray-700 mb-3">Maintenance Schedule</h3>
                  
                  <div className="flex flex-col space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Maintenance Date
                      </label>
                      <input 
                        type="date" 
                        value={lastMaintenanceDate}
                        onChange={(e) => setLastMaintenanceDate(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#02245B]"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Next Maintenance Date
                      </label>
                      <input 
                        type="date" 
                        value={nextMaintenanceDate}
                        onChange={(e) => setNextMaintenanceDate(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#02245B]"
                      />
                    </div>
                    
                    <button
                      onClick={handleUpdateMaintenanceDates}
                      className="w-full px-3 py-2 bg-[#02245B] text-white rounded-md hover:bg-blue-800"
                    >
                      Update Maintenance Dates
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="md:w-2/3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-base font-medium text-gray-500">Name</h3>
                  <p className="text-lg font-medium text-gray-900">{equipment.name}</p>
                </div>
                
                <div>
                  <h3 className="text-base font-medium text-gray-500">Model</h3>
                  <p className="text-lg font-medium text-gray-900">{equipment.model || 'N/A'}</p>
                </div>
                
                <div>
                  <h3 className="text-base font-medium text-gray-500">Manufacturer</h3>
                  <p className="text-lg font-medium text-gray-900">{equipment.manufacturer || 'N/A'}</p>
                </div>
                
                <div>
                  <h3 className="text-base font-medium text-gray-500">Serial Number</h3>
                  <p className="text-lg font-medium text-gray-900">{equipment.serialNumber || 'N/A'}</p>
                </div>
                
                <div>
                  <h3 className="text-base font-medium text-gray-500">Category</h3>
                  <p className="text-lg font-medium text-gray-900">{equipment.category || 'N/A'}</p>
                </div>
                
                <div>
                  <h3 className="text-base font-medium text-gray-500">Location</h3>
                  <p className="text-lg font-medium text-gray-900">{equipment.location?.name || 'N/A'}</p>
                </div>
                
                <div>
                  <h3 className="text-base font-medium text-gray-500">Purchase Date</h3>
                  <p className="text-lg text-gray-900">{formatDate(equipment.purchaseDate)}</p>
                </div>
                
                <div>
                  <h3 className="text-base font-medium text-gray-500">Installation Date</h3>
                  <p className="text-lg text-gray-900">{formatDate(equipment.installationDate)}</p>
                </div>
                
                <div>
                  <h3 className="text-base font-medium text-gray-500">Warranty</h3>
                  <p className="text-lg text-gray-900">{equipment.warranty ? `${equipment.warranty} months` : 'N/A'}</p>
                </div>
                
                <div>
                  <h3 className="text-base font-medium text-gray-500">Status</h3>
                  <p className="text-lg text-gray-900">
                    {equipment.isDeleted 
                      ? <span className="text-red-600">Deleted</span> 
                      : formatStatus(equipment.status)
                    }
                  </p>
                </div>
                
                <div>
                  <h3 className="text-base font-medium text-gray-500">Last Maintenance</h3>
                  <p className="text-lg text-gray-900">{formatDate(equipment.lastMaintenanceDate)}</p>
                </div>
                
                <div>
                  <h3 className="text-base font-medium text-gray-500">Next Maintenance</h3>
                  <p className={`text-lg ${equipment.nextMaintenanceDate && new Date(equipment.nextMaintenanceDate) <= new Date() ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                    {formatDate(equipment.nextMaintenanceDate)}
                  </p>
                </div>
                
                <div className="md:col-span-2">
                  <h3 className="text-base font-medium text-gray-500">Description</h3>
                  <p className="text-lg text-gray-900">{equipment.description || 'No description available'}</p>
                </div>
                
                <div className="md:col-span-2">
                  <h3 className="text-base font-medium text-gray-500">Notes</h3>
                  <p className="text-lg text-gray-900">{equipment.notes || 'No notes available'}</p>
                </div>
                
                <div>
                  <h3 className="text-base font-medium text-gray-500">Created At</h3>
                  <p className="text-lg text-gray-900">{formatDate(equipment.createdAt)}</p>
                </div>
                
                <div>
                  <h3 className="text-base font-medium text-gray-500">Updated At</h3>
                  <p className="text-lg text-gray-900">{formatDate(equipment.updatedAt)}</p>
                </div>
              </div>
              
              <div className="mt-10 pt-6 border-t border-gray-200">
                <div className="flex justify-end space-x-4">
                  {equipment.isDeleted ? (
                    <button
                      onClick={handleRestore}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
                    >
                      Restore
                    </button>
                  ) : (
                    <>
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
                    </>
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

export default EquipmentDetailsModal;