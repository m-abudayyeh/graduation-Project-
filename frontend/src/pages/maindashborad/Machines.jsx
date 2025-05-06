// src/pages/EquipmentPage.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import EquipmentList from './Equipment/EquipmentList';
import EquipmentForm from './Equipment/EquipmentForm';
import EquipmentDetailsModal from './Equipment/EquipmentDetails';
import Pagination from './Equipment/Pagination';
import SearchBar from './Equipment/SearchBar';
import Alert from './Equipment/Alert';
import Loading from './Equipment/Loading';
import MaintenanceDue from './Equipment/MaintenanceDue';

const API_URL = 'http://localhost:5000/api';

const Machines = () => {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [limit, setLimit] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleted, setShowDeleted] = useState(false);
  const [confirmation, setConfirmation] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [categories, setCategories] = useState([]);
  const [locationFilter, setLocationFilter] = useState('');
  const [locations, setLocations] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [statuses, setStatuses] = useState([]);
  const [maintenanceDue, setMaintenanceDue] = useState([]);
  const [showMaintenanceDue, setShowMaintenanceDue] = useState(false);
  const [filtersVisible, setFiltersVisible] = useState(false);
  
  // Fetch equipment
  const fetchEquipment = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`${API_URL}/equipment`, {
        params: {
          page: currentPage,
          limit,
          search: searchTerm || undefined,
          category: categoryFilter || undefined,
          locationId: locationFilter || undefined,
          status: statusFilter || undefined,
          showDeleted
        },
        withCredentials: true
      });
      
      if (response.data && response.data.data) {
        const responseData = response.data.data;
      
        setEquipment(responseData.items);
        setTotalCount(responseData.totalItems);
      } else {
        setEquipment([]);
        setTotalCount(0);
        console.warn('Empty response data');
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching equipment:', err);
      setError(err.response?.data?.message || 'Failed to fetch equipment');
      setEquipment([]);
      setLoading(false);
    }
  };

  // Fetch equipment categories
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/equipment/categories`, {
        withCredentials: true
      });
      if (response.data && response.data.data) {
        setCategories(response.data.data);

      }
      
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };
  
  // Fetch equipment statuses
  const fetchStatuses = async () => {
    try {
      const response = await axios.get(`${API_URL}/equipment/statuses`, {
        withCredentials: true
      });
      
      if (response.data && response.data.data) {
        setStatuses(response.data.data);
        // console.log(response.data.data)
        
      }
    } catch (err) {
      console.error('Error fetching statuses:', err);
    }
  };
  
  // // Fetch locations for filter dropdown
  const fetchLocations = async () => {
    try {
      const response = await axios.get(`${API_URL}/locations`, {
        params: { limit: 100 },
        withCredentials: true,
      });
  
      console.log('📦 Locations:', response.data.data.items);
  
      if (response.data?.data?.items) {
        setLocations(response.data.data.items);
      }
    } catch (err) {
      console.error('❌ Error fetching locations:', err);
    }
  };

 
  // Fetch equipment with maintenance due
  const fetchMaintenanceDue = async () => {
    try {
      const response = await axios.get(`${API_URL}/equipment/maintenance-due`, {
        withCredentials: true
      });
      
      if (response.data && response.data.data) {
        setMaintenanceDue(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching maintenance due equipment:', err);
    }
  };
  
  // Create equipment
  const createEquipment = async (equipmentData) => {
    try {
      setError(null);
      const response = await axios.post(`${API_URL}/equipment`, equipmentData, {
        withCredentials: true
      });
      
      setShowForm(false);
      fetchEquipment();
      setSuccess('Equipment created successfully');
      
      return response.data;
    } catch (err) {
      console.error('Error creating equipment:', err);
      setError(err.response?.data?.message || 'Failed to create equipment');
      throw err;
    }
  };
  
  // Update equipment
  const updateEquipment = async (id, equipmentData) => {
    try {
      setError(null);
      const response = await axios.put(`${API_URL}/equipment/${id}`, equipmentData, {
        withCredentials: true
      });
      
      setShowForm(false);
      setShowDetails(false);
      fetchEquipment();
      setSuccess('Equipment updated successfully');
      
      return response.data;
    } catch (err) {
      console.error('Error updating equipment:', err);
      setError(err.response?.data?.message || 'Failed to update equipment');
      throw err;
    }
  };
  
  // Delete equipment (soft delete) with custom confirmation
  const deleteEquipment = async (id) => {
    setConfirmation({
      message: 'Are you sure you want to delete this equipment?',
      onConfirm: async () => {
        try {
          setConfirmation(null); // Clear confirmation
          setError(null);
          const response = await axios.delete(`${API_URL}/equipment/${id}`, {
            withCredentials: true
          });
          
          setShowDetails(false);
          fetchEquipment();
          fetchMaintenanceDue(); // Refresh maintenance due list
          setSuccess('Equipment deleted successfully');
        } catch (err) {
          console.error('Error deleting equipment:', err);
          setError(err.response?.data?.message || 'Failed to delete equipment');
        }
      },
      onCancel: () => {
        setConfirmation(null); // Clear confirmation on cancel
      }
    });
  };
  
  // Restore equipment
  const restoreEquipment = async (id) => {
    try {
      setError(null);
      const response = await axios.put(`${API_URL}/equipment/${id}/restore`, {}, {
        withCredentials: true
      });
      
      fetchEquipment();
      setSuccess('Equipment restored successfully');
    } catch (err) {
      console.error('Error restoring equipment:', err);
      setError(err.response?.data?.message || 'Failed to restore equipment');
    }
  };
  
  // Update equipment status
  const updateStatus = async (id, status) => {
    try {
      setError(null);
      const response = await axios.put(`${API_URL}/equipment/${id}/status`, { status }, {
        withCredentials: true
      });
      
      // Update the equipment in the list
      if (response.data && response.data.data) {
        const updatedEquipment = response.data.data;
        setEquipment(equipment.map(item => 
          item.id === id ? updatedEquipment : item
        ));
        
        // Update selected equipment if it's the one being viewed
        if (selectedEquipment && selectedEquipment.id === id) {
          setSelectedEquipment(updatedEquipment);
        }
      }
      
      setSuccess('Status updated successfully');
      return response.data;
    } catch (err) {
      console.error('Error updating status:', err);
      setError(err.response?.data?.message || 'Failed to update status');
      throw err;
    }
  };
  
  // Update maintenance dates
  const updateMaintenanceDates = async (id, dates) => {
    try {
      setError(null);
      const response = await axios.put(`${API_URL}/equipment/${id}/maintenance-dates`, dates, {
        withCredentials: true
      });
      
      // Update the equipment in the list
      if (response.data && response.data.data) {
        const updatedEquipment = response.data.data;
        setEquipment(equipment.map(item => 
          item.id === id ? updatedEquipment : item
        ));
        
        // Update selected equipment if it's the one being viewed
        if (selectedEquipment && selectedEquipment.id === id) {
          setSelectedEquipment(updatedEquipment);
        }
        
        // Refresh maintenance due list
        fetchMaintenanceDue();
      }
      
      setSuccess('Maintenance dates updated successfully');
      return response.data;
    } catch (err) {
      console.error('Error updating maintenance dates:', err);
      setError(err.response?.data?.message || 'Failed to update maintenance dates');
      throw err;
    }
  };
  
  // Upload equipment image
  const uploadImage = async (id, file) => {
    try {
      setError(null);
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await axios.put(`${API_URL}/equipment/${id}/image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      });
      
      let updatedEquipment = null;
      
      if (response.data && response.data.data) {
        updatedEquipment = response.data.data;
      } else if (response.data) {
        updatedEquipment = response.data;
      }
      
      if (updatedEquipment) {
        // Update the equipment in the list
        setEquipment(equipment.map(item => 
          item.id === id ? updatedEquipment : item
        ));
        
        // Update selected equipment if it's the one being viewed
        if (selectedEquipment && selectedEquipment.id === id) {
          setSelectedEquipment(updatedEquipment);
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
  
  // Upload equipment documentation file
  const uploadFile = async (id, file) => {
    try {
      setError(null);
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await axios.put(`${API_URL}/equipment/${id}/file`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      });
      
      let updatedEquipment = null;
      
      if (response.data && response.data.data) {
        updatedEquipment = response.data.data;
      } else if (response.data) {
        updatedEquipment = response.data;
      }
      
      if (updatedEquipment) {
        // Update the equipment in the list
        setEquipment(equipment.map(item => 
          item.id === id ? updatedEquipment : item
        ));
        
        // Update selected equipment if it's the one being viewed
        if (selectedEquipment && selectedEquipment.id === id) {
          setSelectedEquipment(updatedEquipment);
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
  
  // View equipment details
  const viewEquipmentDetails = async (id) => {
    try {
      setError(null);
      setLoading(true);
      
      const response = await axios.get(`${API_URL}/equipment/${id}`, {
        withCredentials: true
      });
      
      let equipmentData = null;
      
      if (response.data && response.data.data) {
        equipmentData = response.data.data;
      } else if (response.data) {
        equipmentData = response.data;
      }
      
      if (equipmentData) {
        setSelectedEquipment(equipmentData);
        setShowDetails(true);
      } else {
        setError('Equipment data not found in response');
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error getting equipment details:', err);
      setError(err.response?.data?.message || 'Failed to get equipment details');
      setLoading(false);
    }
  };
  
  // Handle search
  const handleSearch = (term) => {
    setSearchTerm(term);
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
  
  // Handle status filter
  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    setCurrentPage(1); // Reset to first page on new filter
  };
  
  // Toggle showDeleted
  const toggleShowDeleted = () => {
    setShowDeleted(!showDeleted);
    setCurrentPage(1); // Reset to first page
  };
  
  // Close form and details
  const handleClose = () => {
    setShowForm(false);
    setShowDetails(false);
    setSelectedEquipment(null);
    // Make sure to update data after closing
    fetchEquipment();
  };
  
  // Edit equipment
  const editEquipment = (equipment) => {
    setSelectedEquipment(equipment);
    setShowForm(true);
    setShowDetails(false);
  };
  
  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  
  // Toggle filters visibility (for mobile)
  const toggleFiltersVisibility = () => {
    setFiltersVisible(!filtersVisible);
  };
  
  // Check if any filter is active
  const hasActiveFilters = categoryFilter || locationFilter || statusFilter || showDeleted;
  
  useEffect(() => {
    fetchEquipment();
    fetchCategories();
    fetchStatuses();
    fetchLocations();
    fetchMaintenanceDue();
  }, [currentPage, limit, searchTerm, categoryFilter, locationFilter, statusFilter, showDeleted]);
  
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
        <h1 className="text-2xl font-bold text-[#02245B]">Equipment Management</h1>
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={() => setShowMaintenanceDue(!showMaintenanceDue)}
            className={`${showMaintenanceDue ? 'bg-[#02245B]' : 'bg-[#5F656F]'} hover:opacity-90 text-white px-3 sm:px-4 py-2 rounded-md flex items-center text-sm sm:text-base`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="whitespace-nowrap">
              Maintenance {maintenanceDue.length > 0 ? `(${maintenanceDue.length})` : ''}
            </span>
          </button>
          <button 
            onClick={() => { setShowForm(true); setSelectedEquipment(null); setShowDetails(false); }}
            className="bg-[#FF5E14] hover:bg-[#e05413] text-white px-3 sm:px-4 py-2 rounded-md text-sm sm:text-base"
          >
            Add Equipment
          </button>
        </div>
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
      
      {/* Maintenance Due Section */}
      {showMaintenanceDue && maintenanceDue.length > 0 && (
        <div className="mb-6 overflow-x-auto">
          <MaintenanceDue 
            equipment={maintenanceDue}
            onView={viewEquipmentDetails}
            onUpdateDates={updateMaintenanceDates}
            setSuccess={setSuccess}
            setError={setError}
          />
        </div>
      )}
      
      {/* Search and Filters Section */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div className="w-full sm:w-auto">
            <SearchBar onSearch={handleSearch} placeholder="Search equipment..." />
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
            
            {locations.length > 0 && (
              <div className="w-full sm:w-auto">
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <select
                  value={locationFilter}
                  onChange={(e) => handleLocationFilter(e.target.value)}
                  className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#02245B]"
                >
                  <option value="">All Locations</option>
                  {locations.map((location) => (
                    <option key={location.id} value={location.id}>{location.name}</option>
                  ))}
                </select>
              </div>
            )}
            
            {statuses.length > 0 && (
              <div className="w-full sm:w-auto">
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => handleStatusFilter(e.target.value)}
                  className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#02245B]"
                >
                  <option value="">All Statuses</option>
                  {statuses.map((status, index) => (
                    <option key={index} value={status}>{status.replace('_', ' ')}</option>
                  ))}
                </select>
              </div>
            )}
            
            <div className="w-full sm:w-auto flex items-center mt-2 sm:mt-0 pt-[25px]">
              <label className="inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={showDeleted} 
                  onChange={toggleShowDeleted}
                  className="sr-only peer"
                />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#02245B]"></div>
<div className="ml-3 text-sm font-medium text-gray-700 flex">Show Deleted</div>
              </label>
            </div>
            
            {hasActiveFilters && (
              <button
                onClick={() => {
                  setCategoryFilter('');
                  setLocationFilter('');
                  setStatusFilter('');
                  setShowDeleted(false);
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
          <Loading message="Loading equipment..." />
        </div>
      ) : (
        <>
          {showForm ? (
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 overflow-x-auto">
              <EquipmentForm 
                equipment={selectedEquipment} 
                onSubmit={selectedEquipment ? updateEquipment : createEquipment}
                onClose={handleClose}
                onUploadImage={uploadImage}
                onUploadFile={uploadFile}
                categories={categories}
                locations={locations}
                statuses={statuses}
                setError={setError}
                setSuccess={setSuccess}
              />
            </div>
          ) : showDetails && selectedEquipment ? (
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 overflow-x-auto">
              <EquipmentDetailsModal
                equipment={selectedEquipment}
                onClose={handleClose}
                onEdit={() => editEquipment(selectedEquipment)}
                onDelete={deleteEquipment}
                onRestore={restoreEquipment}
                onUpdateStatus={updateStatus}
                onUpdateMaintenanceDates={updateMaintenanceDates}
                onUploadImage={uploadImage}
                onUploadFile={uploadFile}
                statuses={statuses}
                setError={setError}
                setSuccess={setSuccess}
              />
            </div>
          ) : (
            <>
              {equipment.length === 0 && !loading ? (
                <div className="bg-white rounded-lg shadow p-6 text-center">
                  <p className="text-gray-600 mb-4">No equipment found</p>
                  <button 
                    onClick={() => { setShowForm(true); setSelectedEquipment(null); }} 
                    className="bg-[#02245B] hover:bg-blue-800 text-white px-4 py-2 rounded-md"
                  >
                    Add Your First Equipment
                  </button>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto bg-white rounded-lg shadow-md">
                    <EquipmentList 
                      equipment={equipment} 
                      onView={viewEquipmentDetails}
                      onEdit={editEquipment}
                      onDelete={deleteEquipment}
                      onRestore={restoreEquipment}
                      onUpdateStatus={updateStatus}
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

export default Machines;