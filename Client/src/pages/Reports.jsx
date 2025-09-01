import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Reports = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      // Mock report data - replace with actual API call
      const mockData = {
        totalTransactions: 150,
        totalAmount: 450000,
        successfulTransactions: 120,
        failedTransactions: 15,
        pendingTransactions: 15,
        dailyData: Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          transactions: Math.floor(Math.random() * 10) + 1,
          amount: Math.floor(Math.random() * 30000) + 5000
        }))
      };
      setReportData(mockData);
    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading reports...</div>;
  }

  if (!reportData) {
    return <div>No report data available</div>;
  }

  return (
    <div>
      <h1>Reports & Analytics</h1>
      
      {/* Date Range Selector */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Report Period</h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div className="form-group">
            <label className="form-label">Start Date</label>
            <input
              type="date"
              className="form-input"
              value={dateRange.startDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
            />
          </div>
          <div className="form-group">
            <label className="form-label">End Date</label>
            <input
              type="date"
              className="form-input"
              value={dateRange.endDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
            />
          </div>
        </div>
        <button className="btn btn-primary" onClick={fetchReportData} style={{ marginTop: '15px' }}>
          Generate Report
        </button>
      </div>

      {/* Summary Cards */}
      <div className="dashboard-grid">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Total Transactions</h3>
            <span>💳</span>
          </div>
          <div className="card-value" style={{ color: 'var(--primary-color)' }}>
            {reportData.totalTransactions}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Total Amount</h3>
            <span>💰</span>
          </div>
          <div className="card-value" style={{ color: 'var(--success)' }}>
            KES {reportData.totalAmount.toLocaleString()}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Success Rate</h3>
            <span>✅</span>
          </div>
          <div className="card-value" style={{ color: 'var(--success)' }}>
            {((reportData.successfulTransactions / reportData.totalTransactions) * 100).toFixed(1)}%
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Failed Transactions</h3>
            <span>❌</span>
          </div>
          <div className="card-value" style={{ color: 'var(--error)' }}>
            {reportData.failedTransactions}
          </div>
        </div>
      </div>

      {/* Daily Report Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Daily Transaction Summary</h3>
          <button className="btn btn-primary">Export CSV</button>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Transactions</th>
              <th>Amount (KES)</th>
              <th>Average per Transaction</th>
            </tr>
          </thead>
          <tbody>
            {reportData.dailyData.map((day, index) => (
              <tr key={index}>
                <td>{day.date}</td>
                <td>{day.transactions}</td>
                <td>{day.amount.toLocaleString()}</td>
                <td>{(day.amount / day.transactions).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reports;