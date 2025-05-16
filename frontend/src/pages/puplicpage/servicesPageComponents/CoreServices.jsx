// CoreServices.jsx
import React, { useState } from 'react';
import { Wrench, LineChart, Zap } from 'lucide-react';

const ServiceCard = ({ icon, title, description, details }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:-translate-y-2">
      <div className="p-6">
        <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mb-6 mx-auto">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-center mb-4">{title}</h3>
        <p className="text-gray-600 text-center mb-6">{description}</p>
        
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full py-3 px-6 text-center text-white font-medium rounded-md transition-colors"
          style={{ backgroundColor: isExpanded ? '#02245B' : '#FF5E14' }}
        >
          {isExpanded ? 'Show Less' : 'Learn More'}
        </button>
      </div>
      
      {isExpanded && (
        <div className="bg-gray-50 p-6 border-t border-gray-200">
          <ul className="space-y-3">
            {details.map((detail, index) => (
              <li key={index} className="flex items-start">
                <span className="mr-2 text-orange-500">•</span>
                <span>{detail}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const CoreServices = () => {
  const services = [
    {
      icon: <Wrench size={32} color="#FF5E14" />,
      title: "Custom Maintenance Systems",
      description: "Specialized maintenance solutions tailored to your facility's specific requirements and workflows.",
      details: [
        "Tailored maintenance workflows and approvals",
        "Custom KPIs and analytics dashboards",
        "Integration with existing factory systems",
        "Specialized equipment documentation",
        "Custom reporting and audit tools"
      ]
    },
    {
      icon: <LineChart size={32} color="#FF5E14" />,
      title: "Production Management Solutions",
      description: "Comprehensive tools for tracking, analyzing, and optimizing your production processes.",
      details: [
        "Production volume tracking and forecasting",
        "Quality control and defect monitoring",
        "Production planning and scheduling tools",
        "Performance and efficiency analytics",
        "Resource utilization optimization"
      ]
    },
    {
      icon: <Zap size={32} color="#FF5E14" />,
      title: "Energy Monitoring & Optimization",
      description: "IoT-powered solutions to track energy usage and implement cost-saving measures.",
      details: [
        "IoT sensor integration for real-time monitoring",
        "Energy consumption tracking and analysis",
        "Machine utilization status monitoring",
        "Efficiency analytics and recommendations",
        "Cost-saving implementation strategies"
      ]
    }
  ];

  return (
    <div className="py-20 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Custom Development Services</h2>
          <p className="max-w-3xl mx-auto text-gray-600">
            We offer specialized development services to extend our core platform, 
            helping you address your factory's unique challenges with tailored solutions.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {services.map((service, index) => (
            <ServiceCard 
              key={index}
              icon={service.icon}
              title={service.title}
              description={service.description}
              details={service.details}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CoreServices;