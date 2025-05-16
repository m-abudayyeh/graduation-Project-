import React, { useState } from 'react';

const SubscriptionFAQ = () => {
  const [openItem, setOpenItem] = useState(null);

  const toggleItem = (index) => {
    setOpenItem(openItem === index ? null : index);
  };

  const faqItems = [
    {
      question: 'What\'s included in the subscription?',
      answer: 'Our subscription includes full access to all features of the Factory Maintenance system, including work order management, preventive maintenance scheduling, analytics, maintenance request management, and management of locations, equipment, stores, and employees.'
    },
    {
      question: 'How does the free trial work?',
      answer: 'We offer a 7-day free trial that includes full access to all features. No credit card is required to start your trial. At the end of the trial period, you can choose between our monthly or annual subscription plans to continue using the service.'
    },
    {
      question: 'Can I cancel my subscription at any time?',
      answer: 'Yes, you can cancel your subscription at any time. If you cancel, you\'ll continue to have access until the end of your current billing period. We don\'t offer refunds for partial subscription periods.'
    },
    {
      question: 'How do I change my subscription plan?',
      answer: 'You can change your subscription plan by contacting our support team. If you\'re upgrading from monthly to annual, we\'ll prorate the remaining days of your current subscription.'
    },
    {
      question: 'Is there a limit to the number of users?',
      answer: 'No, there is no limit to the number of users you can add to your account. All subscription plans include unlimited users across different roles (admin, supervisor, technician, requester, and viewer).'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards including Visa, Mastercard, American Express, and Discover. All payments are processed securely through Stripe.'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>
      
      <div className="space-y-4">
        {faqItems.map((item, index) => (
          <div key={index} className="border-b border-gray-200 pb-4">
            <button
              className="flex justify-between items-center w-full text-left font-medium focus:outline-none"
              onClick={() => toggleItem(index)}
            >
              <span className="text-gray-800">{item.question}</span>
              <svg
                className={`w-5 h-5 text-gray-500 transition-transform ${openItem === index ? 'transform rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            
            {openItem === index && (
              <div className="mt-2 text-gray-600">
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionFAQ;