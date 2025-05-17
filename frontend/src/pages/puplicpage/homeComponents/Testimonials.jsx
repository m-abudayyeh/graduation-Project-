// // src/components/home/Testimonials.jsx
// import React, { useState } from 'react';

// const Testimonials = () => {
//   const testimonials = [
//     {
//       quote: "We've reduced our maintenance downtime by 35% since implementing this system. The preventive maintenance features have been a game-changer for our production lines.",
//       author: "Ahmed Mahmoud",
//       position: "Maintenance Manager",
//       company: "Global Manufacturing Co.",
//       image: "/images/testimonial-1.jpg"
//     },
//     {
//       quote: "The work order management has streamlined our entire maintenance process. My team now has clear priorities and all the information they need at their fingertips.",
//       author: "Sara Ahmed",
//       position: "Factory Supervisor",
//       company: "Industrial Solutions Ltd.",
//       image: "/images/testimonial-2.jpg"
//     },
//     {
//       quote: "What impressed me most was how quickly we could set up the system and see results. Within two weeks, we had better visibility into our maintenance operations than ever before.",
//       author: "Khaled Ibrahim",
//       position: "Operations Director",
//       company: "Tech Manufacturing",
//       image: "/images/testimonial-3.jpg"
//     }
//   ];

//   const [activeIndex, setActiveIndex] = useState(0);

//   const nextTestimonial = () => {
//     setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
//   };

//   const prevTestimonial = () => {
//     setActiveIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
//   };

//   return (
    // <section className="testimonials py-16 bg-[#02245B] text-white">
    //   <div className="container mx-auto px-4">
    //     <div className="text-center mb-12">
    //       <h2 className="text-3xl font-bold mb-4">What Our Clients Say</h2>
    //       <p className="max-w-3xl mx-auto opacity-80">
    //         Discover how our maintenance management solution has transformed operations for industrial facilities.
    //       </p>
    //     </div>
        
//         <div className="max-w-4xl mx-auto">
//           <div className="relative bg-[#02245B]/50 p-8 rounded-lg border border-white/10">
//             {/* Quote icon */}
//             <div className="absolute top-0 left-0 -translate-x-4 -translate-y-4">
//               <svg className="w-12 h-12 text-[#FF5E14] opacity-50" fill="currentColor" viewBox="0 0 24 24">
//                 <path d="M9.983 3v7.391C9.983 16.095 5.389 16.69 5 16.777V14.816c.726-.007 2.463-.331 2.463-3.777V10.5H3V3h6.983zm11 0v7.391C20.983 16.095 16.389 16.69 16 16.777V14.816c.726-.007 2.463-.331 2.463-3.777V10.5H14V3h6.983z"/>
//               </svg>
//             </div>
            
//             <div className="text-center">
//               <p className="text-xl italic mb-6">"{testimonials[activeIndex].quote}"</p>
              
//               <div className="flex items-center justify-center mb-4">
//                 <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#FF5E14] mr-4">
//                   <img 
//                     src={testimonials[activeIndex].image} 
//                     alt={testimonials[activeIndex].author}
//                     className="w-full h-full object-cover" 
//                   />
//                 </div>
//                 <div className="text-left">
//                   <h4 className="font-bold text-lg">{testimonials[activeIndex].author}</h4>
//                   <p className="text-sm opacity-80">{testimonials[activeIndex].position}</p>
//                   <p className="text-sm opacity-80">{testimonials[activeIndex].company}</p>
//                 </div>
//               </div>
              
//               <div className="flex justify-center gap-2 mt-6">
//                 {testimonials.map((_, index) => (
//                   <button
//                     key={index}
//                     onClick={() => setActiveIndex(index)}
//                     className={`w-3 h-3 rounded-full ${index === activeIndex ? 'bg-[#FF5E14]' : 'bg-white/30'}`}
//                     aria-label={`Go to testimonial ${index + 1}`}
//                   />
//                 ))}
//               </div>
              
//               <div className="flex justify-center gap-4 mt-6">
//                 <button 
//                   onClick={prevTestimonial}
//                   className="p-2 rounded-full border border-white/20 hover:bg-white/10 transition"
//                   aria-label="Previous testimonial"
//                 >
//                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
//                   </svg>
//                 </button>
//                 <button 
//                   onClick={nextTestimonial}
//                   className="p-2 rounded-full border border-white/20 hover:bg-white/10 transition"
//                   aria-label="Next testimonial"
//                 >
//                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
//                   </svg>
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Testimonials;

// TestimonialsSection.jsx
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

const Testimonials = () => {
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
    <div className="py-20 bg-[#F5F5F5]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4 text-[#02245B]">What Our Clients Say</h2>
          <p className="max-w-3xl mx-auto opacity-80">
           Discover how our maintenance management solution has transformed operations for industrial facilities.
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

export default Testimonials;