import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Eye, CheckCircle, Circle, Trash2 } from 'lucide-react';

const CustomSolutionsMassege = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Fetch all custom solutions messages
  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/admin/custom-solutions');
      if (response.data.success) {
        setMessages(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      setError('Failed to load messages. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchMessages();
  }, []);
  
  // View message details
  const handleViewMessage = async (id) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/admin/custom-solutions/${id}`);
      if (response.data.success) {
        setSelectedMessage(response.data.data);
        setIsModalOpen(true);
        // Update the message in the local state if it was marked as read
        setMessages(prevMessages =>
          prevMessages.map(msg => 
            msg.id === id ? { ...msg, isRead: true } : msg
          )
        );
      }
    } catch (error) {
      console.error('Error fetching message details:', error);
    }
  };
  
  // Toggle read/unread status
  const handleToggleReadStatus = async (id, currentStatus) => {
    try {
      const response = await axios.patch(`http://localhost:5000/api/admin/custom-solutions/${id}/toggle-read`);
      if (response.data.success) {
        // Update the status in the messages array
        setMessages(prevMessages =>
          prevMessages.map(msg => 
            msg.id === id ? { ...msg, isRead: !currentStatus } : msg
          )
        );
      }
    } catch (error) {
      console.error('Error toggling message status:', error);
    }
  };
  
  // Delete message
  const handleDeleteMessage = async (id) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        const response = await axios.delete(`http://localhost:5000/api/admin/custom-solutions/${id}`);
        if (response.data.success) {
          // Remove the message from the array
          setMessages(prevMessages => prevMessages.filter(msg => msg.id !== id));
          
          // Close the modal if the deleted message was selected
          if (selectedMessage && selectedMessage.id === id) {
            setIsModalOpen(false);
            setSelectedMessage(null);
          }
        }
      } catch (error) {
        console.error('Error deleting message:', error);
      }
    }
  };
  
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Count unread messages
  const unreadCount = messages.filter(msg => !msg.isRead).length;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#02245B]">Custom Solutions Requests</h1>
        <p className="text-[#5F656F]">
          {messages.length} total messages, {unreadCount} unread
        </p>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF5E14]"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 p-4 rounded-lg text-red-700">
          {error}
        </div>
      ) : messages.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <p className="text-[#5F656F]">No custom solutions requests yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#5F656F] uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#5F656F] uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#5F656F] uppercase tracking-wider">
                  Company
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#5F656F] uppercase tracking-wider">
                  Industry
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#5F656F] uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-[#5F656F] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {messages.map((message) => (
                <tr 
                  key={message.id} 
                  className={`${!message.isRead ? 'bg-blue-50' : ''} hover:bg-gray-50`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    {message.isRead ? (
                      <CheckCircle 
                        className="h-5 w-5 text-green-500 cursor-pointer" 
                        onClick={() => handleToggleReadStatus(message.id, message.isRead)}
                      />
                    ) : (
                      <Circle 
                        className="h-5 w-5 text-blue-500 cursor-pointer" 
                        onClick={() => handleToggleReadStatus(message.id, message.isRead)}
                      />
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{message.name}</div>
                    <div className="text-sm text-gray-500">{message.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {message.companyName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {message.industry}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(message.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleViewMessage(message.id)}
                      className="text-[#02245B] hover:text-[#FF5E14] mr-3"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteMessage(message.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Message Detail Modal */}
      {isModalOpen && selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-[#02245B]">Custom Solution Request Details</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-[#5F656F]">Name</p>
                  <p className="font-medium">{selectedMessage.name}</p>
                </div>
                <div>
                  <p className="text-sm text-[#5F656F]">Email</p>
                  <p className="font-medium">{selectedMessage.email}</p>
                </div>
                <div>
                  <p className="text-sm text-[#5F656F]">Company</p>
                  <p className="font-medium">{selectedMessage.companyName}</p>
                </div>
                <div>
                  <p className="text-sm text-[#5F656F]">Industry</p>
                  <p className="font-medium">{selectedMessage.industry}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-[#5F656F]">Date</p>
                  <p className="font-medium">{formatDate(selectedMessage.createdAt)}</p>
                </div>
              </div>
              
              <div className="mb-6">
                <p className="text-sm text-[#5F656F] mb-1">Message</p>
                <div className="p-4 bg-gray-50 rounded-lg whitespace-pre-wrap">
                  {selectedMessage.message}
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    handleToggleReadStatus(selectedMessage.id, selectedMessage.isRead);
                    setSelectedMessage({...selectedMessage, isRead: !selectedMessage.isRead});
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-[#5F656F] hover:bg-gray-50"
                >
                  Mark as {selectedMessage.isRead ? 'Unread' : 'Read'}
                </button>
                <button
                  onClick={() => {
                    handleDeleteMessage(selectedMessage.id);
                  }}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomSolutionsMassege;