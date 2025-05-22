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

const DashboardHome = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [view, setView] = useState('calendar');
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
 const API_URL = 'http://localhost:5000';

 
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const viewParam = params.get('view');
    const idParam = params.get('id');

    if (viewParam) setView(viewParam);
    if (idParam && (viewParam === 'details' || viewParam === 'edit') && idParam !== selectedWorkOrder?.id) {
      fetchWorkOrderById(idParam);
    }
    if (["list", "calendar", "columns", "deleted"].includes(viewParam)) {
      fetchWorkOrders();
    }
  }, [location.search]);

  useEffect(() => {
  if (['list', 'calendar', 'columns', 'deleted'].includes(view)) {
    fetchWorkOrders();
  }
}, [view, filters]);

  const fetchWorkOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { ...filters };
      const endpoint = view === 'deleted'
        ? `${API_URL}/api/work-orders/deleted`
        : `${API_URL}/api/work-orders`;

      const response = await axios.get(endpoint, {
        params,
        withCredentials: true
      });
      if (response.data?.data) {
        setWorkOrders(response.data.data.items || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching work orders');
      console.error('Error fetching work orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchWorkOrderById = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/api/work-orders/${id}`, { withCredentials: true });
      if (response.data?.data) {
        setSelectedWorkOrder(response.data.data);
      }
      console.log(response.data.data)

    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching work order details');
      console.error('Error fetching work order details:', err);
      navigate('/dashboard/work-orders?view=list');
    } finally {
      setLoading(false);
    }
  };

  const createWorkOrder = async (workOrderData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_URL}/api/work-orders`, workOrderData, { withCredentials: true });
      if (response.data?.data) {
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

  const updateWorkOrder = async (id, workOrderData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put(`${API_URL}/api/work-orders/${id}`, workOrderData, { withCredentials: true });
      if (response.data?.data) {
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

  const deleteWorkOrder = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`${API_URL}/api/work-orders/${id}`, { withCredentials: true });
      setSuccess('Work order deleted successfully');
      if (selectedWorkOrder?.id === id) {
        navigate('/dashboard/work-orders?view=list');
      } else {
        fetchWorkOrders();
      }
    } catch (err) {
       console.error('Error deleting work order:', err);
  setError(err.response?.data?.message || 'Error deleting work order');
    } finally {
      setLoading(false);
    }
  };

const restoreWorkOrder = async (id) => {
  setLoading(true);
  setError(null);
  try {
    await axios.put(`${API_URL}/api/work-orders/${id}/restore`, null, { withCredentials: true });
    setSuccess('Work order restored successfully');

    setWorkOrders(prev => prev.filter(order => order.id !== id));
  } catch (err) {
    setError(err.response?.data?.message || 'Error restoring work order');
    console.error('Error restoring work order:', err);
  } finally {
    setLoading(false);
  }
};
  const handleStatusChange = async (workOrderId, newStatus) => {
    try {
      await axios.put(`${API_URL}/api/work-orders/${workOrderId}`, { status: newStatus }, { withCredentials: true });
      fetchWorkOrders();
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating work order status');
      console.error('Error updating work order status:', err);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const changeView = (newView, workOrderId = null) => {
    const params = new URLSearchParams();
    params.set('view', newView);
    if (workOrderId && ['details', 'edit'].includes(newView)) {
      params.set('id', workOrderId);
    }
    navigate(`/dashboard/work-orders?${params.toString()}`);
  };

  const renderContent = () => {
    if (loading) return <Loading />;
    switch (view) {
      case 'create':
        return <WorkOrderForm onSubmit={createWorkOrder} onCancel={() => changeView('list')} />;
      case 'edit':
        return <WorkOrderForm workOrder={selectedWorkOrder} onSubmit={(data) => updateWorkOrder(selectedWorkOrder.id, data)} onCancel={() => changeView('details', selectedWorkOrder.id)} />;
      case 'details':
        return <WorkOrderDetails workOrder={selectedWorkOrder} onEdit={() => changeView('edit', selectedWorkOrder.id)} onDelete={() => deleteWorkOrder(selectedWorkOrder.id)} onBack={() => changeView('list')} />;
      case 'calendar':
        return <WorkOrderCalendarView workOrders={workOrders} onSelectWorkOrder={(id) => changeView('details', id)} />;
      case 'columns':
        return <WorkOrderColumnView workOrders={workOrders} onSelectWorkOrder={(id) => changeView('details', id)} onStatusChange={handleStatusChange} />;
      case 'deleted':
        return <DeletedWorkOrdersList workOrders={workOrders} onRestore={restoreWorkOrder} onViewDetails={(id) => changeView('details', id)} />;
      case 'list':
      default:
        return <WorkOrderList workOrders={workOrders} filters={filters} onFilterChange={handleFilterChange} onPageChange={handlePageChange} onSelectWorkOrder={(id) => changeView('details', id)} onCreateNew={() => changeView('create')} onViewDeleted={() => changeView('deleted')} onViewCalendar={() => changeView('calendar')} onViewColumns={() => changeView('columns')} />;
    }
  };

  return (
    <div>
      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} />}
      {renderContent()}
    </div>
  );
};

export default DashboardHome;
