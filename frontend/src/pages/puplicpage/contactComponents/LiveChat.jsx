import React, { useState } from 'react';
import { FaComments, FaTimes, FaPaperPlane, FaUser, FaHeadset } from 'react-icons/fa';

const LiveChat = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'agent',
      text: 'Welcome to Factory Maintenance System support! How can I help you today?',
      time: '12:00'
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showCallback, setShowCallback] = useState(false);
  const [callbackData, setCallbackData] = useState({
    name: '',
    phone: '',
    preferredTime: ''
  });

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
    setIsMinimized(false);
  };

  const minimizeChat = () => {
    setIsMinimized(!isMinimized);
  };

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
  };

  const handleCallbackChange = (e) => {
    const { name, value } = e.target;
    setCallbackData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    const userMessage = {
      id: messages.length + 1,
      sender: 'user',
      text: newMessage,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, userMessage]);
    setNewMessage('');
    
    // Simulate agent typing
    setIsTyping(true);
    
    // Simulate agent response after 1-2 seconds
    setTimeout(() => {
      const agentMessage = {
        id: messages.length + 2,
        sender: 'agent',
        text: 'Thank you for contacting us. One of our customer service representatives will respond to you shortly. Would you like to leave a phone number for us to call you back?',
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => [...prev, agentMessage]);
      setIsTyping(false);
      
      // Show callback option after agent response
      setTimeout(() => {
        setShowCallback(true);
      }, 1000);
    }, 1500);
  };

  const submitCallback = (e) => {
    e.preventDefault();
    
    // Add confirmation message to chat
    const confirmationMessage = {
      id: messages.length + 1,
      sender: 'agent',
      text: `Thank you ${callbackData.name}. We'll call you at ${callbackData.phone} during ${callbackData.preferredTime}`,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages([...messages, confirmationMessage]);
    setShowCallback(false);
    
    // Reset form
    setCallbackData({
      name: '',
      phone: '',
      preferredTime: ''
    });
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={toggleChat}
        className={`fixed right-6 bottom-6 bg-[#FF5E14] text-white p-3 rounded-full shadow-lg hover:bg-[#e55412] transition duration-300 z-50 ${
          isChatOpen ? 'hidden' : 'flex'
        }`}
        aria-label="Open Live Chat"
      >
        <FaComments className="text-2xl" />
      </button>
      
      {/* Chat Window */}
      {isChatOpen && (
        <div 
          className={`fixed right-6 bottom-6 w-80 md:w-96 bg-white rounded-lg shadow-xl overflow-hidden z-50 transition-all duration-300 ${
            isMinimized ? 'h-14' : 'h-96'
          }`}
        >
          {/* Chat Header */}
          <div className="bg-[#02245B] text-white p-3 flex justify-between items-center">
            <div className="flex items-center">
              <FaHeadset className="text-xl mr-2" />
              <h3 className="font-medium">Customer Support</h3>
            </div>
            <div className="flex">
              <button 
                onClick={minimizeChat}
                className="mr-2 text-white hover:text-gray-200"
                aria-label={isMinimized ? "Maximize chat" : "Minimize chat"}
              >
                <div className="w-3 h-1 bg-white"></div>
              </button>
              <button 
                onClick={toggleChat}
                className="text-white hover:text-gray-200"
                aria-label="Close chat"
              >
                <FaTimes />
              </button>
            </div>
          </div>
          
          {/* Chat Messages */}
          {!isMinimized && (
            <>
              <div className="h-64 overflow-y-auto p-4 bg-gray-50">
                {messages.map((message) => (
                  <div 
                    key={message.id} 
                    className={`mb-3 max-w-3/4 ${
                      message.sender === 'user' ? 'ml-auto' : 'mr-auto'
                    }`}
                  >
                    <div 
                      className={`p-3 rounded-lg ${
                        message.sender === 'user' 
                          ? 'bg-[#FF5E14] text-white rounded-tl-none' 
                          : 'bg-gray-200 text-gray-800 rounded-tr-none'
                      }`}
                    >
                      {message.text}
                    </div>
                    <div 
                      className={`text-xs mt-1 text-gray-500 flex items-center ${
                        message.sender === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {message.sender === 'user' ? (
                        <>
                          <span>You</span>
                          <FaUser className="ml-1" />
                        </>
                      ) : (
                        <>
                          <FaHeadset className="mr-1" />
                          <span>Support Team</span>
                        </>
                      )}
                      <span className="mx-1">·</span>
                      <span>{message.time}</span>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="mb-3 mr-auto max-w-3/4">
                    <div className="p-3 rounded-lg bg-gray-200 text-gray-800 rounded-tr-none">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Schedule Callback Form */}
              {showCallback && (
                <div className="p-3 bg-gray-100 border-t border-gray-200">
                  <h4 className="font-medium text-[#02245B] mb-2">Schedule a Callback</h4>
                  <form onSubmit={submitCallback} className="space-y-2">
                    <div>
                      <input
                        type="text"
                        name="name"
                        value={callbackData.name}
                        onChange={handleCallbackChange}
                        placeholder="Name"
                        className="w-full p-2 text-sm border border-gray-300 rounded"
                        required
                      />
                    </div>
                    <div>
                      <input
                        type="tel"
                        name="phone"
                        value={callbackData.phone}
                        onChange={handleCallbackChange}
                        placeholder="Phone Number"
                        className="w-full p-2 text-sm border border-gray-300 rounded"
                        required
                      />
                    </div>
                    <div>
                      <select
                        name="preferredTime"
                        value={callbackData.preferredTime}
                        onChange={handleCallbackChange}
                        className="w-full p-2 text-sm border border-gray-300 rounded"
                        required
                      >
                        <option value="">Preferred Callback Time</option>
                        <option value="Morning (9-12)">Morning (9-12)</option>
                        <option value="Afternoon (12-3)">Afternoon (12-3)</option>
                        <option value="Evening (3-6)">Evening (3-6)</option>
                      </select>
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-[#02245B] text-white p-2 rounded text-sm hover:bg-[#01134a] transition duration-300"
                    >
                      Schedule Callback
                    </button>
                  </form>
                </div>
              )}
              
              {/* Chat Input */}
              {!showCallback && (
                <form onSubmit={sendMessage} className="p-3 border-t border-gray-200 flex">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={handleInputChange}
                    placeholder="Type your message here..."
                    className="flex-1 p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-1 focus:ring-[#FF5E14]"
                  />
                  <button
                    type="submit"
                    className="bg-[#FF5E14] text-white p-2 rounded-r-lg hover:bg-[#e55412] transition duration-300"
                    disabled={!newMessage.trim()}
                  >
                    <FaPaperPlane />
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      )}
    </>
  );
};

export default LiveChat;