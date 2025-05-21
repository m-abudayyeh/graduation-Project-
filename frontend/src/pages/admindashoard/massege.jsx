// src/pages/admindashboard/Messages.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';

const Massege = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [replyLoading, setReplyLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all'); // all, read, unread, replied, unreplied

  // Fetch messages
  const fetchMessages = async () => {
    setLoading(true);
    try {
      let queryParams = `?page=${currentPage}&limit=10`;
      if (filterStatus === 'read') {
        queryParams += '&isRead=true';
      } else if (filterStatus === 'unread') {
        queryParams += '&isRead=false';
      } else if (filterStatus === 'replied') {
        queryParams += '&isReplied=true';
      } else if (filterStatus === 'unreplied') {
        queryParams += '&isReplied=false';
      }
      
      const response = await axios.get(`http://localhost:5000/api/contact/messages${queryParams}`, {
        withCredentials: true
      });
      console.log(response.data?.data)
      setMessages(response.data?.data?.items || []);
      setTotalPages(Math.ceil((response.data?.data?.count || 0) / 10));
    } catch (err) {
      setError('Failed to fetch messages. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // View message details
  const viewMessage = async (id) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/contact/messages/${id}`, {
        withCredentials: true
      });
      
      setSelectedMessage(response.data.data);
      
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.id === id ? { ...msg, isRead: true } : msg
        )
      );
    } catch (err) {
      console.error('Error fetching message details:', err);
    }
  };

  // Reply to message
  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyContent.trim()) return;
    
    setReplyLoading(true);
    try {
      await axios.post(
        `http://localhost:5000/api/contact/messages/${selectedMessage.id}/reply`,
        { replyContent },
        {
          withCredentials: true
        }
      );
      
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.id === selectedMessage.id ? { ...msg, isReplied: true } : msg
        )
      );
      
      setSelectedMessage(prev => ({
        ...prev,
        isReplied: true
      }));
      
      setReplyContent('');
    } catch (err) {
      console.error('Error sending reply:', err);
    } finally {
      setReplyLoading(false);
    }
  };

  // Delete message
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    
    try {
      await axios.delete(`http://localhost:5000/api/contact/messages/${id}`, {
        withCredentials: true
      });
      
      setMessages(prevMessages => prevMessages.filter(msg => msg.id !== id));
      
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage(null);
      }
    } catch (err) {
      console.error('Error deleting message:', err);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    fetchMessages();
  }, [currentPage, filterStatus]);

  const closeDetailView = () => {
    setSelectedMessage(null);
    setReplyContent('');
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#02245B]">Contact Messages</h1>
        <div className="flex space-x-2">
          <select 
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF5E14]"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Messages</option>
            <option value="read">Read</option>
            <option value="unread">Unread</option>
            <option value="replied">Replied</option>
            <option value="unreplied">Not Replied</option>
          </select>
          <button 
            onClick={() => fetchMessages()}
            className="px-4 py-2 bg-[#02245B] text-white rounded-md hover:bg-opacity-90"
          >
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 mb-6 rounded-md">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 bg-[#02245B] text-white font-semibold">
            Messages ({messages?.length || 0})
          </div>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF5E14]"></div>
            </div>
          ) : messages.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No messages found
            </div>
          ) : (
            <div className="overflow-y-auto max-h-[calc(100vh-16rem)]">
              {messages.map(message => (
                <div 
                  key={message.id}
                  onClick={() => viewMessage(message.id)}
                  className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedMessage?.id === message.id ? 'bg-gray-100' : ''
                  } ${!message.isRead ? 'font-semibold' : ''}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-medium truncate mr-2">{message.name}</h3>
                    <div className="flex space-x-2">
                      {!message.isRead && (
                        <span className="inline-block w-2 h-2 bg-[#FF5E14] rounded-full"></span>
                      )}
                      {message.isReplied && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          Replied
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 truncate">{message.subject}</p>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-xs text-gray-400">
                      {format(new Date(message.createdAt), 'MMM d, yyyy')}
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(message.id);
                      }}
                      className="text-xs text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center py-4 bg-gray-50">
              <div className="flex space-x-1">
                <button
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded ${
                    currentPage === 1 
                      ? 'bg-gray-200 text-gray-500' 
                      : 'bg-[#02245B] text-white hover:bg-opacity-90'
                  }`}
                >
                  &laquo;
                </button>
                
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handlePageChange(index + 1)}
                    className={`px-3 py-1 rounded ${
                      currentPage === index + 1
                        ? 'bg-[#FF5E14] text-white'
                        : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
                
                <button
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded ${
                    currentPage === totalPages
                      ? 'bg-gray-200 text-gray-500'
                      : 'bg-[#02245B] text-white hover:bg-opacity-90'
                  }`}
                >
                  &raquo;
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Message Detail */}
        <div className="lg:col-span-2">
          {selectedMessage ? (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="flex justify-between items-center p-4 bg-[#02245B] text-white">
                <h2 className="font-semibold">Message Details</h2>
                <button
                  onClick={closeDetailView}
                  className="text-white hover:text-gray-200"
                >
                  &times;
                </button>
              </div>
              
              <div className="p-6">
                <div className="mb-6">
                  <div className="flex justify-between mb-4">
                    <div>
                      <span className="block text-sm text-gray-500">From:</span>
                      <span className="font-medium">{selectedMessage.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="block text-sm text-gray-500">Date:</span>
                      <span>{format(new Date(selectedMessage.createdAt), 'MMM d, yyyy h:mm a')}</span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <span className="block text-sm text-gray-500">Email:</span>
                    <span className="text-blue-600">{selectedMessage.email}</span>
                  </div>
                  
                  <div className="mb-4">
                    <span className="block text-sm text-gray-500">Subject:</span>
                    <span className="font-medium">{selectedMessage.subject}</span>
                  </div>
                  
                  <div>
                    <span className="block text-sm text-gray-500 mb-2">Message:</span>
                    <div className="bg-gray-50 p-4 rounded-md whitespace-pre-wrap">
                      {selectedMessage.message}
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-6">
                  <h3 className="font-medium mb-4">Reply to this message</h3>
                  
                  {selectedMessage.isReplied ? (
                    <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-4">
                      <p className="text-green-700">
                        You have already replied to this message.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleReply}>
                      <textarea
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder="Type your reply here..."
                        className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF5E14] mb-4"
                        rows="6"
                        required
                      ></textarea>
                      
                      <button
                        type="submit"
                        disabled={replyLoading || !replyContent.trim()}
                        className="px-6 py-2 bg-[#FF5E14] text-white rounded-md hover:bg-opacity-90 disabled:bg-opacity-60 disabled:cursor-not-allowed"
                      >
                        {replyLoading ? 'Sending...' : 'Send Reply'}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center h-64 flex flex-col items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <h3 className="text-lg font-medium text-gray-500">Select a message to view details</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Massege;
