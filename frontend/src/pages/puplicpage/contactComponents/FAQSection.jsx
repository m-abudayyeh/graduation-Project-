import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqItems = [
    {
      id: 1,
      category: 'Work Orders',
      question: 'How do I create a new work order?',
      answer: 'You can create a new work order by going to the dashboard, clicking on "Work Orders" and then "Create New Work Order". Fill in the required information such as title, description, priority, equipment, location, and due date.'
    },
    {
      id: 2,
      category: 'Preventive Maintenance',
      question: 'How do I schedule preventive maintenance for equipment?',
      answer: 'Navigate to the "Preventive Maintenance" page in the dashboard, then select "Add Equipment" and choose the equipment you want to schedule maintenance for. Then, you can set the preventive maintenance schedule according to appropriate time intervals.'
    },
    {
      id: 3,
      category: 'Account Management',
      question: 'How do I add new users to the system?',
      answer: 'Only users with admin permissions can add new users. Go to the "Employees" page in the dashboard, then click on "Add Employee", and enter the employee\'s information such as name, email, phone number, and job role.'
    },
    {
      id: 4,
      category: 'Subscriptions',
      question: 'What subscription options are available?',
      answer: 'We offer two subscription options: a monthly subscription for $20, or an annual subscription for $216 (saving 18%). After the 7-day free trial period, you can choose one of these subscription plans.'
    },
    {
      id: 5,
      category: 'Technical Support',
      question: 'What should I do if I encounter a problem using the system?',
      answer: 'You can contact our technical support team by sending a message through the contact form or directly via email to support@factorymaintenance.com. We will respond as soon as possible, usually within 24 business hours.'
    }
  ];

  // Group FAQs by category
  const groupedFAQs = faqItems.reduce((groups, item) => {
    const category = item.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(item);
    return groups;
  }, {});

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-[#02245B]">Frequently Asked Questions</h2>
      
      <div className="space-y-4">
        {Object.entries(groupedFAQs).map(([category, items], categoryIndex) => (
          <div key={categoryIndex} className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-[#5F656F] border-l-4 border-[#FF5E14] pl-3">{category}</h3>
            
            <div className="space-y-2">
              {items.map((item, itemIndex) => (
                <div 
                  key={item.id} 
                  className="border border-gray-200 rounded-lg overflow-hidden"
                >
                  <button
                    className={`w-full text-left p-4 flex justify-between items-center focus:outline-none ${
                      activeIndex === `${categoryIndex}-${itemIndex}` ? 'bg-gray-50' : 'bg-white'
                    }`}
                    onClick={() => toggleFAQ(`${categoryIndex}-${itemIndex}`)}
                  >
                    <span className="font-medium">{item.question}</span>
                    {activeIndex === `${categoryIndex}-${itemIndex}` ? (
                      <FaChevronUp className="text-[#FF5E14]" />
                    ) : (
                      <FaChevronDown className="text-[#FF5E14]" />
                    )}
                  </button>
                  
                  {activeIndex === `${categoryIndex}-${itemIndex}` && (
                    <div className="p-4 bg-gray-50 border-t border-gray-200">
                      <p className="text-gray-700">{item.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-100 text-center">
        <p className="text-gray-700">
          Didn't find an answer to your question?{' '}
          <a 
            href="#contact-form" 
            className="text-[#FF5E14] font-medium hover:underline"
          >
            Contact us directly
          </a>
        </p>
      </div>
    </div>
  );
};

export default FAQSection;