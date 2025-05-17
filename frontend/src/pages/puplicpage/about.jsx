import React from 'react';
import { FaTools, FaClock, FaChartLine, FaUsers, FaMapMarkedAlt, FaCheckCircle, FaCogs, FaShieldAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
const AboutUs = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <div className="bg-[#02245B] text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Transforming Industrial System</h1>
            <p className="text-xl opacity-90 mb-10">
              Your trusted partner in streamlining factory operations and maintenance workflows.
            </p>
           
          <Link
  to="/register"
  className="bg-[#FF5E14] text-white px-8 py-3 rounded-md font-semibold hover:bg-opacity-90 transition duration-300 inline-block"
>
  Start Free Trial
</Link>
          </div>
        </div>
      </div>

      {/* Our Mission */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-[#02245B] mb-6">Our Mission</h2>
            <p className="text-[#5F656F] text-lg leading-relaxed">
             We are committed to transforming industrial maintenance through cutting-edge technology solutions. Our all-in-one platform enables factories and industrial facilities to streamline their maintenance operations, minimize downtime, and extend equipment lifespan — leading to substantial cost savings and improved operational performance.

Beyond maintenance, our solution empowers industrial establishments to enhance productivity, ensure product quality, optimize resource efficiency, and comply with industry standards. By driving smarter operations, we help manufacturers reach peak performance and achieve sustainable growth.

            </p>
          </div>
        </div>
      </div>

      {/* Key Features */}
      <div className="py-16 mx-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-[#02245B] mb-12">What Sets Us Apart</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
            icon={<FaTools className="text-[#FF5E14] text-4xl" />}
  title="Smart Work Order Management"
  description="Streamline task creation, assignment, and completion with intelligent automation and real-time tracking."
            />
            
            <FeatureCard 
           icon={<FaClock className="text-[#FF5E14] text-4xl" />}
  title="Preventive Maintenance Scheduling"
  description="Prevent unplanned downtimes by automating preventive maintenance activities across assets."
            />
            
            <FeatureCard 
icon={<FaChartLine className="text-[#FF5E14] text-4xl" />}
  title="Performance & Productivity Analytics"
  description="Monitor asset performance and workforce productivity with actionable insights and KPIs."
            />
            
            <FeatureCard 
              icon={<FaCogs className="text-[#FF5E14] text-4xl" />}
  title="Production Efficiency Optimization"
  description="Reduce bottlenecks and increase production throughput by integrating maintenance with operations."
            />
            
            <FeatureCard 
            icon={<FaShieldAlt className="text-[#FF5E14] text-4xl" />}
  title="Quality Control & Compliance"
  description="Ensure consistent product quality and meet industry standards with built-in quality assurance tools."
            />
            
            <FeatureCard 
                icon={<FaMapMarkedAlt className="text-[#FF5E14] text-4xl" />}
  title="Multi-Site Coordination"
  description="Oversee maintenance and production operations across multiple sites from a centralized dashboard."
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
                  Established in 2025 by a visionary team of industrial maintenance professionals and software engineers, our platform emerged from real-world challenges faced inside factories and production environments.

                </p>
                <p className="text-[#5F656F] mb-4 leading-relaxed">
                 We witnessed how outdated paper-based systems and generic software tools led to inefficiencies, miscommunication, and costly downtime. Determined to change this, we set out to build a purpose-driven solution tailored specifically for the industrial sector.

                </p>
                <p className="text-[#5F656F] leading-relaxed">
             By blending deep operational expertise with innovative technologies, we created a platform that not only simplifies maintenance management, but also enhances productivity, quality, and overall plant efficiency. Today, our solution supports factories across diverse industries in their journey toward smarter operations and sustainable growth.
                </p>
              </div>
              <div className="rounded-lg overflow-hidden shadow-xl">
                <img 
                  src="factory-team.webp" 
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
      
      {/* Call to Action */}
      <div className="bg-[#173A6F] text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Maintenance Operations?</h2>
            <p className="text-xl opacity-90 mb-10">
              Join hundreds of industrial facilities that have revolutionized their maintenance management.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
           
<Link
  to="/register"
  className="bg-[#FF5E14] text-white px-8 py-3 rounded-md font-semibold hover:bg-opacity-90 transition duration-300 inline-block"
>
  Start 7-Day Free Trial
</Link>
        
<Link
  to="/services#contact-section"
  className="border-2 border-white text-white px-8 py-3 rounded-md font-semibold hover:bg-white hover:text-[#02245B] transition duration-300 inline-block"
>
  Schedule a Demo
</Link>
      
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