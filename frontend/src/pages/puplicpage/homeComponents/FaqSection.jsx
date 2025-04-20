// src/components/home/FaqSection.jsx
import React, { useState } from 'react';

const FaqSection = () => {
  const faqs = [
    {
      question: "How long does it take to set up the system?",
      answer: "Most companies are able to get up and running within a day. Our intuitive interface allows you to quickly add your equipment, locations, and team members. You can start creating work orders immediately after registration."
    },
    {
      question: "Can I access the system on mobile devices?",
      answer: "Yes, our platform is fully responsive and works on all devices including smartphones and tablets. Technicians can update work order status, view equipment details, and complete tasks directly from their mobile devices while on the factory floor."
    },
    {
      question: "How secure is my maintenance data?",
      answer: "We take security seriously. All data is encrypted both in transit and at rest. We implement industry-standard security practices, regular backups, and strict access controls to ensure your maintenance data remains secure and confidential."
    },
    {
      question: "Can I import data from my existing systems?",
      answer: "Yes, we offer data migration services to help you import existing maintenance records, equipment data, and other information from your current systems. Contact our support team after registration for assistance with data migration."
    },
    {
      question: "What happens after the 7-day trial ends?",
      answer: "At the end of your 7-day trial, you'll be prompted to select either our monthly ($20/month) or annual ($216/year) subscription plan to continue using the system. Your data will be preserved when you upgrade to a paid subscription."
    },
    {
      question: "Is there a limit to the number of users or work orders?",
      answer: "No, we don't impose limits on the number of users or work orders in your account. You can add as many team members, equipment items, and maintenance tasks as needed for your operations."
    }
  ];

  const [openIndex, setOpenIndex] = useState(0);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section className="faq-section py-16 bg-[#F5F5F5]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-[#02245B]">Frequently Asked Questions</h2>
          <p className="text-[#5F656F] max-w-3xl mx-auto">
            Get answers to common questions about our maintenance management system.
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <div key={index} className="mb-4">
              <button
                className={`w-full flex justify-between items-center p-5 rounded-lg text-left font-bold text-[#02245B] ${
                  openIndex === index ? 'bg-white shadow-md' : 'bg-white/50 hover:bg-white'
                }`}
                onClick={() => toggleFaq(index)}
              >
                <span>{faq.question}</span>
                <svg 
                  className={`w-5 h-5 transform transition-transform ${openIndex === index ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <div 
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="p-5 bg-white text-[#5F656F] rounded-b-lg">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;