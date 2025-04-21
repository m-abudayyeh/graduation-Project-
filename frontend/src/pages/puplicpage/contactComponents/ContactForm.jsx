import React, { useState } from 'react';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    companyName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    priority: 'Normal',
    department: 'Support'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState({ success: false, message: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Replace with your actual API call
      // const response = await axios.post('/api/contact', formData);
      
      // Simulating API call success for now
      setTimeout(() => {
        setSubmitResult({
          success: true,
          message: 'Thank you for contacting us! We will get back to you as soon as possible.'
        });
        setIsSubmitting(false);
        // Reset form after successful submission
        setFormData({
          firstName: '',
          lastName: '',
          companyName: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
          priority: 'Normal',
          department: 'Support'
        });
      }, 1000);
    } catch (error) {
      setSubmitResult({
        success: false,
        message: 'An error occurred while sending your message. Please try again.'
      });
      setIsSubmitting(false);
    }
  };

  const subjectOptions = [
    { value: 'technical', label: 'Technical Support' },
    { value: 'subscription', label: 'Subscription Inquiry' },
    { value: 'feature', label: 'Feature Request' },
    { value: 'general', label: 'General Question' }
  ];

  const departmentOptions = [
    { value: 'Sales', label: 'Sales' },
    { value: 'Support', label: 'Technical Support' },
    { value: 'Billing', label: 'Billing & Subscriptions' }
  ];

  const priorityOptions = [
    { value: 'Normal', label: 'Normal' },
    { value: 'Urgent', label: 'Urgent' }
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-[#02245B]">Contact Us</h2>
      
      {submitResult.message && (
        <div className={`p-4 mb-6 rounded ${submitResult.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {submitResult.message}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-gray-700 mb-1">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#FF5E14]"
              required
            />
          </div>
          
          <div>
            <label htmlFor="lastName" className="block text-gray-700 mb-1">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#FF5E14]"
              required
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="companyName" className="block text-gray-700 mb-1">Company Name</label>
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="email" className="block text-gray-700 mb-1">Email Address</label>
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
          
          <div>
            <label htmlFor="phone" className="block text-gray-700 mb-1">Phone Number</label>
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
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="subject" className="block text-gray-700 mb-1">Subject</label>
            <select
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#FF5E14]"
              required
            >
              <option value="" disabled>Choose a subject</option>
              {subjectOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="department" className="block text-gray-700 mb-1">Department</label>
            <select
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#FF5E14]"
              required
            >
              {departmentOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="priority" className="block text-gray-700 mb-1">Priority</label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#FF5E14]"
              required
            >
              {priorityOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div>
          <label htmlFor="message" className="block text-gray-700 mb-1">Message</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows="5"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#FF5E14]"
            required
          ></textarea>
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-[#FF5E14] hover:bg-[#e55412] text-white py-2 px-6 rounded-md transition duration-300 disabled:opacity-50"
        >
          {isSubmitting ? 'Sending...' : 'Submit Message'}
        </button>
      </form>
    </div>
  );
};

export default ContactForm;