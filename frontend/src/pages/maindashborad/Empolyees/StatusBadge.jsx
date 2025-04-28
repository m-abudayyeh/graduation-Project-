import React from 'react';

const StatusBadge = ({ status, type = 'default' }) => {
  // Get the appropriate color based on status type
  const getColor = () => {
    if (type === 'role') {
      switch (status?.toLowerCase()) {
        case 'admin':
          return 'bg-red-100 text-red-800';
        case 'supervisor':
          return 'bg-blue-100 text-blue-800';
        case 'technician':
          return 'bg-green-100 text-green-800';
        case 'requester':
          return 'bg-yellow-100 text-yellow-800';
        case 'viewer':
          return 'bg-purple-100 text-purple-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    } else if (type === 'workStatus') {
      switch (status?.toLowerCase()) {
        case 'on_shift':
          return 'bg-green-100 text-green-800';
        case 'end_shift':
          return 'bg-gray-100 text-gray-800';
        case 'on_call':
          return 'bg-yellow-100 text-yellow-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    } else if (type === 'priority') {
      switch (status?.toLowerCase()) {
        case 'high':
          return 'bg-red-100 text-red-800';
        case 'medium':
          return 'bg-yellow-100 text-yellow-800';
        case 'low':
          return 'bg-blue-100 text-blue-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    } else if (type === 'status') {
      switch (status?.toLowerCase()) {
        case 'open':
          return 'bg-blue-100 text-blue-800';
        case 'in progress':
        case 'in_progress':
          return 'bg-yellow-100 text-yellow-800';
        case 'on hold':
        case 'on_hold':
          return 'bg-purple-100 text-purple-800';
        case 'completed':
          return 'bg-green-100 text-green-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    } else {
      return 'bg-gray-100 text-gray-800';
    }
  };

  // Format text for display
  const formatText = (text) => {
    if (!text) return '';
    
    // Handle snake_case to readable format
    if (text.includes('_')) {
      return text.split('_').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
    }
    
    // Capitalize first letter
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getColor()}`}>
      {formatText(status)}
    </span>
  );
};

export default StatusBadge;