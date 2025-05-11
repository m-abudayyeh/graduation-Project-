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

// Setup the localizer
const localizer = momentLocalizer(moment);

// Apply drag and drop functionality to the Calendar
const DragAndDropCalendar = withDragAndDrop(Calendar);

const WorkOrderCalendarView = ({ workOrders, onSelectWorkOrder }) => {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Convert work orders to calendar events
  useEffect(() => {
    if (workOrders && workOrders.length > 0) {
      const calendarEvents = workOrders.map(workOrder => ({
        id: workOrder.id,
        title: workOrder.title,
        start: workOrder.startDate ? new Date(workOrder.startDate) : new Date(workOrder.dueDate),
        end: workOrder.dueDate ? new Date(workOrder.dueDate) : new Date(workOrder.startDate),
        workOrder: workOrder, // Store the original work order data
      }));
      
      setEvents(calendarEvents);
    } else {
      setEvents([]);
    }
  }, [workOrders]);
  
  // Handle event drag (move to different date)
  const handleEventDrop = useCallback(
    async ({ event, start, end }) => {
      setLoading(true);
      setError(null);
      
      // Format the dates
      const startDate = moment(start).format('YYYY-MM-DD');
      const dueDate = moment(end).format('YYYY-MM-DD');
      
      try {
        // Update work order dates in the database
        await axios.put(`/api/work-orders/${event.id}`, {
          startDate: startDate,
          dueDate: dueDate
        });
        
        // Update local state
        setEvents(prevEvents => {
          return prevEvents.map(prevEvent => {
            if (prevEvent.id === event.id) {
              return { ...prevEvent, start, end };
            }
            return prevEvent;
          });
        });
        
        setSuccess(`Work order "${event.title}" rescheduled successfully`);
      } catch (err) {
        setError(err.response?.data?.message || 'Error updating work order dates');
        console.error('Error updating work order dates:', err);
      } finally {
        setLoading(false);
      }
    },
    []
  );
  
  // Handle event resize (change duration)
  const handleEventResize = useCallback(
    async ({ event, start, end }) => {
      setLoading(true);
      setError(null);
      
      // Format the dates
      const startDate = moment(start).format('YYYY-MM-DD');
      const dueDate = moment(end).format('YYYY-MM-DD');
      
      try {
        // Update work order dates in the database
        await axios.put(`/api/work-orders/${event.id}`, {
          startDate: startDate,
          dueDate: dueDate
        });
        
        // Update local state
        setEvents(prevEvents => {
          return prevEvents.map(prevEvent => {
            if (prevEvent.id === event.id) {
              return { ...prevEvent, start, end };
            }
            return prevEvent;
          });
        });
        
        setSuccess(`Work order "${event.title}" duration updated successfully`);
      } catch (err) {
        setError(err.response?.data?.message || 'Error updating work order dates');
        console.error('Error updating work order dates:', err);
      } finally {
        setLoading(false);
      }
    },
    []
  );
  
  // Custom event component to show work order details
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
  
  // Custom toolbar component
  const CustomToolbar = (toolbar) => {
    const goToBack = () => {
      toolbar.onNavigate('PREV');
    };
    
    const goToNext = () => {
      toolbar.onNavigate('NEXT');
    };
    
    const goToCurrent = () => {
      toolbar.onNavigate('TODAY');
    };
    
    const label = () => {
      const date = moment(toolbar.date);
      return (
        <span className="text-lg font-semibold text-[#02245B]">
          {date.format('MMMM YYYY')}
        </span>
      );
    };
    
    return (
      <div className="flex items-center justify-between mb-4">
        <div>{label()}</div>
        
        <div className="flex space-x-2">
          <button
            onClick={goToBack}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#02245B]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          
          <button
            onClick={goToCurrent}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#02245B]"
          >
            Today
          </button>
          
          <button
            onClick={goToNext}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#02245B]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          
          <div className="ml-4 flex space-x-2">
            <button
              onClick={() => toolbar.onView('month')}
              className={`inline-flex items-center px-3 py-2 border text-sm leading-4 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#02245B] ${
                toolbar.view === 'month' 
                  ? 'border-[#02245B] text-white bg-[#02245B]' 
                  : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
              }`}
            >
              Month
            </button>
            
            <button
              onClick={() => toolbar.onView('week')}
              className={`inline-flex items-center px-3 py-2 border text-sm leading-4 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#02245B] ${
                toolbar.view === 'week' 
                  ? 'border-[#02245B] text-white bg-[#02245B]' 
                  : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
              }`}
            >
              Week
            </button>
            
            <button
              onClick={() => toolbar.onView('day')}
              className={`inline-flex items-center px-3 py-2 border text-sm leading-4 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#02245B] ${
                toolbar.view === 'day' 
                  ? 'border-[#02245B] text-white bg-[#02245B]' 
                  : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
              }`}
            >
              Day
            </button>
            
            <button
              onClick={() => toolbar.onView('agenda')}
              className={`inline-flex items-center px-3 py-2 border text-sm leading-4 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#02245B] ${
                toolbar.view === 'agenda' 
                  ? 'border-[#02245B] text-white bg-[#02245B]' 
                  : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
              }`}
            >
              Agenda
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  // Event styles
  const eventStyleGetter = (event) => {
    const { workOrder } = event;
    let backgroundColor = '#3788d8'; // Default blue
    
    // Set color based on priority or status
    switch (workOrder.priority) {
      case 'high':
        backgroundColor = '#ef4444'; // Red
        break;
      case 'medium':
        backgroundColor = '#f97316'; // Orange
        break;
      case 'low':
        backgroundColor = '#22c55e'; // Green
        break;
      default:
        break;
    }
    
    // If completed, make it gray regardless of priority
    if (workOrder.status === 'completed') {
      backgroundColor = '#6b7280'; // Gray
    }
    
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
        components={{
          event: EventComponent,
          toolbar: CustomToolbar
        }}
        eventPropGetter={eventStyleGetter}
        onSelectEvent={(event) => onSelectWorkOrder(event.id)}
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