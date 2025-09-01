const express = require('express');
const axios = require('axios');
const crypto = require('crypto');
require('dotenv').config();

const app = express();
app.use(express.json());

// M-Pesa configuration
const MPESA_CONFIG = {
  consumerKey: process.env.MPESA_CONSUMER_KEY,
  consumerSecret: process.env.MPESA_CONSUMER_SECRET,
  shortcode: process.env.MPESA_SHORTCODE,
  passkey: process.env.MPESA_PASSKEY,
  environment: process.env.MPESA_ENVIRONMENT || 'sandbox',
};

// Base URLs
const MPESA_BASE_URL = MPESA_CONFIG.environment === 'production' 
  ? 'https://api.safaricom.co.ke' 
  : 'https://sandbox.safaricom.co.ke';

let accessToken = null;
let tokenExpiry = null;

// Get access token
const getAccessToken = async () => {
  if (accessToken && tokenExpiry > Date.now()) {
    return accessToken;
  }

  try {
    const auth = Buffer.from(`${MPESA_CONFIG.consumerKey}:${MPESA_CONFIG.consumerSecret}`).toString('base64');
    const response = await axios.get(`${MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`, {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });

    accessToken = response.data.access_token;
    tokenExpiry = Date.now() + (response.data.expires_in * 1000) - 60000; // Subtract 1 minute for safety

    return accessToken;
  } catch (error) {
    console.error('Error getting access token:', error.response?.data || error.message);
    throw new Error('Failed to get access token');
  }
};

// Generate timestamp
const generateTimestamp = () => {
  const now = new Date();
  return (
    now.getFullYear() +
    String(now.getMonth() + 1).padStart(2, '0') +
    String(now.getDate()).padStart(2, '0') +
    String(now.getHours()).padStart(2, '0') +
    String(now.getMinutes()).padStart(2, '0') +
    String(now.getSeconds()).padStart(2, '0')
  );
};

// Generate password
const generatePassword = (shortcode, passkey, timestamp) => {
  return Buffer.from(shortcode + passkey + timestamp).toString('base64');
};

// STK Push request
app.post('/stkpush', async (req, res) => {
  try {
    const { phoneNumber, amount, accountReference, transactionDesc } = req.body;

    if (!phoneNumber || !amount) {
      return res.status(400).json({ message: 'Phone number and amount are required' });
    }

    const token = await getAccessToken();
    const timestamp = generateTimestamp();
    const password = generatePassword(MPESA_CONFIG.shortcode, MPESA_CONFIG.passkey, timestamp);

    const response = await axios.post(
      `${MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest`,
      {
        BusinessShortCode: MPESA_CONFIG.shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: amount,
        PartyA: phoneNumber,
        PartyB: MPESA_CONFIG.shortcode,
        PhoneNumber: phoneNumber,
        CallBackURL: `${process.env.API_BASE_URL}/mpesa/callback`,
        AccountReference: accountReference || 'Payment',
        TransactionDesc: transactionDesc || 'Payment',
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    res.json({
      success: true,
      data: response.data,
      message: 'STK push initiated successfully',
    });
  } catch (error) {
    console.error('STK Push error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to initiate STK push',
      error: error.response?.data || error.message,
    });
  }
});

// Handle M-Pesa callback
app.post('/callback', (req, res) => {
  try {
    const callbackData = req.body;
    console.log('M-Pesa callback received:', JSON.stringify(callbackData, null, 2));

    // Here you would typically:
    // 1. Validate the callback
    // 2. Extract transaction details
    // 3. Update your database
    // 4. Send notification to SAP service
    // 5. Send notification to user

    // For now, just acknowledge receipt
    res.status(200).json({ ResultCode: 0, ResultDesc: 'Success' });
  } catch (error) {
    console.error('Callback processing error:', error);
    res.status(500).json({ ResultCode: 1, ResultDesc: 'Failed' });
  }
});

// Transaction status query
app.post('/transaction-status', async (req, res) => {
  try {
    const { transactionID } = req.body;

    if (!transactionID) {
      return res.status(400).json({ message: 'Transaction ID is required' });
    }

    const token = await getAccessToken();
    const timestamp = generateTimestamp();
    const password = generatePassword(MPESA_CONFIG.shortcode, MPESA_CONFIG.passkey, timestamp);

    const response = await axios.post(
      `${MPESA_BASE_URL}/mpesa/transactionstatus/v1/query`,
      {
        Initiator: process.env.MPESA_INITIATOR,
        SecurityCredential: process.env.MPESA_SECURITY_CREDENTIAL,
        CommandID: 'TransactionStatusQuery',
        TransactionID: transactionID,
        PartyA: MPESA_CONFIG.shortcode,
        IdentifierType: '4',
        ResultURL: `${process.env.API_BASE_URL}/mpesa/result`,
        QueueTimeOutURL: `${process.env.API_BASE_URL}/mpesa/timeout`,
        Remarks: 'Transaction status query',
        Occasion: 'Check transaction status',
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    res.json({
      success: true,
      data: response.data,
      message: 'Transaction status query initiated',
    });
  } catch (error) {
    console.error('Transaction status error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to query transaction status',
      error: error.response?.data || error.message,
    });
  }
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', service: 'M-Pesa Service' });
});

const PORT = process.env.MPESA_SERVICE_PORT || 3002;
app.listen(PORT, () => {
  console.log(`M-Pesa service running on port ${PORT}`);
});