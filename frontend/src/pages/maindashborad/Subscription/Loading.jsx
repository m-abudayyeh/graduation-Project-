import React from 'react';

const Loading = () => {
  return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#FF5E14]"></div>
    </div>
  );
};

export default Loading;