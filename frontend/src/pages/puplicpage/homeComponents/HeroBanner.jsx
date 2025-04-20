// src/components/home/HeroBanner.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const HeroBanner = () => {
  // Slider data
  const slides = [
    {
      id: 1,
      title: "Optimize Your Factory Maintenance",
      description: "Comprehensive maintenance management solutions to streamline industrial operations and reduce downtime",
      image: "/images/factory-dashboard.png",
      gradient: "from-[#02245B] to-[#5F656F]"
    },
    {
      id: 2,
      title: "Track & Schedule Maintenance Effortlessly",
      description: "Automate preventive maintenance scheduling and work order tracking in one unified system",
      image: "/images/maintenance-team.png",
      gradient: "from-[#FF5E14] to-[#FF8F14]"
    },
    {
      id: 3,
      title: "Advanced Maintenance Analytics",
      description: "Valuable insights and key performance metrics to enhance maintenance efficiency",
      image: "/images/analytics-dashboard.png",
      gradient: "from-[#02245B] to-[#0A4FAA]"
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-change slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 6000); // Change every 6 seconds

    return () => clearInterval(interval);
  }, [slides.length]);

  // Go to next slide
  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
  };

  // Go to previous slide
  const prevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + slides.length) % slides.length);
  };

  // Go to specific slide
  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <section className="hero-banner relative h-[650px] overflow-hidden">
      {/* Background pattern with animation */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5 z-0"></div>
      
      {/* Animated particles */}
      <div className="absolute inset-0 z-0">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i}
            className="absolute w-2 h-2 md:w-3 md:h-3 rounded-full bg-white/20"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${5 + Math.random() * 10}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          ></div>
        ))}
      </div>
      
      {/* Slides */}
      <div className="relative h-full">
        {slides.map((slide, index) => (
          <div 
            key={slide.id}
            className={`absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out
              ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            {/* Slide background */}
            <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient} transition-all duration-1000`}></div>
            <div className="absolute inset-0 bg-pattern opacity-10"></div>
            
            {/* Slide content */}
            <div className="container mx-auto px-4 h-full flex items-center relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center h-full py-16">
                <div className={`text-white transition-all duration-700 transform 
                  ${index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                  style={{ transitionDelay: '300ms' }}
                >
                  <span className="inline-block px-4 py-1 bg-white/10 backdrop-blur-sm text-white rounded-full mb-4 border border-white/20">
                    Factory Maintenance Management System
                  </span>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                    {slide.title}
                  </h1>
                  <p className="text-xl mb-8 opacity-90 max-w-lg">
                    {slide.description}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link 
                      to="/register" 
                      className="bg-[#FF5E14] hover:bg-[#e65512] text-white font-bold py-4 px-8 rounded-lg text-center transform transition-all hover:scale-105 hover:shadow-xl shadow-lg flex items-center justify-center group"
                    >
                      <span>Start Free Trial</span>
                      <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>
                    <Link 
                      to="/about" 
                      className="bg-white/10 backdrop-blur-sm border-2 border-white/30 hover:bg-white/20 text-white font-bold py-4 px-8 rounded-lg text-center transform transition-all hover:scale-105 flex items-center justify-center"
                    >
                      Learn More
                    </Link>
                  </div>
                  
                  {/* Slide indicators - number format */}
                  <div className="mt-12 flex items-center">
                    <span className="text-3xl font-bold text-white/70">{currentSlide + 1}</span>
                    <span className="mx-2 text-white/50">/</span>
                    <span className="text-xl text-white/50">{slides.length}</span>
                  </div>
                </div>
                
                <div className={`flex justify-center transition-all duration-700 transform 
                  ${index === currentSlide ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}
                  style={{ transitionDelay: '500ms' }}
                >
                  <div className="relative">
                    {/* Slide image with effects */}
                    <div className="absolute -inset-0.5 bg-white/20 rounded-xl blur-md"></div>
                    <div className="relative rounded-xl shadow-2xl border border-white/10 overflow-hidden group">
                      <img 
                        src={slide.image} 
                        alt="Factory Maintenance Dashboard" 
                        className="relative w-full h-full object-cover transform transition-transform duration-7000 group-hover:scale-[1.02]"
                      />
                      
                      {/* Image overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-70"></div>
                      
                      {/* Image content */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 transform transition-transform duration-500 translate-y-2 group-hover:translate-y-0">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-[#FF5E14] mr-2 animate-pulse"></div>
                          <span className="text-white/90 text-sm">Live dashboard preview</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Decorative elements */}
                    <div className="absolute -top-8 -right-8 w-32 h-32 bg-[#FF5E14]/30 rounded-full blur-xl"></div>
                    <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-[#02245B]/40 rounded-full blur-lg"></div>
                    
                    {/* Floating badges */}
                    <div className="absolute -top-4 -left-4 bg-white shadow-lg rounded-lg px-3 py-2 flex items-center animate-bounce-slow">
                      <svg className="w-5 h-5 text-[#FF5E14] mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                      <span className="text-xs font-bold text-gray-800">Easy to Use</span>
                    </div>
                    
                    <div className="absolute bottom-10 -right-5 bg-[#02245B] shadow-lg rounded-lg px-3 py-2 flex items-center animate-pulse-slow">
                      <svg className="w-5 h-5 text-white mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
                      </svg>
                      <span className="text-xs font-bold text-white">Real-time Data</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Navigation dots */}
      <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center items-center gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide 
                ? 'bg-white w-10' 
                : 'bg-white/40 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
      
      {/* Previous/Next buttons */}
      <button 
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-sm text-white hover:bg-black/30 transition-all hover:scale-110"
        aria-label="Previous slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button 
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-sm text-white hover:bg-black/30 transition-all hover:scale-110"
        aria-label="Next slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
      
      {/* Add custom animation styles */}
      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0px) translateX(0px); }
          25% { transform: translateY(-10px) translateX(10px); }
          50% { transform: translateY(0px) translateX(20px); }
          75% { transform: translateY(10px) translateX(10px); }
          100% { transform: translateY(0px) translateX(0px); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        
        .animate-bounce-slow {
          animation: bounce 5s infinite;
        }
        
        .bg-grid-pattern {
          background-image: linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px);
          background-size: 20px 20px;
        }
      `}</style>
    </section>
  );
};

export default HeroBanner;