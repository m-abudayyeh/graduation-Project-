// src/components/Header.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import ProfileModal from "./ProfileModal";
import CompanyModal from "./CompanyModal";

const Header = ({ user, companyInfo, onLogout, toggleSidebar }) => {
  const [workStatus, setWorkStatus] = useState(user?.workStatus || "end_shift");
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const navigate = useNavigate();

  const handleWorkStatusChange = async (e) => {
    const newStatus = e.target.value;
    const previousStatus = workStatus;
    setWorkStatus(newStatus);

    try {
      await axios.put(
        `http://localhost:5000/api/users/${user.id}/work-status`,
        { workStatus: newStatus },
        {
          withCredentials: true,
        }
      );
      console.log("Work status updated");
    } catch (error) {
      // Restore previous status if the update fails
      setWorkStatus(previousStatus);
      console.error("Failed to update work status:", error);
    }
  };

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  const handleLogout = async () => {
    try {
      // Call the logout API endpoint
      await axios.post("http://localhost:5000/api/auth/logout");

      // Clear session storage
      sessionStorage.clear();

      // Execute any additional logout logic provided by the parent component
      if (onLogout) {
        onLogout();
      }

      // Redirect to the home page
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Format profile picture URL properly
  const getProfilePictureUrl = (path) => {
    if (!path) return null;
    
    // Make sure we have a properly formatted path
    if (path.startsWith('http')) {
      return path;
    } else {
      // Ensure there's only one slash between server and path
      return `http://localhost:5000${path.startsWith('/') ? '' : '/'}${path}`;
    }
  };

  return (
    <header className="bg-white shadow-md px-6 py-3">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleSidebar}
            className="md:hidden p-2 rounded-md text-[#5F656F] hover:bg-gray-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>

          <div className="hidden md:block">
            <h1 className="text-xl font-semibold text-[#02245B]">
              {user?.company?.name || "Company"}{" "}
              <span className="text-[#FF5E14]">Maintenance System</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          {/* Notification Bell */}
          <div className="relative cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-[#5F656F]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
              />
            </svg>
            <span className="absolute -top-1 -right-1 h-5 w-5 bg-[#FF5E14] rounded-full text-xs text-white flex items-center justify-center font-semibold">
              3
            </span>
          </div>

          {/* Status Selector */}
          <div className="hidden md:flex items-center space-x-2 border-r border-gray-300 pr-6">
            <span
              className={`h-3 w-3 rounded-full ${
                workStatus === "on_shift"
                  ? "bg-green-500"
                  : workStatus === "on_call"
                  ? "bg-yellow-500"
                  : "bg-gray-400"
              }`}
            ></span>

            <select
              className="text-sm text-gray-600 border-none focus:ring-0 py-0 pl-0 pr-6 bg-transparent"
              value={workStatus}
              onChange={handleWorkStatusChange}
              disabled={!user?.id}
            >
              <option value="on_shift">On Shift</option>
              <option value="on_call">On Call</option>
              <option value="end_shift">End Shift</option>
            </select>
          </div>

          {/* User Menu */}
          <div className="relative">
            <div
              className="flex items-center space-x-3 cursor-pointer"
              onClick={toggleProfileMenu}
            >
              {user?.profilePicture ? (
                <img
                  src={getProfilePictureUrl(user.profilePicture)}
                  alt={user?.firstName || "User"}
                  className="h-10 w-10 rounded-full object-cover border-2 border-[#FF5E14]"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-[#02245B] flex items-center justify-center text-white font-bold">
                  {user?.firstName?.charAt(0) || "U"}
                </div>
              )}
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-800">
                  {user?.firstName || "User"}
                </p>
                <p className="text-xs text-gray-500">{user?.role}</p>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 text-gray-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                />
              </svg>
            </div>

            {/* Dropdown Menu */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                <div className="py-1 border-b border-gray-100">
                  <p className="px-4 py-2 text-xs font-medium text-gray-500">
                    Signed in as
                  </p>
                  <p
                    className="px-4 py-1 text-sm font-semibold truncate"
                    title={user?.email || ""}
                  >
                    {user?.email || "No email"}
                  </p>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => {
                      setShowProfileModal(true);
                      setShowProfileMenu(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Your Profile
                  </button>
                 
                  <button
                    onClick={() => {
                      setShowCompanyModal(true);
                      setShowProfileMenu(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Company Profile
                  </button>
                </div>
                <div className="py-1 border-t border-gray-100">
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Profile Modal */}
      {user && (
        <ProfileModal
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          user={user}
          onUpdate={(updatedUser) => {
            // Handle the updated user data here, e.g. by passing it to a parent component
            console.log("Profile updated:", updatedUser);
            // You might want to update the user state in a parent component
          }}
        />
      )}

      {/* Company Modal - Available for all users to view but only admin can edit */}
      {user && companyInfo && (
        <CompanyModal
          isOpen={showCompanyModal}
          onClose={() => setShowCompanyModal(false)}
          company={companyInfo}
          user={user}
          onUpdate={(updatedCompany) => {
            console.log("Company updated:", updatedCompany);
            // Add logic to update company info in parent component
          }}
        />
      )}
    </header>
  );
};

export default Header;