// src/pages/maindashborad/WorkOrders/PriorityBadge.jsx
import React from 'react';

const PriorityBadge = ({ priority }) => {
  let bgColor;
  let textColor;
  let priorityText;

  switch (priority) {
    case 'high':
      bgColor = 'bg-red-100';
      textColor = 'text-red-800';
      priorityText = 'High';
      break;
    case 'medium':
      bgColor = 'bg-orange-100';
      textColor = 'text-orange-800';
      priorityText = 'Medium';
      break;
    case 'low':
      bgColor = 'bg-green-100';
      textColor = 'text-green-800';
      priorityText = 'Low';
      break;
    case 'none':
      bgColor = 'bg-gray-100';
      textColor = 'text-gray-800';
      priorityText = 'None';
      break;
    default:
      bgColor = 'bg-gray-100';
      textColor = 'text-gray-800';
      priorityText = priority || 'Unknown';
      break;
  }

  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${bgColor} ${textColor}`}>
      {priorityText}
    </span>
  );
};

export default PriorityBadge;