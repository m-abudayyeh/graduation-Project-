import React from 'react';

const SubscriptionStatusBadge = ({ status }) => {
  const getStatusClasses = () => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'trial':
        return 'bg-blue-100 text-blue-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses()}`}>
      {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown'}
    </span>
  );
};

export default SubscriptionStatusBadge;