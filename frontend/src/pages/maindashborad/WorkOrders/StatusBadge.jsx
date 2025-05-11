// src/pages/maindashborad/WorkOrders/StatusBadge.jsx
import React from 'react';

const StatusBadge = ({ status }) => {
  let bgColor;
  let textColor;
  let statusText;

  switch (status) {
    case 'open':
      bgColor = 'bg-blue-100';
      textColor = 'text-blue-800';
      statusText = 'Open';
      break;
    case 'in_progress':
      bgColor = 'bg-yellow-100';
      textColor = 'text-yellow-800';
      statusText = 'In Progress';
      break;
    case 'on_hold':
      bgColor = 'bg-purple-100';
      textColor = 'text-purple-800';
      statusText = 'On Hold';
      break;
    case 'completed':
      bgColor = 'bg-green-100';
      textColor = 'text-green-800';
      statusText = 'Completed';
      break;
    default:
      bgColor = 'bg-gray-100';
      textColor = 'text-gray-800';
      statusText = status || 'Unknown';
      break;
  }

  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${bgColor} ${textColor}`}>
      {statusText}
    </span>
  );
};

export default StatusBadge;