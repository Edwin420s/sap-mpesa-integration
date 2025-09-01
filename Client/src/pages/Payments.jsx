import React, { useState } from 'react';
import api from '../services/api';

const Payments = () => {
  const [formData, setFormData] = useState({
    phoneNumber: '',
    amount: '',
    accountReference: '',
    transactionDesc: ''
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await api.post('/mpesa/stkpush', formData);
      setResult(response.data);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to initiate payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Initiate Payment</h1>
      
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">STK Push Payment</h3>
        </div>

        {error && (
          <div style={{ 
            color: 'var(--error)', 
            padding: '10px', 
            margin: '15px', 
            backgroundColor: '#fde9e7',
            borderRadius: 'var(--border-radius)'
          }}>
            {error}
          </div>
        )}

        {result && (
          <div style={{ 
            color: 'var(--success)', 
            padding: '10px', 
            margin: '15px', 
            backgroundColor: '#e6f7ee',
            borderRadius: 'var(--border-radius)'
          }}>
            Payment initiated successfully! Check your phone to complete the transaction.
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                name="phoneNumber"
                className="form-input"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                required
                placeholder="254712345678"
                pattern="2547[0-9]{8}"
                title="Enter a valid Kenyan phone number (2547XXXXXXXX)"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Amount (KES)</label>
              <input
                type="number"
                name="amount"
                className="form-input"
                value={formData.amount}
                onChange={handleInputChange}
                required
                min="1"
                placeholder="100"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Account Reference</label>
              <input
                type="text"
                name="accountReference"
                className="form-input"
                value={formData.accountReference}
                onChange={handleInputChange}
                required
                placeholder="Invoice Number or Customer ID"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Transaction Description</label>
              <input
                type="text"
                name="transactionDesc"
                className="form-input"
                value={formData.transactionDesc}
                onChange={handleInputChange}
                required
                placeholder="Payment description"
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
            style={{ marginTop: '20px' }}
          >
            {loading ? 'Initiating Payment...' : 'Initiate Payment'}
          </button>
        </form>
      </div>

      {/* Payment Instructions */}
      <div className="card" style={{ marginTop: '20px' }}>
        <div className="card-header">
          <h3 className="card-title">Payment Instructions</h3>
        </div>
        <div style={{ padding: '15px' }}>
          <ol style={{ lineHeight: '1.6' }}>
            <li>Enter the customer's phone number (format: 2547XXXXXXXX)</li>
            <li>Specify the amount to be paid in Kenyan Shillings</li>
            <li>Provide a reference for the transaction (e.g., invoice number)</li>
            <li>Add a description for the payment</li>
            <li>Click "Initiate Payment" to send an STK push to the customer's phone</li>
            <li>The customer will receive a prompt to enter their M-Pesa PIN</li>
            <li>Transaction status will be updated automatically</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default Payments;