// WebSocket service for real-time updates
class SocketService {
  constructor() {
    this.socket = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  connect() {
    if (this.socket) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const wsUrl = process.env.REACT_APP_WS_URL || 'ws://localhost:3000';
      this.socket = new WebSocket(`${wsUrl}?token=${token}`);

      this.socket.onopen = () => {
        console.log('WebSocket connected');
        this.reconnectAttempts = 0;
      };

      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleMessage(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.socket.onclose = () => {
        console.log('WebSocket disconnected');
        this.attemptReconnect();
      };

      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

    } catch (error) {
      console.error('WebSocket connection error:', error);
    }
  }

  handleMessage(data) {
    // Handle different types of messages
    switch (data.type) {
      case 'transaction_update':
        this.emit('transaction', data.payload);
        break;
      case 'notification':
        this.emit('notification', data.payload);
        break;
      default:
        console.log('Unknown message type:', data.type);
    }
  }

  emit(event, data) {
    // Dispatch custom event
    window.dispatchEvent(new CustomEvent(event, { detail: data }));
  }

  attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => this.connect(), 1000 * this.reconnectAttempts);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  send(message) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    }
  }
}

export default new SocketService();