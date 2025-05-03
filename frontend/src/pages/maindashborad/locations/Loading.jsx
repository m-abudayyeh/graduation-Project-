// src/components/common/Loading.jsx
const Loading = ({ size = 'medium', message = 'Loading...' }) => {
    const getSizeClasses = () => {
      switch (size) {
        case 'small':
          return 'h-6 w-6 border-2';
        case 'large':
          return 'h-16 w-16 border-4';
        case 'medium':
        default:
          return 'h-10 w-10 border-3';
      }
    };
    
    return (
      <div className="flex flex-col items-center justify-center p-4">
        <div
          className={`animate-spin rounded-full ${getSizeClasses()} border-t-[#FF5E14] border-b-[#FF5E14] border-l-transparent border-r-transparent`}
        ></div>
        {message && <p className="mt-2 text-gray-600">{message}</p>}
      </div>
    );
  };
  
  export default Loading;