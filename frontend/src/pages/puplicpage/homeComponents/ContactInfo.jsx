// src/components/home/ContactInfo.jsx
import React from 'react';

const ContactInfo = () => {
  const contactMethods = [
    {
      title: 'Email Support',
      description: 'Get help with technical issues or account questions',
      contact: 'support@factorymaintenance.com',
      icon: (
        <svg className="w-10 h-10 text-[#FF5E14]" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
        </svg>
      )
    },
    {
      title: 'Sales Inquiries',
      description: 'Learn more about pricing and enterprise solutions',
      contact: 'sales@factorymaintenance.com',
      icon: (
        <svg className="w-10 h-10 text-[#FF5E14]" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      title: 'Phone Support',
      description: 'Available Monday-Friday, 9am-6pm',
      contact: '+1 (555) 123-4567',
      icon: (
        <svg className="w-10 h-10 text-[#FF5E14]" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
        </svg>
      )
    }
  ];

  return (
    <section className="contact-info py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-[#02245B]">Get in Touch</h2>
          <p className="text-[#5F656F] max-w-3xl mx-auto">
            Have questions about our maintenance management system? We're here to help.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {contactMethods.map((method, index) => (
            <div key={index} className="bg-[#F5F5F5] rounded-lg p-6 text-center hover:shadow-md transition-shadow duration-300">
              <div className="flex justify-center mb-4">{method.icon}</div>
              <h3 className="text-xl font-bold mb-2 text-[#02245B]">{method.title}</h3>
              <p className="text-[#5F656F] mb-4">{method.description}</p>
              <p className="font-medium text-[#FF5E14]">{method.contact}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-[#5F656F] mb-4">
            Need immediate assistance? Fill out our contact form and we'll get back to you within 24 hours.
          </p>
          <a 
            href="/contact" 
            className="inline-block bg-[#02245B] hover:bg-[#02245B]/90 text-white font-bold py-3 px-8 rounded-lg transition"
          >
            Contact Us
          </a>
        </div>
      </div>
    </section>
  );
};

export default ContactInfo;