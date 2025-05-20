import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      axios.defaults.withCredentials = true;

      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email: formData.email,
        password: formData.password
      });

      if (response.data && response.data.data && response.data.data.user) {
        const user = response.data.data.user;
        const storage = formData.rememberMe ? localStorage : sessionStorage;
        storage.setItem('user', JSON.stringify(user));

        if (formData.rememberMe) {
          localStorage.setItem('rememberMe', 'true');
        } else {
          localStorage.removeItem('rememberMe');
        }

        // ✅ إعادة التوجيه بناءً على الدور
        if (user.role === 'super_admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } else {
        setError('Received invalid response from server. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      if (err.response && err.response.data) {
        setError(err.response.data.message || 'Login failed. Please check your credentials.');
      } else {
        setError('Network error occurred. Please check your connection and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage: "url(/login_background.jpg)",
          filter: "brightness(0.8)"
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#02245B]/70 to-[#02245B]/40 z-0"></div>

      <div className="relative z-10 bg-white/10 backdrop-blur-md rounded-xl shadow-xl w-11/12 max-w-md p-8 text-center">
        <h1 className="text-[#02245B] text-3xl font-bold mb-2">
          Opti <span style={{ color: '#FF5E14' }}>Plant</span>
        </h1>

        <div className="w-16 h-1 bg-[#FF5E14] mx-auto mb-6"></div>

        <h2 className="text-[#F5F5F5] text-xl mb-8 font-semibold">Login to your Account</h2>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-100 px-4 py-2 rounded-md mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
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

          <div className="relative">
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

          <div className="flex justify-between items-center text-[#F5F5F5] text-sm">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="rememberMe"
                name="rememberMe"
                className="w-4 h-4 accent-[#FF5E14]"
                checked={formData.rememberMe}
                onChange={handleChange}
              />
              <label htmlFor="rememberMe" className="cursor-pointer">Remember me</label>
            </div>

            <button
              type="button"
              className="text-[#FF5E14] hover:underline"
              onClick={() => navigate('/forgot-password')}
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#FF5E14] hover:bg-[#FF5E14]/90 text-white font-medium rounded-md transition-colors duration-300 disabled:opacity-70"
            disabled={loading}
          >
            {loading ? 'LOGGING IN...' : 'LOGIN'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <div className="flex items-center justify-center">
            <div className="flex-1 h-px bg-[#5F656F]/30"></div>
            <p className="mx-4 text-[#F5F5F5]">Don't have an account?</p>
            <div className="flex-1 h-px bg-[#5F656F]/30"></div>
          </div>
          <button
            type="button"
            onClick={() => navigate('/register')}
            className="inline-block mt-4 text-[#F5F5F5] hover:text-[#FF5E14] transition-colors duration-300"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
