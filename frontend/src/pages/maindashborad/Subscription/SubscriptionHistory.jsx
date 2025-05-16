import React from 'react';
import SubscriptionStatusBadge from './SubscriptionStatusBadge';

const SubscriptionHistory = ({ history }) => {
  if (!history || history.length === 0) {
    return null;
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD'
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Subscription History</h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Plan Type
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Period
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {history.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {formatDate(item.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap capitalize">
                  {item.planType}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {formatCurrency(item.amount, item.currency)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {formatDate(item.startDate)} - {formatDate(item.endDate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <SubscriptionStatusBadge status={item.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SubscriptionHistory;