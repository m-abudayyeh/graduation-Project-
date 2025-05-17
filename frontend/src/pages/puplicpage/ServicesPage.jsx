import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import HeroSection from './servicesPageComponents/HeroSection';
import CoreServices from './servicesPageComponents/CoreServices';
import BenefitsSection from './servicesPageComponents/BenefitsSection';
import ProcessSection from './servicesPageComponents/ProcessSection';
import ComparisonTable from './servicesPageComponents/ComparisonTable';
import ContactSection from './servicesPageComponents/Contact';

const ServicesPage = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100); // slight delay to allow page render
      }
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-gray-50">
      <HeroSection />
      <CoreServices />
      <ProcessSection />
      <BenefitsSection />
      <ComparisonTable />
      <div id="contact-section">
        <ContactSection />
      </div>
    </div>
  );
};

export default ServicesPage;
