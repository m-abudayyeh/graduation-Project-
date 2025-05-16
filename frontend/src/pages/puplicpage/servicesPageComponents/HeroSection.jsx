import React from 'react';

const HeroSection = () => {
  return (
    <div className="relative bg-deep-blue py-20 overflow-hidden" style={{ backgroundColor: '#02245B' }}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute right-0 bottom-0">
          <svg width="400" height="400" viewBox="0 0 200 200">
            <path fill="#FF5E14" d="M42.7,-73.2C55.9,-67.3,67.7,-56.7,72.7,-43.7C77.7,-30.6,75.9,-15.3,73.5,-1.4C71.1,12.6,68.1,25.1,62.6,37.4C57.1,49.7,49.1,61.7,38.1,68.1C27.1,74.5,13.5,75.3,-0.2,75.5C-13.8,75.8,-27.6,75.6,-40.8,70.7C-54,65.8,-66.5,56.3,-73.6,43.7C-80.8,31,-82.5,15.5,-81.2,0.8C-79.9,-14,-75.6,-28,-68.4,-40.5C-61.2,-53,-51.2,-64.1,-39,-70.1C-26.9,-76.1,-13.4,-77.1,0.8,-78.5C15,-79.9,29.5,-81.6,42.7,-73.2Z" transform="translate(100 100)" />
          </svg>
        </div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="w-full lg:w-1/2 text-white pb-10 lg:pb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Tailored Solutions for Modern Manufacturing
            </h1>
            <p className="text-lg md:text-xl mb-8 text-gray-200">
              We create custom systems designed specifically for your factory's unique workflows, 
              challenges, and objectives. Transform your operations with solutions built around your needs.
            </p>
            <button 
              className="px-8 py-4 bg-orange-500 text-white font-bold rounded-md hover:bg-orange-600 transition-colors"
              style={{ backgroundColor: '#FF5E14' }}
            >
              Request Custom Solution
            </button>
          </div>
          
          <div className="w-full lg:w-1/2 flex justify-center">
            <img 
              src="/assets/images/custom-solution.svg" 
              alt="Custom Factory Solutions" 
              className="max-w-md w-full"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/500x400?text=Custom+Solutions";
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;