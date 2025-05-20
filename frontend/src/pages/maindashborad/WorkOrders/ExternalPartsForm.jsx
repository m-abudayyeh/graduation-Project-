// src/pages/maindashborad/WorkOrders/ExternalPartsForm.jsx
import React, { useState } from 'react';
import axios from 'axios';
import Alert from './Alert';

const ExternalPartsForm = ({ workOrderId, onExternalPartsAdded }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [externalPart, setExternalPart] = useState({
    name: '',
    partNumber: '',
    quantity: 1,
    cost: '',
    supplier: '',
    notes: ''
  });
  const [additionalParts, setAdditionalParts] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExternalPart(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddToList = () => {
    if (!externalPart.name) {
      setError('Part name is required');
      return;
    }
    setAdditionalParts([...additionalParts, { ...externalPart, id: Date.now() }]);
    setExternalPart({ name: '', partNumber: '', quantity: 1, cost: '', supplier: '', notes: '' });
  };

  const handleRemoveFromList = (id) => {
    setAdditionalParts(additionalParts.filter(part => part.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const partsToSubmit = [];
    if (externalPart.name) {
      partsToSubmit.push(externalPart);
    }
    additionalParts.forEach(part => {
      const { id, ...partData } = part;
      partsToSubmit.push(partData);
    });
    if (partsToSubmit.length === 0) {
      setError('At least one part is required');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`http://localhost:5000/api/work-orders/${workOrderId}/external-parts`, {
        externalParts: partsToSubmit
      }, {
        withCredentials: true
      });
      if (response.data && response.data.data) {
        setSuccess('External parts added successfully');
        setExternalPart({ name: '', partNumber: '', quantity: 1, cost: '', supplier: '', notes: '' });
        setAdditionalParts([]);
        onExternalPartsAdded?.(response.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error adding external parts');
      console.error('Error adding external parts:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-lg font-medium text-[#02245B] mb-4">Add External Parts</h2>
      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} />}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Form Inputs */}
          {/* ... نفس الحقول كما هي */}
        </div>

        <div className="mt-4 flex justify-end">
          <button type="button" onClick={handleAddToList} className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#02245B]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add to List
          </button>
        </div>

        {additionalParts.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Parts to be added:</h3>
            <div className="bg-gray-50 p-3 rounded-md">
              <ul className="divide-y divide-gray-200">
                {additionalParts.map((part) => (
                  <li key={part.id} className="py-2 flex items-center justify-between">
                    <div>
                      <span className="font-medium">{part.name}</span>
                      {part.partNumber && <span className="ml-2 text-gray-500">({part.partNumber})</span>}
                      <span className="ml-2">Qty: {part.quantity}</span>
                      {part.cost && <span className="ml-2">${part.cost}</span>}
                    </div>
                    <button type="button" onClick={() => handleRemoveFromList(part.id)} className="text-red-600 hover:text-red-900">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div className="mt-4 flex justify-end">
          <button type="submit" disabled={loading} className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#FF5E14] hover:bg-[#e05413] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF5E14]">
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : 'Save Parts'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExternalPartsForm;
