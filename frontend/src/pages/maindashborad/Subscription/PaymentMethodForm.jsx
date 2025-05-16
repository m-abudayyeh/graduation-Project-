import React, { useState } from 'react';
import axios from 'axios';
import Alert from './Alert';

const PaymentMethodForm = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const API_URL = 'http://localhost:5000';

  const handleUpdatePayment = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      // استخدام الكوكيز بدلاً من التوكن من localStorage
      const response = await axios.post(
        `${API_URL}/api/subscriptions/create-update-payment-session`,
        {},
        {
          withCredentials: true, // لإرسال الكوكيز
        }
      );

      // إعادة التوجيه إلى رابط Stripe
      window.location.href = response.data.data.url;
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating payment method');
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Payment Method</h2>

      {error && <Alert type="error" message={error} />}
      {success && <Alert type="success" message={success} />}

      <div className="mb-4">
        <p className="text-gray-600 mb-4">
          Update your payment method to ensure uninterrupted service. Your subscription will continue to renew automatically.
        </p>

        <button
          onClick={handleUpdatePayment}
          disabled={loading}
          className="px-4 py-2 bg-[#FF5E14] text-white rounded-md hover:bg-[#e44d0e] transition-colors disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Update Payment Method'}
        </button>
      </div>
    </div>
  );
};

export default PaymentMethodForm;
