// src/pages/maindashborad/WorkOrders/WorkOrderColumnView.jsx
import React from 'react';
import PriorityBadge from './PriorityBadge';

const WorkOrderColumnView = ({ workOrders, onSelectWorkOrder }) => {
  // Group work orders by status
  const groupByStatus = () => {
    const grouped = {
      open: [],
      in_progress: [],
      on_hold: [],
      completed: []
    };
    
    if (workOrders && workOrders.length > 0) {
      workOrders.forEach(workOrder => {
        // Make sure status is one of our defined groups, default to 'open' if not
        const status = workOrder.status && grouped.hasOwnProperty(workOrder.status) 
          ? workOrder.status 
          : 'open';
        
        grouped[status].push(workOrder);
      });
    }
    
    return grouped;
  };
  
  const groupedWorkOrders = groupByStatus();
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  // Define columns with their titles and colors
  const columns = [
    { id: 'open', title: 'Open', color: 'bg-blue-50 border-blue-200' },
    { id: 'in_progress', title: 'In Progress', color: 'bg-yellow-50 border-yellow-200' },
    { id: 'on_hold', title: 'On Hold', color: 'bg-purple-50 border-purple-200' },
    { id: 'completed', title: 'Completed', color: 'bg-green-50 border-green-200' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-lg font-semibold text-[#02245B] mb-4">
        Work Orders by Status
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map(column => (
          <div key={column.id} className={`${column.color} rounded-md p-3 border`}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-700">{column.title}</h3>
              <div className="bg-white rounded-full py-1 px-2 text-xs font-medium text-gray-500 shadow-sm">
                {groupedWorkOrders[column.id].length}
              </div>
            </div>
            
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {groupedWorkOrders[column.id].length > 0 ? (
                groupedWorkOrders[column.id].map(workOrder => (
                  <div 
                    key={workOrder.id}
                    onClick={() => onSelectWorkOrder(workOrder.id)}
                    className="bg-white rounded-md p-3 shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="font-medium text-sm mb-1 truncate">
                      {workOrder.title}
                    </div>
                    
                    <div className="flex items-center text-xs text-gray-500 mb-2">
                      <span className="truncate">#{workOrder.workOrderNumber}</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 items-center justify-between">
                      <PriorityBadge priority={workOrder.priority} />
                      
                      <div className="text-xs text-gray-500">
                        {formatDate(workOrder.dueDate)}
                      </div>
                    </div>
                    
                    {workOrder.equipment && (
                      <div className="mt-2 flex items-center text-xs text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                        </svg>
                        <span className="truncate">{workOrder.equipment.name}</span>
                      </div>
                    )}
                    
                    {workOrder.primaryAssignee && (
                      <div className="mt-1 flex items-center text-xs text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                        <span className="truncate">
                          {`${workOrder.primaryAssignee.firstName} ${workOrder.primaryAssignee.lastName}`}
                        </span>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-sm text-gray-500">
                  No work orders
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkOrderColumnView;