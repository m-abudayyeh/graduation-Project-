import React from 'react';
import { FaTools, FaChartLine, FaClock, FaUsers, FaMapMarkedAlt, FaCheckCircle } from 'react-icons/fa';

const AboutUs = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <div className="bg-[#02245B] text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Transforming Industrial Maintenance</h1>
            <p className="text-xl opacity-90 mb-10">
              Your trusted partner in streamlining factory operations and maintenance workflows.
            </p>
            <button className="bg-[#FF5E14] text-white px-8 py-3 rounded-md font-semibold hover:bg-opacity-90 transition duration-300">
              Start Free Trial
            </button>
          </div>
        </div>
      </div>

      {/* Our Mission */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-[#02245B] mb-6">Our Mission</h2>
            <p className="text-[#5F656F] text-lg leading-relaxed">
              We are dedicated to revolutionizing industrial maintenance management through innovative 
              technology solutions. Our comprehensive platform empowers factories and industrial facilities 
              to optimize their maintenance processes, reduce downtime, and extend equipment lifespan, 
              resulting in significant cost savings and improved operational efficiency.
            </p>
          </div>
        </div>
      </div>

      {/* Key Features */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-[#02245B] mb-12">What Sets Us Apart</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<FaTools className="text-[#FF5E14] text-4xl" />}
              title="Comprehensive Work Order Management"
              description="Efficiently create, assign, and track maintenance tasks from start to finish with our intuitive system."
            />
            
            <FeatureCard 
              icon={<FaClock className="text-[#FF5E14] text-4xl" />}
              title="Preventive Maintenance"
              description="Reduce costly breakdowns by scheduling and automating preventive maintenance activities."
            />
            
            <FeatureCard 
              icon={<FaChartLine className="text-[#FF5E14] text-4xl" />}
              title="Advanced Analytics"
              description="Gain valuable insights with detailed reports and analytics to optimize your maintenance operations."
            />
            
            <FeatureCard 
              icon={<FaUsers className="text-[#FF5E14] text-4xl" />}
              title="Role-Based Access"
              description="Tailor system access based on employee roles for optimal workflow and security."
            />
            
            <FeatureCard 
              icon={<FaMapMarkedAlt className="text-[#FF5E14] text-4xl" />}
              title="Multi-Location Support"
              description="Easily manage maintenance across multiple facilities from a single platform."
            />
            
            <FeatureCard 
              icon={<FaCheckCircle className="text-[#FF5E14] text-4xl" />}
              title="Quality Assurance"
              description="Ensure maintenance tasks meet quality standards with built-in verification procedures."
            />
          </div>
        </div>
      </div>

      {/* Our Story */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-[#02245B] mb-6">Our Story</h2>
                <p className="text-[#5F656F] mb-4 leading-relaxed">
                  Founded in 2020 by a team of industrial maintenance experts and software engineers, our platform 
                  was born from firsthand experience with the challenges of factory maintenance management.
                </p>
                <p className="text-[#5F656F] mb-4 leading-relaxed">
                  We recognized that many facilities were struggling with inefficient paper-based systems or using 
                  software not specifically designed for industrial maintenance. This led to delays, miscommunication, 
                  and costly downtime.
                </p>
                <p className="text-[#5F656F] leading-relaxed">
                  Our solution combines deep industry knowledge with cutting-edge technology to create a platform 
                  that addresses the unique needs of factory maintenance teams. Today, we serve clients across 
                  various industrial sectors, helping them achieve operational excellence.
                </p>
              </div>
              <div className="rounded-lg overflow-hidden shadow-xl">
                <img 
                  src="/images/factory-team.jpg" 
                  alt="Our team in a factory setting" 
                  className="w-full h-auto"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/600x400?text=Our+Team";
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-[#02245B] mb-12">What Our Clients Say</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <TestimonialCard 
              quote="This platform has revolutionized how we manage maintenance. We've reduced downtime by 35% in just six months."
              author="John Smith"
              position="Maintenance Manager"
              company="Acme Manufacturing"
            />
            
            <TestimonialCard 
              quote="The preventive maintenance features alone have saved us thousands in potential equipment failures."
              author="Sarah Johnson"
              position="Operations Director"
              company="Global Industries"
            />
            
            <TestimonialCard 
              quote="Easy to implement and user-friendly. Our technicians adapted quickly and now can't imagine working without it."
              author="Robert Chen"
              position="Technical Supervisor"
              company="Precision Engineering"
            />
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-[#02245B] text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Maintenance Operations?</h2>
            <p className="text-xl opacity-90 mb-10">
              Join hundreds of industrial facilities that have revolutionized their maintenance management.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="bg-[#FF5E14] text-white px-8 py-3 rounded-md font-semibold hover:bg-opacity-90 transition duration-300">
                Start 7-Day Free Trial
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-md font-semibold hover:bg-white hover:text-[#02245B] transition duration-300">
                Schedule a Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Feature Card Component
const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition duration-300">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-[#02245B] mb-3">{title}</h3>
      <p className="text-[#5F656F]">{description}</p>
    </div>
  );
};

// Testimonial Card Component
const TestimonialCard = ({ quote, author, position, company }) => {
  return (
    <div className="bg-[#F5F5F5] p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
      <div className="text-[#FF5E14] text-5xl font-serif mb-4">"</div>
      <p className="text-[#5F656F] italic mb-6">{quote}</p>
      <div>
        <p className="font-semibold text-[#02245B]">{author}</p>
        <p className="text-sm text-[#5F656F]">{position}, {company}</p>
      </div>
    </div>
  );
};

export default AboutUs;