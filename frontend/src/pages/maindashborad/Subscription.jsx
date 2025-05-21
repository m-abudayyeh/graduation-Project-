import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SubscriptionDetails from './Subscription/SubscriptionDetails';
import SubscriptionHistory from './Subscription/SubscriptionHistory';
import PlanCard from './Subscription/PlanCard';
import Loading from './Subscription/Loading';
import Alert from './Subscription/Alert';
import CancelSubscriptionModal from './Subscription/CancelSubscriptionModal';
import SubscriptionFAQ from './Subscription/SubscriptionFAQ';
import { User } from 'lucide-react';

const Subscription = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [history, setHistory] = useState([]);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const navigate = useNavigate();
  const API_URL = 'http://localhost:5000';

  const fetchSubscriptionData = async () => {
    try {
      setLoading(true);
      setError(null);
const userData = JSON.parse(sessionStorage.getItem('user'));
const companyId = userData?.companyId;
console.log(companyId);
      const response = await axios.get(`${API_URL}/api/subscriptions/company/${companyId}`,
        
        {
        withCredentials: true, // Ensure cookies are sent with the request
      });
console.log(response.data.data.company);
      setSubscription(response.data.data.company);
      setHistory(response.data.data.subscriptions);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Error loading subscription data');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptionData();
  }, []);

  const handleStartTrial = async () => {
    try {
      setLoading(true);
      setError(null);

      await axios.post(`${API_URL}/api/subscriptions/create-trial`, {}, {
        withCredentials: true, // Ensure cookies are sent with the request
      });

      fetchSubscriptionData();
    } catch (err) {
      setError(err.response?.data?.message || 'Error activating trial');
      setLoading(false);
    }
  };

  const handleSubscribe = async (planType) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post(`${API_URL}/api/subscriptions/create-checkout-session`, {
        planType
      }, {
        withCredentials: true, // Ensure cookies are sent with the request
      });

      // Redirect to Stripe checkout URL

      console.log( response.data.data.url)
      window.location.href = response.data.data.url;
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating checkout session');
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    try {
      setLoading(true);
      setError(null);

      await axios.post(`${API_URL}/api/subscriptions/cancel`, {}, {
        withCredentials: true, // Ensure cookies are sent with the request
      });

      setShowCancelModal(false);
      fetchSubscriptionData();
    } catch (err) {
      setError(err.response?.data?.message || 'Error cancelling subscription');
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return <Loading />;
    }

    if (error) {
      return <Alert type="error" message={error} />;
    }
    
  //  console.log(subscription)
    if ( subscription.subscriptionType === 'trial') {
      return (
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Choose a Subscription Plan</h2>
          
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
              recommended={false}
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
              recommended={true}
            />

            
          </div>
          

          {!subscription && (
            <div className="mt-8 p-4 bg-blue-50 rounded-lg text-center">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Start with a 7-day Free Trial</h3>
              <p className="text-blue-600 mb-4">Try out all features before committing to a subscription</p>
              <button 
                onClick={handleStartTrial}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md transition-colors"
              >
                Start Free Trial
              </button>
            </div>
          )}
        </div>
        
      );
    }

    return (
      <div className="space-y-6">
        <SubscriptionDetails 
          subscription={subscription} 
          onCancel={() => setShowCancelModal(true)} 
        />
        
        <SubscriptionHistory history={history} />
      </div>
    );
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Subscription Management</h1>
      </div>
 <div className="space-y-6 mb-6">
        {/* <SubscriptionDetails 
          subscription={subscription} 
          onCancel={() => setShowCancelModal(true)} 
        /> */}
        
        <SubscriptionHistory history={history} />
      </div>
      
      {renderContent()}

      {showCancelModal && (
        <CancelSubscriptionModal 
          onCancel={() => setShowCancelModal(false)}
          onConfirm={handleCancelSubscription}
        />
      )}
    </div>
  );
};

export default Subscription;
