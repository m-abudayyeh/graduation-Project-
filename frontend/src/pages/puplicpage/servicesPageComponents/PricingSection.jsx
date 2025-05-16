// PricingSection.jsx
import React from 'react';
import { Check } from 'lucide-react';

const PricingSection = () => {
  return (
    <div className="py-20 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Custom Solution Pricing</h2>
          <p className="max-w-3xl mx-auto text-gray-600">
            Our custom solutions are tailored to your specific needs and requirements. 
            Pricing varies based on project scope, complexity, and implementation timeline.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Base Platform Pricing */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-8 bg-deep-blue text-white text-center" style={{ backgroundColor: '#02245B' }}>
              <h3 className="text-2xl font-bold mb-2">Platform Subscription</h3>
              <p className="text-gray-200 mb-6">Core maintenance management system</p>
              <div className="flex justify-center items-baseline">
                <span className="text-3xl font-bold">$20</span>
                <span className="text-xl ml-1 font-medium">/month</span>
              </div>
              <p className="mt-2 text-gray-300">or $216/year</p>
            </div>
            
            <div className="p-8">
              <ul className="space-y-4">
                <li className="flex items-start">
                  <Check size={20} className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                  <span>Maintenance task management</span>
                </li>
                <li className="flex items-start">
                  <Check size={20} className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                  <span>Preventive maintenance scheduling</span>
                </li>
                <li className="flex items-start">
                  <Check size={20} className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                  <span>Asset and inventory tracking</span>
                </li>
                <li className="flex items-start">
                  <Check size={20} className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                  <span>Basic reporting and analytics</span>
                </li>
                <li className="flex items-start">
                  <Check size={20} className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                  <span>7-day free trial</span>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Custom Development */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden border-2 border-orange-500 transform scale-105 z-10" style={{ borderColor: '#FF5E14' }}>
            <div className="p-8 text-white text-center relative" style={{ backgroundColor: '#FF5E14' }}>
              <div className="absolute top-0 right-0 bg-deep-blue text-white text-xs font-bold py-1 px-3 rounded-bl-lg" style={{ backgroundColor: '#02245B' }}>
                MOST POPULAR
              </div>
              <h3 className="text-2xl font-bold mb-2">Custom Development</h3>
              <p className="text-gray-100 mb-6">Tailored to your specific needs</p>
              <div className="flex justify-center items-baseline">
                <span className="text-3xl font-bold">Custom</span>
                <span className="text-xl ml-1 font-medium">Quote</span>
              </div>
              <p className="mt-2 text-gray-200">Based on project requirements</p>
            </div>
            
            <div className="p-8">
              <ul className="space-y-4">
                <li className="flex items-start">
                  <Check size={20} className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                  <span>All platform subscription features</span>
                </li>
                <li className="flex items-start">
                  <Check size={20} className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                  <span>Custom workflows & interfaces</span>
                </li>
                <li className="flex items-start">
                  <Check size={20} className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                  <span>Industry-specific modules</span>
                </li>
                <li className="flex items-start">
                  <Check size={20} className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                  <span>Integration with existing systems</span>
                </li>
                <li className="flex items-start">
                  <Check size={20} className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                  <span>Dedicated implementation support</span>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Add-on Modules */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-8 bg-gray-700 text-white text-center">
              <h3 className="text-2xl font-bold mb-2">Add-on Modules</h3>
              <p className="text-gray-200 mb-6">Extend your system capabilities</p>
              <div className="flex justify-center items-baseline">
                <span className="text-3xl font-bold">Starting at</span>
              </div>
              <p className="mt-2 text-gray-300">Contact for pricing details</p>
            </div>
            
            <div className="p-8">
              <ul className="space-y-4">
                <li className="flex items-start">
                  <Check size={20} className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                  <span>Production management module</span>
                </li>
                <li className="flex items-start">
                  <Check size={20} className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                  <span>Energy monitoring system</span>
                </li>
                <li className="flex items-start">
                  <Check size={20} className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                  <span>IoT sensor integration</span>
                </li>
                <li className="flex items-start">
                  <Check size={20} className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                  <span>Advanced analytics</span>
                </li>
                <li className="flex items-start">
                  <Check size={20} className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                  <span>Implementation consulting</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Need more information about our custom solutions and pricing options?
            Contact our team for a personalized consultation.
          </p>
          <button 
            className="px-8 py-4 bg-orange-500 text-white font-bold rounded-md hover:bg-orange-600 transition-colors"
            style={{ backgroundColor: '#FF5E14' }}
          >
            Request a Quote
          </button>
        </div>
      </div>
    </div>
  );
};

export default PricingSection;