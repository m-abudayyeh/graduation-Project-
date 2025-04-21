import React from 'react';
import { FaMapMarkerAlt, FaBuilding, FaGlobe } from 'react-icons/fa';

const LocationInfo = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-[#02245B]">Our Location</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-start">
            <FaBuilding className="text-[#FF5E14] text-xl mt-1 mr-3" />
            <div>
              <h3 className="font-semibold text-lg text-[#5F656F]">Headquarters</h3>
              <p className="text-gray-700">Technology Complex, Main Avenue</p>
              <p className="text-gray-700">Boston, MA, United States</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <FaMapMarkerAlt className="text-[#FF5E14] text-xl mt-1 mr-3" />
            <div>
              <h3 className="font-semibold text-lg text-[#5F656F]">Address</h3>
              <p className="text-gray-700">Building #8, 3rd Floor</p>
              <p className="text-gray-700">Technology Complex, Main Avenue</p>
              <p className="text-gray-700">Boston, MA 02110, United States</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <FaGlobe className="text-[#FF5E14] text-xl mt-1 mr-3" />
            <div>
              <h3 className="font-semibold text-lg text-[#5F656F]">Regional Offices</h3>
              <p className="text-gray-700">Chicago | Dallas | San Francisco</p>
            </div>
          </div>
        </div>
        
        <div className="h-64 md:h-full">
          {/* Map placeholder - in a real application, you would integrate Google Maps or another map provider */}
          <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center relative overflow-hidden">
            {/* This is a placeholder for the map. In a real application, you would replace this with an actual map component */}
            <div className="absolute inset-0 opacity-50">
              <img src="/api/placeholder/800/400" alt="Location Map" className="w-full h-full object-cover" />
            </div>
            <div className="z-10 bg-white px-4 py-2 rounded-lg shadow-md">
              <span className="flex items-center text-[#02245B]">
                <FaMapMarkerAlt className="text-[#FF5E14] mr-2" />
                Company Headquarters
              </span>
            </div>
          </div>
          <div className="mt-2 text-center">
            <a 
              href="https://maps.google.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#FF5E14] hover:underline inline-flex items-center"
            >
              <FaMapMarkerAlt className="mr-1" />
              Get Directions
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationInfo;