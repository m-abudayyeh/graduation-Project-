import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  ArrowLeft, 
  ArrowRight, 
  RefreshCw,
  X
} from 'lucide-react';

// Components
import EmployeeForm from './Empolyees/Employee Form';
import DeleteConfirmModal from './Empolyees/DeleteConfirmModal';
import Loader from './Empolyees/Loader';
import NoData from './Empolyees/NoData';
import StatusBadge from './Empolyees/StatusBadge';

const Employees = () => {
  // State
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState([]);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/auth/me', { withCredentials: true });
        setCurrentUser(res.data.data);
      } catch (error) {
        console.error('Failed to fetch user data', error);
      }
    };
    
    fetchCurrentUser();
  }, []);

  // Calculate total pages
  const totalPages = Math.ceil(totalEmployees / limit);
  
  // Check if user is admin
  const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'super_admin';

  // Fetch employees
  useEffect(() => {
    fetchEmployees();
  }, [page, limit, searchQuery, roleFilter, refreshTrigger]);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      let url = `http://localhost:5000/api/users?page=${page}&limit=${limit}`;
      
      if (searchQuery) {
        url += `&search=${searchQuery}`;
      }
      
      if (roleFilter) {
        url += `&role=${roleFilter}`;
      }
      
      const res = await axios.get(url, { withCredentials: true });
      console.log('API Response:', res.data); 
      
    if (res.data && res.data.success && res.data.data) {
      setTotalEmployees(res.data.data.totalItems || 0);  
      setEmployees(res.data.data.items || []);
      } else {
        console.error('Unexpected API response structure:', res.data);
        setEmployees([]);
        setTotalEmployees(0);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch employees');
      setEmployees([]);
      setTotalEmployees(0);
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1); // Reset to first page on new search
  };

  // Handle edit
  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setShowEditModal(true);
  };

  // Handle delete click
  const handleDeleteClick = (employee) => {
    setSelectedEmployee(employee);
    setShowDeleteModal(true);
  };

  // Handle delete confirm
  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${selectedEmployee.id}`, { withCredentials: true });
      toast.success('Employee deleted successfully');
      setShowDeleteModal(false);
      // Refresh the list
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete employee');
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // Handle form submit success
  const handleFormSuccess = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setSelectedEmployee(null);
    // Refresh the list
    setRefreshTrigger(prev => prev + 1);
  };
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

  // Role badge colors
  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'supervisor':
        return 'bg-blue-100 text-blue-800';
      case 'technician':
        return 'bg-green-100 text-green-800';
      case 'requester':
        return 'bg-yellow-100 text-yellow-800';
      case 'viewer':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Work status badge colors
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'on_shift':
        return 'bg-green-100 text-green-800';
      case 'end_shift':
        return 'bg-gray-100 text-gray-800';
      case 'on_call':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Format work status for display
  const formatWorkStatus = (status) => {
    switch (status) {
      case 'on_shift':
        return 'On Shift';
      case 'end_shift':
        return 'End Shift';
      case 'on_call':
        return 'On Call';
      default:
        return status;
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Employees</h1>
        <div className="flex space-x-2">
          <button
            onClick={handleRefresh}
            className="p-2 text-gray-500 hover:text-gray-700"
            title="Refresh"
          >
            <RefreshCw size={20} />
          </button>
          
          {isAdmin && (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center px-4 py-2 bg-[#FF5E14] text-white rounded-md hover:bg-[#e65412] transition"
            >
              <Plus size={18} className="mr-1" />
              Add Employee
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-md shadow-sm mb-6">
        <div className="flex flex-col md:flex-row md:justify-between md:space-x-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex mb-4 md:mb-0">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-[#FF5E14] focus:border-transparent"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                <Search size={18} />
              </button>
            </div>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="px-3 py-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-r-md"
              >
                <X size={18} />
              </button>
            )}
          </form>

          {/* Role filter */}
          <div className="flex items-center">
            <label htmlFor="roleFilter" className="mr-2 text-gray-600">
              Role:
            </label>
            <select
              id="roleFilter"
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setPage(1); // Reset to first page on filter change
              }}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF5E14] focus:border-transparent"
            >
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="supervisor">Supervisor</option>
              <option value="technician">Technician</option>
              <option value="requester">Requester</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>
        </div>
      </div>

      {/* Employees List */}
      {loading ? (
        <Loader />
      ) : (!employees || employees.length === 0) ? (
        <NoData message="No employees found" />
      ) : (
        <div className="bg-white overflow-x-auto rounded-md shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                {isAdmin && (
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {employees.map((employee) => (
                <tr key={employee.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {employee.profilePicture ? (
                          <img
                            src={getProfilePictureUrl(employee.profilePicture)}
                            alt={`${employee.firstName} ${employee.lastName}`}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                            {employee.firstName?.[0]}{employee.lastName?.[0]}
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {employee.firstName} {employee.lastName}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{employee.email}</div>
                    <div className="text-sm text-gray-500">{employee.phoneNumber}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeColor(employee.role)}`}>
                      {employee.role?.charAt(0).toUpperCase() + employee.role?.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(employee.workStatus)}`}>
                      {formatWorkStatus(employee.workStatus)}
                    </span>
                  </td>
                  {isAdmin && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(employee)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        <Edit size={18} />
                      </button>
                      {/* Don't allow admins to delete themselves */}
                      {currentUser?.id !== employee.id && (
                        <button
                          onClick={() => handleDeleteClick(employee)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-gray-500">
            Showing {(page - 1) * limit + 1} to {Math.min(page * limit, totalEmployees)} of {totalEmployees} results
          </div>
          <div className="flex space-x-1">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className={`px-3 py-1 rounded ${
                page === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <ArrowLeft size={16} />
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-1 rounded ${
                  page === i + 1
                    ? 'bg-[#FF5E14] text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className={`px-3 py-1 rounded ${
                page === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Add Employee Modal */}
      {showAddModal && (
        <EmployeeForm
          onClose={() => setShowAddModal(false)}
          onSuccess={handleFormSuccess}
        />
      )}

      {/* Edit Employee Modal */}
      {showEditModal && selectedEmployee && (
        <EmployeeForm
          employee={selectedEmployee}
          onClose={() => {
            setShowEditModal(false);
            setSelectedEmployee(null);
          }}
          onSuccess={handleFormSuccess}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedEmployee && (
        <DeleteConfirmModal
          title="Delete Employee"
          message={`Are you sure you want to delete ${selectedEmployee.firstName} ${selectedEmployee.lastName}? This action cannot be undone.`}
          onConfirm={handleDeleteConfirm}
          onCancel={() => {
            setShowDeleteModal(false);
            setSelectedEmployee(null);
          }}
        />
      )}
    </div>
  );
};

export default Employees;