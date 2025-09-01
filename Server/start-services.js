const { spawn } = require('child_process');
const path = require('path');

const services = [
  { name: 'API Gateway', script: 'api-gateway/index.js', port: 3000 },
  { name: 'Auth Service', script: 'auth-service/index.js', port: 3001 },
  { name: 'M-Pesa Service', script: 'mpesa-service/index.js', port: 3002 },
  { name: 'SAP Service', script: 'sap-service/index.js', port: 3003 },
  { name: 'Transaction Service', script: 'transaction-service/index.js', port: 3004 },
  { name: 'Notification Service', script: 'notification-service/index.js', port: 3005 },
];

services.forEach(service => {
  const child = spawn('node', [service.script], {
    cwd: __dirname,
    stdio: 'pipe'
  });

  console.log(`Starting ${service.name} on port ${service.port}...`);

  child.stdout.on('data', (data) => {
    console.log(`[${service.name}] ${data.toString().trim()}`);
  });

  child.stderr.on('data', (data) => {
    console.error(`[${service.name} ERROR] ${data.toString().trim()}`);
  });

  child.on('close', (code) => {
    console.log(`[${service.name}] process exited with code ${code}`);
  });
});

console.log('All services started. Press Ctrl+C to stop all services.');