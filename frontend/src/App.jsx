import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Layouts
import PublicLayout from './components/PublicLayout';

// Public Pages
import Home from './pages/puplicpage/Home';
import AboutUs from './pages/puplicpage/about';
import ContactPage from './pages/puplicpage/contact';
import ServicesPage from './pages/puplicpage/ServicesPage';

// Auth Pages
import Login from './pages/Authpages/login';
import Register from './pages/Authpages/register';
import ResetPasswordPage from './pages/Authpages/ResetPasswordPage';
import ForgotPasswordPage from './pages/Authpages/ForgotPasswordPage';

// Main Dashboard (for company users)
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
import Subscription from './pages/maindashborad/Subscription';

// Subscription flow
import SubscriptionSuccess from './pages/SubscriptionSuccess';
import SubscriptionCancel from './pages/SubscriptionCancel';
import SubscriptionRenew from './pages/SubscriptionRenew';

// Admin Dashboard
import AdminDashboard from './pages/admindashoard/AdminDashboard';
import AdminDashboardHome from './pages/admindashoard/AdminDashboardHome';
import Users from './pages/admindashoard/Users';
import Massege from './pages/admindashoard/massege';
import CustomSolutionsMassege from './pages/admindashoard/CustomSolutionsMassege';

function App() {
  return (
    <Router>
      <Routes>

        {/* Public routes with layout */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/services" element={<ServicesPage />} />
        </Route>

        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

        {/* Subscription redirect pages (outside dashboards) */}
        <Route path="/dashboard/subscription/success" element={<SubscriptionSuccess />} />
        <Route path="/dashboard/subscription/cancel" element={<SubscriptionCancel />} />
        <Route path="/dashboard/subscription/renew" element={<SubscriptionRenew />} />

        {/* Main Dashboard Routes */}
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
          <Route path="subscription" element={<Subscription />} />
        </Route>

        {/* Admin Dashboard Routes */}
        <Route path="/admin" element={<AdminDashboard />}>
          <Route index element={<AdminDashboardHome />} />
          <Route path="users" element={<Users />} />
          <Route path="massege" element={<Massege />} />
          <Route path="customSolutionsMassege" element={<CustomSolutionsMassege />} />
        </Route>

        {/* Fallback: redirect to home if route not found */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
