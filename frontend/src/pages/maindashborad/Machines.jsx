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
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#02245B]">Equipment Management</h1>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowMaintenanceDue(!showMaintenanceDue)}
            className={`${showMaintenanceDue ? 'bg-[#02245B]' : 'bg-[#5F656F]'} hover:opacity-90 text-white px-4 py-2 rounded-md flex items-center`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Maintenance Due {maintenanceDue.length > 0 ? `(${maintenanceDue.length})` : ''}
          </button>
          <button 
            onClick={() => { setShowForm(true); setSelectedEquipment(null); setShowDetails(false); }}
            className="bg-[#FF5E14] hover:bg-[#e05413] text-white px-4 py-2 rounded-md"
          >
            Add New Equipment
          </button>
        </div>
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
      
      {showMaintenanceDue && maintenanceDue.length > 0 && (
        <MaintenanceDue 
          equipment={maintenanceDue}
          onView={viewEquipmentDetails}
          onUpdateDates={updateMaintenanceDates}
          setSuccess={setSuccess}
          setError={setError}
        />
      )}
      
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <SearchBar onSearch={handleSearch} placeholder="Search equipment..." />
        
        <div className="flex flex-wrap items-center gap-4">
          {categories.length > 0 && (
            <select
              value={categoryFilter}
              onChange={(e) => handleCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#02245B]"
            >
              <option value="">All Categories</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>{category}</option>
              ))}
            </select>
          )}
          
          {locations.length > 0 && (
            <select
              value={locationFilter}
              onChange={(e) => handleLocationFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#02245B]"
            >
              <option value="">All Locations</option>
              {locations.map((location) => (
                <option key={location.id} value={location.id}>{location.name}</option>
              ))}
            </select>
          )}
          
          {statuses.length > 0 && (
            <select
              value={statusFilter}
              onChange={(e) => handleStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#02245B]"
            >
              <option value="">All Statuses</option>
              {statuses.map((status, index) => (
                <option key={index} value={status}>{status.replace('_', ' ')}</option>
              ))}
            </select>
          )}
          
          <label className="inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              checked={showDeleted} 
              onChange={toggleShowDeleted}
              className="sr-only peer"
            />
            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#02245B]"></div>
            <span className="ml-3 text-sm font-medium text-gray-700">Show Deleted</span>
          </label>
        </div>
      </div>
      
      {loading && !showForm && !showDetails ? (
        <div className="flex justify-center items-center h-64">
          <Loading message="Loading equipment..." />
        </div>
      ) : (
        <>
          {showForm ? (
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
          ) : showDetails && selectedEquipment ? (
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
                  <EquipmentList 
                    equipment={equipment} 
                    onView={viewEquipmentDetails}
                    onEdit={editEquipment}
                    onDelete={deleteEquipment}
                    onRestore={restoreEquipment}
                    onUpdateStatus={updateStatus}
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

export default Machines;