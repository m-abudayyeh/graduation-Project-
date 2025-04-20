// src/components/home/Testimonials.jsx
import React, { useState } from 'react';

const Testimonials = () => {
  const testimonials = [
    {
      quote: "We've reduced our maintenance downtime by 35% since implementing this system. The preventive maintenance features have been a game-changer for our production lines.",
      author: "Ahmed Mahmoud",
      position: "Maintenance Manager",
      company: "Global Manufacturing Co.",
      image: "/images/testimonial-1.jpg"
    },
    {
      quote: "The work order management has streamlined our entire maintenance process. My team now has clear priorities and all the information they need at their fingertips.",
      author: "Sara Ahmed",
      position: "Factory Supervisor",
      company: "Industrial Solutions Ltd.",
      image: "/images/testimonial-2.jpg"
    },
    {
      quote: "What impressed me most was how quickly we could set up the system and see results. Within two weeks, we had better visibility into our maintenance operations than ever before.",
      author: "Khaled Ibrahim",
      position: "Operations Director",
      company: "Tech Manufacturing",
      image: "/images/testimonial-3.jpg"
    }
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  const nextTestimonial = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="testimonials py-16 bg-[#02245B] text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">What Our Clients Say</h2>
          <p className="max-w-3xl mx-auto opacity-80">
            Discover how our maintenance management solution has transformed operations for industrial facilities.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-[#02245B]/50 p-8 rounded-lg border border-white/10">
            {/* Quote icon */}
            <div className="absolute top-0 left-0 -translate-x-4 -translate-y-4">
              <svg className="w-12 h-12 text-[#FF5E14] opacity-50" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9.983 3v7.391C9.983 16.095 5.389 16.69 5 16.777V14.816c.726-.007 2.463-.331 2.463-3.777V10.5H3V3h6.983zm11 0v7.391C20.983 16.095 16.389 16.69 16 16.777V14.816c.726-.007 2.463-.331 2.463-3.777V10.5H14V3h6.983z"/>
              </svg>
            </div>
            
            <div className="text-center">
              <p className="text-xl italic mb-6">"{testimonials[activeIndex].quote}"</p>
              
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#FF5E14] mr-4">
                  <img 
                    src={testimonials[activeIndex].image} 
                    alt={testimonials[activeIndex].author}
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div className="text-left">
                  <h4 className="font-bold text-lg">{testimonials[activeIndex].author}</h4>
                  <p className="text-sm opacity-80">{testimonials[activeIndex].position}</p>
                  <p className="text-sm opacity-80">{testimonials[activeIndex].company}</p>
                </div>
              </div>
              
              <div className="flex justify-center gap-2 mt-6">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={`w-3 h-3 rounded-full ${index === activeIndex ? 'bg-[#FF5E14]' : 'bg-white/30'}`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
              
              <div className="flex justify-center gap-4 mt-6">
                <button 
                  onClick={prevTestimonial}
                  className="p-2 rounded-full border border-white/20 hover:bg-white/10 transition"
                  aria-label="Previous testimonial"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button 
                  onClick={nextTestimonial}
                  className="p-2 rounded-full border border-white/20 hover:bg-white/10 transition"
                  aria-label="Next testimonial"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;