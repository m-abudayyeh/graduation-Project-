// ServicesPage.jsx
import React from 'react';
import HeroSection from './servicesPageComponents/HeroSection';
import CoreServices from './servicesPageComponents/CoreServices';
import BenefitsSection from './servicesPageComponents/BenefitsSection';
import ProcessSection from './servicesPageComponents/ProcessSection';
import TestimonialsSection from './servicesPageComponents/TestimonialsSection';
// import PricingSection from './components/services/PricingSection';
// import ContactCTA from './components/services/ContactCTA';

const ServicesPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <HeroSection />
      <CoreServices />
      <BenefitsSection />
      <ProcessSection />
      <TestimonialsSection />
      {/* <PricingSection />
      <ContactCTA /> */}
    </div>
  );
};

export default ServicesPage;