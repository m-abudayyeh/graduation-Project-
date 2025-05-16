// TestimonialsSection.jsx
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

const TestimonialsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const testimonials = [
    {
      name: "Ahmed Al-Khatib",
      position: "Production Manager",
      company: "Jordan Manufacturing Co.",
      image: "/assets/images/testimonial1.jpg",
      stars: 5,
      text: "The custom production management system developed for our factory has transformed our operations. We've seen a 30% increase in efficiency and can now accurately track all aspects of our production process."
    },
    {
      name: "Layla Al-Masri",
      position: "Maintenance Director",
      company: "Gulf Industries",
      image: "/assets/images/testimonial2.jpg",
      stars: 5,
      text: "Their team took the time to understand our maintenance challenges and developed a solution that fits our factory perfectly. The system has significantly reduced our downtime and streamlined our maintenance operations."
    },
    {
      name: "Omar Haddad",
      position: "Operations Manager",
      company: "Amman Steel Works",
      image: "/assets/images/testimonial3.jpg",
      stars: 5,
      text: "The energy monitoring system they built for us has helped us reduce our energy costs by 25%. The real-time monitoring capabilities have been invaluable for identifying inefficiencies in our operations."
    }
  ];

  const nextTestimonial = () => {
    setActiveIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevTestimonial = () => {
    setActiveIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Success Stories</h2>
          <p className="max-w-3xl mx-auto text-gray-600">
            See how our custom factory solutions have helped businesses like yours 
            overcome challenges and achieve operational excellence.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto relative">
          {/* Testimonial Card */}
          <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center md:items-start mb-8">
              <div className="w-24 h-24 rounded-full overflow-hidden mb-4 md:mb-0 md:mr-6 flex-shrink-0">
                <img 
                  src={testimonials[activeIndex].image} 
                  alt={testimonials[activeIndex].name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://ui-avatars.com/api/?name=${testimonials[activeIndex].name.replace(' ', '+')}&background=FF5E14&color=fff`;
                  }}
                />
              </div>
              
              <div className="text-center md:text-left">
                <h3 className="text-xl font-bold">{testimonials[activeIndex].name}</h3>
                <p className="text-gray-600">{testimonials[activeIndex].position}</p>
                <p className="text-orange-500 font-semibold">{testimonials[activeIndex].company}</p>
                
                <div className="flex items-center mt-2 justify-center md:justify-start">
                  {[...Array(testimonials[activeIndex].stars)].map((_, i) => (
                    <Star key={i} size={18} fill="#FF5E14" color="#FF5E14" />
                  ))}
                  {[...Array(5 - testimonials[activeIndex].stars)].map((_, i) => (
                    <Star key={i + testimonials[activeIndex].stars} size={18} color="#D1D5DB" />
                  ))}
                </div>
              </div>
            </div>
            
            <blockquote className="text-gray-700 text-lg italic relative">
              <span className="text-6xl text-orange-200 absolute top-0 left-0 -ml-4 -mt-6">"</span>
              <p className="relative z-10 pl-4">{testimonials[activeIndex].text}</p>
              <span className="text-6xl text-orange-200 absolute bottom-0 right-0 -mr-4">"</span>
            </blockquote>
          </div>
          
          {/* Navigation */}
          <div className="flex justify-center mt-8 space-x-4">
            <button 
              onClick={prevTestimonial}
              className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft size={24} color="#5F656F" />
            </button>
            
            <div className="flex space-x-2 items-center">
              {testimonials.map((_, index) => (
                <button 
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === activeIndex ? 'bg-orange-500 w-8' : 'bg-gray-300'
                  }`}
                  style={{ backgroundColor: index === activeIndex ? '#FF5E14' : '#D1D5DB' }}
                />
              ))}
            </div>
            
            <button 
              onClick={nextTestimonial}
              className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-100 transition-colors"
            >
              <ChevronRight size={24} color="#5F656F" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialsSection;