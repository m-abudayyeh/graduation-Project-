// src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="flex flex-col items-center">
      <div className="max-w-4xl text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Welcome to the Maintenance Management System
        </h1>
        <p className="text-xl text-gray-600">
          A comprehensive solution for managing maintenance operations efficiently
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
        <FeatureCard 
          title="Work Order Management"
          description="Create, track, and manage work orders efficiently"
          icon="🔧"
        />
        <FeatureCard 
          title="Preventive Maintenance"
          description="Schedule and track regular maintenance to prevent issues"
          icon="⏱️"
        />
        <FeatureCard 
          title="Resource Management"
          description="Keep track of inventory, equipment, and personnel"
          icon="📊"
        />
      </div>

      <div className="mt-12">
        <Link 
          to="/dashboard" 
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg text-lg shadow-md transition-colors"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
};

// Feature card component
const FeatureCard = ({ title, description, icon }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default Home;