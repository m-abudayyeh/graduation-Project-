// src/pages/maindashborad/WorkOrders/WorkOrderForm.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Alert from './Alert';
import Loading from './Loading';

const WorkOrderForm = ({ workOrder, onSubmit, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [locations, setLocations] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [users, setUsers] = useState([]);
  const API_URL = 'http://localhost:5000/api';
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'medium',
    dueDate: '',
    startDate: '',
    equipmentId: '',
    locationId: '',
    primaryAssigneeId: '',
    secondaryAssigneeId: '',
    estimatedCost: '',
    estimatedHours: '',
    notes: '',
    tags: []
  });
  

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


  // Load data for dropdowns and populate form if editing
  useEffect(() => {
    const fetchFormData = async () => {
      setLoading(true);
      try {
        // Fetch locations
        const response = await axios.get(`${API_URL}/locations`, {
          params: { limit: 100 },
          withCredentials: true,
        });
    
        // console.log(' Locations:', response.data.data.items);
    
        if (response.data?.data?.items) {
          setLocations(response.data.data.items);
        }
        


        // Fetch equipment
const equipmentResponse = await axios.get(`${API_URL}/equipment`, {
  withCredentials: true
});if (equipmentResponse.data && equipmentResponse.data.data) {
  setEquipment(equipmentResponse.data.data.items|| []);
}
// console.log(equipmentResponse.data.data.items);




        // Fetch users
const usersResponse = await axios.get(`${API_URL}/users`, {
  withCredentials: true
});

if (usersResponse.data && usersResponse.data.data) {
  setUsers(usersResponse.data.data.items || []);
}

// console.log(usersResponse.data);


        
        // If editing, populate form with work order data
        if (workOrder) {
          setFormData({
            title: workOrder.title || '',
            description: workOrder.description || '',
            category: workOrder.category || '',
            priority: workOrder.priority || 'medium',
            dueDate: workOrder.dueDate ? new Date(workOrder.dueDate).toISOString().split('T')[0] : '',
            startDate: workOrder.startDate ? new Date(workOrder.startDate).toISOString().split('T')[0] : '',
            equipmentId: workOrder.equipmentId || '',
            locationId: workOrder.locationId || '',
            primaryAssigneeId: workOrder.primaryAssigneeId || '',
            secondaryAssigneeId: workOrder.secondaryAssigneeId || '',
            estimatedCost: workOrder.estimatedCost || '',
            estimatedHours: workOrder.estimatedHours || '',
            notes: workOrder.notes || '',
            tags: workOrder.tags || []
          });
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Error loading form data');
        console.error('Error loading form data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFormData();
  }, [workOrder]);
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };
  
  // Handle tag input
  const [tagInput, setTagInput] = useState('');
  
  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prevData) => ({
        ...prevData,
        tags: [...prevData.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };
  
  const handleRemoveTag = (tagToRemove) => {
    setFormData((prevData) => ({
      ...prevData,
      tags: prevData.tags.filter(tag => tag !== tagToRemove)
    }));
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.title) {
      setError('Title is required');
      return;
    }
    
    // Call parent's onSubmit function
    onSubmit(formData);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-6 text-[#02245B]">
        {workOrder ? 'Edit Work Order' : 'Create Work Order'}
      </h2>
      
      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#02245B] focus:ring-[#02245B] sm:text-sm"
              required
            />
          </div>
          
          {/* Description */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#02245B] focus:ring-[#02245B] sm:text-sm"
            />
          </div>
          
          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#02245B] focus:ring-[#02245B] sm:text-sm"
            />
          </div>
          
          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#02245B] focus:ring-[#02245B] sm:text-sm"
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
              <option value="none">None</option>
            </select>
          </div>
          
          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#02245B] focus:ring-[#02245B] sm:text-sm"
            />
          </div>
          
          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#02245B] focus:ring-[#02245B] sm:text-sm"
            />
          </div>
          
          {/* Equipment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Equipment</label>
            <select
              name="equipmentId"
              value={formData.equipmentId}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#02245B] focus:ring-[#02245B] sm:text-sm"
            >
              <option value="">Select Equipment</option>
              {equipment.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          
          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <select
              name="locationId"
              value={formData.locationId}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#02245B] focus:ring-[#02245B] sm:text-sm"
            >
              <option value="">Select Location</option>
              {locations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </select>
          </div>
          
          {/* Primary Assignee */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Primary Assignee</label>
            <select
              name="primaryAssigneeId"
              value={formData.primaryAssigneeId}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#02245B] focus:ring-[#02245B] sm:text-sm"
            >
              <option value="">Select Primary Assignee</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {`${user.firstName} ${user.lastName}`}
                </option>
              ))}
            </select>
          </div>
          
          {/* Secondary Assignee */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Assignee</label>
            <select
              name="secondaryAssigneeId"
              value={formData.secondaryAssigneeId}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#02245B] focus:ring-[#02245B] sm:text-sm"
            >
              <option value="">Select Secondary Assignee</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {`${user.firstName} ${user.lastName}`}
                </option>
              ))}
            </select>
          </div>
          
          {/* Estimated Cost */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Cost</label>
            <input
              type="number"
              name="estimatedCost"
              value={formData.estimatedCost}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#02245B] focus:ring-[#02245B] sm:text-sm"
              min="0"
              step="0.01"
            />
          </div>
          
          {/* Estimated Hours */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Hours</label>
            <input
              type="number"
              name="estimatedHours"
              value={formData.estimatedHours}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#02245B] focus:ring-[#02245B] sm:text-sm"
              min="0"
              step="0.5"
            />
          </div>
          
          {/* Notes */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#02245B] focus:ring-[#02245B] sm:text-sm"
            />
          </div>
          
          {/* Tags */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
            <div className="flex items-center">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#02245B] focus:ring-[#02245B] sm:text-sm"
                placeholder="Add a tag"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="ml-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-[#02245B] hover:bg-[#021d4a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#02245B]"
              >
                Add
              </button>
            </div>
            
            <div className="mt-2 flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <div 
                  key={index} 
                  className="inline-flex items-center bg-[#F5F5F5] px-2 py-1 rounded-md text-sm"
                >
                  <span className="text-[#5F656F]">{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 text-[#5F656F] hover:text-[#FF5E14]"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#02245B]"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#FF5E14] hover:bg-[#e05413] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF5E14]"
          >
            {workOrder ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default WorkOrderForm;