// src/pages/maindashborad/WorkOrders/WorkOrderPartsSection.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Alert from './Alert';

const WorkOrderPartsSection = ({ workOrder }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [storeParts, setStoreParts] = useState([]);
  const [selectedPart, setSelectedPart] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [showAddPartForm, setShowAddPartForm] = useState(false);
  
  // External parts state
  const [showAddExternalPartForm, setShowAddExternalPartForm] = useState(false);
  const [externalPart, setExternalPart] = useState({
    name: '',
    partNumber: '',
    quantity: 1,
    cost: '',
    supplier: '',
    notes: ''
  });
  
  // Fetch available parts for dropdown
  useEffect(() => {
    const fetchStoreParts = async () => {
      try {
        const response = await axios.get('/api/store-parts');
        if (response.data && response.data.data) {
          setStoreParts(response.data.data.rows || []);
        }
      } catch (err) {
        console.error('Error fetching store parts:', err);
      }
    };
    
    if (showAddPartForm) {
      fetchStoreParts();
    }
  }, [showAddPartForm]);
  
  // Add a part from inventory
  const handleAddPart = async (e) => {
    e.preventDefault();
    
    if (!selectedPart) {
      setError('Please select a part');
      return;
    }
    
    if (quantity <= 0) {
      setError('Quantity must be greater than zero');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post(`/api/work-orders/${workOrder.id}/parts`, {
        parts: [{ storePartId: selectedPart, quantity }]
      });
      
      if (response.data && response.data.data) {
        setSuccess('Part added successfully');
        setSelectedPart('');
        setQuantity(1);
        setShowAddPartForm(false);
        
        // Update the work order parts in parent component
        if (workOrder.parts) {
          const updatedPart = response.data.data.find(part => part.id === parseInt(selectedPart));
          if (updatedPart) {
            const existingPartIndex = workOrder.parts.findIndex(part => part.id === updatedPart.id);
            
            if (existingPartIndex >= 0) {
              workOrder.parts[existingPartIndex].WorkOrderParts.quantity += quantity;
            } else {
              updatedPart.WorkOrderParts = { quantity };
              workOrder.parts.push(updatedPart);
            }
          }
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error adding part');
      console.error('Error adding part:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Remove a part
  const handleRemovePart = async (partId) => {
    setLoading(true);
    setError(null);
    
    try {
      await axios.delete(`/api/work-orders/${workOrder.id}/parts/${partId}`);
      
      setSuccess('Part removed successfully');
      
      // Update the work order parts in parent component
      if (workOrder.parts) {
        workOrder.parts = workOrder.parts.filter(part => part.id !== partId);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error removing part');
      console.error('Error removing part:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Add an external part
  const handleAddExternalPart = async (e) => {
    e.preventDefault();
    
    if (!externalPart.name) {
      setError('Part name is required');
      return;
    }
    
    if (externalPart.quantity <= 0) {
      setError('Quantity must be greater than zero');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post(`/api/work-orders/${workOrder.id}/external-parts`, {
        externalParts: [externalPart]
      });
      
      if (response.data && response.data.data) {
        setSuccess('External part added successfully');
        setExternalPart({
          name: '',
          partNumber: '',
          quantity: 1,
          cost: '',
          supplier: '',
          notes: ''
        });
        setShowAddExternalPartForm(false);
        
        // Update the work order external parts in parent component
        if (workOrder.externalParts) {
          workOrder.externalParts = response.data.data;
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error adding external part');
      console.error('Error adding external part:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle external part input changes
  const handleExternalPartChange = (e) => {
    const { name, value } = e.target;
    setExternalPart(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-[#02245B]">Parts</h3>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setShowAddPartForm(!showAddPartForm);
              setShowAddExternalPartForm(false);
            }}
            className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-[#02245B] hover:bg-[#021d4a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#02245B]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            {showAddPartForm ? 'Cancel' : 'Add Part'}
          </button>
          
          <button
            onClick={() => {
              setShowAddExternalPartForm(!showAddExternalPartForm);
              setShowAddPartForm(false);
            }}
            className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#02245B]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            {showAddExternalPartForm ? 'Cancel' : 'Add External Part'}
          </button>
        </div>
      </div>
      
      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} />}
      
      {/* Add Part Form */}
      {showAddPartForm && (
        <div className="mb-4 bg-gray-50 p-4 rounded-md">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Add Part from Inventory</h4>
          <form onSubmit={handleAddPart}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Part</label>
                <select
                  value={selectedPart}
                  onChange={(e) => setSelectedPart(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#02245B] focus:ring-[#02245B] sm:text-sm"
                  required
                >
                  <option value="">Select a part</option>
                  {storeParts.map((part) => (
                    <option key={part.id} value={part.id}>
                      {part.name} - {part.partNumber} ({part.quantity} in stock)
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#02245B] focus:ring-[#02245B] sm:text-sm"
                  min="1"
                  required
                />
              </div>
            </div>
            
            <div className="mt-4 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#FF5E14] hover:bg-[#e05413] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF5E14]"
              >
                {loading ? (
                  <>
                    <span className="animate-spin inline-block h-4 w-4 mr-2 border-t-2 border-b-2 border-white rounded-full"></span>
                    Adding...
                  </>
                ) : 'Add Part'}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Add External Part Form */}
      {showAddExternalPartForm && (
        <div className="mb-4 bg-gray-50 p-4 rounded-md">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Add External Part</h4>
          <form onSubmit={handleAddExternalPart}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Part Name</label>
                <input
                  type="text"
                  name="name"
                  value={externalPart.name}
                  onChange={handleExternalPartChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#02245B] focus:ring-[#02245B] sm:text-sm"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Part Number</label>
                <input
                  type="text"
                  name="partNumber"
                  value={externalPart.partNumber}
                  onChange={handleExternalPartChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#02245B] focus:ring-[#02245B] sm:text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  value={externalPart.quantity}
                  onChange={handleExternalPartChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#02245B] focus:ring-[#02245B] sm:text-sm"
                  min="1"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cost</label>
                <input
                  type="number"
                  name="cost"
                  value={externalPart.cost}
                  onChange={handleExternalPartChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#02245B] focus:ring-[#02245B] sm:text-sm"
                  min="0"
                  step="0.01"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
                <input
                  type="text"
                  name="supplier"
                  value={externalPart.supplier}
                  onChange={handleExternalPartChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#02245B] focus:ring-[#02245B] sm:text-sm"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  name="notes"
                  value={externalPart.notes}
                  onChange={handleExternalPartChange}
                  rows={2}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#02245B] focus:ring-[#02245B] sm:text-sm"
                />
              </div>
            </div>
            
            <div className="mt-4 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#FF5E14] hover:bg-[#e05413] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF5E14]"
              >
                {loading ? (
                  <>
                    <span className="animate-spin inline-block h-4 w-4 mr-2 border-t-2 border-b-2 border-white rounded-full"></span>
                    Adding...
                  </>
                ) : 'Add External Part'}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Inventory Parts List */}
      {workOrder.parts && workOrder.parts.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Inventory Parts</h4>
          <div className="overflow-x-auto border rounded-md">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Part #
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unit Cost
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Cost
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {workOrder.parts.map((part) => (
                  <tr key={part.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {part.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {part.partNumber || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {part.WorkOrderParts?.quantity || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {part.cost ? `$${part.cost}` : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {part.cost && part.WorkOrderParts?.quantity
                        ? `$${(part.cost * part.WorkOrderParts.quantity).toFixed(2)}`
                        : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleRemovePart(part.id)}
                        className="text-red-600 hover:text-red-900"
                        disabled={loading}
                      >
                        {loading ? 'Removing...' : 'Remove'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* External Parts List */}
      {workOrder.externalParts && workOrder.externalParts.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">External Parts</h4>
          <div className="overflow-x-auto border rounded-md">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Part #
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cost
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Supplier
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {workOrder.externalParts.map((part, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {part.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {part.partNumber || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {part.quantity || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {part.cost ? `$${part.cost}` : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {part.supplier || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {part.notes || 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {(!workOrder.parts || workOrder.parts.length === 0) && 
       (!workOrder.externalParts || workOrder.externalParts.length === 0) && (
        <div className="text-sm text-gray-500 italic">
          No parts added to this work order yet.
        </div>
      )}
    </div>
  );
};

export default WorkOrderPartsSection;