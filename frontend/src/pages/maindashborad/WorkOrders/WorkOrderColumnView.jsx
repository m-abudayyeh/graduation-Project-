// src/pages/maindashborad/WorkOrders/WorkOrderColumnView.jsx
import React from 'react';
import PriorityBadge from './PriorityBadge';
// import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
const WorkOrderColumnView = ({ workOrders, onSelectWorkOrder, onStatusChange }) => {
  const groupByStatus = () => {
    const grouped = {
      open: [],
      in_progress: [],
      on_hold: [],
      completed: []
    };

    workOrders?.forEach(workOrder => {
      const status = grouped.hasOwnProperty(workOrder.status) ? workOrder.status : 'open';
      grouped[status].push(workOrder);
    });

    return grouped;
  };

  const groupedWorkOrders = groupByStatus();

  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    return new Date(dateString).toLocaleDateString();
  };

  const columns = [
    { id: 'open', title: 'Open', color: 'bg-blue-50 border-blue-200' },
    { id: 'in_progress', title: 'In Progress', color: 'bg-yellow-50 border-yellow-200' },
    { id: 'on_hold', title: 'On Hold', color: 'bg-purple-50 border-purple-200' },
    { id: 'completed', title: 'Completed', color: 'bg-green-50 border-green-200' }
  ];

  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;
    if (!destination || source.droppableId === destination.droppableId) return;
    if (onStatusChange) {
      onStatusChange(draggableId, destination.droppableId);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-lg font-semibold text-[#02245B] mb-4">Work Orders by Status</h2>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {columns.map(({ id, title, color }) => (
            <Droppable key={id} droppableId={id}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`${color} rounded-md p-3 border`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-gray-700">{title}</h3>
                    <div className="bg-white rounded-full py-1 px-2 text-xs font-medium text-gray-500 shadow-sm">
                      {groupedWorkOrders[id].length}
                    </div>
                  </div>
                  <div className="space-y-2 max-h-[600px] overflow-y-auto">
                    {groupedWorkOrders[id].length > 0 ? (
                      groupedWorkOrders[id].map((workOrder, index) => (
                        <Draggable draggableId={workOrder.id.toString()} index={index} key={workOrder.id}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              onClick={() => onSelectWorkOrder(workOrder.id)}
                              className=" bg-white rounded-md p-3 shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow duration-200"
                            >
                              <div className="font-medium text-sm mb-1 truncate">{workOrder.title}</div>
                              <div className="flex items-center text-xs text-gray-500 mb-2">
                                <span className="truncate">#{workOrder.workOrderNumber}</span>
                              </div>
                              <div className="flex flex-wrap gap-2 items-center justify-between">
                                <PriorityBadge priority={workOrder.priority} />
                                <div className="text-xs text-gray-500">{formatDate(workOrder.dueDate)}</div>
                              </div>
                              {workOrder.equipment?.name && (
                                <div className="mt-2 flex items-center text-xs text-gray-500">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0..." clipRule="evenodd" />
                                  </svg>
                                  <span className="truncate">{workOrder.equipment.name}</span>
                                </div>
                              )}
                              {workOrder.primaryAssignee && (
                                <div className="mt-1 flex items-center text-xs text-gray-500">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zM3 18a7 7 0 1114 0H3z" clipRule="evenodd" />
                                  </svg>
                                  <span className="truncate">{`${workOrder.primaryAssignee.firstName} ${workOrder.primaryAssignee.lastName}`}</span>
                                </div>
                              )}
                            </div>
                          )}
                        </Draggable>
                      ))
                    ) : (
                      <div className="text-center py-8 text-sm text-gray-500">No work orders</div>
                    )}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default WorkOrderColumnView;
