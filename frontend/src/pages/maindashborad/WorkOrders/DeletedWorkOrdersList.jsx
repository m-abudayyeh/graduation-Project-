// src/pages/maindashborad/WorkOrders/DeletedWorkOrdersList.jsx
import React, { useState } from 'react';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';
import Pagination from './Pagination';
import SearchBar from './SearchBar';
import Alert from './Alert';

const DeletedWorkOrdersList = ({ workOrders, onRestore, onViewDetails }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  // Filter work orders by search query
  const filteredWorkOrders = workOrders.filter(workOrder => {
    if (!searchQuery) return true;
    
    const searchLower = searchQuery.toLowerCase();
    
    return (
      workOrder.title?.toLowerCase().includes(searchLower) ||
      workOrder.description?.toLowerCase().includes(searchLower) ||
      workOrder.workOrderNumber?.toLowerCase().includes(searchLower)
    );
  });
  
  // Paginate work orders
  const paginatedWorkOrders = filteredWorkOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  // Handle work order restoration
  const handleRestore = async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      await onRestore(id);
      setSuccess('Work order restored successfully');
    } catch (err) {
      setError(err.message || 'Error restoring work order');
      console.error('Error restoring work order:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-xl font-bold mb-4 text-[#02245B]">Deleted Work Orders</h2>
      
      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} />}
      
      <div className="mb-4">
        <SearchBar 
          value={searchQuery} 
          onChange={setSearchQuery} 
          placeholder="Search deleted work orders..." 
        />
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Work Order #
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Priority
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Deleted Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Equipment
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedWorkOrders.length > 0 ? (
              paginatedWorkOrders.map((workOrder) => (
                <tr key={workOrder.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {workOrder.workOrderNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {workOrder.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={workOrder.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <PriorityBadge priority={workOrder.priority} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(workOrder.deletedAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {workOrder.equipment?.name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleRestore(workOrder.id)}
                      disabled={loading}
                      className="text-[#02245B] hover:text-[#021d4a] mr-3"
                    >
                      {loading ? 'Restoring...' : 'Restore'}
                    </button>
                    <button
                      onClick={() => onViewDetails(workOrder.id)}
                      className="text-[#FF5E14] hover:text-[#e05413]"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                  No deleted work orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {filteredWorkOrders.length > 0 && (
        <div className="mt-4">
          <Pagination 
            currentPage={currentPage} 
            onPageChange={setCurrentPage} 
            totalPages={Math.ceil(filteredWorkOrders.length / itemsPerPage)} 
          />
        </div>
      )}
    </div>
  );
};

export default DeletedWorkOrdersList;