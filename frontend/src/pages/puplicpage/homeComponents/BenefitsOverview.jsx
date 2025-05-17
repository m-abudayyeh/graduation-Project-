// src/components/home/BenefitsOverview.jsx
import React from 'react';

const BenefitsOverview = () => {
  const userBenefits = [
    {
      userType: 'Factory Managers',
      benefits: [
        'Comprehensive overview of all maintenance activities',
        'Real-time analytics for data-driven decisions',
        'Reduced downtime and maintenance costs',
        'Improved resource allocation'
      ],
      color: 'bg-[#02245B]'
    },
    {
      userType: 'Maintenance Supervisors',
      benefits: [
        'Efficient work order distribution and tracking',
        'Streamlined scheduling of preventive maintenance',
        'Simplified resource management',
        'Performance tracking of maintenance teams'
      ],
      color: 'bg-[#FF5E14]'
    },
    {
      userType: 'Technicians',
      benefits: [
        'Clear task assignments and priorities',
        'Mobile access to equipment information',
        'Simplified documentation of completed work',
        'Access to maintenance history and manuals'
      ],
      color: 'bg-[#5F656F]'
    }
  ];

  return (
    <section className="benefits-overview py-16 bg-[#F5F5F5]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-[#02245B]">Benefits For Your Team</h2>
          <p className="text-[#5F656F] max-w-3xl mx-auto">
            Our platform delivers targeted benefits for every role in your maintenance team.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 ">
          {userBenefits.map((item, index) => (
            <div key={index} className="rounded-lg overflow-hidden shadow-md">
              <div className={`${item.color} text-white p-6`}>
                <h3 className="text-xl font-bold mb-2">{item.userType}</h3>
              </div>
              <div className="bg-white p-6">
                <ul className="space-y-3">
                  {item.benefits.map((benefit, benefitIndex) => (
                    <li key={benefitIndex} className="flex items-start">
                      <svg className="w-5 h-5 text-[#FF5E14] mt-1 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                      <span className="text-[#5F656F]">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsOverview;