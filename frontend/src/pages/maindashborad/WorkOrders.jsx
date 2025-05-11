// src/pages/maindashborad/WorkOrders.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import WorkOrderList from './WorkOrders/WorkOrderList';
import WorkOrderForm from './WorkOrders/WorkOrderForm';
import WorkOrderDetails from './WorkOrders/WorkOrderDetails';
import WorkOrderCalendarView from './WorkOrders/WorkOrderCalendarView';
import WorkOrderColumnView from './WorkOrders/WorkOrderColumnView';
import DeletedWorkOrdersList from './WorkOrders/DeletedWorkOrdersList';
import Loading from './WorkOrders/Loading';
import Alert from './WorkOrders/Alert';

const WorkOrders = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [view, setView] = useState('list'); // list, calendar, columns, details, create, edit, deleted
  const [workOrders, setWorkOrders] = useState([]);
  const [selectedWorkOrder, setSelectedWorkOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: '',
    status: '',
    priority: '',
    assigneeId: '',
    locationId: '',
    equipmentId: '',
    startDate: '',
    endDate: '',
  });

  // Parse URL params to determine the current view
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const viewParam = params.get('view');
    const idParam = params.get('id');
    
    if (viewParam) {
      setView(viewParam);
    }
    
    if (idParam && (viewParam === 'details' || viewParam === 'edit')) {
      fetchWorkOrderById(idParam);
    }
    
    if (viewParam === 'list' || viewParam === 'calendar' || viewParam === 'columns' || viewParam === 'deleted') {
      fetchWorkOrders();
    }
  }, [location.search]);

  // Fetch work orders based on current filters
  const fetchWorkOrders = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = { ...filters };
      
      // If viewing deleted work orders, adjust the endpoint
      const endpoint = view === 'deleted' ? '/api/work-orders/deleted' : '/api/work-orders';
      
      const response = await axios.get(endpoint, { params });
      
      if (response.data && response.data.data) {
        setWorkOrders(response.data.data.rows || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching work orders');
      console.error('Error fetching work orders:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch a single work order by ID
  const fetchWorkOrderById = async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`/api/work-orders/${id}`);
      
      if (response.data && response.data.data) {
        setSelectedWorkOrder(response.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching work order details');
      console.error('Error fetching work order details:', err);
      navigate('/dashboard/work-orders?view=list');
    } finally {
      setLoading(false);
    }
  };

  // Create a new work order
  const createWorkOrder = async (workOrderData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post('/api/work-orders', workOrderData);
      
      if (response.data && response.data.data) {
        setSuccess('Work order created successfully');
        navigate(`/dashboard/work-orders?view=details&id=${response.data.data.id}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating work order');
      console.error('Error creating work order:', err);
    } finally {
      setLoading(false);
    }
  };

  // Update an existing work order
  const updateWorkOrder = async (id, workOrderData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.put(`/api/work-orders/${id}`, workOrderData);
      
      if (response.data && response.data.data) {
        setSelectedWorkOrder(response.data.data);
        setSuccess('Work order updated successfully');
        navigate(`/dashboard/work-orders?view=details&id=${id}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating work order');
      console.error('Error updating work order:', err);
    } finally {
      setLoading(false);
    }
  };

  // Delete a work order
  const deleteWorkOrder = async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      await axios.delete(`/api/work-orders/${id}`);
      setSuccess('Work order deleted successfully');
      
      // If we just deleted the currently selected work order, go back to list
      if (selectedWorkOrder && selectedWorkOrder.id === id) {
        navigate('/dashboard/work-orders?view=list');
      } else {
        // Otherwise, just refresh the current list
        fetchWorkOrders();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error deleting work order');
      console.error('Error deleting work order:', err);
    } finally {
      setLoading(false);
    }
  };

  // Restore a deleted work order
  const restoreWorkOrder = async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      await axios.put(`/api/work-orders/${id}/restore`);
      setSuccess('Work order restored successfully');
      fetchWorkOrders();
    } catch (err) {
      setError(err.response?.data?.message || 'Error restoring work order');
      console.error('Error restoring work order:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters, page: 1 });
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    setFilters({ ...filters, page: newPage });
  };

  // Change the view
  const changeView = (newView, workOrderId = null) => {
    const params = new URLSearchParams();
    params.set('view', newView);
    
    if (workOrderId && (newView === 'details' || newView === 'edit')) {
      params.set('id', workOrderId);
    }
    
    navigate(`/dashboard/work-orders?${params.toString()}`);
  };

  // Render the appropriate component based on the current view
  const renderContent = () => {
    if (loading) {
      return <Loading />;
    }

    switch (view) {
      case 'create':
        return (
          <WorkOrderForm 
            onSubmit={createWorkOrder} 
            onCancel={() => changeView('list')} 
          />
        );
      
      case 'edit':
        return (
          <WorkOrderForm 
            workOrder={selectedWorkOrder} 
            onSubmit={(data) => updateWorkOrder(selectedWorkOrder.id, data)} 
            onCancel={() => changeView('details', selectedWorkOrder.id)} 
          />
        );
      
      case 'details':
        return (
          <WorkOrderDetails 
            workOrder={selectedWorkOrder} 
            onEdit={() => changeView('edit', selectedWorkOrder.id)} 
            onDelete={() => deleteWorkOrder(selectedWorkOrder.id)} 
            onBack={() => changeView('list')} 
          />
        );
      
      case 'calendar':
        return (
          <WorkOrderCalendarView 
            workOrders={workOrders} 
            onSelectWorkOrder={(id) => changeView('details', id)} 
          />
        );
      
      case 'columns':
        return (
          <WorkOrderColumnView 
            workOrders={workOrders} 
            onSelectWorkOrder={(id) => changeView('details', id)} 
          />
        );
      
      case 'deleted':
        return (
          <DeletedWorkOrdersList 
            workOrders={workOrders} 
            onRestore={restoreWorkOrder} 
            onViewDetails={(id) => changeView('details', id)} 
          />
        );
      
      case 'list':
      default:
        return (
          <WorkOrderList 
            workOrders={workOrders} 
            filters={filters}
            onFilterChange={handleFilterChange}
            onPageChange={handlePageChange}
            onSelectWorkOrder={(id) => changeView('details', id)} 
            onCreateNew={() => changeView('create')} 
            onViewDeleted={() => changeView('deleted')} 
            onViewCalendar={() => changeView('calendar')} 
            onViewColumns={() => changeView('columns')} 
          />
        );
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-[#02245B]">Work Orders</h1>
      
      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} />}
      
      {renderContent()}
    </div>
  );
};

export default WorkOrders;