import React from 'react';
import { FaPhoneAlt, FaEnvelope, FaClock, FaHeadset } from 'react-icons/fa';

const DirectContact = () => {
  const contactInfo = [
    {
      id: 1,
      title: 'Technical Support',
      email: 'support@factorymaintenance.com',
      phone: '+1 (555) 123-4567',
      icon: <FaHeadset className="text-2xl text-[#FF5E14]" />
    },
    {
      id: 2,
      title: 'Sales Team',
      email: 'sales@factorymaintenance.com',
      phone: '+1 (555) 123-4568',
      icon: <FaPhoneAlt className="text-2xl text-[#FF5E14]" />
    },
    {
      id: 3,
      title: 'Billing & Subscriptions',
      email: 'billing@factorymaintenance.com',
      phone: '+1 (555) 123-4569',
      icon: <FaEnvelope className="text-2xl text-[#FF5E14]" />
    }
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-[#02245B]">Contact Us Directly</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {contactInfo.map((info) => (
          <div key={info.id} className="p-4 border border-gray-100 rounded-lg hover:shadow-md transition duration-300">
            <div className="flex items-center mb-3">
              {info.icon}
              <h3 className="text-lg font-bold ml-2 text-[#5F656F]">{info.title}</h3>
            </div>
            <div className="space-y-2">
              <p className="flex items-center">
                <FaEnvelope className="text-[#FF5E14] mr-2" />
                <a href={`mailto:${info.email}`} className="hover:text-[#FF5E14]">
                  {info.email}
                </a>
              </p>
              <p className="flex items-center">
                <FaPhoneAlt className="text-[#FF5E14] mr-2" />
                <a href={`tel:${info.phone}`} className="hover:text-[#FF5E14]">
                  {info.phone}
                </a>
              </p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
        <div className="flex items-center mb-2">
          <FaClock className="text-xl text-[#FF5E14] mr-2" />
          <h3 className="text-lg font-bold text-[#5F656F]">Business Hours</h3>
        </div>
        <p className="text-gray-700">Monday - Friday: 8:00 AM - 5:00 PM (EST)</p>
        <p className="text-gray-700">Saturday - Sunday: Closed</p>
        <p className="mt-2 text-gray-700">
          <span className="font-semibold">Expected Response Time:</span> We respond to all inquiries within 24 business hours
        </p>
      </div>
    </div>
  );
};

export default DirectContact;