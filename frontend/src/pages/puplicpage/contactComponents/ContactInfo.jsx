const ContactInfo = () => {
  return (
    <div className="mr-24 ml-6 bg-white rounded-lg shadow-md p-8 mb-12 mt-12">
      <h2 className="text-2xl font-semibold text-[#02245B] mb-6">Contact Information</h2>
      
      <div className="space-y-4">
        <div className="flex items-start">
          <div className="text-[#FF5E14] mr-4 mt-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-medium text-[#5F656F]">Email</h3>
            <p className="text-[#5F656F]">optiplant.mailer@gmail.com</p>
          </div>
        </div>
        
        <div className="flex items-start">
          <div className="text-[#FF5E14] mr-4 mt-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-medium text-[#5F656F]">Phone</h3>
            <p className="text-[#5F656F]">+962 785 078 600</p>
          </div>
        </div>
    
      </div>
    </div>
  );
}; 
export default ContactInfo;