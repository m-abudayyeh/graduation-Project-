// src/pages/admindashoard/AdminDashboard.jsx
import { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: '📊' },
    { name: 'Users', path: '/admin/users', icon: '👥' },
    { name: 'Settings', path: '/admin/settings', icon: '⚙️' },
    { name: 'Reports', path: '/admin/reports', icon: '📈' },
    // { name: 'Maintenance Requests', path: '/admin/maintenance-requests', icon: '🔧' },
    // { name: 'System Logs', path: '/admin/system-logs', icon: '📝' },
  ];

  return (
    <div className={`h-screen bg-gray-900 text-white overflow-y-auto transition-all duration-300 ${isOpen ? 'w-64' : 'w-16'}`}>
      <div className="p-4 flex justify-between items-center border-b border-gray-700">
        {isOpen && <h2 className="text-xl font-bold">Admin Panel</h2>}
        <button onClick={toggleSidebar} className="p-1 rounded-full hover:bg-gray-800">
          {isOpen ? '←' : '→'}
        </button>
      </div>
      <nav className="mt-6">
        <ul>
          {menuItems.map((item) => (
            <li key={item.name} className="mb-2">
              <Link
                to={item.path}
                className="flex items-center px-4 py-3 hover:bg-gray-800 transition-colors"
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
        <h1 className="text-xl font-semibold text-gray-800">Administration Control Panel</h1>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600 flex items-center">
            <div className="h-8 w-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-semibold mr-2">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <span>{user?.name || 'Admin'}</span>
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

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState({ name: 'Admin', role: 'Super Admin' }); // Mock user data

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

export default AdminDashboard;