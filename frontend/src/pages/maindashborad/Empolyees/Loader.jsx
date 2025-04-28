import React from 'react';

const Loader = () => {
  return (
    <div className="flex justify-center items-center py-16 bg-white rounded-md shadow-sm">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF5E14]"></div>
    </div>
  );
};

export default Loader;