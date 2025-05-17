// src/components/home/HowItWorks.jsx
import React from 'react';

const HowItWorks = () => {
  const steps = [
    {
      number: '01',
      title: 'Register Account',
      description: 'Create your company account and get a 7-day free trial with full access to all features.'
    },
    {
      number: '02',
      title: 'Set Up Your Facility',
      description: 'Add your locations, equipment, and team members to customize the system for your needs.'
    },
    {
      number: '03',
      title: 'Create Work Orders',
      description: 'Start assigning maintenance tasks to your team and track progress in real-time.'
    },
    {
      number: '04',
      title: 'Analyze and Optimize',
      description: 'Use built-in analytics to identify improvement areas and optimize your maintenance operations.'
    }
  ];

  return (
    <section className="how-it-works py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-[#02245B]">How It Works</h2>
          <p className="text-[#5F656F] max-w-3xl mx-auto">
            Get started with our maintenance management system in four simple steps.
          </p>
        </div>
        
        <div className="relative">
          {/* Connection line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-[#F5F5F5] -translate-x-1/2 z-0"></div>
          
          <div className="space-y-12 relative z-10 mx-24">
            {steps.map((step, index) => (
              <div 
                key={index} 
                className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center`}
              >
                <div className="md:w-1/2 mb-6 md:mb-0 px-4">
                  <div className={`text-center ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                    <span className="inline-block text-5xl font-bold text-[#FF5E14] opacity-50 mb-2">
                      {step.number}
                    </span>
                    <h3 className="text-2xl font-bold mb-2 text-[#02245B]">{step.title}</h3>
                    <p className="text-[#5F656F]">{step.description}</p>
                  </div>
                </div>
                
                <div className="md:w-24 flex justify-center">
                  <div className="w-12 h-12 rounded-full bg-[#FF5E14] flex items-center justify-center text-white font-bold shadow-lg">
                    {index + 1}
                  </div>
                </div>
                
                <div className="md:w-1/2 px-4">
                  {/* Placeholder for potential images on the other side */}
                  <div className={`hidden md:block h-32 ${index % 2 === 0 ? 'md:text-left' : 'md:text-right'}`}>
                    {/* You can add images here if needed */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;