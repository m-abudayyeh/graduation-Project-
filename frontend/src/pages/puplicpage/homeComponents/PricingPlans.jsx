// src/components/home/PricingPlans.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const PricingPlans = () => {
  const plans = [
    {
      name: 'Free Trial',
      price: '0',
      duration: '7 days',
      features: [
        'Full access to all features',
        'Unlimited users',
        'Priority technical support',
        'Unlimited work orders',
        'All dashboard features',
        'Data export capabilities'
      ],
      isFeatured: false,
      buttonText: 'Start Free Trial',
      buttonLink: '/register'
    },
    {
      name: 'Monthly',
      price: '20',
      duration: 'per month',
      features: [
        'Full access to all features',
        'Unlimited users',
        'Priority technical support',
        'Unlimited work orders',
        'All dashboard features',
        'Data export capabilities'
      ],
      isFeatured: true,
      buttonText: 'Choose Monthly',
      buttonLink: '/register?plan=monthly'
    },
    {
      name: 'Annual',
      price: '216',
      duration: 'per year',
      features: [
        'Full access to all features',
        'Unlimited users',
        'Priority technical support',
        'Unlimited work orders',
        'All dashboard features',
        'Data export capabilities',
        '10% savings vs monthly plan'
      ],
      isFeatured: false,
      buttonText: 'Choose Annual',
      buttonLink: '/register?plan=annual'
    }
  ];

  return (
    <section className="pricing-plans py-16 bg-[#F5F5F5]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-[#02245B]">Simple, Transparent Pricing</h2>
          <p className="text-[#5F656F] max-w-3xl mx-auto">
            Choose the plan that works best for your maintenance needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`flex flex-col justify-between h-full rounded-lg overflow-hidden transition-transform duration-300 hover:-translate-y-2 ${
                plan.isFeatured 
                  ? 'bg-white shadow-xl border-t-4 border-[#FF5E14] relative transform scale-105 z-10' 
                  : 'bg-white shadow-md'
              }`}
            >
              {plan.isFeatured && (
                <div className="absolute top-0 right-0 bg-[#FF5E14] text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                  MOST POPULAR
                </div>
              )}

              <div className="p-6 flex flex-col grow text-center">
                <h3 className="text-xl font-bold mb-2 text-[#02245B]">{plan.name}</h3>

                <div className="my-6">
                  <span className="text-4xl font-bold text-[#02245B]">${plan.price}</span>
                  <span className="text-[#5F656F]">/{plan.duration}</span>
                </div>

                <ul className="space-y-3 mb-8 text-left">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <svg className="w-5 h-5 text-[#FF5E14] mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                      <span className="text-[#5F656F]">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto">
                  <Link 
                    to={plan.buttonLink} 
                    className={`block w-full py-3 px-6 rounded-lg font-bold text-center transition ${
                      plan.isFeatured 
                        ? 'bg-[#FF5E14] hover:bg-[#e65512] text-white' 
                        : 'bg-white border-2 border-[#FF5E14] text-[#FF5E14] hover:bg-[#FF5E14]/5'
                    }`}
                  >
                    {plan.buttonText}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingPlans;
