import React, { useState } from 'react';
import { FaCalendarAlt, FaLaptop, FaCheckCircle } from 'react-icons/fa';

const DemoRequest = () => {
  const [formData, setFormData] = useState({
    name: '',
    companyName: '',
    email: '',
    phone: '',
    jobTitle: '',
    preferredDate: '',
    preferredTime: '',
    message: '',
    companySize: '',
    industry: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      
      // Reset form after success (optional)
      setFormData({
        name: '',
        companyName: '',
        email: '',
        phone: '',
        jobTitle: '',
        preferredDate: '',
        preferredTime: '',
        message: '',
        companySize: '',
        industry: ''
      });
    }, 1500);
  };
  
  const timeSlots = [
    '9:00 AM - 10:00 AM',
    '10:00 AM - 11:00 AM',
    '11:00 AM - 12:00 PM',
    '1:00 PM - 2:00 PM',
    '2:00 PM - 3:00 PM',
    '3:00 PM - 4:00 PM'
  ];
  
  const industries = [
    'Food Manufacturing',
    'Pharmaceutical',
    'Textile',
    'Petroleum',
    'Chemical',
    'Metallurgical',
    'Electronics',
    'Other'
  ];
  
  const companySizes = [
    'Less than 50 employees',
    '50-100 employees',
    '101-500 employees',
    '501-1000 employees',
    'More than 1000 employees'
  ];
  
  // Get tomorrow's date in YYYY-MM-DD format for the min date in the date picker
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];
  
  // Get date 30 days from now for the max date in the date picker
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 30);
  const maxDateStr = maxDate.toISOString().split('T')[0];
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-[#02245B]">Request a Demo</h2>
      
      {isSubmitted ? (
        <div className="text-center p-6 bg-green-50 rounded-lg">
          <FaCheckCircle className="text-green-500 text-5xl mx-auto mb-4" />
          <h3 className="text-xl font-bold text-green-700 mb-2">Your request has been received!</h3>
          <p className="text-gray-700 mb-4">
            Thank you for your interest in Factory Maintenance System. Our team will contact you soon to confirm your demonstration appointment.
          </p>
          <button 
            onClick={() => setIsSubmitted(false)} 
            className="bg-[#02245B] text-white py-2 px-6 rounded-md hover:bg-[#01134a] transition duration-300"
          >
            Request Another Demo
          </button>
        </div>
      ) : (
        <>
          <div className="flex items-center mb-6 bg-blue-50 p-4 rounded-lg">
            <FaLaptop className="text-[#02245B] text-2xl mr-4" />
            <div>
              <h3 className="font-semibold text-lg text-[#02245B]">Get a Personalized Demo of Factory Maintenance System</h3>
              <p className="text-gray-700">One of our experts will showcase all the features and how to customize the system to meet your organization's needs</p>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-gray-700 mb-1">Full Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#FF5E14]"
                  required
                />
              </div>
              
              {/* Company Name */}
              <div>
                <label htmlFor="companyName" className="block text-gray-700 mb-1">Company Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#FF5E14]"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-gray-700 mb-1">Email Address <span className="text-red-500">*</span></label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#FF5E14]"
                  required
                />
              </div>
              
              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-gray-700 mb-1">Phone Number <span className="text-red-500">*</span></label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#FF5E14]"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Job Title */}
              <div>
                <label htmlFor="jobTitle" className="block text-gray-700 mb-1">Job Title</label>
                <input
                  type="text"
                  id="jobTitle"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#FF5E14]"
                />
              </div>
              
              {/* Company Size */}
              <div>
                <label htmlFor="companySize" className="block text-gray-700 mb-1">Company Size</label>
                <select
                  id="companySize"
                  name="companySize"
                  value={formData.companySize}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#FF5E14]"
                >
                  <option value="">-- Select Company Size --</option>
                  {companySizes.map((size, index) => (
                    <option key={index} value={size}>{size}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Industry */}
              <div>
                <label htmlFor="industry" className="block text-gray-700 mb-1">Industry</label>
                <select
                  id="industry"
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#FF5E14]"
                >
                  <option value="">-- Select Industry --</option>
                  {industries.map((industry, index) => (
                    <option key={index} value={industry}>{industry}</option>
                  ))}
                </select>
              </div>
              
              {/* Preferred Date */}
              <div>
                <label htmlFor="preferredDate" className="block text-gray-700 mb-1">
                  <span className="mr-1">Preferred Date <span className="text-red-500">*</span></span>
                  <FaCalendarAlt className="inline-block text-[#FF5E14]" />
                </label>
                <input
                  type="date"
                  id="preferredDate"
                  name="preferredDate"
                  value={formData.preferredDate}
                  onChange={handleChange}
                  min={tomorrowStr}
                  max={maxDateStr}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#FF5E14]"
                  required
                />
              </div>
            </div>
            
            {/* Preferred Time */}
            <div>
              <label htmlFor="preferredTime" className="block text-gray-700 mb-1">Preferred Time <span className="text-red-500">*</span></label>
              <select
                id="preferredTime"
                name="preferredTime"
                value={formData.preferredTime}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#FF5E14]"
                required
              >
                <option value="">-- Select Preferred Time --</option>
                {timeSlots.map((timeSlot, index) => (
                  <option key={index} value={timeSlot}>{timeSlot}</option>
                ))}
              </select>
            </div>
            
            {/* Additional Notes */}
            <div>
              <label htmlFor="message" className="block text-gray-700 mb-1">Additional Notes</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="3"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#FF5E14]"
                placeholder="Tell us more about your specific needs or any questions you'd like to address during the demo"
              ></textarea>
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#FF5E14] hover:bg-[#e55412] text-white py-3 px-6 rounded-md transition duration-300 disabled:opacity-50 w-full md:w-auto"
            >
              {isSubmitting ? 'Submitting Request...' : 'Request Demo'}
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default DemoRequest;