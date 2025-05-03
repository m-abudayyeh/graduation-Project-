// src/components/locations/LocationList.jsx
import { useState } from 'react';

const LocationList = ({ locations = [], onView, onEdit, onDelete, onRestore }) => {
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  // Make sure locations is an array before spreading it
  const sortedLocations = Array.isArray(locations) ? [...locations].sort((a, b) => {
    const aValue = a[sortField] || '';
    const bValue = b[sortField] || '';
    
    if (sortDirection === 'asc') {
      return aValue.toString().localeCompare(bValue.toString());
    } else {
      return bValue.toString().localeCompare(aValue.toString());
    }
  }) : [];
  
  const getlocationPictureUrl = (path) => {
    if (!path) return null;
    
    // Make sure we have a properly formatted path
    if (path.startsWith('http')) {
      return path;
    } else {
      // Ensure there's only one slash between server and path
      return `http://localhost:5000${path.startsWith('/') ? '' : '/'}${path}`;
    }
  };

  // Handle row click to view location details
  const handleRowClick = (locationId, event) => {
    // Only trigger if the click is not on a button or its children
    if (!event.target.closest('button')) {
      onView(locationId);
    }
  };

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th 
              scope="col" 
              className="px-2 sm:px-4 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('name')}
            >
              Name
              {sortField === 'name' && (
                <span className="ml-1">
                  {sortDirection === 'asc' ? '▲' : '▼'}
                </span>
              )}
            </th>
            <th 
              scope="col" 
              className="hidden sm:table-cell px-2 sm:px-4 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('address')}
            >
              Address
              {sortField === 'address' && (
                <span className="ml-1">
                  {sortDirection === 'asc' ? '▲' : '▼'}
                </span>
              )}
            </th>
            {/* <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th> */}
            <th scope="col" className="px-2 sm:px-4 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedLocations.length > 0 ? (
            sortedLocations.map((location) => (
              <tr 
                key={location.id} 
                className={`${location.deletedAt ? 'bg-red-50' : ''} cursor-pointer hover:bg-gray-50`}
                onClick={(e) => handleRowClick(location.id, e)}
              >
                <td className="px-2 sm:px-4 md:px-6 py-2 md:py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {location.image ? (
                      <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10 mr-2 sm:mr-4">
                        <img className="h-8 w-8 sm:h-10 sm:w-10 rounded-full object-cover"
                        src={getlocationPictureUrl(location.image)}  alt={location.name} />
                      </div>
                    ) : (
                      <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10 mr-2 sm:mr-4 bg-gray-200 rounded-full flex items-center justify-center">
                        <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                    <div className="text-xs sm:text-sm font-medium text-gray-900">{location.name}</div>
                  </div>
                </td>
                <td className="hidden sm:table-cell px-2 sm:px-4 md:px-6 py-2 md:py-4 whitespace-nowrap">
                  <div className="text-xs sm:text-sm text-gray-900">{location.address || 'N/A'}</div>
                </td>
           
                <td className="px-2 sm:px-4 md:px-6 py-2 md:py-4 whitespace-nowrap text-left text-xs sm:text-sm font-medium">
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
                
                    <button 
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent the row click from triggering
                        onEdit(location);
                      }} 
                      className="text-[#5F656F] hover:text-gray-700 sm:mr-3"
                    >
                      Edit
                    </button>
                    {location.deletedAt ? (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent the row click from triggering
                          onRestore(location.id);
                        }} 
                        className="text-green-600 hover:text-green-800"
                      >
                        Restore
                      </button>
                    ) : (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent the row click from triggering
                          onDelete(location.id);
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
              <td colSpan="4" className="px-2 sm:px-4 md:px-6 py-2 md:py-4 text-center text-gray-500">
                No locations found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LocationList;