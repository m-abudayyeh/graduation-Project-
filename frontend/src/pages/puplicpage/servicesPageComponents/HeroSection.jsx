import React, { useRef } from 'react';import { ChevronRight } from 'lucide-react';


import ContactSection from "./Contact";
const HeroSection = () => {
  const contactRef = useRef(null);
const scrollToContact = () => {
  const section = document.getElementById('contact-section');
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
  }
};

  return (
    <div className="relative bg-[#02245B] py-16 md:py-24 overflow-hidden">
      {/* Abstract Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute right-0 bottom-0 opacity-10">
          <svg width="600" height="600" viewBox="0 0 200 200">
            <path fill="#FF5E14" d="M42.7,-73.2C55.9,-67.3,67.7,-56.7,72.7,-43.7C77.7,-30.6,75.9,-15.3,73.5,-1.4C71.1,12.6,68.1,25.1,62.6,37.4C57.1,49.7,49.1,61.7,38.1,68.1C27.1,74.5,13.5,75.3,-0.2,75.5C-13.8,75.8,-27.6,75.6,-40.8,70.7C-54,65.8,-66.5,56.3,-73.6,43.7C-80.8,31,-82.5,15.5,-81.2,0.8C-79.9,-14,-75.6,-28,-68.4,-40.5C-61.2,-53,-51.2,-64.1,-39,-70.1C-26.9,-76.1,-13.4,-77.1,0.8,-78.5C15,-79.9,29.5,-81.6,42.7,-73.2Z" transform="translate(100 100)" />
          </svg>
        </div>
        <div className="absolute left-0 top-0 opacity-5">
          <svg width="400" height="400" viewBox="0 0 200 200">
            <path fill="#F5F5F5" d="M39.5,-68.1C52.5,-62.1,65.3,-53.9,73.4,-42.1C81.5,-30.3,84.9,-15.1,83.4,-0.9C82,13.4,75.7,26.8,67.5,38.7C59.3,50.5,49.2,60.8,37.1,67.9C25,74.9,12.5,78.7,-0.9,80.1C-14.2,81.6,-28.5,80.8,-40.8,74.6C-53.1,68.5,-63.5,57.1,-70.4,44C-77.2,30.9,-80.6,15.5,-79.9,0.4C-79.2,-14.6,-74.3,-29.2,-66.6,-42.1C-58.9,-55.1,-48.3,-66.4,-35.8,-72.4C-23.2,-78.4,-11.6,-79,-0.2,-78.7C11.3,-78.3,22.6,-77,39.5,-68.1Z" transform="translate(100 100)" />
          </svg>
        </div>
      </div>
      
      <div className="container mx-24 px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-0">
          {/* Text Content */}
          <div className="w-full lg:w-1/2 text-white">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
Solutions customized for
              <span className="text-[#FF5E14]"> Modern Manufacturing</span>
            </h1>
            <p className="text-lg md:text-xl mb-8 text-gray-200 max-w-xl">
             We create customized systems for your factory's unique workflows, challenges, and objectives. You can just transform your operations with solutions built around your needs.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={scrollToContact}
                className="px-8 py-4 bg-[#FF5E14] text-white font-bold rounded-lg hover:bg-orange-600 transition-colors shadow-lg flex items-center gap-2 transform hover:translate-y-1 hover:shadow-xl transition-all duration-300"
              >
                Request Custom Solution
                <ChevronRight size={20} />
              </button>
            </div>
            
       
          </div>
          
          {/* Image */}
          <div className="w-full lg:w-1/3 flex justify-center">
            <div className="relative">
              {/* Decorative elements */}
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-[#FF5E14] rounded-full opacity-20 blur-xl"></div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#5F656F] rounded-full opacity-20 blur-xl"></div>
              
              <img 
                src="pexels-photo-1267337.jpeg" 
                alt="Factory Maintenance Solution"
                className="rounded-xl shadow-2xl object-cover w-full max-w-lg border-4 border-[#F5F5F5]/10"
              />
              
              {/* Feature callout */}
              <div className="absolute -bottom-5 -right-5 bg-white rounded-lg shadow-xl p-4 max-w-xs">
                <div className="flex items-center gap-3">
                  <div className="bg-[#FF5E14] rounded-full p-2 text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-[#5F656F]">Make your custom services</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
       <div ref={contactRef}>
      </div>
    </div>
  );
};

export default HeroSection;