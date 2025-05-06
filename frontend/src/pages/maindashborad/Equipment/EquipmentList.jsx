// src/components/Equipment/EquipmentList.jsx
import { useState } from 'react';

const EquipmentList = ({ equipment = [], onView, onEdit, onDelete, onRestore, onUpdateStatus }) => {
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [statusUpdating, setStatusUpdating] = useState(null);
  
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  // Make sure equipment is an array before spreading it
  const sortedEquipment = Array.isArray(equipment) ? [...equipment].sort((a, b) => {
    const aValue = a[sortField] || '';
    const bValue = b[sortField] || '';
    
    if (sortDirection === 'asc') {
      return String(aValue).localeCompare(String(bValue));
    } else {
      return String(bValue).localeCompare(String(aValue));
    }
  }) : [];
  
  const getImageUrl = (path) => {
    if (!path) return null;
    
    // Make sure we have a properly formatted path
    if (path.startsWith('http')) {
      return path;
    } else {
      // Ensure there's only one slash between server and path
      return `http://localhost:5000${path.startsWith('/') ? '' : '/'}${path}`;
    }
  };

  // Handle row click to view equipment details
  const handleRowClick = (equipmentId, event) => {
    // Only trigger if the click is not on a button or select
    if (!event.target.closest('button') && !event.target.closest('select')) {
      onView(equipmentId);
    }
  };
  
  // Format status for display
  const formatStatus = (status) => {
    if (!status) return 'N/A';
    return status.replace('_', ' ').replace(/\b\w/g, char => char.toUpperCase());
  };
  
  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'running':
        return 'bg-green-100 text-green-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      case 'out_of_service':
        return 'bg-red-100 text-red-800';
      case 'standby':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Handle status change
  const handleStatusChange = async (id, status) => {
    setStatusUpdating(id);
    try {
      await onUpdateStatus(id, status);
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setStatusUpdating(null);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th 
              scope="col" 
              className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('name')}
            >
              Equipment
              {sortField === 'name' && (
                <span className="ml-1">
                  {sortDirection === 'asc' ? '▲' : '▼'}
                </span>
              )}
            </th>
            <th 
              scope="col" 
              className="hidden sm:table-cell px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('model')}
            >
              Model
              {sortField === 'model' && (
                <span className="ml-1">
                  {sortDirection === 'asc' ? '▲' : '▼'}
                </span>
              )}
            </th>
            <th 
              scope="col" 
              className="hidden md:table-cell px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('category')}
            >
              Category
              {sortField === 'category' && (
                <span className="ml-1">
                  {sortDirection === 'asc' ? '▲' : '▼'}
                </span>
              )}
            </th>
            <th 
              scope="col" 
              className="hidden lg:table-cell px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
            >
              Location
            </th>
            <th 
              scope="col" 
              className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('status')}
            >
              Status
              {sortField === 'status' && (
                <span className="ml-1">
                  {sortDirection === 'asc' ? '▲' : '▼'}
                </span>
              )}
            </th>
            <th 
              scope="col" 
              className="hidden xl:table-cell px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('nextMaintenanceDate')}
            >
              Next Maintenance
              {sortField === 'nextMaintenanceDate' && (
                <span className="ml-1">
                  {sortDirection === 'asc' ? '▲' : '▼'}
                </span>
              )}
            </th>
            <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedEquipment.length > 0 ? (
            sortedEquipment.map((equipment) => (
              <tr 
                key={equipment.id} 
                className={`${equipment.isDeleted ? 'bg-red-50' : ''} cursor-pointer hover:bg-gray-50`}
                onClick={(e) => handleRowClick(equipment.id, e)}
              >
                <td className="px-3 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {equipment.image ? (
                      <div className="flex-shrink-0 h-10 w-10 mr-4">
                        <img className="h-10 w-10 rounded-full object-cover"
                        src={getImageUrl(equipment.image)} alt={equipment.name} />
                      </div>
                    ) : (
                      <div className="flex-shrink-0 h-10 w-10 mr-4 bg-gray-200 rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    <div className="text-sm font-medium text-gray-900">{equipment.name}</div>
                  </div>
                </td>
                <td className="hidden sm:table-cell px-3 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{equipment.model || 'N/A'}</div>
                </td>
                <td className="hidden md:table-cell px-3 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{equipment.category || 'N/A'}</div>
                </td>
                <td className="hidden lg:table-cell px-3 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{equipment.location?.name || 'N/A'}</div>
                </td>
                <td className="px-3 py-4 whitespace-nowrap">
                  {equipment.isDeleted ? (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                      Deleted
                    </span>
                  ) : (
                    <div className="text-sm" onClick={(e) => e.stopPropagation()}>
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(equipment.status)}`}>
                        {formatStatus(equipment.status)}
                      </span>
                      {!equipment.isDeleted && (
                        <select
                          value={equipment.status || ''}
                          onChange={(e) => handleStatusChange(equipment.id, e.target.value)}
                          disabled={statusUpdating === equipment.id}
                          className="ml-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#02245B]"
                        >
                          <option value="" disabled>Change status</option>
                          <option value="running">Running</option>
                          <option value="maintenance">Maintenance</option>
                          <option value="out_of_service">Out of Service</option>
                          <option value="standby">Standby</option>
                        </select>
                      )}
                    </div>
                  )}
                </td>
                <td className="hidden xl:table-cell px-3 py-4 whitespace-nowrap">
                  <div className={`text-sm ${equipment.nextMaintenanceDate && new Date(equipment.nextMaintenanceDate) <= new Date() ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                    {formatDate(equipment.nextMaintenanceDate)}
                  </div>
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex flex-col sm:flex-row gap-2">
                    {!equipment.isDeleted && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent the row click from triggering
                          onEdit(equipment);
                        }}
                        className="text-[#5F656F] hover:text-gray-700"
                      >
                        Edit
                      </button>
                    )}
                    
                    {equipment.isDeleted ? (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent the row click from triggering
                          onRestore(equipment.id);
                        }}
                        className="text-green-600 hover:text-green-800"
                      >
                        Restore
                      </button>
                    ) : (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent the row click from triggering
                          onDelete(equipment.id);
                        }}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="px-3 py-4 text-center text-gray-500">
                No equipment found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EquipmentList;