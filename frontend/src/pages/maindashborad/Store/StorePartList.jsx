// src/components/storeParts/StorePartList.jsx
import { useState } from 'react';

const StorePartList = ({ storeParts = [], onView, onEdit, onDelete, onRestore, onUpdateQuantity }) => {
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [quickQuantity, setQuickQuantity] = useState({});
  
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  // Make sure storeParts is an array before spreading it
  const sortedStoreParts = Array.isArray(storeParts) ? [...storeParts].sort((a, b) => {
    const aValue = a[sortField] || '';
    const bValue = b[sortField] || '';
    
    if (sortField === 'quantity') {
      return sortDirection === 'asc' 
        ? (parseInt(aValue) || 0) - (parseInt(bValue) || 0)
        : (parseInt(bValue) || 0) - (parseInt(aValue) || 0);
    }
    
    if (sortDirection === 'asc') {
      return aValue.toString().localeCompare(bValue.toString());
    } else {
      return bValue.toString().localeCompare(aValue.toString());
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

  // Handle row click to view store part details
  const handleRowClick = (storePartId, event) => {
    // Only trigger if the click is not on a button or input
    if (!event.target.closest('button') && !event.target.closest('input')) {
      onView(storePartId);
    }
  };
  
  // Handle quick quantity update
  const handleQuickQuantityChange = (id, value) => {
    setQuickQuantity({
      ...quickQuantity,
      [id]: parseInt(value) || 1
    });
  };
  
  // Add quantity
  const handleAddQuantity = (id) => {
    const qty = quickQuantity[id] || 1;
    onUpdateQuantity(id, qty, 'add');
  };
  
  // Remove quantity
  const handleRemoveQuantity = (id) => {
    const qty = quickQuantity[id] || 1;
    onUpdateQuantity(id, qty, 'subtract');
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
              Part
              {sortField === 'name' && (
                <span className="ml-1">
                  {sortDirection === 'asc' ? '▲' : '▼'}
                </span>
              )}
            </th>
            <th 
              scope="col" 
              className="hidden md:table-cell px-2 sm:px-4 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('partNumber')}
            >
              Part Number
              {sortField === 'partNumber' && (
                <span className="ml-1">
                  {sortDirection === 'asc' ? '▲' : '▼'}
                </span>
              )}
            </th>
            <th 
              scope="col" 
              className="hidden sm:table-cell px-2 sm:px-4 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
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
              className="hidden lg:table-cell px-2 sm:px-4 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('location')}
            >
              Location
              {sortField === 'location' && (
                <span className="ml-1">
                  {sortDirection === 'asc' ? '▲' : '▼'}
                </span>
              )}
            </th>
            <th 
              scope="col" 
              className="px-2 sm:px-4 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('quantity')}
            >
              Quantity
              {sortField === 'quantity' && (
                <span className="ml-1">
                  {sortDirection === 'asc' ? '▲' : '▼'}
                </span>
              )}
            </th>
            <th scope="col" className="px-2 sm:px-4 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedStoreParts.length > 0 ? (
            sortedStoreParts.map((storePart) => (
              <tr 
                key={storePart.id} 
                className={`${storePart.isDeleted ? 'bg-red-50' : ''} cursor-pointer hover:bg-gray-50`}
                onClick={(e) => handleRowClick(storePart.id, e)}
              >
                <td className="px-2 sm:px-4 md:px-6 py-2 md:py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {storePart.image ? (
                      <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10 mr-2 sm:mr-4">
                        <img className="h-8 w-8 sm:h-10 sm:w-10 rounded-full object-cover"
                        src={getImageUrl(storePart.image)} alt={storePart.name} />
                      </div>
                    ) : (
                      <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10 mr-2 sm:mr-4 bg-gray-200 rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                        </svg>
                      </div>
                    )}
                    <div className="text-xs sm:text-sm font-medium text-gray-900">{storePart.name}</div>
                  </div>
                </td>
                <td className="hidden md:table-cell px-2 sm:px-4 md:px-6 py-2 md:py-4 whitespace-nowrap">
                  <div className="text-xs sm:text-sm text-gray-900">{storePart.partNumber || 'N/A'}</div>
                </td>
                <td className="hidden sm:table-cell px-2 sm:px-4 md:px-6 py-2 md:py-4 whitespace-nowrap">
                  <div className="text-xs sm:text-sm text-gray-900">{storePart.category || 'N/A'}</div>
                </td>
                <td className="hidden lg:table-cell px-2 sm:px-4 md:px-6 py-2 md:py-4 whitespace-nowrap">
                  <div className="text-xs sm:text-sm text-gray-900">{storePart.location || 'N/A'}</div>
                </td>
                <td className="px-2 sm:px-4 md:px-6 py-2 md:py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm font-medium ${storePart.quantity <= 5 ? 'text-red-600' : 'text-gray-900'}`}>
                      {storePart.quantity}
                    </span>
                    {!storePart.isDeleted && (
                      <div className="flex items-center ml-2" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="number"
                          min="1"
                          value={quickQuantity[storePart.id] || 1}
                          onChange={(e) => handleQuickQuantityChange(storePart.id, e.target.value)}
                          className="w-12 px-1 py-1 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#02245B]"
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddQuantity(storePart.id);
                          }}
                          className="ml-1 p-1 text-green-600 hover:text-green-800"
                          title="Add quantity"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveQuantity(storePart.id);
                          }}
                          className="ml-1 p-1 text-red-600 hover:text-red-800"
                          title="Remove quantity"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-2 sm:px-4 md:px-6 py-2 md:py-4 whitespace-nowrap text-left text-xs sm:text-sm font-medium">
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    {!storePart.isDeleted && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent the row click from triggering
                          onEdit(storePart);
                        }} 
                        className="text-[#5F656F] hover:text-gray-700"
                      >
                        Edit
                      </button>
                    )}
                    
                    {storePart.isDeleted ? (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent the row click from triggering
                          onRestore(storePart.id);
                        }} 
                        className="text-green-600 hover:text-green-800"
                      >
                        Restore
                      </button>
                    ) : (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent the row click from triggering
                          onDelete(storePart.id);
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
              <td colSpan="6" className="px-2 sm:px-4 md:px-6 py-2 md:py-4 text-center text-gray-500">
                No store parts found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StorePartList;