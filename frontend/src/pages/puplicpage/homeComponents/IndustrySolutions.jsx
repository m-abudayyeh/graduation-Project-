// src/components/home/IndustrySolutions.jsx
import React from 'react';

const IndustrySolutions = () => {
  const industries = [
    {
      name: 'Manufacturing',
      image: '/images/manufacturing.jpg',
      description: 'Optimize production lines with tailored maintenance workflows and reduce costly downtime.'
    },
    {
      name: 'Food Processing',
      image: '/images/food-processing.jpg',
      description: 'Maintain hygienic operations and ensure compliance with food safety maintenance standards.'
    },
    {
      name: 'Automotive',
      image: '/images/automotive.jpg',
      description: 'Keep assembly lines running smoothly with preventive maintenance and quick issue resolution.'
    },
    {
      name: 'Pharmaceuticals',
      image: '/images/pharmaceuticals.jpg',
      description: 'Support GMP compliance and critical equipment maintenance in regulated environments.'
    }
  ];

  return (
    <section className="industry-solutions py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-[#02245B]">Industry Solutions</h2>
          <p className="text-[#5F656F] max-w-3xl mx-auto">
            Our maintenance management system adapts to the unique needs of various industrial sectors.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {industries.map((industry, index) => (
            <div key={index} className="overflow-hidden rounded-lg shadow-md group">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={industry.image} 
                  alt={industry.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#02245B]/80 to-transparent"></div>
                <h3 className="absolute bottom-0 left-0 right-0 p-4 text-white text-xl font-bold">
                  {industry.name}
                </h3>
              </div>
              <div className="p-4 bg-white">
                <p className="text-[#5F656F]">{industry.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default IndustrySolutions;