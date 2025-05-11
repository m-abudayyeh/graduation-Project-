// src/pages/maindashborad/WorkOrders/FilterOptions.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FilterOptions = ({ filters, onChange }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [locations, setLocations] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [users, setUsers] = useState([]);
  
  // Fetch filter options data
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        // Fetch locations
        const locationsResponse = await axios.get('/api/locations');
        if (locationsResponse.data && locationsResponse.data.data) {
          setLocations(locationsResponse.data.data.rows || []);
        }
        
        // Fetch equipment
        const equipmentResponse = await axios.get('/api/equipment');
        if (equipmentResponse.data && equipmentResponse.data.data) {
          setEquipment(equipmentResponse.data.data.rows || []);
        }
        
        // Fetch users
        const usersResponse = await axios.get('/api/users');
        if (usersResponse.data && usersResponse.data.data) {
          setUsers(usersResponse.data.data.rows || []);
        }
      } catch (error) {
        console.error('Error fetching filter options:', error);
      }
    };
    
    fetchFilterOptions();
  }, []);
  
  const handleResetFilters = () => {
    onChange({
      status: '',
      priority: '',
      assigneeId: '',
      locationId: '',
      equipmentId: '',
      startDate: '',
      endDate: '',
    });
  };

  return (
    <div className="mb-4">
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="flex items-center text-sm text-[#02245B] hover:text-[#021d4a] mb-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-5 w-5 mr-1 transform ${showFilters ? 'rotate-180' : ''} transition-transform duration-200`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
        {showFilters ? 'Hide Filters' : 'Show Filters'}
      </button>
      
      {showFilters && (
        <div className="bg-gray-50 p-4 rounded-md">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#02245B] focus:border-[#02245B] sm:text-sm rounded-md"
                value={filters.status}
                onChange={(e) => onChange({ status: e.target.value })}
              >
                <option value="">All Statuses</option>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="on_hold">On Hold</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            
            {/* Priority Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#02245B] focus:border-[#02245B] sm:text-sm rounded-md"
                value={filters.priority}
                onChange={(e) => onChange({ priority: e.target.value })}
              >
                <option value="">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
                <option value="none">None</option>
              </select>
            </div>
            
            {/* Assignee Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Assignee</label>
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#02245B] focus:border-[#02245B] sm:text-sm rounded-md"
                value={filters.assigneeId}
                onChange={(e) => onChange({ assigneeId: e.target.value })}
              >
                <option value="">All Assignees</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {`${user.firstName} ${user.lastName}`}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Location Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <select
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#02245B] focus:border-[#02245B] sm:text-sm rounded-md"
              value={filters.locationId}
              onChange={(e) => onChange({ locationId: e.target.value })}
            >
              <option value="">All Locations</option>
              {locations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </select>
          </div>
          
          {/* Equipment Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Equipment</label>
            <select
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#02245B] focus:border-[#02245B] sm:text-sm rounded-md"
              value={filters.equipmentId}
              onChange={(e) => onChange({ equipmentId: e.target.value })}
            >
              <option value="">All Equipment</option>
              {equipment.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          
          {/* Date Range Filters */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#02245B] focus:border-[#02245B] sm:text-sm rounded-md"
              value={filters.startDate}
              onChange={(e) => onChange({ startDate: e.target.value })}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#02245B] focus:border-[#02245B] sm:text-sm rounded-md"
              value={filters.endDate}
              onChange={(e) => onChange({ endDate: e.target.value })}
            />
          </div>
        </div>
        
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleResetFilters}
            className="inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#02245B]"
          >
            Reset Filters
          </button>
        </div>
      </div>
    )}
  </div>
);
};

export default FilterOptions;