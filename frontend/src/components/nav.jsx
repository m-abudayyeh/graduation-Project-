// src/components/nav.jsx
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
// Import logo SVG for better quality (add the file)
// import logo from '../assets/logo.svg';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Handle scroll effect on navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when routes change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Check if link is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav 
      className="w-full z-50 transition-all duration-300 sticky top-0"
      style={{ 
        backgroundColor: scrolled ? '#FFFFFF' : 'rgba(255, 255, 255, 0.97)',
        boxShadow: scrolled 
          ? '0 4px 20px -1px rgba(2, 36, 91, 0.1), 0 2px 10px -1px rgba(2, 36, 91, 0.05)' 
          : 'none',
        padding: scrolled ? '0.5rem 0' : '1rem 0',
        borderBottom: scrolled ? 'none' : '1px solid rgba(95, 101, 111, 0.1)'
      }}
    >
      <div className="max-w-7xl mx-16 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center group">
              <div className="overflow-hidden rounded-lg h-12 w-auto transition-all duration-500 group-hover:shadow-lg p-1"
                   style={{ 
                     background: 'linear-gradient(135deg, #F5F5F5 0%, #e9f0ff 100%)',
                     borderLeft: '1px solid rgba(255,94,20,0.3)',
                     borderTop: '1px solid rgba(255,94,20,0.3)',
                     borderRight: '1px solid rgba(2,36,91,0.3)',
                     borderBottom: '1px solid rgba(2,36,91,0.3)',
                   }}>
                <div className="h-10 w-10 rounded-md flex items-center justify-center text-white text-xl font-bold transition-all duration-500 transform group-hover:scale-105"
                     style={{ 
                       background: 'linear-gradient(135deg, #02245B 0%, #0A3A87 100%)',
                       boxShadow: '0 4px 10px -1px rgba(2, 36, 91, 0.2)'
                     }}>
                  OP
                </div>
              </div>
              <div className="ml-3 flex flex-col">
                <span className="text-2xl font-bold transition-all duration-300 transform group-hover:translate-x-0.5" style={{ color: '#02245B' }}>
                  Opti<span style={{ color: '#FF5E14' }}>Plant</span>
                </span>
                <span className="text-xs tracking-wider font-medium transition-all duration-300 opacity-80 group-hover:opacity-100" style={{ color: '#5F656F' }}>Maintenance Management</span>
              </div>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-3">
            {[
              { name: 'Home', path: '/' },
              { name: 'Services', path: '/services' },
              { name: 'About', path: '/about' },
              { name: 'Contact', path: '/contact' }
            ].map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`px-4 py-2 rounded-md font-medium transition-all duration-300 relative overflow-hidden group`}
                style={{ 
                  color: isActive(item.path) ? '#FFFFFF' : '#5F656F',
                  background: isActive(item.path) 
                    ? 'linear-gradient(to right, #FF5E14, #FF7A40)' 
                    : 'transparent',
                  boxShadow: isActive(item.path) 
                    ? '0 4px 12px -2px rgba(255, 94, 20, 0.25)' 
                    : 'none'
                }}
              >
                {!isActive(item.path) && (
                  <span 
                    className="absolute inset-0 w-full h-full transition-all duration-300 ease-out transform translate-y-full bg-gradient-to-b from-white to-blue-50 opacity-0 group-hover:opacity-100 group-hover:translate-y-0"
                    style={{ zIndex: -1 }}
                  ></span>
                )}
                {isActive(item.path) && (
                  <span 
                    className="absolute inset-0 w-0 h-full transition-all duration-500 ease-out transform -skew-x-12 bg-white opacity-20"
                    style={{ 
                      left: '-10%',
                      top: '0',
                      animation: 'shine 3s ease-in-out infinite',
                      animationDelay: '0.5s'
                    }}
                  ></span>
                )}
                <span className={`relative z-10 ${!isActive(item.path) ? 'group-hover:text-[#02245B]' : ''}`}>
                  {item.name}
                </span>
              </Link>
            ))}
          </div>

          {/* Login and Sign-up Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/login"
              className="px-5 py-2 rounded-md transition-all duration-300 shadow-sm hover:shadow font-medium overflow-hidden relative group"
              style={{ 
                color: '#02245B', 
                borderWidth: '1.5px',
                borderStyle: 'solid',
                borderColor: '#02245B'
              }}
            >
              <span 
                className="absolute inset-0 w-full h-full transition-all duration-300 ease-out transform translate-y-full bg-gradient-to-t from-[#02245B] to-[#0A3A87] opacity-0 group-hover:opacity-100 group-hover:translate-y-0"
                style={{ zIndex: -1 }}
              ></span>
              <span className="relative z-10 group-hover:text-white">Log In</span>
            </Link>
            <Link
              to="/register"
              className="px-5 py-2 rounded-md text-white transition-all duration-300 shadow hover:shadow-lg flex items-center font-medium transform hover:-translate-y-0.5 relative overflow-hidden group"
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
              <span className="relative z-10 mr-2">Start Free Trial</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 relative z-10 transition-transform duration-300 transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md focus:outline-none transition-colors relative overflow-hidden group"
              style={{ color: '#5F656F' }}
              aria-expanded={isMobileMenuOpen}
            >
              <span 
                className="absolute inset-0 w-full h-full transition-all duration-300 ease-out transform translate-y-full rounded-md opacity-0 group-hover:opacity-100 group-hover:translate-y-0"
                style={{ 
                  backgroundColor: 'rgba(255, 94, 20, 0.1)',
                  zIndex: -1
                }}
              ></span>
              <span className="sr-only">Open main menu</span>
              {/* Menu Icon */}
              <svg
                className={`${isMobileMenuOpen ? 'hidden' : 'block'} h-6 w-6 relative z-10 group-hover:text-[#FF5E14]`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              {/* Close Icon */}
              <svg
                className={`${isMobileMenuOpen ? 'block' : 'hidden'} h-6 w-6 relative z-10 group-hover:text-[#FF5E14]`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - with smooth transition */}
      <div 
        className="md:hidden overflow-hidden transition-all duration-300 ease-in-out"
        style={{ 
          maxHeight: isMobileMenuOpen ? '300px' : '0',
          opacity: isMobileMenuOpen ? '1' : '0',
          backgroundColor: '#FFFFFF',
          boxShadow: isMobileMenuOpen ? '0 8px 15px -3px rgba(2, 36, 91, 0.1)' : 'none'
        }}
      >
        <div className="px-4 pt-2 pb-3 space-y-1">
          {[
            { name: 'Home', path: '/' },
            { name: 'Services', path: '/services' },
            { name: 'About', path: '/about' },
            { name: 'Contact', path: '/contact' }
          ].map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="block px-3 py-2 rounded-md text-base font-medium transition-all duration-300 relative overflow-hidden group"
              style={{ 
                color: isActive(item.path) ? '#FFFFFF' : '#5F656F',
                background: isActive(item.path) 
                  ? 'linear-gradient(to right, #FF5E14, #FF7A40)' 
                  : 'transparent',
                boxShadow: isActive(item.path) 
                  ? '0 4px 8px -2px rgba(255, 94, 20, 0.2)' 
                  : 'none'
              }}
            >
              {!isActive(item.path) && (
                <span 
                  className="absolute inset-0 w-full h-full transition-all duration-300 ease-out transform translate-x-full bg-gradient-to-r from-white to-blue-50 opacity-0 group-hover:opacity-100 group-hover:translate-x-0"
                  style={{ zIndex: -1 }}
                ></span>
              )}
              <span className={`relative z-10 ${!isActive(item.path) ? 'group-hover:text-[#02245B]' : ''}`}>
                {item.name}
              </span>
            </Link>
          ))}
          <div className="pt-4 pb-3 space-y-3" style={{ borderTop: '1px solid rgba(95, 101, 111, 0.1)' }}>
            <Link
              to="/login"
              className="block w-full text-center px-4 py-2 rounded-md font-medium transition-all duration-300 relative overflow-hidden group"
              style={{ 
                color: '#02245B', 
                borderWidth: '1.5px',
                borderStyle: 'solid',
                borderColor: '#02245B'
              }}
            >
              <span 
                className="absolute inset-0 w-full h-full transition-all duration-300 ease-out transform translate-y-full bg-gradient-to-t from-[#02245B] to-[#0A3A87] opacity-0 group-hover:opacity-100 group-hover:translate-y-0"
                style={{ zIndex: -1 }}
              ></span>
              <span className="relative z-10 group-hover:text-white">Log In</span>
            </Link>
            <Link
              to="/register"
              className="block w-full text-center px-4 py-2 rounded-md text-white transition-all duration-300 flex items-center justify-center font-medium relative overflow-hidden group"
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
              <span className="relative z-10 mr-2">Start Free Trial</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 relative z-10 transition-transform duration-300 transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
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
    </nav>
  );
};

export default Navbar;