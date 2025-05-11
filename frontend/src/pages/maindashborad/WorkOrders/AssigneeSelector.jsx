// src/pages/maindashborad/WorkOrders/AssigneeSelector.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AssigneeSelector = ({ 
  primaryAssigneeId, 
  secondaryAssigneeId, 
  onPrimaryAssigneeChange, 
  onSecondaryAssigneeChange,
  showSecondary = true,
  disabled = false
}) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await axios.get('/api/users');
        
        if (response.data && response.data.data) {
          // Filter users to only show technicians and supervisors
          const filteredUsers = response.data.data.rows.filter(
            user => user.role === 'technician' || user.role === 'supervisor'
          );
          
          setUsers(filteredUsers || []);
        }
      } catch (err) {
        setError('Error loading users. Please try again.');
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, []);

  return (
    <div className="space-y-4">
      {/* Primary Assignee */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Primary Assignee
          {loading && (
            <span className="ml-2 inline-block w-4 h-4">
              <svg className="animate-spin h-4 w-4 text-[#02245B]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
          )}
        </label>
        
        {error && <p className="text-sm text-red-600 mb-2">{error}</p>}
        
        <select
          value={primaryAssigneeId || ''}
          onChange={(e) => onPrimaryAssigneeChange(e.target.value)}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#02245B] focus:ring-[#02245B] sm:text-sm"
          disabled={disabled || loading}
        >
          <option value="">Select Primary Assignee</option>
          {users.map((user) => (
            <option 
              key={user.id} 
              value={user.id}
              disabled={user.id === secondaryAssigneeId} // Can't select same user for both roles
            >
              {`${user.firstName} ${user.lastName} (${user.role})`}
            </option>
          ))}
        </select>
      </div>
      
      {/* Secondary Assignee (optional) */}
      {showSecondary && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Secondary Assignee (Optional)
          </label>
          
          <select
            value={secondaryAssigneeId || ''}
            onChange={(e) => onSecondaryAssigneeChange(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#02245B] focus:ring-[#02245B] sm:text-sm"
            disabled={disabled || loading}
          >
            <option value="">Select Secondary Assignee</option>
            {users.map((user) => (
              <option 
                key={user.id} 
                value={user.id}
                disabled={user.id === primaryAssigneeId} // Can't select same user for both roles
              >
                {`${user.firstName} ${user.lastName} (${user.role})`}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default AssigneeSelector;