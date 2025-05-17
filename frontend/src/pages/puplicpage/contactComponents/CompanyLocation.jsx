const CompanyLocation = () => {
  return (
    <div className="mr-24 ml-6 bg-white rounded-lg shadow-md p-8 mb-12">
      <h2 className="text-2xl font-semibold text-[#02245B] mb-6">Our Location</h2>
      
      <div className="flex items-start mb-6">
        <div className="text-[#FF5E14] mr-4 mt-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-medium text-[#5F656F]">Office Address</h3>
          <p className="text-[#5F656F]">Al-Zarqa-Jordan</p>
         
        </div>
      </div>
      
      {/* Placeholder for map - can be added later */}
<div className="h-64 bg-[#F5F5F5] rounded-md overflow-hidden">
  <iframe
    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d298.8752422776856!2d36.085029290959675!3d32.05877000674862!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151b65cd4d8f17e1%3A0x30e86b8a97e4ac7d!2sOrange%20Digital%20Village%20Zarqa!5e0!3m2!1sen!2sjo!4v1747479589296!5m2!1sen!2sjo"
    style={{ width: "100%", height: "100%", border: 0 }}
    allowFullScreen=""
    loading="lazy"
    referrerPolicy="no-referrer-when-downgrade"
  />
</div>
    </div>
  );
};
export default CompanyLocation ; 