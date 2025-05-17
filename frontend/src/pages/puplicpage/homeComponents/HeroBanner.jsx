// src/components/home/HeroBanner.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const HeroBanner = () => {
  // Slider data
  const slides = [
      {
    id: 1,
    title: "Optimize Your Factory Maintenance",
    description: "Boost reliability and extend equipment lifespan with smart maintenance planning tailored for industrial environments.",
    image: "pexels-photo-8985607.webp",
    gradient: "from-[#02245B] to-[#5F656F]"
  },
  {
    id: 2,
    title: "Track & Schedule Energy Effortlessly",
    description: "Monitor energy consumption, schedule usage, and automate maintenance to reduce waste and improve operational efficiency.",
    image: "pexels-photo-2569839.jpeg",
    gradient: "from-[#3F3F3F] to-[#5C5C5C]"
  },
  {
    id: 3,
    title: "Advanced Production Analytics",
    description: "Analyze real-time performance, detect inefficiencies, and make data-driven decisions to improve production output and quality.",
    image: "pexels-photo-4481326.jpeg",
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
      <div className="relative h-full ">
        {slides.map((slide, index) => (
          <div 
            key={slide.id}
            className={`absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out
              ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            {/* Slide background image */}
            <div className="absolute inset-0 bg-cover bg-center z-0" style={{ backgroundImage: `url(${slide.image})` }}></div>
            
            {/* Darkening overlay */}
            <div className="absolute inset-0  z-0"></div>
            
            {/* Color gradient overlay (reduced opacity) */}
            <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient} opacity-70 z-0`}></div>
            
            <div className="absolute inset-0 bg-pattern opacity-10 z-0"></div>
            
            {/* Slide content */}
            <div className="container px-4 h-full flex items-center relative z-10 mx-24">
              <div className="w-full md:w-3/5 lg:w-1/2 py-8">
                <div className={`text-white transition-all duration-700 transform 
                  ${index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                  style={{ transitionDelay: '300ms' }}
                >
                  {/* <span className="inline-block px-4 py-1 bg-white/10 backdrop-blur-sm text-white rounded-full mb-4 border border-white/20">
                    Factory Maintenance Management System
                  </span> */}
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