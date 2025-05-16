// ServicesPage.jsx
import React from 'react';
import HeroSection from './servicesPageComponents/HeroSection';
import CoreServices from './servicesPageComponents/CoreServices';
import BenefitsSection from './servicesPageComponents/BenefitsSection';
import ProcessSection from './servicesPageComponents/ProcessSection';
import ComparisonTable from './servicesPageComponents/ComparisonTable';
import ContactSection from './servicesPageComponents/Contact';

const ServicesPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 ">
      <HeroSection />
      <CoreServices />
       <ProcessSection />
      <BenefitsSection />
      <ComparisonTable/>
       <div id="contact-section">
  <ContactSection />
</div>
    </div>
  );
};

export default ServicesPage;