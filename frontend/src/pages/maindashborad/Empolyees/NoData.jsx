import React from 'react';
import { FileX } from 'lucide-react';

const NoData = ({ message = 'No data found' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 bg-white rounded-md shadow-sm">
      <FileX size={60} className="text-gray-300 mb-4" />
      <p className="text-gray-500 text-lg">{message}</p>
    </div>
  );
};

export default NoData;