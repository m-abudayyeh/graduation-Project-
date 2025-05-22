// src/components/SuperAdminSidebar.jsx
import { useLocation, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const SuperAdminSidebar = ({ isOpen, toggleSidebar, user }) => {
  const location = useLocation();
  const [logoError, setLogoError] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Check if viewport is mobile size
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkIfMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Super Admin menu items based on requirements
 const menuItems = [
  {
    name: 'Dashboard',
    path: '/admin',
    icon: 'M3 3h18M3 9h18M3 15h18M3 21h18' // أيقونة خطوط dashboard (قائمة إدارية)
  },
  // {
  //   name: 'Users',
  //   path: '/admin/users',
  //   icon: 'M17 20h5v-2a4 4 0 00-5-4m-6 6H2v-2a4 4 0 014-4h4a4 4 0 014 4v2zm1-10a4 4 0 11-8 0 4 4 0 018 0z' // أيقونة شخصين
  // },
  {
    name: 'Massege',
    path: '/admin/massege',
    icon: 'M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z' // أيقونة دردشة / رسالة
  },
  {
    name: 'CustomSolutionsMassege',
    path: '/admin/customSolutionsMassege',
    icon: 'M9 12h6m-6 4h6m-7-8h8a2 2 0 012 2v8a2 2 0 01-2 2H9l-4 4V6a2 2 0 012-2h2' // أيقونة رسالة مخصصة أو تذاكر دعم
  }
];

  return (
    <>
      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={toggleSidebar}
        />
      )}
      
      {/* Mobile toggle button */}
      {isMobile && !isOpen && (
        <button 
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-40 p-2 rounded-full bg-[#02245B] text-white shadow-lg hover:bg-[#FF5E14] transition-colors"
          aria-label="Open menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
      )}
      
      <div 
        className={`fixed md:relative h-screen bg-[#02245B] text-white overflow-y-auto transition-all duration-300 z-30 shadow-xl ${
          isOpen ? 'w-64' : 'w-20'
        } ${isMobile && !isOpen ? '-translate-x-full' : 'translate-x-0'}`}
      >
        {/* Header with Logo */}
        <div className="p-4 flex flex-col items-center border-b border-[#5F656F]/30">
          {/* Logo area */}
          <div className={`flex items-center justify-center mb-2 ${isOpen ? 'w-full' : 'w-10'}`}>
            {isOpen ? (
              <div className="text-xl font-bold text-white">Super Admin</div>
            ) : (
              <div className="w-10 h-10 flex items-center justify-center bg-[#FF5E14] rounded-full">
                <span className="text-white font-bold">SA</span>
              </div>
            )}
          </div>
          
          {/* Toggle button */}
          <button 
            onClick={toggleSidebar} 
            className="p-1 rounded-full hover:bg-[#5F656F]/20 text-white mt-3"
            aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              )}
            </svg>
          </button>
        </div>
        
        {/* Menu Items */}
        <div className="mt-6">
          <ul>
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
              return (
                <li key={item.name} className="mb-2 px-3">
                  <Link
                    to={item.path}
                    className={`flex items-center py-3 px-3 rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-[#FF5E14] text-white font-medium shadow-md' 
                        : 'hover:bg-[#5F656F]/20'
                    }`}
                    onClick={isMobile ? toggleSidebar : undefined}
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      strokeWidth={1.5} 
                      stroke="currentColor" 
                      className={`w-6 h-6 min-w-6 ${isActive ? 'text-white' : 'text-gray-300'}`}
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        d={item.icon} 
                      />
                    </svg>
                    {isOpen && (
                      <span className={`ml-3 font-medium truncate ${isActive ? 'text-white' : 'text-gray-300'}`}>
                        {item.name}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* User Profile Section at Bottom */}
        {isOpen && user && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#5F656F]/30">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-[#FF5E14] flex items-center justify-center text-white font-medium">
                {user.firstName?.charAt(0) || 'S'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-gray-300 truncate">
                  Super Admin
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Collapsed User Icon */}
        {!isOpen && user && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center">
            <div className="w-10 h-10 rounded-full bg-[#FF5E14] flex items-center justify-center text-white font-medium">
              {user.firstName?.charAt(0) || 'S'}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SuperAdminSidebar;