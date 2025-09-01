import React from 'react';

const DashboardCards = ({ stats }) => {
  const cards = [
    {
      title: 'Total Transactions',
      value: stats.totalTransactions,
      icon: '💳',
      color: '#4CAF50',
    },
    {
      title: 'Successful Payments',
      value: stats.successfulPayments,
      icon: '✅',
      color: '#2196F3',
    },
    {
      title: 'Pending Transactions',
      value: stats.pendingTransactions,
      icon: '⏳',
      color: '#FF9800',
    },
    {
      title: 'Failed Transactions',
      value: stats.failedTransactions,
      icon: '❌',
      color: '#F44336',
    },
  ];

  return (
    <div className="dashboard-grid">
      {cards.map((card, index) => (
        <div key={index} className="card">
          <div className="card-header">
            <h3 className="card-title">{card.title}</h3>
            <span style={{ fontSize: '24px' }}>{card.icon}</span>
          </div>
          <div className="card-value" style={{ fontSize: '2rem', fontWeight: 'bold', color: card.color }}>
            {card.value}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardCards;