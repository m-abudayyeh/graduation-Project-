import React, { useState } from 'react';
import { Eye, EyeOff, Facebook, Twitter } from 'lucide-react';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    companyName: '',
    termsAgreed: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Registration data:', formData);
    
    // Note: In a real application, you would use Axios here
    // You'll need to install and import it in your project
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0" 
        style={{ 
          backgroundImage: "url(/login_background.jpg)",
          filter: "brightness(0.8)"
        }}
      />
      
      {/* Overlay Layer */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#02245B]/70 to-[#02245B]/40 z-0"></div>
      
      {/* Registration Form */}
      <div className="relative z-10 bg-white/10 backdrop-blur-md rounded-xl shadow-xl w-11/12 max-w-3xl p-8 text-center my-10">
        <h1 className="text-[#02245B] text-3xl font-bold mb-2"> Opti <span style={{ color: '#FF5E14' }}>Plant</span></h1>

        <div className="w-16 h-1 bg-[#FF5E14] mx-auto mb-6"></div>
        
        <h2 className="text-[#F5F5F5] text-xl mb-8 font-semibold">Create New Account</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* First Name & Last Name Fields (side by side) */}
          <div className="flex space-x-4">
            <div className="relative flex-2">
              <input 
                type="text" 
                name="firstName"
                placeholder="First Name"
                className="w-full py-3 px-4 bg-white/20 text-[#F5F5F5] placeholder-[#F5F5F5]/70 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF5E14]"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="relative flex-2">
              <input 
                type="text" 
                name="lastName"
                placeholder="Last Name"
                className="w-full py-3 px-4 bg-white/20 text-[#F5F5F5] placeholder-[#F5F5F5]/70 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF5E14]"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          {/* Email & Phone Number Fields (side by side) */}
          <div className="flex space-x-4">
            <div className="relative flex-1">
              <input 
                type="email" 
                name="email"
                placeholder="Email"
                className="w-full py-3 px-4 bg-white/20 text-[#F5F5F5] placeholder-[#F5F5F5]/70 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF5E14]"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="relative flex-1">
              <input 
                type="tel" 
                name="phoneNumber"
                placeholder="Phone Number"
                className="w-full py-3 px-4 bg-white/20 text-[#F5F5F5] placeholder-[#F5F5F5]/70 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF5E14]"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          {/* Password & Company Name Fields (side by side) */}
          <div className="flex space-x-4">
            <div className="relative flex-1">
              <input 
                type={showPassword ? "text" : "password"} 
                name="password"
                placeholder="Password"
                className="w-full py-3 px-4 bg-white/20 text-[#F5F5F5] placeholder-[#F5F5F5]/70 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF5E14]"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button 
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#F5F5F5]"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            
            <div className="relative flex-1">
              <input 
                type="text" 
                name="companyName"
                placeholder="Company Name"
                className="w-full py-3 px-4 bg-white/20 text-[#F5F5F5] placeholder-[#F5F5F5]/70 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF5E14]"
                value={formData.companyName}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          {/* Terms and Conditions */}
          <div className="flex items-start space-x-2 text-[#F5F5F5] text-sm mb-5">
            <input 
              type="checkbox" 
              id="terms"
              name="termsAgreed"
              className="w-4 h-4 accent-[#FF5E14] mt-1"
              checked={formData.termsAgreed}
              onChange={handleChange}
              required
            />
            <label htmlFor="terms" className="cursor-pointer text-left">
              I agree to the <a href="#" className="text-[#FF5E14] hover:underline">Terms & Conditions</a> and Privacy Policy
            </label>
          </div>
          
          {/* Sign Up Button */}
          <button 
            type="submit" 
            className="w-full py-3 bg-[#FF5E14] hover:bg-[#FF5E14]/90 text-white font-medium rounded-md transition-colors duration-300"
          >
            SIGN UP
          </button>
        </form>
        
        {/* Already have an account */}
        <div className="mt-4 text-center">
          <div className="flex items-center justify-center">
            <div className="flex-1 h-px bg-[#5F656F]/30"></div>
            <p className="mx-4 text-[#F5F5F5]">Already have an account?</p>
            <div className="flex-1 h-px bg-[#5F656F]/30"></div>
          </div>
          <a href="#" className="inline-block mt-4 text-[#F5F5F5] hover:text-[#FF5E14] transition-colors duration-300">
            Sign In
          </a>
        </div>
      </div>
    </div>
  );
};

export default Register;