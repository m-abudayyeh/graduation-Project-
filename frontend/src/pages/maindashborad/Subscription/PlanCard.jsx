import React from 'react';

const PlanCard = ({ title, price, period, features, onSubscribe, recommended }) => {
  return (
    <div className={`rounded-lg shadow-md p-6 border ${recommended ? 'border-[#FF5E14] bg-orange-50' : 'border-gray-200'}`}>
      {recommended && (
        <div className="inline-block bg-[#FF5E14] text-white px-3 py-1 rounded-full text-sm mb-4">
          Recommended
        </div>
      )}
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <div className="mb-4">
        <span className="text-3xl font-bold">{price}</span>
        <span className="text-gray-600 ml-1">{period}</span>
      </div>
      <ul className="mb-6 space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <button 
        onClick={onSubscribe}
        className={`w-full py-2 px-4 rounded-md transition-colors ${
          recommended 
            ? 'bg-[#FF5E14] hover:bg-[#e44d0e] text-white' 
            : 'bg-gray-800 hover:bg-gray-900 text-white'
        }`}
      >
        Subscribe Now
      </button>
    </div>
  );
};

export default PlanCard;