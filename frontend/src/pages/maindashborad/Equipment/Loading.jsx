// src/components/common/Loading.jsx
const Loading = ({ message = 'Loading...' }) => {
    return (
      <div className="flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF5E14]"></div>
        <p className="mt-4 text-gray-600">{message}</p>
      </div>
    );
  };
  
  export default Loading;