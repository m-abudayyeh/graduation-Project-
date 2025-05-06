// src/pages/StorePartsPage.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import StorePartList from './Store/StorePartList';
import StorePartForm from './Store/StorePartForm';
import StorePartDetailsModal from './Store/StorePartDetails';
import Pagination from './Store/Pagination';
import SearchBar from './Store/SearchBar';
import Alert from './Store/Alert';
import Loading from './Store/Loading';

const API_URL = 'http://localhost:5000/api';

const Store = () => {
  const [storeParts, setStoreParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedStorePart, setSelectedStorePart] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [limit, setLimit] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [includeDeleted, setIncludeDeleted] = useState(false);
  const [confirmation, setConfirmation] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [categories, setCategories] = useState([]);
  const [locationFilter, setLocationFilter] = useState('');
  const [filtersVisible, setFiltersVisible] = useState(false);
  
  // Fetch store parts
  const fetchStoreParts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`${API_URL}/store`, {
        params: {
          page: currentPage,
          limit,
          search: searchTerm || undefined,
          category: categoryFilter || undefined,
          location: locationFilter || undefined,
          includeDeleted: includeDeleted
        },
        withCredentials: true
      });
      
      console.log('Full API Response:', response);
      console.log('Full API Response1:', response.data);
      console.log('Full API Response2:', response.data.data);
      if (response.data && response.data.data) {
        const responseData = response.data.data;
        
        let storePartsArray = [];
        let totalItems = 0;
        
        if (responseData.data && responseData.data.rows && Array.isArray(responseData.data.rows)) {
          storePartsArray = responseData.data.rows;
          totalItems = responseData.data.count || storePartsArray.length;
        } else if (Array.isArray(responseData.data)) {
          storePartsArray = responseData.data;
          totalItems = storePartsArray.length;
        }
        console.log('Store parts array:', responseData.items);
        console.log('Total count:', responseData.totalItems);
        setStoreParts(responseData.items);  // استخدم items بدلاً من rows
        setTotalCount(responseData.totalItems);
      } else {
        setStoreParts([]);
        setTotalCount(0);
        console.warn('Empty response data');
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching store parts:', err);
      setError(err.response?.data?.message || 'Failed to fetch store parts');
      setStoreParts([]);
      setLoading(false);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/store/categories`, {
        withCredentials: true
      });
      
      if (response.data && response.data.data) {
        setCategories(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };
  
  // Create store part
  const createStorePart = async (storePartData) => {
    try {
      setError(null);
      const response = await axios.post(`${API_URL}/store`, storePartData, {
        withCredentials: true
      });
      
      console.log('Create store part response:', response);
      
      setShowForm(false);
      fetchStoreParts();
      setSuccess('Store part created successfully');
      
      return response.data;
    } catch (err) {
      console.error('Error creating store part:', err);
      setError(err.response?.data?.message || 'Failed to create store part');
      throw err;
    }
  };
  
  // Update store part
  const updateStorePart = async (id, storePartData) => {
    try {
      setError(null);
      const response = await axios.put(`${API_URL}/store/${id}`, storePartData, {
        withCredentials: true
      });
      
      console.log('Update store part response:', response);
      
      setShowForm(false);
      setShowDetails(false);
      fetchStoreParts();
      setSuccess('Store part updated successfully');
      
      return response.data;
    } catch (err) {
      console.error('Error updating store part:', err);
      setError(err.response?.data?.message || 'Failed to update store part');
      throw err;
    }
  };
  
  // Delete store part (soft delete) with custom confirmation
  const deleteStorePart = async (id) => {
    setConfirmation({
      message: 'Are you sure you want to delete this store part?',
      onConfirm: async () => {
        try {
          setConfirmation(null); // Clear confirmation
          setError(null);
          const response = await axios.delete(`${API_URL}/store/${id}`, {
            withCredentials: true
          });
          
          console.log('Delete store part response:', response);
          
          setShowDetails(false);
          fetchStoreParts();
          setSuccess('Store part deleted successfully');
        } catch (err) {
          console.error('Error deleting store part:', err);
          setError(err.response?.data?.message || 'Failed to delete store part');
        }
      },
      onCancel: () => {
        setConfirmation(null); // Clear confirmation on cancel
      }
    });
  };
  
  // Update store part quantity
  const updateQuantity = async (id, quantity, action) => {
    try {
      setError(null);
      const response = await axios.put(`${API_URL}/store/${id}/quantity`, {
        quantity,
        action
      }, {
        withCredentials: true
      });
      
      console.log('Update quantity response:', response);
      
      // Update the store part in the list
      if (response.data && response.data.data) {
        const updatedPart = response.data.data;
        setStoreParts(storeParts.map(part => 
          part.id === id ? updatedPart : part
        ));
        
        // Update selected store part if it's the one being viewed
        if (selectedStorePart && selectedStorePart.id === id) {
          setSelectedStorePart(updatedPart);
        }
      }
      
      setSuccess('Quantity updated successfully');
      return response.data;
    } catch (err) {
      console.error('Error updating quantity:', err);
      setError(err.response?.data?.message || 'Failed to update quantity');
      throw err;
    }
  };
  
  // Upload store part image
  const uploadImage = async (id, file) => {
    try {
      setError(null);
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await axios.put(`${API_URL}/store/${id}/image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      });
      
      console.log('Upload image response:', response);
      
      let updatedStorePart = null;
      
      if (response.data && response.data.data) {
        updatedStorePart = response.data.data;
      } else if (response.data) {
        updatedStorePart = response.data;
      }
      
      if (updatedStorePart) {
        // Update the store part in the list
        setStoreParts(storeParts.map(part => 
          part.id === id ? updatedStorePart : part
        ));
        

        // Update selected store part if it's the one being viewed
        if (selectedStorePart && selectedStorePart.id === id) {
          setSelectedStorePart(updatedStorePart);
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
  
  // Upload store part file
  const uploadFile = async (id, file) => {
    try {
      setError(null);
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await axios.put(`${API_URL}/store/${id}/file`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      });
      
      console.log('Upload file response:', response);
      
      let updatedStorePart = null;
      
      if (response.data && response.data.data) {
        updatedStorePart = response.data.data;
      } else if (response.data) {
        updatedStorePart = response.data;
      }
      
      if (updatedStorePart) {
        // Update the store part in the list
        setStoreParts(storeParts.map(part => 
          part.id === id ? updatedStorePart : part
        ));
        
        // Update selected store part if it's the one being viewed
        if (selectedStorePart && selectedStorePart.id === id) {
          setSelectedStorePart(updatedStorePart);
        }
        
        setSuccess('File uploaded successfully');
      }
      
      return response.data;
    } catch (err) {
      console.error('Error uploading file:', err);
      setError(err.response?.data?.message || 'Failed to upload file');
      throw err;
    }
  };
  
  // View store part details
  const viewStorePartDetails = async (id) => {
    try {
      setError(null);
      setLoading(true);
      
      const response = await axios.get(`${API_URL}/store/${id}`, {
        withCredentials: true
      });
      
      console.log('Store part details response:', response);
      
      let storePartData = null;
      
      if (response.data && response.data.data) {
        storePartData = response.data.data;
      } else if (response.data) {
        storePartData = response.data;
      }
      
      if (storePartData) {
        setSelectedStorePart(storePartData);
        setShowDetails(true);
      } else {
        setError('Store part data not found in response');
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error getting store part details:', err);
      setError(err.response?.data?.message || 'Failed to get store part details');
      setLoading(false);
    }
  };
  
  // Handle search
  const handleSearch = (term) => {
    setSearchTerm(term);
    // setCurrentPage(1); // Reset to first page on new search
  };
  
  // Handle category filter
  const handleCategoryFilter = (category) => {
    setCategoryFilter(category);
    setCurrentPage(1); // Reset to first page on new filter
  };
  
  // Handle location filter
  const handleLocationFilter = (location) => {
    setLocationFilter(location);
    setCurrentPage(1); // Reset to first page on new filter
  };
  
  // Toggle include deleted store parts
  const toggleIncludeDeleted = () => {
    setIncludeDeleted(!includeDeleted);
    setCurrentPage(1); // Reset to first page
  };
  
  // Close form and details
  const handleClose = () => {
    setShowForm(false);
    setShowDetails(false);
    setSelectedStorePart(null);
    // Make sure to update data after closing
    fetchStoreParts();
  };
  
  // Edit store part
  const editStorePart = (storePart) => {
    console.log('Editing store part:', storePart);
    setSelectedStorePart(storePart);
    setShowForm(true);
    setShowDetails(false);
  };
  
  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  
  // Restore store part
  const restoreStorePart = async (id) => {
    try {
      setError(null);
      const response = await axios.post(`${API_URL}/store/${id}/restore`, {}, {
        withCredentials: true
      });
      
      console.log('Restore store part response:', response);
      
      fetchStoreParts();
      setSuccess('Store part restored successfully');
    } catch (err) {
      console.error('Error restoring store part:', err);
      setError(err.response?.data?.message || 'Failed to restore store part');
    }
  };
  
  // Toggle filters visibility (for mobile)
  const toggleFiltersVisibility = () => {
    setFiltersVisible(!filtersVisible);
  };
  
  // Check if any filter is active
  const hasActiveFilters = categoryFilter || locationFilter || includeDeleted;
  
  useEffect(() => {
    fetchStoreParts();
    fetchCategories();
  }, [currentPage, limit, searchTerm, categoryFilter, locationFilter, includeDeleted]);
  
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(null);
      }, 5000); 
      
      return () => clearTimeout(timer);
    }
  }, [success]);
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-full">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-[#02245B]">Store Parts Management</h1>
        <button 
          onClick={() => { setShowForm(true); setSelectedStorePart(null); setShowDetails(false); }}
          className="bg-[#FF5E14] hover:bg-[#e05413] text-white px-3 sm:px-4 py-2 rounded-md text-sm sm:text-base"
        >
          Add New Part
        </button>
      </div>
      
      {/* Alerts */}
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
      
      {/* Search and Filters Section */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div className="w-full sm:w-auto">
            <SearchBar onSearch={handleSearch} placeholder="Search parts..." />
          </div>
          
          <button
            onClick={toggleFiltersVisibility}
            className="flex items-center px-3 py-2 bg-[#02245B] text-white rounded-md sm:hidden"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filters {hasActiveFilters && <span className="ml-1 bg-[#FF5E14] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">!</span>}
          </button>
        </div>
        
        {/* Filters - Always visible on desktop, toggleable on mobile */}
        <div className={`${filtersVisible || window.innerWidth >= 640 ? 'block' : 'hidden'} sm:block bg-white p-4 rounded-lg shadow-sm mb-4 transition-all duration-300`}>
          <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-4">
            {categories.length > 0 && (
              <div className="w-full sm:w-auto">
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={categoryFilter}
                  onChange={(e) => handleCategoryFilter(e.target.value)}
                  className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#02245B]"
                >
                  <option value="">All Categories</option>
                  {categories.map((category, index) => (
                    <option key={index} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            )}
            
            <div className="w-full sm:w-auto">
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input 
                type="text" 
                value={locationFilter}
                onChange={(e) => handleLocationFilter(e.target.value)}
                placeholder="Filter by location"
                className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#02245B]"
              />
            </div>
            
            <div className="w-full sm:w-auto flex items-center mt-2 sm:mt-0 pt-[25px]">
              <label className="inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={includeDeleted} 
                  onChange={toggleIncludeDeleted}
                  className="sr-only peer"
                />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#02245B]"></div>
                <div className="ml-3 text-sm font-medium text-gray-700 flex items-center pt-[2px]">Deleted Parts</div>
              </label>
            </div>
            
            {hasActiveFilters && (
              <button
                onClick={() => {
                  setCategoryFilter('');
                  setLocationFilter('');
                  setIncludeDeleted(false);
                }}
                className="text-[#FF5E14] text-sm font-medium hover:underline mt-2 sm:mt-0 ml-auto"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      {loading && !showForm && !showDetails ? (
        <div className="flex justify-center items-center h-64">
          <Loading message="Loading store parts..." />
        </div>
      ) : (
        <>
          {showForm ? (
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 overflow-x-auto">
              <StorePartForm 
                storePart={selectedStorePart} 
                onSubmit={selectedStorePart ? updateStorePart : createStorePart}
                onClose={handleClose}
                onUploadImage={uploadImage}
                onUploadFile={uploadFile}
                categories={categories}
                setError={setError}
                setSuccess={setSuccess}
              />
            </div>
          ) : (
            <>
              {storeParts.length === 0 && !loading ? (
                <div className="bg-white rounded-lg shadow p-6 text-center">
                  <p className="text-gray-600 mb-4">No store parts found</p>
                  <button 
                    onClick={() => { setShowForm(true); setSelectedStorePart(null); }} 
                    className="bg-[#02245B] hover:bg-blue-800 text-white px-4 py-2 rounded-md"
                  >
                    Add Your First Store Part
                  </button>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto bg-white rounded-lg shadow-md">
                    <StorePartList 
                      storeParts={storeParts} 
                      onView={viewStorePartDetails}
                      onEdit={editStorePart}
                      onDelete={deleteStorePart}
                      onRestore={restoreStorePart}
                      onUpdateQuantity={updateQuantity}
                    />
                  </div>
                  <div className="mt-6">
                    <Pagination 
                      currentPage={currentPage}
                      totalCount={totalCount}
                      pageSize={limit}
                      onPageChange={handlePageChange}
                    />
                  </div>
                </>
              )}
            </>
          )}
        </>
      )}
      
      {/* Store Part Details Modal */}
      {showDetails && selectedStorePart && (
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 overflow-x-auto">
          <StorePartDetailsModal
            storePart={selectedStorePart}
            onClose={handleClose}
            onEdit={() => editStorePart(selectedStorePart)}
            onDelete={deleteStorePart}
            onRestore={restoreStorePart}  
            onUpdateQuantity={updateQuantity}
            onUploadImage={uploadImage}
            onUploadFile={uploadFile}
            setError={setError}
            setSuccess={setSuccess}
          />
        </div>
      )}
      
      {/* Custom Confirmation Dialog */}
      {confirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-xl max-w-md w-full">
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

export default Store;