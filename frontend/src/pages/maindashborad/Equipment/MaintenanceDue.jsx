// src/components/Equipment/MaintenanceDue.jsx
import { useState } from 'react';

const MaintenanceDue = ({ equipment = [], onView, onUpdateDates, setSuccess, setError }) => {
  const [updatingId, setUpdatingId] = useState(null);
  const [maintenanceDates, setMaintenanceDates] = useState({});
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  // Get image URL
  const getImageUrl = (path) => {
    if (!path) return null;
    
    if (path.startsWith('http')) {
      return path;
    } else {
      return `http://localhost:5000${path.startsWith('/') ? '' : '/'}${path}`;
    }
  };
  
  // Initialize maintenance dates when needed
  const initMaintenanceDates = (id) => {
    const item = equipment.find(e => e.id === id);
    if (item && !maintenanceDates[id]) {
      setMaintenanceDates({
        ...maintenanceDates,
        [id]: {
          lastMaintenanceDate: new Date().toISOString().split('T')[0],
          nextMaintenanceDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        }
      });
    }
  };
  
  // Handle maintenance date change
  const handleDateChange = (id, field, value) => {
    initMaintenanceDates(id);
    
    setMaintenanceDates({
      ...maintenanceDates,
      [id]: {
        ...maintenanceDates[id],
        [field]: value
      }
    });
  };
  
  // Complete maintenance
  const completeMaintenanceTask = async (id) => {
    try {
      setUpdatingId(id);
      
      // Initialize if not initialized yet
      initMaintenanceDates(id);
      
      await onUpdateDates(id, maintenanceDates[id]);
      
      setUpdatingId(null);
      setSuccess('Maintenance dates updated successfully');
    } catch (error) {
      setUpdatingId(null);
      console.error('Error updating maintenance dates:', error);
      setError('Failed to update maintenance dates');
    }
  };
  
  return (
    <div className="mb-6 bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 bg-[#02245B] text-white flex justify-between items-center">
        <h3 className="text-lg font-medium">
          Equipment Maintenance Due ({equipment.length})
        </h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Equipment
              </th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Maintenance
              </th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Next Maintenance
              </th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {equipment.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-3 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {item.image ? (
                      <div className="flex-shrink-0 h-10 w-10 mr-4">
                        <img 
                          className="h-10 w-10 rounded-full object-cover"
                          src={getImageUrl(item.image)} 
                          alt={item.name} 
                        />
                      </div>
                    ) : (
                      <div className="flex-shrink-0 h-10 w-10 mr-4 bg-gray-200 rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    <div 
                      className="text-sm font-medium text-blue-600 hover:text-blue-800 cursor-pointer"
                      onClick={() => onView(item.id)}
                    >
                      {item.name}
                    </div>
                  </div>
                </td>
                <td className="px-3 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{item.location?.name || 'N/A'}</div>
                </td>
                <td className="px-3 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {updatingId === item.id ? (
                      <input 
                        type="date" 
                        value={maintenanceDates[item.id]?.lastMaintenanceDate || ''}
                        onChange={(e) => handleDateChange(item.id, 'lastMaintenanceDate', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#02245B]"
                      />
                    ) : (
                      formatDate(item.lastMaintenanceDate)
                    )}
                  </div>
                </td>
                <td className="px-3 py-4 whitespace-nowrap">
                  <div className="text-sm text-red-600 font-medium">
                    {updatingId === item.id ? (
                      <input 
                        type="date" 
                        value={maintenanceDates[item.id]?.nextMaintenanceDate || ''}
                        onChange={(e) => handleDateChange(item.id, 'nextMaintenanceDate', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#02245B]"
                      />
                    ) : (
                      formatDate(item.nextMaintenanceDate)
                    )}
                  </div>
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center">
                    {updatingId === item.id ? (
                      <>
                        <button
                          onClick={() => completeMaintenanceTask(item.id)}
                          className="text-green-600 hover:text-green-800 mr-4"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setUpdatingId(null)}
                          className="text-gray-600 hover:text-gray-800"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => {
                          setUpdatingId(item.id);
                          initMaintenanceDates(item.id);
                        }}
                        className="text-[#FF5E14] hover:text-[#e05413]"
                      >
                        Complete Maintenance
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MaintenanceDue;