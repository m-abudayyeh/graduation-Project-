// src/components/Sidebar.jsx
import { useLocation, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Sidebar = ({ isOpen, toggleSidebar, user, companyInfo }) => {
  const location = useLocation();
  const [logoError, setLogoError] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Reset logo error state when companyInfo changes
  useEffect(() => {
    setLogoError(false);
  }, [companyInfo]);

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

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { name: 'Work Orders', path: '/dashboard/work-orders?view=list', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
    { name: 'Preventive Maintenance', path: '/dashboard/preventive-maintenance', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
    { name: 'Analytics', path: '/dashboard/analytics', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { name: 'Requests', path: '/dashboard/requests', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
    { name: 'Machines', path: '/dashboard/machines', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
    { name: 'Store', path: '/dashboard/store', icon: 'M3 3h18v2H3V3zm0 8h18v10a2 2 0 01-2 2H5a2 2 0 01-2-2V11zm4-4h2v2H7V7zm4 0h2v2h-2V7zm4 0h2v2h-2V7z' },
    { name: 'Locations', path: '/dashboard/locations', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z' },
    { name: 'Employees', path: '/dashboard/employees', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
      { name: 'Subscription', path: '/dashboard/Subscription', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },

  ];

  // Helper function to get the image URL
  const getLogoUrl = () => {
    if (!companyInfo || !companyInfo.logo) return null;
    
    // Check if logo URL already contains the base URL
    if (companyInfo.logo.startsWith('http')) {
      return companyInfo.logo;
    }
    
    // Otherwise, prepend the base URL
    return `http://localhost:5000/${companyInfo.logo}`;
  };

  return (
    <>
      {/* Only render overlay when sidebar is open on mobile */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={toggleSidebar}
        />
      )}
      
      {/* Mobile toggle button - only shows when sidebar is closed */}
      {isMobile && !isOpen && (
        <button 
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-40 p-2 rounded-full bg-[#02245B] text-white shadow-lg hover:bg-[#FF5E14] transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
      )}
      
      <div 
        className={`fixed md:relative h-screen bg-[#02245B] text-white overflow-y-auto transition-all duration-300 z-30 ${
          isOpen ? 'w-64' : 'w-20'
        } ${isMobile && !isOpen ? '-translate-x-full' : 'translate-x-0'}`}
      >
        {/* Company Info at Top */}
        <div className="p-4 flex flex-col items-center border-b border-[#5F656F]/30">
          {isOpen ? (
            <div className="flex flex-col items-center w-full">
              {/* Company Logo or Fallback */}
              {companyInfo?.logo && !logoError ? (
                <div className="h-16 w-16 rounded-full overflow-hidden mb-2 bg-white border-2 border-[#FF5E14] flex items-center justify-center">
                  <img 
                    src={getLogoUrl()} 
                    alt={`${companyInfo.name || 'Company'} Logo`}
                    className="w-full h-full object-cover" 
                    onError={() => setLogoError(true)}
                  />
                </div>
              ) : (
                <div className="h-16 w-16 bg-[#FF5E14] rounded-full flex items-center justify-center text-white font-bold text-xl mb-2">
                  {companyInfo?.name?.charAt(0) || 'M'}
                </div>
              )}
              <h2 className="text-xl font-bold text-center truncate max-w-full">
                {companyInfo?.name || 'MaintenX'}
              </h2>
              {/* {companyInfo?.subscriptionStatus && (
                <p className="text-xs text-gray-300 mt-1">{companyInfo.subscriptionStatus}</p>
              )} */}
            </div>
          ) : (
            <div className="mx-auto">
              {companyInfo?.logo && !logoError ? (
                <div className="h-12 w-12 rounded-full overflow-hidden bg-white border-2 border-[#FF5E14] flex items-center justify-center">
                  <img 
                    src={getLogoUrl()} 
                    alt={`${companyInfo?.name || 'Company'} Logo`}
                    className="w-full h-full object-cover" 
                    onError={() => setLogoError(true)}
                  />
                </div>
              ) : (
                <div className="h-12 w-12 bg-[#FF5E14] rounded-full flex items-center justify-center text-white font-bold">
                  {companyInfo?.name?.charAt(0) || 'M'}
                </div>
              )}
            </div>
          )}
          
          {/* Toggle button */}
          <button 
            onClick={toggleSidebar} 
            className="p-1 rounded-full hover:bg-[#5F656F]/20 text-white mt-3"
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
        <div className="mt-4">
          <ul>
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.name} className="mb-1 px-3">
                  <Link
                    to={item.path}
                    className={`flex items-center py-3 px-3 rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-[#FF5E14] text-white' 
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
                      className="w-6 h-6 min-w-6"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        d={item.icon} 
                      />
                    </svg>
                    {isOpen && <span className="ml-3 font-medium truncate">{item.name}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Sidebar;