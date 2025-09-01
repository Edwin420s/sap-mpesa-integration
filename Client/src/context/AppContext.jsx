import React, { createContext, useContext, useState, useEffect } from 'react';
import SocketService from '../services/socket';

const AppContext = createContext();

export const useApp = () => {
  return useContext(AppContext);
};

export const AppProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Setup WebSocket connection
  useEffect(() => {
    SocketService.connect();

    const handleTransaction = (event) => {
      setTransactions(prev => [event.detail, ...prev]);
    };

    const handleNotification = (event) => {
      setNotifications(prev => [event.detail, ...prev]);
    };

    window.addEventListener('transaction', handleTransaction);
    window.addEventListener('notification', handleNotification);

    return () => {
      SocketService.disconnect();
      window.removeEventListener('transaction', handleTransaction);
      window.removeEventListener('notification', handleNotification);
    };
  }, []);

  const addNotification = (notification) => {
    setNotifications(prev => [notification, ...prev]);
  };

  const markNotificationAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const value = {
    notifications,
    transactions,
    isOnline,
    addNotification,
    markNotificationAsRead,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;