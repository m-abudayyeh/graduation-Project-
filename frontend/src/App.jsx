// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Import layouts
import PublicLayout from './components/PublicLayout';

// Import pages
import Home from './pages/puplicpage/Home';
import About from './pages/puplicpage/about';
import Contact from './pages/puplicpage/contact';
import Login from './pages/Authpages/login';
import Register from './pages/Authpages/register';

// Import dashboard components
import MainDashboard from './pages/maindashborad/maindashborad';
import DashboardHome from './pages/maindashborad/DashboardHome';
import WorkOrders from './pages/maindashborad/WorkOrders';
import PreventiveMaintenance from './pages/maindashborad/PreventiveMaintenance';
import Analytics from './pages/maindashborad/Analytics';
import Requests from './pages/maindashborad/Requests';
import Machines from './pages/maindashborad/Machines';
import Store from './pages/maindashborad/Store';
import Locations from './pages/maindashborad/Locations';
import Meters from './pages/maindashborad/Meters';
import Vendors from './pages/maindashborad/Vendors';
import Employees from './pages/maindashborad/Employees';


// Import admin dashboard components
import AdminDashboard from './pages/admindashoard/AdminDashboard';
import AdminDashboardHome from './pages/admindashoard/AdminDashboardHome';
import Users from './pages/admindashoard/Users';
import Settings from './pages/admindashoard/Settings';
import Reports from './pages/admindashoard/Reports';
// import MaintenanceRequests from './pages/admindashoard/MaintenanceRequests';
// import SystemLogs from './pages/admindashoard/SystemLogs';


function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes with Navbar */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        <Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        </Route>

        {/* Dashboard routes - without Navbar */}
        <Route path="/dashboard" element={<MainDashboard />}>
          <Route index element={<DashboardHome />} />
          <Route path="work-orders" element={<WorkOrders />} />
          <Route path="preventive-maintenance" element={<PreventiveMaintenance />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="requests" element={<Requests />} />
          <Route path="machines" element={<Machines />} />
          <Route path="store" element={<Store />} />
          <Route path="locations" element={<Locations />} />
          <Route path="meters" element={<Meters />} />
          <Route path="vendors" element={<Vendors />} />
          <Route path="employees" element={<Employees />} />
        </Route>
        
        <Route path="/admin" element={<AdminDashboard />}>
          <Route index element={<AdminDashboardHome />} />
          <Route path="users" element={<Users />} />
          <Route path="settings" element={<Settings />} />
          <Route path="reports" element={<Reports />} />
        </Route>
        {/* Redirect unknown routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;