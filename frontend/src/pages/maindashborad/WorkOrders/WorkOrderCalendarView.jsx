// src/pages/maindashborad/WorkOrders/WorkOrderCalendarView.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import axios from 'axios';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';
import Alert from './Alert';

const localizer = momentLocalizer(moment);
const DragAndDropCalendar = withDragAndDrop(Calendar);

const WorkOrderCalendarView = ({ workOrders, onSelectWorkOrder }) => {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (workOrders?.length) {
      const calendarEvents = workOrders.map(workOrder => ({
        id: workOrder.id,
        title: workOrder.title,
        start: workOrder.startDate ? new Date(workOrder.startDate) : new Date(workOrder.dueDate),
        end: workOrder.dueDate ? new Date(workOrder.dueDate) : new Date(workOrder.startDate),
        workOrder
      }));
      setEvents(calendarEvents);
    } else {
      setEvents([]);
    }
  }, [workOrders]);

  const updateDates = async (id, start, end, updateMessage) => {
    setLoading(true);
    setError(null);
    const startDate = moment(start).format('YYYY-MM-DD');
    const dueDate = moment(end).format('YYYY-MM-DD');
    try {
      await axios.put(`http://localhost:5000/api/work-orders/${id}`, { startDate, dueDate }, {
        withCredentials: true
      });
      setEvents(prev => prev.map(ev => ev.id === id ? { ...ev, start, end } : ev));
      setSuccess(updateMessage);
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating work order dates');
      console.error('Error updating work order dates:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEventDrop = useCallback(({ event, start, end }) => {
    updateDates(event.id, start, end, `Work order "${event.title}" rescheduled successfully`);
  }, []);

  const handleEventResize = useCallback(({ event, start, end }) => {
    updateDates(event.id, start, end, `Work order "${event.title}" duration updated successfully`);
  }, []);

  const EventComponent = ({ event }) => {
    const { workOrder } = event;
    return (
      <div className="p-1 overflow-hidden h-full">
        <div className="font-medium text-xs truncate">{workOrder.title}</div>
        <div className="flex items-center justify-between mt-1">
          <StatusBadge status={workOrder.status} />
          <PriorityBadge priority={workOrder.priority} />
        </div>
      </div>
    );
  };

  const CustomToolbar = (toolbar) => {
    const goTo = dir => toolbar.onNavigate(dir);
    const viewBtn = (view) => (
      <button
        onClick={() => toolbar.onView(view)}
        className={`inline-flex items-center px-3 py-2 border text-sm leading-4 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#02245B] ${
          toolbar.view === view
            ? 'border-[#02245B] text-white bg-[#02245B]'
            : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
        }`}
      >
        {view.charAt(0).toUpperCase() + view.slice(1)}
      </button>
    );

    return (
      <div className="flex items-center justify-between mb-4">
        <div className="text-lg font-semibold text-[#02245B]">{moment(toolbar.date).format('MMMM YYYY')}</div>
        <div className="flex space-x-2">
          <button onClick={() => goTo('PREV')} className="btn-nav">←</button>
          <button onClick={() => goTo('TODAY')} className="btn-nav">Today</button>
          <button onClick={() => goTo('NEXT')} className="btn-nav">→</button>
          <div className="ml-4 flex space-x-2">
            {['month', 'week', 'day', 'agenda'].map(viewBtn)}
          </div>
        </div>
      </div>
    );
  };

  const eventStyleGetter = ({ workOrder }) => {
    let backgroundColor = '#3788d8';
    switch (workOrder.priority) {
      case 'high': backgroundColor = '#ef4444'; break;
      case 'medium': backgroundColor = '#f97316'; break;
      case 'low': backgroundColor = '#22c55e'; break;
    }
    if (workOrder.status === 'completed') backgroundColor = '#6b7280';
    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block'
      }
    };
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} />}

      {loading && (
        <div className="fixed top-4 right-4 z-50 bg-white p-2 rounded-md shadow-md">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-[#FF5E14] mr-2"></div>
            <span className="text-sm text-gray-600">Updating...</span>
          </div>
        </div>
      )}

      <div className="mb-4 p-3 bg-[#F5F5F5] rounded-md text-sm text-[#5F656F]">
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#02245B]" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <span>Tip: Drag and drop work orders to reschedule them. Drag the edges to change duration.</span>
        </div>
      </div>

      <DragAndDropCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 700 }}
        views={['month', 'week', 'day', 'agenda']}
        defaultView="month"
        components={{ event: EventComponent, toolbar: CustomToolbar }}
        eventPropGetter={eventStyleGetter}
        onSelectEvent={event => onSelectWorkOrder(event.id)}
        onEventDrop={handleEventDrop}
        onEventResize={handleEventResize}
        resizable
        popup
        selectable
      />
    </div>
  );
};

export default WorkOrderCalendarView;
