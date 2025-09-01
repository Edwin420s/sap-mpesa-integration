const express = require('express');
require('dotenv').config();

const app = express();
app.use(express.json());

// In-memory transaction store (replace with database in production)
let transactions = [];
let transactionId = 1;

// Get all transactions with optional filtering
app.get('/', (req, res) => {
  const { status, type, limit } = req.query;
  let filteredTransactions = [...transactions];
  
  if (status) {
    filteredTransactions = filteredTransactions.filter(t => t.status === status);
  }
  
  if (type) {
    filteredTransactions = filteredTransactions.filter(t => t.type === type);
  }
  
  if (limit) {
    filteredTransactions = filteredTransactions.slice(0, parseInt(limit));
  }
  
  res.json(filteredTransactions);
});

// Create a new transaction
app.post('/', (req, res) => {
  try {
    const { type, amount, phoneNumber, reference, status = 'pending' } = req.body;
    
    const newTransaction = {
      id: transactionId++,
      type,
      amount,
      phoneNumber,
      reference,
      status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    transactions.push(newTransaction);
    
    res.status(201).json(newTransaction);
  } catch (error) {
    console.error('Transaction creation error:', error);
    res.status(500).json({ message: 'Failed to create transaction' });
  }
});

// Update transaction status
app.patch('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const transaction = transactions.find(t => t.id === parseInt(id));
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    
    transaction.status = status;
    transaction.updatedAt = new Date().toISOString();
    
    res.json(transaction);
  } catch (error) {
    console.error('Transaction update error:', error);
    res.status(500).json({ message: 'Failed to update transaction' });
  }
});

// Get dashboard statistics
app.get('/dashboard/stats', (req, res) => {
  const totalTransactions = transactions.length;
  const successfulPayments = transactions.filter(t => t.status === 'completed').length;
  const pendingTransactions = transactions.filter(t => t.status === 'pending').length;
  const failedTransactions = transactions.filter(t => t.status === 'failed').length;
  
  res.json({
    totalTransactions,
    successfulPayments,
    pendingTransactions,
    failedTransactions
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', service: 'Transaction Service' });
});

const PORT = process.env.TRANSACTION_SERVICE_PORT || 3004;
app.listen(PORT, () => {
  console.log(`Transaction service running on port ${PORT}`);
});