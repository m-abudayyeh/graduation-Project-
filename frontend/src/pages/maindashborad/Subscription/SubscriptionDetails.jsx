import React from 'react';
import SubscriptionStatusBadge from './SubscriptionStatusBadge';

const SubscriptionDetails = ({ subscription, onCancel }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const getDaysRemaining = () => {
    if (!subscription.subscriptionEndDate) return 0;
    const endDate = new Date(subscription.subscriptionEndDate);
    const today = new Date();
    const diffTime = endDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const daysRemaining = getDaysRemaining();

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-bold text-gray-800">Current Subscription</h2>
        <SubscriptionStatusBadge status={subscription.subscriptionStatus} />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-500">Plan Type</h3>
            <p className="text-lg font-semibold capitalize">{subscription.subscriptionType || 'N/A'}</p>
          </div>

          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-500">Start Date</h3>
            <p className="text-lg font-semibold">{formatDate(subscription.subscriptionStartDate)}</p>
          </div>

          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-500">End Date</h3>
            <p className="text-lg font-semibold">{formatDate(subscription.subscriptionEndDate)}</p>
          </div>
        </div>

        <div>
          {subscription.subscriptionStatus === 'active' && (
            <div className="bg-blue-50 rounded-lg p-4 mb-4">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">
                Subscription Active
              </h3>
              <p className="text-blue-600 mb-2">
                Your subscription is currently active and will expire in {daysRemaining} days.
              </p>
              {subscription.subscriptionType !== 'trial' && (
                <button
                  onClick={onCancel}
                  className="text-red-600 hover:text-red-800 font-medium transition-colors"
                >
                  Cancel Subscription
                </button>
              )}
            </div>
          )}

          {subscription.subscriptionStatus === 'trial' && (
            <div className="bg-green-50 rounded-lg p-4 mb-4">
              <h3 className="text-lg font-semibold text-green-800 mb-2">
                Trial Active
              </h3>
              <p className="text-green-600 mb-2">
                Your free trial is active and will expire in {daysRemaining} days.
              </p>
              <p className="text-green-600">
                Choose a subscription plan before your trial ends to continue using all features.
              </p>
            </div>
          )}

          {(subscription.subscriptionStatus === 'active' || subscription.subscriptionStatus === 'trial') && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Billing Information</h3>
              {subscription.subscriptionType === 'monthly' ? (
                <p>Your subscription renews automatically each month.</p>
              ) : subscription.subscriptionType === 'annual' ? (
                <p>Your subscription renews automatically each year.</p>
              ) : (
                <p>Your free trial does not renew automatically.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionDetails;