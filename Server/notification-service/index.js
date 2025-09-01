const express = require('express');
require('dotenv').config();

const app = express();
app.use(express.json());

// In-memory notification store (replace with database in production)
let notifications = [];
let notificationId = 1;

// Get all notifications
app.get('/', (req, res) => {
  res.json(notifications);
});

// Create a new notification
app.post('/', (req, res) => {
  try {
    const { message, type = 'info' } = req.body;
    
    const newNotification = {
      id: notificationId++,
      message,
      type,
      read: false,
      createdAt: new Date().toISOString()
    };
    
    notifications.unshift(newNotification); // Add to beginning of array
    
    res.status(201).json(newNotification);
  } catch (error) {
    console.error('Notification creation error:', error);
    res.status(500).json({ message: 'Failed to create notification' });
  }
});

// Mark notification as read
app.patch('/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    const notification = notifications.find(n => n.id === parseInt(id));
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    notification.read = true;
    
    res.json(notification);
  } catch (error) {
    console.error('Notification update error:', error);
    res.status(500).json({ message: 'Failed to update notification' });
  }
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', service: 'Notification Service' });
});

const PORT = process.env.NOTIFICATION_SERVICE_PORT || 3005;
app.listen(PORT, () => {
  console.log(`Notification service running on port ${PORT}`);
});