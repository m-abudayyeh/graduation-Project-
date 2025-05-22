import React, { useState } from 'react';
import { 
  PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, BarChart, Bar, ResponsiveContainer 
} from 'recharts';

// Demo data for display
const subscriptionTypeData = [
  { name: 'Monthly', value: 40 },
  { name: 'Annual', value: 30 },
  { name: 'Trial', value: 30 },
];

const subscriptionStatusData = [
  { name: 'Active', value: 75 },
  { name: 'Expired', value: 25 },
];

const monthlyRevenueData = [
  { name: 'Jan', revenue: 40 },
  { name: 'Feb', revenue: 50 },
  { name: 'Mar', revenue: 30 },
  { name: 'Apr', revenue: 70 },
  { name: 'May', revenue: 60 },
  { name: 'Jun', revenue: 80 },
];

const adminJoinData = [
  { month: 'Jan', count: 5 },
  { month: 'Feb', count: 8 },
  { month: 'Mar', count: 12 },
  { month: 'Apr', count: 6 },
  { month: 'May', count: 10 },
  { month: 'Jun', count: 15 },
];

const companyJoinData = [
  { month: 'Jan', count: 3 },
  { month: 'Feb', count: 5 },
  { month: 'Mar', count: 8 },
  { month: 'Apr', count: 4 },
  { month: 'May', count: 6 },
  { month: 'Jun', count: 10 },
];

// Colors for charts
const COLORS = ['#FF5E14', '#02245B', '#5F656F', '#F5F5F5'];

const AdminDashboardHome = () => {
  const [totalCompanies] = useState(15);
  const [totalAdmins] = useState(15);
  const [totalRevenue] = useState(450);

  return (
    <div className="bg-gray-100 min-h-screen p-4 font-sans">
      <div className="container mx-auto">
        {/* <h1 className="text-3xl font-bold mb-6 text-[#02245B]">Super Admin Dashboard</h1> */}
        
        {/* General Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-600 mb-2">Total Companies</h2>
            <p className="text-4xl font-bold text-[#FF5E14]">{totalCompanies}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-600 mb-2">Total User</h2>
            <p className="text-4xl font-bold text-[#FF5E14]">{totalAdmins}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-600 mb-2">Total Revenue ($)</h2>
            <p className="text-4xl font-bold text-[#FF5E14]">{totalRevenue.toLocaleString()} $</p>
          </div>
        </div>
        
        {/* Subscription Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Subscription Type Distribution */}
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold text-gray-600 mb-4">Subscription Type Distribution</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={subscriptionTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {subscriptionTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Subscription Status */}
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold text-gray-600 mb-4">Subscription Status</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={subscriptionStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {subscriptionStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Monthly Revenue */}
          <div className="bg-white rounded-lg shadow p-4 col-span-1 md:col-span-2 lg:col-span-1">
            <h2 className="text-lg font-semibold text-gray-600 mb-4">Monthly Revenue</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={monthlyRevenueData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#FF5E14" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        {/* Admins and Companies by Join Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Admins by Join Date */}
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold text-gray-600 mb-4">Admins by Join Date</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={adminJoinData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" name="Number of Admins" fill="#02245B" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Companies by Join Date */}
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold text-gray-600 mb-4">Companies by Join Date</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={companyJoinData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" name="Number of Companies" fill="#FF5E14" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardHome;