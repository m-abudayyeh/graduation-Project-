// src/components/home/ContactInfo.jsx
import React from 'react';

const ContactInfo = () => {
  const contactMethods = [
    {
      title: 'Email Support',
      description: 'Get help with technical issues or account questions',
      contact: 'optiplant.mailer@gmail.com',
      link: 'mailto: optiplant.mailer@gmail.com',
      icon: (
        <svg className="w-10 h-10 text-[#FF5E14]" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
        </svg>
      )
    },
    {
      title: 'WhatsApp Support',
      description: 'Chat with our support team instantly on WhatsApp',
      contact: '+962 785 078 600',
      link: 'https://wa.me/962785078600',
      icon: (
        <svg className="w-10 h-10 text-[#FF5E14]" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.001 2.001c-5.523 0-10 4.477-10 10 0 1.769.464 3.428 1.352 4.915L2 22l5.238-1.345A9.965 9.965 0 0012 22c5.523 0 10-4.477 10-10s-4.477-10-10-10zm0 18a7.952 7.952 0 01-4.288-1.263l-.306-.19-3.108.798.83-3.026-.199-.311A7.96 7.96 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8zm4.535-5.464c-.246-.123-1.454-.718-1.679-.799-.226-.082-.391-.123-.556.123-.164.246-.637.799-.781.964-.144.164-.288.185-.534.062-.246-.123-1.038-.383-1.976-1.222-.73-.652-1.223-1.456-1.367-1.702-.144-.246-.016-.379.108-.501.112-.112.246-.288.369-.432.123-.144.164-.246.246-.41.082-.164.041-.308-.02-.432-.062-.123-.556-1.344-.762-1.847-.2-.48-.403-.415-.556-.415h-.475c-.164 0-.431.062-.657.308-.226.246-.866.846-.866 2.062s.887 2.393 1.011 2.556c.123.164 1.743 2.665 4.231 3.733.591.255 1.051.408 1.41.522.593.189 1.134.162 1.56.098.475-.07 1.454-.594 1.659-1.168.205-.574.205-1.066.144-1.168-.062-.103-.226-.164-.472-.288z" />
        </svg>
      )
    },
    {
      title: 'Phone Support',
      description: 'Available Sunday-Tuesday, 9am-6pm',
      contact: '+(962)-785-078-600',
      link: 'tel:+962785078600',
      icon: (
        <svg className="w-10 h-10 text-[#FF5E14]" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
        </svg>
      )
    }
  ];

  return (
    <section className="contact-info py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-[#02245B]">Get in Touch</h2>
          <p className="text-[#5F656F] max-w-3xl mx-auto">
            Have questions about our maintenance management system? We're here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {contactMethods.map((method, index) => (
      <a
  key={index}
  href={method.link}
  target="_blank"
  rel="noopener noreferrer"
  className="block bg-[#F5F5F5] rounded-lg p-6 text-center hover:shadow-md transition-shadow duration-300"
>
  <div className="flex justify-center mb-4">{method.icon}</div>
  <h3 className="text-xl font-bold mb-2 text-[#02245B]">{method.title}</h3>
  <p className="text-[#5F656F] mb-4 min-h-[72px]">{method.description}</p>
  <p className="font-medium text-[#FF5E14] hover:underline">{method.contact}</p>
</a>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-[#5F656F] mb-4">
            Need immediate assistance? Fill out our contact form and we'll get back to you within 24 hours.
          </p>
          <a 
            href="/contact" 
            className="inline-block bg-[#02245B] hover:bg-[#02245B]/90 text-white font-bold py-3 px-8 rounded-lg transition"
          >
            Contact Us
          </a>
        </div>
      </div>
    </section>
  );
};

export default ContactInfo;
