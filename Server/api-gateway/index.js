const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('combined'));
app.use(express.json());

// Routes
app.use('/auth', createProxyMiddleware({
  target: process.env.AUTH_SERVICE_URL || 'http://localhost:3001',
  changeOrigin: true,
}));

app.use('/mpesa', createProxyMiddleware({
  target: process.env.MPESA_SERVICE_URL || 'http://localhost:3002',
  changeOrigin: true,
}));

app.use('/sap', createProxyMiddleware({
  target: process.env.SAP_SERVICE_URL || 'http://localhost:3003',
  changeOrigin: true,
}));

app.use('/transactions', createProxyMiddleware({
  target: process.env.TRANSACTION_SERVICE_URL || 'http://localhost:3004',
  changeOrigin: true,
}));

app.use('/notifications', createProxyMiddleware({
  target: process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3005',
  changeOrigin: true,
}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'API Gateway is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});