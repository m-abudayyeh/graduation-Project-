// src/pages/maindashborad/WorkOrders/WorkOrderDetails.jsx
import React, { useState } from 'react';
import axios from 'axios';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';
import WorkOrderPartsSection from './WorkOrderPartsSection';
import WorkOrderImagesSection from './WorkOrderImagesSection';
import DeleteConfirmModal from './DeleteConfirmModal';
import Alert from './Alert';
import Loading from './Loading';

const WorkOrderDetails = ({ workOrder, onEdit, onDelete, onBack }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  // Handle status change
  const handleStatusChange = async (newStatus) => {
    setStatusUpdateLoading(true);
    setError(null);
    
    try {
      const response = await axios.put(`/api/work-orders/${workOrder.id}`, {
        status: newStatus
      });
      
      if (response.data && response.data.data) {
        // Update the work order in parent component (this will cause a re-render)
        workOrder.status = newStatus;
        
        setSuccess(`Status updated to ${newStatus}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating status');
      console.error('Error updating status:', err);
    } finally {
      setStatusUpdateLoading(false);
    }
  };
  
  if (!workOrder) {
    return <Loading />;
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      {/* Header with actions */}
      <div className="px-6 py-4 border-b border-gray-200 flex flex-wrap items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#02245B]">{workOrder.title}</h2>
          <p className="text-gray-500">#{workOrder.workOrderNumber}</p>
        </div>
        
        <div className="flex space-x-2 mt-2 sm:mt-0">
          <button
            onClick={onBack}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#02245B]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back
          </button>
          
          <button
            onClick={onEdit}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#02245B]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            Edit
          </button>
          
          <button
            onClick={() => setShowDeleteModal(true)}
            className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Delete
          </button>
        </div>
      </div>
      
      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} />}
      
      {/* Status and priority */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <span className="text-sm font-medium text-gray-500">Status:</span>
            <div className="mt-1">
              {statusUpdateLoading ? (
                <div className="inline-block">
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-[#FF5E14]"></div>
                </div>
              ) : (
                <div className="relative">
                  <select
                    value={workOrder.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="block pl-3 pr-10 py-1 text-base border-gray-300 focus:outline-none focus:ring-[#02245B] focus:border-[#02245B] sm:text-sm rounded-md"
                  >
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="on_hold">On Hold</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <span className="text-sm font-medium text-gray-500">Priority:</span>
            <div className="mt-1">
              <PriorityBadge priority={workOrder.priority} />
            </div>
          </div>
          
          <div>
            <span className="text-sm font-medium text-gray-500">Category:</span>
            <div className="mt-1 text-sm text-gray-900">{workOrder.category || 'N/A'}</div>
          </div>
          
          <div>
            <span className="text-sm font-medium text-gray-500">Type:</span>
            <div className="mt-1 text-sm text-gray-900">
              {workOrder.isPreventive ? 'Preventive' : 'Corrective'}
            </div>
          </div>
        </div>
      </div>
      
      {/* Dates and assignment */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <span className="text-sm font-medium text-gray-500">Start Date:</span>
            <div className="mt-1 text-sm text-gray-900">{formatDate(workOrder.startDate)}</div>
          </div>
          
          <div>
            <span className="text-sm font-medium text-gray-500">Due Date:</span>
            <div className="mt-1 text-sm text-gray-900">{formatDate(workOrder.dueDate)}</div>
          </div>
          
          <div>
            <span className="text-sm font-medium text-gray-500">Created:</span>
            <div className="mt-1 text-sm text-gray-900">{formatDate(workOrder.createdAt)}</div>
          </div>
          
          <div>
            <span className="text-sm font-medium text-gray-500">Completed:</span>
            <div className="mt-1 text-sm text-gray-900">{formatDate(workOrder.completionDate)}</div>
          </div>
        </div>
      </div>
      
      {/* Location and Equipment */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="text-sm font-medium text-gray-500">Location:</span>
            <div className="mt-1 text-sm text-gray-900">
              {workOrder.location ? workOrder.location.name : 'N/A'}
            </div>
          </div>
          
          <div>
            <span className="text-sm font-medium text-gray-500">Equipment:</span>
            <div className="mt-1 text-sm text-gray-900">
              {workOrder.equipment ? workOrder.equipment.name : 'N/A'}
            </div>
          </div>
        </div>
      </div>
      
      {/* Assignees */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="text-sm font-medium text-gray-500">Primary Assignee:</span>
            <div className="mt-1 text-sm text-gray-900">
              {workOrder.primaryAssignee ? 
                `${workOrder.primaryAssignee.firstName} ${workOrder.primaryAssignee.lastName}` : 
                'Unassigned'}
            </div>
          </div>
          
          <div>
            <span className="text-sm font-medium text-gray-500">Secondary Assignee:</span>
            <div className="mt-1 text-sm text-gray-900">
              {workOrder.secondaryAssignee ? 
                `${workOrder.secondaryAssignee.firstName} ${workOrder.secondaryAssignee.lastName}` : 
                'Unassigned'}
            </div>
          </div>
        </div>
      </div>
      
      {/* Description and Notes */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="mb-4">
          <span className="text-sm font-medium text-gray-500">Description:</span>
          <div className="mt-1 text-sm text-gray-900 whitespace-pre-line">
            {workOrder.description || 'No description provided.'}
          </div>
        </div>
        
        <div>
          <span className="text-sm font-medium text-gray-500">Notes:</span>
          <div className="mt-1 text-sm text-gray-900 whitespace-pre-line">
            {workOrder.notes || 'No notes available.'}
          </div>
        </div>
      </div>
      
      {/* Costs and Time */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <span className="text-sm font-medium text-gray-500">Estimated Cost:</span>
            <div className="mt-1 text-sm text-gray-900">
              {workOrder.estimatedCost ? `$${workOrder.estimatedCost}` : 'N/A'}
            </div>
          </div>
          
          <div>
            <span className="text-sm font-medium text-gray-500">Actual Cost:</span>
            <div className="mt-1 text-sm text-gray-900">
              {workOrder.actualCost ? `$${workOrder.actualCost}` : 'N/A'}
            </div>
          </div>
          
          <div>
            <span className="text-sm font-medium text-gray-500">Estimated Hours:</span>
            <div className="mt-1 text-sm text-gray-900">
              {workOrder.estimatedHours ? `${workOrder.estimatedHours} hrs` : 'N/A'}
            </div>
          </div>
          
          <div>
            <span className="text-sm font-medium text-gray-500">Actual Hours:</span>
            <div className="mt-1 text-sm text-gray-900">
              {workOrder.actualHours ? `${workOrder.actualHours} hrs` : 'N/A'}
            </div>
          </div>
        </div>
      </div>
      
      {/* Solution */}
      {workOrder.solution && (
        <div className="px-6 py-4 border-b border-gray-200">
          <span className="text-sm font-medium text-gray-500">Solution:</span>
          <div className="mt-1 text-sm text-gray-900 whitespace-pre-line">
            {workOrder.solution}
          </div>
        </div>
      )}
      
      {/* Tags */}
      {workOrder.tags && workOrder.tags.length > 0 && (
        <div className="px-6 py-4 border-b border-gray-200">
          <span className="text-sm font-medium text-gray-500">Tags:</span>
          <div className="mt-1 flex flex-wrap gap-2">
            {workOrder.tags.map((tag, index) => (
              <span 
                key={index} 
                className="inline-flex items-center bg-[#F5F5F5] px-2 py-1 rounded-md text-sm text-[#5F656F]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {/* Parts Section */}
      <div className="px-6 py-4 border-b border-gray-200">
        <WorkOrderPartsSection workOrder={workOrder} />
      </div>
      
      {/* Images Section */}
      <div className="px-6 py-4">
        <WorkOrderImagesSection workOrder={workOrder} />
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <DeleteConfirmModal
          title="Delete Work Order"
          message={`Are you sure you want to delete work order "${workOrder.title}"? This action cannot be undone.`}
          onConfirm={() => {
            setShowDeleteModal(false);
            onDelete();
          }}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  );
};

export default WorkOrderDetails;