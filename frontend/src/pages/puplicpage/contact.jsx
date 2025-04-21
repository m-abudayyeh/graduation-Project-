import React from 'react';
// Import all components
import ContactForm from './contactComponents/ContactForm';
import DirectContact from './contactComponents/DirectContact';
import FAQSection from './contactComponents/FAQSection';
import LocationInfo from './contactComponents/LocationInfo';
import LiveChat from './contactComponents/LiveChat';
import DemoRequest from './contactComponents/DemoRequest';
import SocialMedia from './contactComponents/SocialMedia';

const ContactPage = () => {
  return (
    <div className="bg-[#F5F5F5] min-h-screen">
      <div className="container mx-auto py-10 px-4">
        {/* Hero Section */}
        <div className="bg-[#02245B] text-white p-8 rounded-lg mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-lg mb-2">
            The Factory Maintenance Management System support team is here to help
          </p>
          <p className="text-gray-300">
            We're available to answer your questions and provide technical support and assistance for all aspects of the Factory Maintenance Management System
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Contact Form */}
            <div id="contact-form">
              <ContactForm />
            </div>

            {/* Location Information */}
            <LocationInfo />

            {/* Social Media */}
            <SocialMedia />
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Direct Contact Information */}
            <DirectContact />

            {/* Demo Request */}
            <DemoRequest />

            {/* FAQ Section */}
            <FAQSection />
          </div>
        </div>
      </div>

      {/* Live Chat Component (Fixed Position) */}
      <LiveChat />
    </div>
  );
};

export default ContactPage;