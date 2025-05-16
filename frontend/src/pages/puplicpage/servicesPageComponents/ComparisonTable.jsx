import React from 'react';

const ComparisonTable = () => {
  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl  font-bold t text-center mb-12">
          Service Comparison
        </h2>
        
        <div className="overflow-x-auto mx-24">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#02245B] text-white">
                <th className="p-4 text-left">Features</th>
                <th className="p-4 text-center">Monthly Subscription</th>
                <th className="p-4 text-center">Annual Subscription</th>
                <th className="p-4 text-center bg-[#FF5E14]">Custom Solution</th>
              </tr>
            </thead>
            <tbody>
              {/* Basic features */}
              <tr className="border-b">
                <td className="p-4 font-medium">Work Order Management</td>
                <td className="p-4 text-center">
                  <svg className="h-6 w-6 text-[#FF5E14] mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </td>
                <td className="p-4 text-center">
                  <svg className="h-6 w-6 text-[#FF5E14] mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </td>
                <td className="p-4 text-center bg-[#f8f8f8]">
                  <svg className="h-6 w-6 text-[#FF5E14] mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </td>
              </tr>
              
              <tr className="border-b">
                <td className="p-4 font-medium">Preventive Maintenance</td>
                <td className="p-4 text-center">
                  <svg className="h-6 w-6 text-[#FF5E14] mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </td>
                <td className="p-4 text-center">
                  <svg className="h-6 w-6 text-[#FF5E14] mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </td>
                <td className="p-4 text-center bg-[#f8f8f8]">
                  <svg className="h-6 w-6 text-[#FF5E14] mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </td>
              </tr>
              
              <tr className="border-b">
                <td className="p-4 font-medium">Inventory Management</td>
                <td className="p-4 text-center">
                  <svg className="h-6 w-6 text-[#FF5E14] mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </td>
                <td className="p-4 text-center">
                  <svg className="h-6 w-6 text-[#FF5E14] mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </td>
                <td className="p-4 text-center bg-[#f8f8f8]">
                  <svg className="h-6 w-6 text-[#FF5E14] mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </td>
              </tr>
              
              <tr className="border-b">
                <td className="p-4 font-medium">Basic Analytics</td>
                <td className="p-4 text-center">
                  <svg className="h-6 w-6 text-[#FF5E14] mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </td>
                <td className="p-4 text-center">
                  <svg className="h-6 w-6 text-[#FF5E14] mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </td>
                <td className="p-4 text-center bg-[#f8f8f8]">
                  <svg className="h-6 w-6 text-[#FF5E14] mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </td>
              </tr>
              
              {/* Advanced features */}
              <tr className="border-b">
                <td className="p-4 font-medium">Custom User Roles & Permissions</td>
                <td className="p-4 text-center">
                  <svg className="h-6 w-6 text-[#5F656F] mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </td>
                <td className="p-4 text-center">
                  <svg className="h-6 w-6 text-[#5F656F] mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </td>
                <td className="p-4 text-center bg-[#f8f8f8]">
                  <svg className="h-6 w-6 text-[#FF5E14] mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </td>
              </tr>
              
              <tr className="border-b">
                <td className="p-4 font-medium">Integration with Existing Systems</td>
                <td className="p-4 text-center">
                  <svg className="h-6 w-6 text-[#5F656F] mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </td>
                <td className="p-4 text-center">
                  <svg className="h-6 w-6 text-[#5F656F] mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </td>
                <td className="p-4 text-center bg-[#f8f8f8]">
                  <svg className="h-6 w-6 text-[#FF5E14] mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </td>
              </tr>
              
              <tr className="border-b">
                <td className="p-4 font-medium">Industry-Specific Features</td>
                <td className="p-4 text-center">
                  <svg className="h-6 w-6 text-[#5F656F] mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </td>
                <td className="p-4 text-center">
                  <svg className="h-6 w-6 text-[#5F656F] mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </td>
                <td className="p-4 text-center bg-[#f8f8f8]">
                  <svg className="h-6 w-6 text-[#FF5E14] mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </td>
              </tr>
              
              <tr className="border-b">
                <td className="p-4 font-medium">Predictive Maintenance AI</td>
                <td className="p-4 text-center">
                  <svg className="h-6 w-6 text-[#5F656F] mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </td>
                <td className="p-4 text-center">
                  <svg className="h-6 w-6 text-[#5F656F] mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </td>
                <td className="p-4 text-center bg-[#f8f8f8]">
                  <svg className="h-6 w-6 text-[#FF5E14] mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </td>
              </tr>
              
              <tr className="border-b">
                <td className="p-4 font-medium">Advanced Custom Reporting</td>
                <td className="p-4 text-center">
                  <svg className="h-6 w-6 text-[#5F656F] mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </td>
                <td className="p-4 text-center">
                  <svg className="h-6 w-6 text-[#5F656F] mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </td>
                <td className="p-4 text-center bg-[#f8f8f8]">
                  <svg className="h-6 w-6 text-[#FF5E14] mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </td>
              </tr>
              
              {/* Price row */}
              <tr className="border-b bg-gray-50">
                <td className="p-4 font-medium">Price</td>
                <td className="p-4 text-center font-bold">$20/month</td>
                <td className="p-4 text-center font-bold">$216/year</td>
                <td className="p-4 text-center bg-[#f8f8f8] font-bold">Custom Quote</td>
              </tr>
              
              {/* Free trial */}
              <tr className="border-b">
                <td className="p-4 font-medium">Free Trial</td>
                <td className="p-4 text-center">7 days</td>
                <td className="p-4 text-center">7 days</td>
                <td className="p-4 text-center bg-[#f8f8f8]">Consultation</td>
              </tr>
              
              {/* Best for row */}
              <tr>
                <td className="p-4 font-medium">Best For</td>
                <td className="p-4 text-center">Short-term projects</td>
                <td className="p-4 text-center">Long-term maintenance</td>
                <td className="p-4 text-center bg-[#f8f8f8]">Complex facilities & unique needs</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ComparisonTable;