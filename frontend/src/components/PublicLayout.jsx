// src/components/PublicLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './nav';
import Footer from './footer';

const PublicLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <header>
        <Navbar />
      </header>
      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;