import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState(null);

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:5000/api/auth/reset-password/${token}`, {
        newPassword
      });
      setMessage('Password reset successful. Redirecting...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setMessage('Invalid or expired token.');
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Reset Password</h1>
      {message && <p className="mb-4">{message}</p>}
      <form onSubmit={handleReset}>
        <input
          type="password"
          placeholder="New password"
          className="border p-2 w-full mb-4"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <button type="submit" className="bg-orange-500 text-white px-4 py-2 rounded">
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
