import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loading from '../pages/maindashborad/Subscription/Loading';
import Alert from '../pages/maindashborad/Subscription/Alert';
import PlanCard from '../pages/maindashborad/Subscription/PlanCard';

const SubscriptionRenew = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubscriptionData = async () => {
      try {
        setLoading(true);
        setError(null);

        const userData = JSON.parse(sessionStorage.getItem('user'));
        const companyId = userData?.companyId;
        const response = await axios.get(`/api/subscriptions/company/${companyId}`, {
          withCredentials: true, // إرسال الكوكيز
        });

        setSubscription(response.data.data.company);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Error loading subscription data');
        setLoading(false);
      }
    };

    fetchSubscriptionData();
  }, []);

  const handleSubscribe = async (planType) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post(
        '/api/subscriptions/create-checkout-session',
        { planType },
        {
          withCredentials: true, // إرسال الكوكيز
        }
      );

      // توجيه المستخدم إلى Stripe
      window.location.href = response.data.data.url;
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating checkout session');
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="p-4">
        <Alert type="error" message={error} />
        <button
          onClick={() => navigate('/dashboard/subscription')}
          className="mt-4 px-4 py-2 bg-[#FF5E14] text-white rounded hover:bg-[#e44d0e] transition-colors"
        >
          Return to Subscription
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Renew Subscription</h1>
        <button
          onClick={() => navigate('/dashboard/subscription')}
          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          Back to Subscription
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Choose a Plan to Renew</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <PlanCard 
            title="Monthly Plan"
            price="$20"
            period="per month"
            features={[
              "All features included",
              "Unlimited work orders",
              "Unlimited users",
              "24/7 support"
            ]}
            onSubscribe={() => handleSubscribe('monthly')}
            recommended={subscription?.subscriptionType === 'monthly'}
          />
          <PlanCard 
            title="Annual Plan"
            price="$216"
            period="per year"
            features={[
              "All features included",
              "Unlimited work orders",
              "Unlimited users",
              "24/7 support",
              "Save 10% compared to monthly"
            ]}
            onSubscribe={() => handleSubscribe('annual')}
            recommended={subscription?.subscriptionType === 'annual' || subscription?.subscriptionType !== 'monthly'}
          />
        </div>

        <div className="mt-6">
          <div className="bg-blue-50 border border-blue-100 rounded-md p-4">
            <h3 className="text-md font-semibold text-blue-800 mb-2">Subscription Renewal</h3>
            <p className="text-blue-700 text-sm">
              Your current subscription is {subscription?.subscriptionStatus === 'expired' ? 'expired' : 'active until ' + new Date(subscription?.subscriptionEndDate).toLocaleDateString()}. 
              Renewing now will {subscription?.subscriptionStatus === 'expired' ? 'reactivate your account immediately' : 'extend your subscription from the current end date'}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionRenew;
