// src/components/home/DashboardPreview.jsx
import React from 'react';

const DashboardPreview = () => {
  return (
    <section className="dashboard-preview py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold mb-4 text-[#02245B]">Powerful Dashboard at Your Fingertips</h2>
            <p className="text-[#5F656F] mb-6">
              Our intuitive dashboard gives you complete visibility into your maintenance operations. Monitor key metrics, track work orders, and make data-driven decisions with ease.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-[#FF5E14]/10 p-2 rounded-full mr-4">
                  <svg className="w-6 h-6 text-[#FF5E14]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-[#02245B] mb-1">Real-time Updates</h3>
                  <p className="text-[#5F656F]">Get instant visibility into work order status and maintenance activities.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-[#FF5E14]/10 p-2 rounded-full mr-4">
                  <svg className="w-6 h-6 text-[#FF5E14]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
                    <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-[#02245B] mb-1">Actionable Analytics</h3>
                  <p className="text-[#5F656F]">Track KPIs and view critical maintenance metrics in customizable dashboards.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-[#FF5E14]/10 p-2 rounded-full mr-4">
                  <svg className="w-6 h-6 text-[#FF5E14]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-[#02245B] mb-1">Mobile Responsive</h3>
                  <p className="text-[#5F656F]">Access your dashboard from any device, whether in the office or on the factory floor.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="md:w-1/2">
            <div className="relative">
              {/* Main screenshot */}
              <div className="rounded-lg shadow-2xl overflow-hidden border-8 border-[#02245B]/10">
                <img 
                  src="/images/dashboard-preview.jpg" 
                  alt="Maintenance Management Dashboard" 
                  className="w-full"
                />
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -bottom-4 -right-4 w-1/3 h-48 rounded-lg shadow-xl overflow-hidden border-4 border-white rotate-6 z-10">
                <img 
                  src="/images/dashboard-mobile.jpg" 
                  alt="Mobile Dashboard View" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Decorative pattern */}
              <div className="absolute -top-8 -left-8 w-32 h-32 bg-[#FF5E14]/10 rounded-full z-0"></div>
              <div className="absolute -bottom-6 right-24 w-16 h-16 bg-[#02245B]/10 rounded-full z-0"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardPreview;