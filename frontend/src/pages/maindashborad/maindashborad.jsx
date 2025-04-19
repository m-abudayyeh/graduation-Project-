// src/pages/maindashborad/MainDashboard.jsx
import { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: '📊' },
    { name: 'Work Orders', path: '/dashboard/work-orders', icon: '🔧' },
    { name: 'Preventive Maintenance', path: '/dashboard/preventive-maintenance', icon: '⏱️' },
    { name: 'Analytics', path: '/dashboard/analytics', icon: '📈' },
    { name: 'Requests', path: '/dashboard/requests', icon: '📝' },
    { name: 'Machines', path: '/dashboard/machines', icon: '⚙️' },
    { name: 'Store', path: '/dashboard/store', icon: '🏪' },
    { name: 'Locations', path: '/dashboard/locations', icon: '📍' },
    { name: 'Meters', path: '/dashboard/meters', icon: '🔢' },
    { name: 'Vendors', path: '/dashboard/vendors', icon: '🏢' },
    { name: 'Employees', path: '/dashboard/employees', icon: '👥' },
  ];

  return (
    <div className={`h-screen bg-gray-800 text-white overflow-y-auto transition-all duration-300 ${isOpen ? 'w-64' : 'w-16'}`}>
      <div className="p-4 flex justify-between items-center">
        {isOpen && <h2 className="text-xl font-bold">Maintenance</h2>}
        <button onClick={toggleSidebar} className="p-1 rounded-full hover:bg-gray-700">
          {isOpen ? '←' : '→'}
        </button>
      </div>
      <nav className="mt-6">
        <ul>
          {menuItems.map((item) => (
            <li key={item.name} className="mb-2">
              <Link
                to={item.path}
                className="flex items-center px-4 py-3 hover:bg-gray-700 transition-colors"
              >
                <span className="mr-3">{item.icon}</span>
                {isOpen && <span>{item.name}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

const Header = ({ user, onLogout }) => {
  return (
    <header className="bg-white shadow-md p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold text-gray-800">Maintenance Management System</h1>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600">
            Welcome, {user?.name || 'User'}
          </div>
          <button
            onClick={onLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

const MainDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState({ name: 'Admin' }); // Mock user data

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    // Implement logout logic here
    console.log('Logging out...');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={user} onLogout={handleLogout} />
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <Outlet /> {/* This will render the child routes */}
        </main>
      </div>
    </div>
  );
};

export default MainDashboard;