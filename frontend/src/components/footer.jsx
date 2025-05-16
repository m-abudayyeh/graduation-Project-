// src/components/Footer.jsx
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, ArrowUp, Facebook, Twitter, Instagram, Linkedin, Clock, Check } from 'lucide-react';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="pt-16 pb-6 relative overflow-hidden " style={{ backgroundColor: '#02245B' }}>
      {/* Background decoration elements */}
      <div 
        className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-5"
        style={{ 
          background: 'radial-gradient(circle, #FF5E14 0%, transparent 70%)',
          transform: 'translate(30%, -50%)'
        }}
      ></div>
      <div 
        className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-5"
        style={{ 
          background: 'radial-gradient(circle, #FF5E14 0%, transparent 70%)',
          transform: 'translate(-30%, 30%)'
        }}
      ></div>
      <div className='mx-12'>
      <div className="container mx-auto px-6 relative z-10">
        {/* Top section with logo and social media */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 border-b border-opacity-20 border-gray-400 pb-10">
          <div className="mb-8 md:mb-0">
            <div className="flex items-center group mb-4">
              <div className="overflow-hidden rounded-lg h-12 w-auto transition-all duration-500 group-hover:shadow-lg p-1"
                   style={{ 
                     background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                     borderLeft: '1px solid rgba(255,255,255,0.2)',
                     borderTop: '1px solid rgba(255,255,255,0.2)',
                     borderRight: '1px solid rgba(255,255,255,0.05)',
                     borderBottom: '1px solid rgba(255,255,255,0.05)',
                   }}>
                <div className="h-10 w-10 rounded-md flex items-center justify-center text-white text-xl font-bold transition-all duration-500 transform group-hover:scale-105"
                     style={{ 
                       background: 'linear-gradient(135deg, #FF5E14 0%, #FF7A40 100%)',
                       boxShadow: '0 4px 10px -1px rgba(255, 94, 20, 0.3)'
                     }}>
                  OP
                </div>
              </div>
              <div className="ml-3 flex flex-col">
                <span className="text-2xl font-bold transition-all duration-300 transform group-hover:translate-x-0.5 text-white">
                  Opti<span style={{ color: '#FF5E14' }}>Plant</span>
                </span>
                <span className="text-xs tracking-wider font-medium transition-all duration-300 opacity-80 group-hover:opacity-100" style={{ color: '#F5F5F5' }}>Maintenance Management</span>
              </div>
            </div>
            <p style={{ color: '#F5F5F5' }} className="mt-2 max-w-md opacity-80 leading-relaxed">
              Providing innovative solutions. We help organizations optimize their operations, reduce downtime, and maximize efficiency.
            </p>
          </div>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Contact Information */}
          <div className="relative">
            <h3 className="text-xl font-bold mb-6 text-white relative inline-block">
              Our Contact Information
              <span className="absolute -bottom-2 left-0 w-12 h-1" style={{ backgroundColor: '#FF5E14' }}></span>
            </h3>
            <ul className="space-y-5">
              <li className="flex items-start group">
                <MapPin className="mr-3 h-5 w-5 flex-shrink-0 mt-1 transition-colors duration-300" style={{ color: '#FF5E14' }} />
                <div style={{ color: '#F5F5F5' }} className="group-hover:text-white transition-colors duration-300">
                  <p className="leading-snug"></p>
                  <p className="leading-snug">Amman, Jordan</p>
                </div>
              </li>
              <li className="flex items-center group">
                <Phone className="mr-3 h-5 w-5 flex-shrink-0 transition-colors duration-300" style={{ color: '#FF5E14' }} />
                <span style={{ color: '#F5F5F5' }} className="group-hover:text-white transition-colors duration-300">+96278078600</span>
              </li>
              <li className="flex items-center group">
                <Mail className="mr-3 h-5 w-5 flex-shrink-0 transition-colors duration-300" style={{ color: '#FF5E14' }} />
                <span style={{ color: '#F5F5F5' }} className="group-hover:text-white transition-colors duration-300">optiplant.mailer@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="relative">
            <h3 className="text-xl font-bold mb-6 text-white relative inline-block">
              Quick Links
              <span className="absolute -bottom-2 left-0 w-12 h-1" style={{ backgroundColor: '#FF5E14' }}></span>
            </h3>
            <ul className="space-y-3">
              <li>
            <a 
  href="/" 
  className="flex items-center transition-all duration-300 hover:translate-x-1 relative group overflow-hidden"
>
  <span className="mr-2 transition-all duration-300 text-lg" style={{ color: '#FF5E14' }}>&#x2192;</span>
  <span style={{ color: '#F5F5F5' }} className="relative z-10 group-hover:text-white">Home</span>
  <span 
    className="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full"
    style={{ backgroundColor: '#FF5E14' }}
  ></span>
</a>
              </li>
                            <li>
            <a 
  href="/services"
  className="flex items-center transition-all duration-300 hover:translate-x-1 relative group overflow-hidden"
>
  <span className="mr-2 transition-all duration-300 text-lg" style={{ color: '#FF5E14' }}>&#x2192;</span>
  <span style={{ color: '#F5F5F5' }} className="relative z-10 group-hover:text-white">Our Services</span>
  <span 
    className="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full"
    style={{ backgroundColor: '#FF5E14' }}
  ></span>
</a>
              </li>
              <li>
            <a 
  href="/about"
  className="flex items-center transition-all duration-300 hover:translate-x-1 relative group overflow-hidden"
>
  <span className="mr-2 transition-all duration-300 text-lg" style={{ color: '#FF5E14' }}>&#x2192;</span>
  <span style={{ color: '#F5F5F5' }} className="relative z-10 group-hover:text-white">About Us</span>
  <span 
    className="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full"
    style={{ backgroundColor: '#FF5E14' }}
  ></span>
</a>

              </li>
              <li>
            <a 
  href="/contact"
  className="flex items-center transition-all duration-300 hover:translate-x-1 relative group overflow-hidden"
>
  <span className="mr-2 transition-all duration-300 text-lg" style={{ color: '#FF5E14' }}>&#x2192;</span>
  <span style={{ color: '#F5F5F5' }} className="relative z-10 group-hover:text-white">Contact Us</span>
  <span 
    className="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full"
    style={{ backgroundColor: '#FF5E14' }}
  ></span>
</a>
              </li>
            </ul>
          </div>

          {/* Our Services */}
          <div className="relative">
            <h3 className="text-xl font-bold mb-6 text-white relative inline-block">
              Our Services
              <span className="absolute -bottom-2 left-0 w-12 h-1" style={{ backgroundColor: '#FF5E14' }}></span>
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center group">
                <Check className="mr-3 h-4 w-4 flex-shrink-0 transition-colors duration-300 rounded-full" 
                      style={{ 
                        color: '#FFFFFF',
                        backgroundColor: '#FF5E14',
                        padding: '2px'
                      }} />
                <span style={{ color: '#F5F5F5' }} className="group-hover:text-white transition-colors duration-300">Maintenance Management</span>
              </li>
              <li className="flex items-center group">
                <Check className="mr-3 h-4 w-4 flex-shrink-0 transition-colors duration-300 rounded-full" 
                      style={{ 
                        color: '#FFFFFF',
                        backgroundColor: '#FF5E14',
                        padding: '2px'
                      }} />
                <span style={{ color: '#F5F5F5' }} className="group-hover:text-white transition-colors duration-300">Production Management</span>
              </li>
              <li className="flex items-center group">
                <Check className="mr-3 h-4 w-4 flex-shrink-0 transition-colors duration-300 rounded-full" 
                      style={{ 
                        color: '#FFFFFF',
                        backgroundColor: '#FF5E14',
                        padding: '2px'
                      }} />
                <span style={{ color: '#F5F5F5' }} className="group-hover:text-white transition-colors duration-300">Energy Management</span>
              </li>
              <li className="flex items-center group">
                <Check className="mr-3 h-4 w-4 flex-shrink-0 transition-colors duration-300 rounded-full" 
                      style={{ 
                        color: '#FFFFFF',
                        backgroundColor: '#FF5E14',
                        padding: '2px'
                      }} />
                <span style={{ color: '#F5F5F5' }} className="group-hover:text-white transition-colors duration-300">Consulting Services</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="relative">
            <h3 className="text-xl font-bold mb-6 text-white relative inline-block">
              Newsletter
              <span className="absolute -bottom-2 left-0 w-12 h-1" style={{ backgroundColor: '#FF5E14' }}></span>
            </h3>
            <p className="mb-5" style={{ color: '#F5F5F5' }}>
              Subscribe to get the latest news and special offers.
            </p>
            <div className="space-y-4">
              <div className="relative">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="w-full p-3 pl-4 pr-12 rounded-lg focus:outline-none text-gray-800 placeholder-gray-500"
                  style={{ 
                    backgroundColor: 'rgba(245, 245, 245, 0.95)',
                    boxShadow: '0 4px 10px -2px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Mail className="h-5 w-5" style={{ color: '#5F656F' }} />
                </div>
              </div>
              <button 
                className="w-full transition duration-300 text-white font-medium py-3 px-4 rounded-lg shadow-lg hover:shadow-xl relative overflow-hidden group"
                style={{ 
                  background: 'linear-gradient(to right, #FF5E14, #FF7A40)',
                  boxShadow: '0 4px 10px -2px rgba(255, 94, 20, 0.3)'
                }}
              >
                <span 
                  className="absolute inset-0 w-0 h-full transition-all duration-1000 ease-out transform -skew-x-12 bg-white opacity-20"
                  style={{ 
                    left: '-10%',
                    top: '0',
                    animation: 'shine 3s ease-in-out infinite'
                  }}
                ></span>
                <span className="relative z-10">Subscribe</span>
              </button>
            </div>
          </div>
        </div>

        {/* Copyright section */}
        <div className="mt-12 pt-8 border-t border-opacity-20 border-gray-400 text-center" style={{ color: '#F5F5F5' }}>
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p>© {new Date().getFullYear()} OptiPlant. All rights reserved.</p>
            <div className="mt-4 md:mt-0 flex flex-wrap justify-center gap-4">
              <Link to="/privacy" 
                className="transition-colors duration-300 relative group overflow-hidden"
                style={{ color: '#F5F5F5' }}
              >
                <span className="relative z-10">Privacy Policy</span>
                <span 
                  className="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full"
                  style={{ backgroundColor: '#FF5E14' }}
                ></span>
              </Link>
              <Link to="/terms" 
                className="transition-colors duration-300 relative group overflow-hidden"
                style={{ color: '#F5F5F5' }}
              >
                <span className="relative z-10">Terms of Service</span>
                <span 
                  className="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full"
                  style={{ backgroundColor: '#FF5E14' }}
                ></span>
              </Link>
              <Link to="/faq" 
                className="transition-colors duration-300 relative group overflow-hidden"
                style={{ color: '#F5F5F5' }}
              >
                <span className="relative z-10">FAQ</span>
                <span 
                  className="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full"
                  style={{ backgroundColor: '#FF5E14' }}
                ></span>
              </Link>
            </div>
          </div>
        </div>
      </div>
</div>
      {/* Scroll to top button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button 
          onClick={scrollToTop} 
          className="transition-all duration-300 text-white p-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 relative overflow-hidden group"
          aria-label="Scroll to top"
          style={{ 
            background: 'linear-gradient(135deg, #FF5E14, #FF7A40)',
            boxShadow: '0 4px 15px -3px rgba(255, 94, 20, 0.4)'
          }}
        >
          <span 
            className="absolute inset-0 w-full h-full rounded-full transition-all duration-300 ease-out transform scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100"
            style={{ 
              background: 'linear-gradient(135deg, #FF7A40, #FF5E14)',
              zIndex: -1
            }}
          ></span>
          <ArrowUp className="h-6 w-6 relative z-10" />
        </button>
      </div>

      {/* Animation keyframes for shine effect */}
      <style jsx>{`
        @keyframes shine {
          0% {
            left: -100%;
            opacity: 0;
          }
          20% {
            left: 100%;
            opacity: 0.6;
          }
          100% {
            left: 100%;
            opacity: 0;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;