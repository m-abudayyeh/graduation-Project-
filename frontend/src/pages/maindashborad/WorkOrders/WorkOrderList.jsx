// src/pages/maindashborad/WorkOrders/WorkOrderList.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';
import FilterOptions from './FilterOptions';
import Pagination from './Pagination';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';

const WorkOrderList = ({ 
  workOrders, 
  filters, 
  onFilterChange, 
  onPageChange, 
  onSelectWorkOrder, 
  onCreateNew, 
  onViewDeleted, 
  onViewCalendar,
  onViewColumns 
}) => {
  const navigate = useNavigate();

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex flex-wrap items-center justify-between mb-4">
        <div className="flex space-x-2 mb-2 sm:mb-0">
          <button
            onClick={onCreateNew}
            className="bg-[#FF5E14] hover:bg-[#e05413] text-white px-4 py-2 rounded-md flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            New Work Order
          </button>

          <button
            onClick={onViewDeleted}
            className="bg-[#5F656F] hover:bg-[#4a4f57] text-white px-4 py-2 rounded-md"
          >
            Deleted
          </button>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={onViewCalendar}
            className="bg-[#02245B] hover:bg-[#021d4a] text-white px-4 py-2 rounded-md flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            Calendar
          </button>

          <button
            onClick={onViewColumns}
            className="bg-[#02245B] hover:bg-[#021d4a] text-white px-4 py-2 rounded-md flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            Columns
          </button>
        </div>
      </div>

      <div className="mb-4">
        <SearchBar 
          value={filters.search} 
          onChange={(value) => onFilterChange({ search: value })} 
          placeholder="Search work orders..." 
        />
      </div>

      <div className="mb-4">
        <FilterOptions 
          filters={filters} 
          onChange={onFilterChange} 
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
                Due Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Equipment
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Assignee
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {workOrders.length > 0 ? (
              workOrders.map((workOrder) => (
                <tr 
                  key={workOrder.id} 
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => onSelectWorkOrder(workOrder.id)}
                >
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
                    {formatDate(workOrder.dueDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {workOrder.equipment?.name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {workOrder.location?.name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {workOrder.primaryAssignee ? 
                      `${workOrder.primaryAssignee.firstName} ${workOrder.primaryAssignee.lastName}` : 
                      'Unassigned'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectWorkOrder(workOrder.id);
                      }}
                      className="text-[#02245B] hover:text-[#021d4a] mr-3"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="px-6 py-4 text-center text-sm text-gray-500">
                  No work orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4">
        <Pagination 
          currentPage={filters.page} 
          onPageChange={onPageChange} 
          totalPages={filters.totalPages || 1} 
        />
      </div>
    </div>
  );
};

export default WorkOrderList;

