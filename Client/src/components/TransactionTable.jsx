import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { formatDate, formatCurrency } from '../utils';

const TransactionTable = ({ filters }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const response = await api.get('/transactions', { params: filters });
        setTransactions(response.data);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [filters]);

  const getStatusBadge = (status) => {
    let className = '';
    switch (status) {
      case 'completed':
        className = 'status-success';
        break;
      case 'pending':
        className = 'status-pending';
        break;
      case 'failed':
        className = 'status-failed';
        break;
      default:
        className = '';
    }
    return <span className={`status-badge ${className}`}>{status}</span>;
  };

  if (loading) {
    return <div>Loading transactions...</div>;
  }

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Transaction History</h3>
        <button className="btn btn-primary">Export CSV</button>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Date</th>
            <th>Type</th>
            <th>Phone Number</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Reference</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>{transaction.id}</td>
              <td>{formatDate(transaction.createdAt)}</td>
              <td>{transaction.type}</td>
              <td>{transaction.phoneNumber}</td>
              <td>{formatCurrency(transaction.amount)}</td>
              <td>{getStatusBadge(transaction.status)}</td>
              <td>{transaction.reference}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;