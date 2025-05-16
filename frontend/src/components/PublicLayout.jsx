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
      <main className="flex-grow container mx-auto  ">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;