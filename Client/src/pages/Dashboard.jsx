import React, { useState, useEffect } from 'react';
import DashboardCards from '../components/DashboardCards';
import api from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalTransactions: 0,
    successfulPayments: 0,
    pendingTransactions: 0,
    failedTransactions: 0,
  });

  const [recentTransactions, setRecentTransactions] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsResponse, transactionsResponse] = await Promise.all([
          api.get('/transactions/dashboard/stats'),
          api.get('/transactions?limit=5'),
        ]);

        setStats(statsResponse.data);
        setRecentTransactions(transactionsResponse.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <DashboardCards stats={stats} />
      
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Recent Transactions</h3>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Date</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {recentTransactions.map(transaction => (
              <tr key={transaction.id}>
                <td>{transaction.id}</td>
                <td>{new Date(transaction.createdAt).toLocaleDateString()}</td>
                <td>{transaction.type}</td>
                <td>{transaction.amount}</td>
                <td>
                  <span className={`status-badge status-${transaction.status}`}>
                    {transaction.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;