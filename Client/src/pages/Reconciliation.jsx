import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Reconciliation = () => {
  const [reconciliationData, setReconciliationData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    status: 'unreconciled',
    date: ''
  });

  useEffect(() => {
    fetchReconciliationData();
  }, [filters]);

  const fetchReconciliationData = async () => {
    setLoading(true);
    try {
      // Mock data - replace with actual API call
      const mockData = [
        {
          id: 1,
          mpesaReference: 'MPESA12345',
          sapReference: '',
          amount: 1500,
          phoneNumber: '254712345678',
          transactionDate: '2023-12-01T10:30:00Z',
          status: 'unreconciled'
        },
        {
          id: 2,
          mpesaReference: 'MPESA12346',
          sapReference: 'SAPINV1001',
          amount: 2500,
          phoneNumber: '254712345679',
          transactionDate: '2023-12-01T11:15:00Z',
          status: 'reconciled'
        },
        {
          id: 3,
          mpesaReference: 'MPESA12347',
          sapReference: '',
          amount: 3500,
          phoneNumber: '254712345680',
          transactionDate: '2023-12-01T12:00:00Z',
          status: 'unreconciled'
        }
      ];

      const filteredData = filters.status === 'all' 
        ? mockData 
        : mockData.filter(item => item.status === filters.status);
      
      setReconciliationData(filteredData);
    } catch (error) {
      console.error('Error fetching reconciliation data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReconcile = async (id, sapReference) => {
    try {
      // Mock reconciliation - replace with actual API call
      console.log(`Reconciling transaction ${id} with SAP reference ${sapReference}`);
      alert(`Transaction ${id} reconciled successfully!`);
      
      // Refresh data
      fetchReconciliationData();
    } catch (error) {
      console.error('Error reconciling transaction:', error);
      alert('Failed to reconcile transaction');
    }
  };

  if (loading) {
    return <div>Loading reconciliation data...</div>;
  }

  return (
    <div>
      <h1>Reconciliation</h1>
      
      {/* Filters */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Filters</h3>
        </div>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Status</label>
            <select 
              className="form-input"
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            >
              <option value="all">All</option>
              <option value="reconciled">Reconciled</option>
              <option value="unreconciled">Unreconciled</option>
            </select>
          </div>

          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Date</label>
            <input
              type="date"
              className="form-input"
              value={filters.date}
              onChange={(e) => setFilters(prev => ({ ...prev, date: e.target.value }))}
            />
          </div>
        </div>
      </div>

      {/* Reconciliation Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Transaction Reconciliation</h3>
          <button className="btn btn-primary" onClick={fetchReconciliationData}>
            Refresh
          </button>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>M-Pesa Reference</th>
              <th>SAP Reference</th>
              <th>Amount</th>
              <th>Phone Number</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reconciliationData.map((item) => (
              <tr key={item.id}>
                <td>{item.mpesaReference}</td>
                <td>
                  {item.sapReference || (
                    <input
                      type="text"
                      placeholder="Enter SAP reference"
                      style={{ padding: '5px', border: '1px solid #ddd', borderRadius: '4px' }}
                    />
                  )}
                </td>
                <td>KES {item.amount.toLocaleString()}</td>
                <td>{item.phoneNumber}</td>
                <td>{new Date(item.transactionDate).toLocaleDateString()}</td>
                <td>
                  <span className={`status-badge status-${item.status === 'reconciled' ? 'success' : 'pending'}`}>
                    {item.status}
                  </span>
                </td>
                <td>
                  {item.status === 'unreconciled' && (
                    <button 
                      className="btn btn-success"
                      onClick={() => handleReconcile(item.id, 'SAPREF123')}
                    >
                      Reconcile
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {reconciliationData.length === 0 && (
          <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-light)' }}>
            No transactions found matching the current filters.
          </div>
        )}
      </div>

      {/* Reconciliation Summary */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Reconciliation Summary</h3>
        </div>
        <div style={{ padding: '15px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            <div>
              <h4>Total Transactions</h4>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                {reconciliationData.length}
              </p>
            </div>
            <div>
              <h4>Reconciled</h4>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--success)' }}>
                {reconciliationData.filter(item => item.status === 'reconciled').length}
              </p>
            </div>
            <div>
              <h4>Unreconciled</h4>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--warning)' }}>
                {reconciliationData.filter(item => item.status === 'unreconciled').length}
              </p>
            </div>
            <div>
              <h4>Reconciliation Rate</h4>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--secondary-color)' }}>
                {reconciliationData.length > 0 
                  ? ((reconciliationData.filter(item => item.status === 'reconciled').length / reconciliationData.length) * 100).toFixed(1) + '%'
                  : '0%'
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reconciliation;