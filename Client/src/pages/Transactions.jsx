import React, { useState, useEffect } from 'react';
import TransactionTable from '../components/TransactionTable';
import api from '../services/api';

const Transactions = () => {
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    startDate: '',
    endDate: ''
  });
  const [loading, setLoading] = useState(false);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      type: '',
      startDate: '',
      endDate: ''
    });
  };

  return (
    <div>
      <h1>Transactions</h1>
      
      {/* Filter Section */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Filters</h3>
          <button className="btn btn-primary" onClick={clearFilters}>
            Clear Filters
          </button>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          <div className="form-group">
            <label className="form-label">Status</label>
            <select 
              className="form-input"
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Type</label>
            <select 
              className="form-input"
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
            >
              <option value="">All Types</option>
              <option value="C2B">Customer to Business</option>
              <option value="B2C">Business to Customer</option>
              <option value="B2B">Business to Business</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Start Date</label>
            <input
              type="date"
              className="form-input"
              value={filters.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">End Date</label>
            <input
              type="date"
              className="form-input"
              value={filters.endDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <TransactionTable filters={filters} />
    </div>
  );
};

export default Transactions;