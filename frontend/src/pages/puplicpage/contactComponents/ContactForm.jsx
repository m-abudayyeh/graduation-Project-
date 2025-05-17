const ContactForm = () => {
  return (
    <div className="ml-24 mr-6 bg-white rounded-lg shadow-md p-8 mb-12 mt-12">
      <form className="space-y-6">
        <div>
          <label className="block text-[#5F656F] mb-2" htmlFor="name">Full Name</label>
          <input 
            type="text" 
            id="name" 
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF5E14]" 
            placeholder="Your full name"
          />
        </div>
        
        <div>
          <label className="block text-[#5F656F] mb-2" htmlFor="email">Email Address*</label>
          <input 
            type="email" 
            id="email" 
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF5E14]" 
            placeholder="your@email.com" 
            required
          />
        </div>
        
        <div>
          <label className="block text-[#5F656F] mb-2" htmlFor="phone">Phone Number (Optional)</label>
          <input 
            type="tel" 
            id="phone" 
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF5E14]" 
            placeholder="+962 7xx xxx xxx"
          />
        </div>
        
        <div>
          <label className="block text-[#5F656F] mb-2" htmlFor="company">Company Name</label>
          <input 
            type="text" 
            id="company" 
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF5E14]" 
            placeholder="Your company name"
          />
        </div>
        
        <div>
          <label className="block text-[#5F656F] mb-2" htmlFor="message">Message</label>
          <textarea 
            id="message" 
            rows="4" 
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF5E14]" 
            placeholder="How can we help you?"
          ></textarea>
        </div>
        
        <div>
          <button 
            type="submit" 
            className="px-6 py-3 bg-[#FF5E14] text-white font-medium rounded-md hover:bg-[#e65512] transition-colors duration-300"
          >
            Send Message
          </button>
        </div>
      </form>
    </div>
  );
};
export default ContactForm ;