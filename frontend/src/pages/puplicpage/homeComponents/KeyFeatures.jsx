// src/components/home/KeyFeatures.jsx
import React from 'react';
import { BsClipboardCheck, BsCalendarCheck, BsGraphUp, BsTools, BsBuilding ,BsBell} from 'react-icons/bs';

const KeyFeatures = () => {
  const features = [
    {
      icon: <BsClipboardCheck className="text-4xl text-[#FF5E14] mb-4" />,
      title: 'Work Order Management',
      description: 'Efficiently create, assign, and track maintenance tasks from start to finish.'
    },
    {
      icon: <BsCalendarCheck className="text-4xl text-[#FF5E14] mb-4" />,
      title: 'Preventive Maintenance',
      description: 'Schedule recurring maintenance to prevent equipment failures and extend asset lifespan.'
    },
    {
      icon: <BsGraphUp className="text-4xl text-[#FF5E14] mb-4" />,
      title: 'Analytics & Reporting',
      description: 'Gain insights with comprehensive reports and visualize your maintenance metrics.'
    },
    {
      icon: <BsTools className="text-4xl text-[#FF5E14] mb-4" />,
      title: 'Equipment Management',
      description: 'Track all machinery details, maintenance history, and performance data.'
    },
    {
      icon: <BsBuilding className="text-4xl text-[#FF5E14] mb-4" />,
      title: 'Multi-location Support',
      description: 'Manage maintenance across multiple facilities from a single platform.'
    },
    {
  icon: <BsBell className="text-4xl text-[#FF5E14] mb-4" />,
  title: 'Real-Time Alerts',
  description: 'Stay informed with instant notifications for maintenance events, task updates, and system anomalies.'
}
  ];

  return (
    <section className="key-features py-16 bg-[#F5F5F5]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-[#02245B]">Key Features</h2>
          <p className="text-[#5F656F] max-w-3xl mx-auto">
            Our comprehensive maintenance management system provides all the tools you need to streamline your factory operations.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mx-24">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 text-center"
            >
              <div className="flex justify-center">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-[#02245B]">{feature.title}</h3>
              <p className="text-[#5F656F]">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default KeyFeatures;