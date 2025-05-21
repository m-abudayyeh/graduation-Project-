import React, { useState } from 'react';
import axios from 'axios'; 
const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post('http://localhost:5000/api/contact', formData);
      
      if (response.data.status === 'success') {
        setSuccess(response.data.message);
        setFormData({ name: '', email: '', subject: '', message: '' });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ml-24 mr-6 bg-white rounded-lg shadow-md p-8 mb-12 mt-12">
      {success && (
        <div className="bg-green-100 text-green-700 p-4 mb-6 rounded-md">
          {success}
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 text-red-700 p-4 mb-6 rounded-md">
          {error}
        </div>
      )}
      
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label className="block text-[#5F656F] mb-2" htmlFor="name">Full Name*</label>
          <input 
            type="text" 
            id="name" 
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF5E14]" 
            placeholder="Your full name"
            required
          />
        </div>
        
        <div>
          <label className="block text-[#5F656F] mb-2" htmlFor="email">Email Address*</label>
          <input 
            type="email" 
            id="email" 
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF5E14]" 
            placeholder="your@email.com" 
            required
          />
        </div>
        
        <div>
          <label className="block text-[#5F656F] mb-2" htmlFor="subject">Subject*</label>
          <input 
            type="text" 
            id="subject" 
            value={formData.subject}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF5E14]" 
            placeholder="Message subject"
            required
          />
        </div>
        
        <div>
          <label className="block text-[#5F656F] mb-2" htmlFor="message">Message*</label>
          <textarea 
            id="message" 
            value={formData.message}
            onChange={handleChange}
            rows="4" 
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF5E14]" 
            placeholder="How can we help you?"
            required
          ></textarea>
        </div>
        
        <div>
          <button 
            type="submit" 
            className="px-6 py-3 bg-[#FF5E14] text-white font-medium rounded-md hover:bg-[#e65512] transition-colors duration-300 flex items-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
              </>
            ) : "Send Message"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;