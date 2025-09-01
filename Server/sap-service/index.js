const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.json());

// Mock SAP integration - replace with actual SAP connectivity
app.post('/sync', (req, res) => {
  try {
    const { transactionData } = req.body;
    console.log('Syncing with SAP:', transactionData);
    
    // In a real implementation, this would connect to SAP via RFC, OData, or IDoc
    // For now, we'll just simulate a successful response
    
    res.json({
      success: true,
      message: 'Transaction synced with SAP successfully',
      sapDocumentNumber: `DOC-${Date.now()}`
    });
  } catch (error) {
    console.error('SAP sync error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to sync with SAP'
    });
  }
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', service: 'SAP Service' });
});

const PORT = process.env.SAP_SERVICE_PORT || 3003;
app.listen(PORT, () => {
  console.log(`SAP service running on port ${PORT}`);
});