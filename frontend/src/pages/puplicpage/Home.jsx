// src/pages/Home.jsx
import React from 'react';

// Importing all section components
import HeroBanner from './homeComponents/HeroBanner';
import KeyFeatures from './homeComponents/KeyFeatures';
import IndustrySolutions from './homeComponents/IndustrySolutions';
import BenefitsOverview from './homeComponents/BenefitsOverview';
import HowItWorks from './homeComponents/HowItWorks';
import Testimonials from './homeComponents/Testimonials';
import PricingPlans from './homeComponents/PricingPlans';
import DashboardPreview from './homeComponents/DashboardPreview';
import StatisticsHighlight from './homeComponents/StatisticsHighlight';
import FaqSection from './homeComponents/FaqSection';
import ContactInfo from './homeComponents/ContactInfo';
import TrialSignup from './homeComponents/TrialSignup';

const Home = () => {
  return (
    <div className="home-page">
      <HeroBanner />
      <KeyFeatures />
      <IndustrySolutions />
      <BenefitsOverview />
      <HowItWorks />
      <Testimonials />
      <PricingPlans />
      {/* <DashboardPreview /> */}
      <StatisticsHighlight />
      <FaqSection />
      <ContactInfo />
      {/* <TrialSignup /> */}
    </div>
  );
};

export default Home;