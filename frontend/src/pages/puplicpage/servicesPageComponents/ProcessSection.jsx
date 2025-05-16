// ProcessSection.jsx
import React, { useState } from 'react';
import { Users, PenTool, Code, Upload, BookOpen, LineChart } from 'lucide-react';

const ProcessSection = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      icon: <Users size={32} color="#FF5E14" />,
      title: "Consultation & Requirements",
      description: "We start by understanding your factory's unique processes, pain points, and goals through in-depth consultation with your team."
    },
    {
      icon: <PenTool size={32} color="#FF5E14" />,
      title: "Solution Design",
      description: "Our experts design a tailored solution that addresses your specific challenges and objectives, with detailed workflows and interfaces."
    },
    {
      icon: <Code size={32} color="#FF5E14" />,
      title: "Development & Testing",
      description: "We develop your custom solution with rigorous testing throughout the process to ensure functionality, performance, and security."
    },
    {
      icon: <Upload size={32} color="#FF5E14" />,
      title: "Implementation & Integration",
      description: "We deploy your solution with minimal disruption to operations, ensuring seamless integration with existing systems and processes."
    },
    {
      icon: <BookOpen size={32} color="#FF5E14" />,
      title: "Training & Support",
      description: "We provide comprehensive training for your team and ongoing support to ensure maximum adoption and value from your new system."
    },
    {
      icon: <LineChart size={32} color="#FF5E14" />,
      title: "Ongoing Optimization",
      description: "We continuously monitor, evaluate and refine your solution to accommodate changing needs and maximize long-term value."
    }
  ];

  return (
    <div className="py-20 ">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Custom Development Process</h2>
          <p className="max-w-3xl mx-auto text-gray-600">
            We follow a structured, collaborative approach to ensure your custom solution 
            perfectly meets your needs and delivers maximum value.
          </p>
        </div>
        
        {/* Process Steps - Desktop */}
        <div className="hidden lg:block relative mb-8 mx-24">
          {/* Connection Line */}
          <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-300 -translate-y-1/2"></div>
          
          <div className="grid grid-cols-6 gap-4">
            {steps.map((step, index) => (
              <div 
                key={index} 
                className="relative flex flex-col items-center"
                onMouseEnter={() => setActiveStep(index)}
              >
                <div 
                  className={`w-16 h-16 rounded-full ${index === activeStep ? 'bg-orange-500' : 'bg-white'} border-4 border-orange-500 flex items-center justify-center z-10 mb-4 transition-colors duration-300`}
                  style={{ backgroundColor: index === activeStep ? '#FF5E14' : 'white' }}
                >
                  <div className={index === activeStep ? 'text-white' : 'text-orange-500'}>
                    {step.icon}
                  </div>
                </div>
                <p className={`font-semibold text-center ${index === activeStep ? 'text-orange-500' : 'text-gray-700'}`}>
                  {step.title}
                </p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Active Step Description - Desktop */}
        <div className="hidden lg:block bg-white p-8 rounded-lg shadow-md max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold mb-4 text-deep-blue" style={{ color: '#02245B' }}>
            {steps[activeStep].title}
          </h3>
          <p className="text-gray-600 text-lg">
            {steps[activeStep].description}
          </p>
        </div>
        
        {/* Mobile Version */}
        <div className="lg:hidden space-y-6">
          {steps.map((step, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div 
                  className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center mr-4"
                  style={{ backgroundColor: '#FF5E14' }}
                >
                  <div className="text-white">{step.icon}</div>
                </div>
                <h3 className="text-xl font-bold text-gray-800">{step.title}</h3>
              </div>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProcessSection;