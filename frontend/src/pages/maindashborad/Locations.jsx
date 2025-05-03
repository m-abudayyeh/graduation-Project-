// src/pages/LocationsPage.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import LocationList from './locations/LocationList';
import LocationForm from './locations/LocationForm';
import LocationDetailsModal from './locations/LocationDetails';
import Pagination from './locations/Pagination';
import SearchBar from './locations/SearchBar';
import Alert from './locations/Alert';
import Loading from './locations/Loading';

const API_URL = 'http://localhost:5000/api';

const Locations = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [currentPage, setCurrentPage] = useState(2);
  const [totalCount, setTotalCount] = useState(0);
  const [limit, setLimit] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [includeDeleted, setIncludeDeleted] = useState(false);
  const [confirmation, setConfirmation] = useState(null);
  
  // Fetch locations
  const fetchLocations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`${API_URL}/locations`, {
        params: {
          page: currentPage,
          limit,
          search: searchTerm || undefined,
          includeDeleted: includeDeleted || undefined
        },
        withCredentials: true
      });
      
      console.log('Full API Response:', response);
      console.log(response.data.data);
      if (response.data) {
        const responseData = response.data;
        
        let locationsArray = [];
        let totalItems = 0;
        
        if (responseData.data && responseData.data.items && Array.isArray(responseData.data.items)) {
          locationsArray = responseData.data.items;
          totalItems = responseData.data.totalItems || locationsArray.length;
        }
        
        console.log('Processed locations array:', locationsArray);
        console.log('Total count:', totalItems);
        
        setLocations(locationsArray);
        setTotalCount(totalItems);
      } else {
        setLocations([]);
        setTotalCount(0);
        console.warn('Empty response data');
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching locations:', err);
      setError(err.response?.data?.message || 'Failed to fetch locations');
      setLocations([]);
      setLoading(false);
    }
  };
  
  // Create location
  const createLocation = async (locationData) => {
    try {
      setError(null);
      const response = await axios.post(`${API_URL}/locations`, locationData, {
        withCredentials: true
      });
      
      console.log('Create location response:', response);
      
      setShowForm(false);
      fetchLocations();
      setSuccess('Location created successfully');
      
      return response.data;
    } catch (err) {
      console.error('Error creating location:', err);
      setError(err.response?.data?.message || 'Failed to create location');
      throw err;
    }
  };
  
  // Update location
  const updateLocation = async (id, locationData) => {
    try {
      setError(null);
      const response = await axios.put(`${API_URL}/locations/${id}`, locationData, {
        withCredentials: true
      });
      
      console.log('Update location response:', response);
      
      setShowForm(false);
      setShowDetails(false);
      fetchLocations();
      setSuccess('Location updated successfully');
      
      return response.data;
    } catch (err) {
      console.error('Error updating location:', err);
      setError(err.response?.data?.message || 'Failed to update location');
      throw err;
    }
  };
  
  // Delete location (soft delete) with custom confirmation
  const deleteLocation = async (id) => {
    // Using custom confirmation instead of window.confirm
    setConfirmation({
      message: 'Are you sure you want to delete this location?',
      onConfirm: async () => {
        try {
          setConfirmation(null); // Clear confirmation
          setError(null);
          const response = await axios.delete(`${API_URL}/locations/${id}`, {
            withCredentials: true
          });
          
          console.log('Delete location response:', response);
          
          setShowDetails(false);
          fetchLocations();
          setSuccess('Location deleted successfully');
        } catch (err) {
          console.error('Error deleting location:', err);
          setError(err.response?.data?.message || 'Failed to delete location');
        }
      },
      onCancel: () => {
        setConfirmation(null); // Clear confirmation on cancel
      }
    });
  };
  
  // Restore location
  const restoreLocation = async (id) => {
    try {
      setError(null);
      const response = await axios.post(`${API_URL}/locations/${id}/restore`, {}, {
        withCredentials: true
      });
      
      console.log('Restore location response:', response);
      
      fetchLocations();
      setSuccess('Location restored successfully');
    } catch (err) {
      console.error('Error restoring location:', err);
      setError(err.response?.data?.message || 'Failed to restore location');
    }
  };
  
  // Permanently delete location with custom confirmation
  const permanentlyDeleteLocation = async (id) => {
    // Using custom confirmation for permanent deletion
    setConfirmation({
      message: 'Are you sure you want to permanently delete this location? This action cannot be undone.',
      onConfirm: async () => {
        try {
          setConfirmation(null); // Clear confirmation
          setError(null);
          const response = await axios.delete(`${API_URL}/locations/${id}/permanent`, {
            withCredentials: true
          });
          
          console.log('Permanently delete location response:', response);
          
          setShowDetails(false);
          fetchLocations();
          setSuccess('Location permanently deleted');
        } catch (err) {
          console.error('Error permanently deleting location:', err);
          setError(err.response?.data?.message || 'Failed to permanently delete location');
        }
      },
      onCancel: () => {
        setConfirmation(null); // Clear confirmation on cancel
      }
    });
  };
  
  // Upload location image
  const uploadImage = async (id, file) => {
    try {
      setError(null);
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await axios.put(`${API_URL}/locations/${id}/image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      });
      
      console.log('Upload image response:', response);
      
      let updatedLocation = null;
      
      if (response.data && response.data.data) {
        updatedLocation = response.data.data;
      } else if (response.data) {
        updatedLocation = response.data;
      }
      
      if (updatedLocation) {
        // Update the location in the list
        setLocations(locations.map(loc => 
          loc.id === id ? updatedLocation : loc
        ));
        
        // Update selected location if it's the one being viewed
        if (selectedLocation && selectedLocation.id === id) {
          setSelectedLocation(updatedLocation);
        }
        
        setSuccess('Image uploaded successfully');
      }
      
      return response.data;
    } catch (err) {
      console.error('Error uploading image:', err);
      setError(err.response?.data?.message || 'Failed to upload image');
      throw err;
    }
  };
  
  // View location details
  const viewLocationDetails = async (id) => {
    try {
      setError(null);
      setLoading(true);
      
      const response = await axios.get(`${API_URL}/locations/${id}`, {
        params: {
          includeDeleted: includeDeleted || undefined
        },
        withCredentials: true
      });
      
      console.log('Location details response:', response);
      
      let locationData = null;
      
      if (response.data && response.data.data) {
        locationData = response.data.data;
      } else if (response.data) {
        locationData = response.data;
      }
      
      if (locationData) {
        setSelectedLocation(locationData);
        setShowDetails(true);
      } else {
        setError('Location data not found in response');
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error getting location details:', err);
      setError(err.response?.data?.message || 'Failed to get location details');
      setLoading(false);
    }
  };
  
  // Handle search
  const handleSearch = (term) => {
    setSearchTerm(term);
    // setCurrentPage(1); // Reset to first page on new search
  };
  
  // Toggle include deleted locations
  const toggleIncludeDeleted = () => {
    setIncludeDeleted(!includeDeleted);
    setCurrentPage(1); // Reset to first page
  };
  
  // Close form and details
  const handleClose = () => {
    setShowForm(false);
    setShowDetails(false);
    setSelectedLocation(null);
    // Make sure to update data after closing
    fetchLocations();
  };
  
  // Edit location
  const editLocation = (location) => {
    console.log('Editing location:', location);
    setSelectedLocation(location);
    setShowForm(true);
    setShowDetails(false);
  };
  
  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  
  useEffect(() => {
    fetchLocations();
  }, [currentPage, limit, searchTerm, includeDeleted]);
  
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(null);
      }, 5000); 
      
      return () => clearTimeout(timer);
    }
  }, [success]);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#02245B]">Locations Management</h1>
        <button 
          onClick={() => { setShowForm(true); setSelectedLocation(null); setShowDetails(false); }}
          className="bg-[#FF5E14] hover:bg-[#e05413] text-white px-4 py-2 rounded-md"
        >
          Add New Location
        </button>
      </div>
      
      {error && (
        <Alert 
          type="error" 
          message={error} 
          onClose={() => setError(null)}
        />
      )}
      
      {success && (
        <Alert 
          type="success" 
          message={success} 
          onClose={() => setSuccess(null)}
        />
      )}
      
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <SearchBar onSearch={handleSearch} />
        
        <div className="flex items-center">
          <label className="inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              checked={includeDeleted} 
              onChange={toggleIncludeDeleted}
              className="sr-only peer"
            />
            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#02245B]"></div>
            <span className="ml-3 text-sm font-medium text-gray-700"> Deleted Location</span>
          </label>
        </div>
      </div>
      
      {loading && !showForm && !showDetails ? (
        <div className="flex justify-center items-center h-64">
          <Loading message="Loading locations..." />
          
        </div>
      ) : (
        <>
          {showForm ? (
            <LocationForm 
              location={selectedLocation} 
              onSubmit={selectedLocation ? updateLocation : createLocation}
              onClose={handleClose}
              onUploadImage={uploadImage}
              setError={setError}
              setSuccess={setSuccess}
            />
          ) : (
            <>
              {locations.length === 0 && !loading ? (
                <div className="bg-white rounded-lg shadow p-6 text-center">
                  <p className="text-gray-600 mb-4">No locations found</p>
                  <button 
                    onClick={() => { setShowForm(true); setSelectedLocation(null); }} 
                    className="bg-[#02245B] hover:bg-blue-800 text-white px-4 py-2 rounded-md"
                  >
                    Add Your First Location
                  </button>
                </div>
              ) : (
                <>
                  <LocationList 
                    locations={locations} 
                    onView={viewLocationDetails}
                    onEdit={editLocation}
                    onDelete={deleteLocation}
                    onRestore={restoreLocation}
                  />
                  
                  <Pagination 
                    currentPage={currentPage}
                    totalCount={totalCount}
                    pageSize={limit}
                    onPageChange={handlePageChange}
                  />
                </>
              )}
            </>
          )}
        </>
      )}
      
      {/* Render the LocationDetailsModal when showDetails is true */}
      {showDetails && selectedLocation && (
        <LocationDetailsModal
          location={selectedLocation}
          onClose={handleClose}
          onEdit={() => editLocation(selectedLocation)}
          onDelete={deleteLocation}
          onPermanentDelete={permanentlyDeleteLocation}
          onRestore={restoreLocation}
          onUploadImage={uploadImage}
          setError={setError}
          setSuccess={setSuccess}
        />
      )}
      
      {/* Custom Confirmation Dialog */}
      {confirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirmation</h3>
            <p className="mb-6 text-gray-600">{confirmation.message}</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={confirmation.onCancel}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmation.onConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Locations;