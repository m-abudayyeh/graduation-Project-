// BenefitsSection.jsx
import React from 'react';
import { CheckCircle, TrendingUp, Clock, DollarSign, Award } from 'lucide-react';

const BenefitCard = ({ icon, title, description }) => {
  return (
    <div className="flex flex-col md:flex-row items-start p-6 bg-white rounded-lg shadow-md">
      <div className="mr-5 mb-4 md:mb-0">
        {icon}
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
};

const BenefitsSection = () => {
  const benefits = [
    {
      icon: <CheckCircle size={40} color="#FF5E14" />,
      title: "Industry-Specific Solutions",
      description: "Our systems are tailored to your specific industry requirements, processes, and compliance needs."
    },
    {
      icon: <TrendingUp size={40} color="#FF5E14" />,
      title: "Increased Operational Efficiency",
      description: "Custom workflows and automation designed around your unique processes to maximize productivity."
    },
    {
      icon: <Clock size={40} color="#FF5E14" />,
      title: "Reduced Downtime",
      description: "Specialized monitoring and predictive maintenance tools designed specifically for your equipment."
    },
    {
      icon: <DollarSign size={40} color="#FF5E14" />,
      title: "Cost Optimization",
      description: "Identify inefficiencies and implement targeted solutions to reduce operational expenses."
    },
    {
      icon: <Award size={40} color="#FF5E14" />,
      title: "Competitive Advantage",
      description: "Leverage technology tailored to your unique strengths to outperform industry standards."
    }
  ];

  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Why Choose Our Custom Solutions</h2>
          <p className="max-w-3xl mx-auto text-gray-600">
            We don't believe in one-size-fits-all approaches. Our custom solutions provide 
            targeted advantages that help your factory achieve specific operational goals.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <BenefitCard 
              key={index}
              icon={benefit.icon}
              title={benefit.title}
              description={benefit.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BenefitsSection;