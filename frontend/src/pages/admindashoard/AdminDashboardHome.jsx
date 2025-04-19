// src/pages/admindashoard/AdminDashboardHome.jsx
import React from 'react';

const AdminDashboardHome = () => {
  // Mock data for admin dashboard
  const stats = {
    totalUsers: 342,
    activeUsers: 289,
    totalRequests: 158,
    pendingApprovals: 24,
    systemHealth: 98,
    serverUptime: '45 days, 17 hours'
  };

  const recentActivities = [
    { id: 1, user: 'John Doe', action: 'Created new work order', time: '10 minutes ago' },
    { id: 2, user: 'Sarah Williams', action: 'Approved maintenance request', time: '45 minutes ago' },
    { id: 3, user: 'Alex Johnson', action: 'Updated system settings', time: '2 hours ago' },
    { id: 4, user: 'Mike Smith', action: 'Generated monthly report', time: '5 hours ago' },
    { id: 5, user: 'Emily Brown', action: 'Added new user account', time: '6 hours ago' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Users" value={stats.totalUsers} subtitle={`${stats.activeUsers} active`} color="indigo" icon="👥" />
        <StatCard title="Requests" value={stats.totalRequests} subtitle={`${stats.pendingApprovals} pending`} color="blue" icon="🔧" />
        <StatCard title="System Health" value={`${stats.systemHealth}%`} subtitle={`Uptime: ${stats.serverUptime}`} color="green" icon="📊" />
      </div>
      
      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <QuickActionButton title="Add User" icon="👤" color="indigo" />
          <QuickActionButton title="System Settings" icon="⚙️" color="gray" />
          <QuickActionButton title="Generate Report" icon="📄" color="green" />
          <QuickActionButton title="View Logs" icon="📋" color="red" />
        </div>
      </div>
      
      {/* Recent Activities */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Recent Activities</h2>
        <div className="overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {recentActivities.map((activity) => (
              <li key={activity.id} className="py-3">
                <div className="flex items-start">
                  <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3">
                    {activity.user.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{activity.user}</p>
                    <p className="text-sm text-gray-600">{activity.action}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-4 text-center">
          <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">View All Activities</button>
        </div>
      </div>
      
      {/* System Notifications */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">System Notifications</h2>
        <div className="space-y-3">
          <Notification 
            type="info" 
            message="System update scheduled for April 15, 2025 at 02:00 AM" 
          />
          <Notification 
            type="warning" 
            message="Disk space reaching 80% capacity on main server" 
          />
          <Notification 
            type="success" 
            message="Backup completed successfully" 
          />
        </div>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, value, subtitle, color, icon }) => {
  const getColorClasses = () => {
    switch (color) {
      case 'indigo':
        return 'bg-indigo-50 text-indigo-500 border-indigo-100';
      case 'blue':
        return 'bg-blue-50 text-blue-500 border-blue-100';
      case 'green':
        return 'bg-green-50 text-green-500 border-green-100';
      case 'red':
        return 'bg-red-50 text-red-500 border-red-100';
      default:
        return 'bg-gray-50 text-gray-500 border-gray-100';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 border-t-4 border-l border-r border-b" style={{ borderLeftColor: '#e5e7eb', borderRightColor: '#e5e7eb', borderBottomColor: '#e5e7eb' }}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
          <p className="text-xs text-gray-500 mt-2">{subtitle}</p>
        </div>
        <div className={`h-12 w-12 rounded-full ${getColorClasses()} flex items-center justify-center text-xl`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

// Quick Action Button Component
const QuickActionButton = ({ title, icon, color }) => {
  const getColorClasses = () => {
    switch (color) {
      case 'indigo':
        return 'bg-indigo-500 hover:bg-indigo-600';
      case 'blue':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'green':
        return 'bg-green-500 hover:bg-green-600';
      case 'red':
        return 'bg-red-500 hover:bg-red-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  return (
    <button className={`${getColorClasses()} text-white rounded-lg p-4 text-center transition-colors`}>
      <div className="text-2xl mb-2">{icon}</div>
      <div className="text-sm font-medium">{title}</div>
    </button>
  );
};

// Notification Component
const Notification = ({ type, message }) => {
  const getNotificationStyles = () => {
    switch (type) {
      case 'info':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          text: 'text-blue-800',
          icon: 'ℹ️'
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          text: 'text-yellow-800',
          icon: '⚠️'
        };
      case 'error':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          text: 'text-red-800',
          icon: '❌'
        };
      case 'success':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          text: 'text-green-800',
          icon: '✅'
        };
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          text: 'text-gray-800',
          icon: '📌'
        };
    }
  };

  const styles = getNotificationStyles();

  return (
    <div className={`${styles.bg} ${styles.border} ${styles.text} border rounded-md p-3 flex items-start`}>
      <span className="mr-3">{styles.icon}</span>
      <span className="text-sm">{message}</span>
    </div>
  );
};

export default AdminDashboardHome;