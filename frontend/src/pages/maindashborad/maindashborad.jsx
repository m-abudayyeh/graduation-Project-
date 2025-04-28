// src/pages/maindashboard/MainDashboard.jsx
import { useState, useEffect } from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import axios from 'axios';

const MainDashboard = () => {
  const [user, setUser] = useState(null);
  const [companyInfo, setCompanyInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/auth/me', {
          withCredentials: true
        });

        setUser(response.data.data);
        console.log("User data:", response.data.data);
        
        // After getting user data, fetch company info
        if (response.data.data && response.data.data.companyId) {
          fetchCompanyData(response.data.data.companyId);
        } else {
          setLoading(false);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch user data');
        setLoading(false);
      }
    };

    const fetchCompanyData = async (companyId) => {
      try {
        const response = await axios.get(`http://localhost:5000/api/companies/${companyId}`, {
          withCredentials: true
        });
        
        setCompanyInfo(response.data.data);
        console.log("Company data:", response.data.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch company data');
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);
  
  // Handle company profile updates
  const handleCompanyUpdate = (updatedCompany) => {
    setCompanyInfo(updatedCompany);
  };
  
  // Handle user profile updates
  const handleUserUpdate = (updatedUser) => {
    setUser(prevUser => ({
      ...prevUser,
      ...updatedUser
    }));
  };
  
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

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/logout', {}, {
        withCredentials: true
      });
      
      // Reset state
      setUser(null);
      setCompanyInfo(null);
      
      // Redirect will be handled in the Header component
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  
  // Check if we're at the dashboard home route
  const location = useLocation();
  const isDashboardHome = location.pathname === '/dashboard';
  
  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-[#F5F5F5]">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-[#FF5E14] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-lg text-gray-700">Loading user information...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="flex items-center justify-center h-screen bg-[#F5F5F5]">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <div className="text-red-500 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-center mb-4">Error Loading Data</h2>
        <p className="text-gray-700 text-center">{error}</p>
        <div className="mt-6 text-center">
          <button 
            onClick={() => window.location.reload()} 
            className="bg-[#FF5E14] text-white px-4 py-2 rounded-md hover:bg-[#e05313]"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
  
  if (!user) return (
    <div className="flex items-center justify-center h-screen bg-[#F5F5F5]">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <p className="text-lg text-gray-700 mb-4">No user information available</p>
        <button 
          onClick={() => window.location.href = '/login'} 
          className="bg-[#02245B] text-white px-4 py-2 rounded-md hover:bg-[#01173d]"
        >
          Return to Login
        </button>
      </div>
    </div>
  );
  
  return (
    <div className="flex h-screen bg-[#F5F5F5] overflow-hidden">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'block' : 'hidden'} md:block`}>
        <Sidebar 
          isOpen={sidebarOpen} 
          toggleSidebar={toggleSidebar} 
          user={user}
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
          onUserUpdate={handleUserUpdate}
          onCompanyUpdate={handleCompanyUpdate}
        />
        
        <main className="flex-1 overflow-y-auto p-6 bg-[#F5F5F5]">
          <div className="max-w-7xl mx-auto">
            {/* Show profile info on dashboard home */}
            {isDashboardHome && (
              <div className="mb-8 space-y-6">
                {/* You can add dashboard home specific content here */}
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