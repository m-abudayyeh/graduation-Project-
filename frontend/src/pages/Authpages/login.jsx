import React, { useState } from 'react';
import { Eye, EyeOff, Facebook, Twitter } from 'lucide-react';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login with data:', { username, password, rememberMe });
    
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
      
      {/* Login Form */}
      <div className="relative z-10 bg-white/10 backdrop-blur-md rounded-xl shadow-xl w-11/12 max-w-md p-8 text-center">
        <h1 className="text-[#02245B] text-3xl font-bold mb-2"> Opti <span style={{ color: '#FF5E14' }}>Plant</span></h1>

        <div className="w-16 h-1 bg-[#FF5E14] mx-auto mb-6"></div>
        
        <h2 className="text-[#F5F5F5] text-xl mb-8">Welcom Back</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username Field */}
          <div className="relative">
            <input 
              type="text" 
              placeholder="Username"
              className="w-full py-3 px-4 bg-white/20 text-[#F5F5F5] placeholder-[#F5F5F5]/70 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF5E14]"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          
          {/* Password Field */}
          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Password"
              className="w-full py-3 px-4 bg-white/20 text-[#F5F5F5] placeholder-[#F5F5F5]/70 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF5E14]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
          
          {/* Sign In Button */}
          <button 
            type="submit" 
            className="w-full py-3 bg-[#FF5E14] hover:bg-[#FF5E14]/90 text-white font-medium rounded-md transition-colors duration-300"
          >
            SIGN IN
          </button>
          
          {/* Remember Me and Forgot Password */}
          <div className="flex items-center justify-between text-[#F5F5F5] text-sm">
            <div className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                id="remember"
                className="w-4 h-4 accent-[#FF5E14]"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="remember" className="cursor-pointer">Remember Me</label>
            </div>
            <a href="#" className="text-[#F5F5F5] hover:text-[#FF5E14] transition-colors duration-300">
              Forgot Password
            </a>
          </div>
        </form>
        
        {/* Or Sign In With */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center">
            <div className="flex-1 h-px bg-[#5F656F]/30"></div>
            <p className="mx-4 text-[#F5F5F5]">Don't have account </p>
            <div className="flex-1 h-px bg-[#5F656F]/30"></div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LoginPage;