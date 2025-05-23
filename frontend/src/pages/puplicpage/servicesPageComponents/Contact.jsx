import React, { useState } from 'react';
import axios from 'axios';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    companyName: '',
    industry: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState({
    type: '',
    message: ''
  });
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormStatus({ type: '', message: '' });
    
    try {
      const response = await axios.post('http://localhost:5000/api/custom-solutions', formData);
      
      if (response.data.success) {
        setFormStatus({
          type: 'success',
          message: 'Thank you! Your message has been sent successfully.'
        });
        // Clear form fields
        setFormData({
          name: '',
          email: '',
          companyName: '',
          industry: '',
          message: ''
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setFormStatus({
        type: 'error',
        message: error.response?.data?.message || 'Failed to send your message. Please try again later.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="bg-[#02245B] rounded-xl overflow-hidden shadow-xl mx-24">
          <div className="flex flex-col md:flex-row ">
            {/* Content */}
            <div className="md:w-1/2 p-8 md:p-12">
              <h2 className="text-3xl font-bold text-white mb-4">
                Need a Custom System?
              </h2>
              <p className="text-gray-300 mb-6">
                Our team of experts is ready to design the perfect solution for your facility's unique challenges. 
                Contact us today for a free consultation and discover how we can transform your operations.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-[#FF5E14] flex items-center justify-center mr-3">
                    <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <span className="text-white">+962 785 078 600</span>
                </div>
                
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-[#FF5E14] flex items-center justify-center mr-3">
                    <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="text-white">optiplant.mailer@gmail.com</span>
                </div>
              </div>
              
              <div className="flex space-x-4">
                <a href="/about" className="inline-block py-2 px-4 bg-white border border-white text- font-medium rounded-lg hover:bg-transparent hover:text-white transition duration-300">
                  Learn More
                </a>
              </div>
            </div>
            
            {/* Form */}
            <div className="md:w-1/2 bg-white p-8 md:p-12">
              <h3 className="text-2xl font-bold text-[#02245B] mb-6">
                Get a Free Consultation
              </h3>
              
              {formStatus.message && (
                <div className={`p-4 mb-6 rounded-lg ${formStatus.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {formStatus.message}
                </div>
              )}
              
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-[#5F656F] mb-1">
                      Your Name
                    </label>
                    <input 
                      type="text" 
                      id="name" 
                      className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#FF5E14]" 
                      placeholder="Your name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-[#5F656F] mb-1">
                      Email Address
                    </label>
                    <input 
                      type="email" 
                      id="email" 
                      className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#FF5E14]" 
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-[#5F656F] mb-1">
                    Company Name
                  </label>
                  <input 
                    type="text" 
                    id="companyName" 
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#FF5E14]" 
                    placeholder="Company Inc."
                    value={formData.companyName}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="industry" className="block text-sm font-medium text-[#5F656F] mb-1">
                    Industry
                  </label>
                  <select 
                    id="industry" 
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#FF5E14]"
                    value={formData.industry}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>Select your industry</option>
                    <option value="manufacturing">Manufacturing</option>
                    <option value="food">Food & Beverage</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="oil">Oil & Gas</option>
                    <option value="electronics">Electronics</option>
                    <option value="utilities">Utilities & Infrastructure</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-[#5F656F] mb-1">
                    Tell us about your needs
                  </label>
                  <textarea 
                    id="message" 
                    rows="4" 
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#FF5E14]" 
                    placeholder="Describe your challenges and requirements..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>
                
                <button 
                  type="submit" 
                  className={`w-full ${
                    isSubmitting ? 'bg-gray-400' : 'bg-[#FF5E14] hover:bg-[#e5540c]'
                  } text-white font-medium py-3 px-6 rounded-lg transition duration-300`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Request Consultation'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;