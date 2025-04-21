import React from 'react';
import { FaLinkedin, FaTwitter, FaFacebook, FaYoutube, FaInstagram } from 'react-icons/fa';

const SocialMedia = () => {
  const socialLinks = [
    {
      id: 1,
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/company/factorymaintenance',
      icon: <FaLinkedin className="text-2xl" />,
      color: 'bg-[#0077B5]'
    },
    {
      id: 2,
      name: 'Twitter',
      url: 'https://twitter.com/factorymaintenance',
      icon: <FaTwitter className="text-2xl" />,
      color: 'bg-[#1DA1F2]'
    },
    {
      id: 3,
      name: 'Facebook',
      url: 'https://www.facebook.com/factorymaintenance',
      icon: <FaFacebook className="text-2xl" />,
      color: 'bg-[#1877F2]'
    },
    {
      id: 4,
      name: 'YouTube',
      url: 'https://www.youtube.com/factorymaintenance',
      icon: <FaYoutube className="text-2xl" />,
      color: 'bg-[#FF0000]'
    },
    {
      id: 5,
      name: 'Instagram',
      url: 'https://www.instagram.com/factorymaintenance',
      icon: <FaInstagram className="text-2xl" />,
      color: 'bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCAF45]'
    }
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-[#02245B]">Follow Us on Social Media</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {socialLinks.map((link) => (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex flex-col items-center justify-center p-4 rounded-lg ${link.color} text-white hover:opacity-90 transition duration-300`}
          >
            {link.icon}
            <span className="mt-2 text-sm font-medium">{link.name}</span>
          </a>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-100 text-center">
        <p className="text-gray-700">
          Follow us on social media for the latest news and updates about the Factory Maintenance Management System.
        </p>
        <p className="mt-2 text-gray-700">
          #MaintenanceManagement #Factory #PreventiveMaintenance #TaskManagement
        </p>
      </div>
    </div>
  );
};

export default SocialMedia;