// src/pages/maindashboard/MainDashboard.jsx
import { useState, useEffect } from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const MainDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState({ 
    name: 'mohammed', 
    role: 'Administrator',
    status: 'On shift',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    profilePicture: null // Add actual URL for profile picture
  });
  
  const [companyInfo, setCompanyInfo] = useState({
    name: 'test Industrial Solutions',
    logo: null, // Add actual URL for logo
    subscription: 'Professional Plan',
    email: 'test@maintenx.com',
    phone: '+1 (555) 987-6543',
    address: '123 Industrial Ave, Suite 500',
    website: 'www.maintenx.com'
  });
  
  // Handle responsive sidebar behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    
    // Initial check
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    // Implement logout logic here
    console.log('Logging out...');
  };
  
  // Check if we're at the dashboard home route
  const location = useLocation();
  const isDashboardHome = location.pathname === '/dashboard';

  return (
    <div className="flex h-screen bg-[#F5F5F5] overflow-hidden">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'block' : 'hidden'} md:block`}>
        <Sidebar 
          isOpen={sidebarOpen} 
          toggleSidebar={toggleSidebar} 
          user={user}
          companyInfo={companyInfo}
        />
      </div>
      
      {/* Mobile overlay when sidebar is open */}
      {sidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-gray-600 bg-opacity-50 z-10"
          onClick={toggleSidebar}
        />
      )}
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          user={user} 
          companyInfo={companyInfo}
          onLogout={handleLogout} 
          toggleSidebar={toggleSidebar} 
        />
        
        <main className="flex-1 overflow-y-auto p-6 bg-[#F5F5F5]">
          <div className="max-w-7xl mx-auto">
            {/* Show profile info on dashboard home */}
            {isDashboardHome && (
              <div className="mb-8 space-y-6">               
              </div>
            )}

            <Outlet /> {/* This will render the child routes */}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainDashboard;