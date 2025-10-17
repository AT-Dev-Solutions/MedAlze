const { spawn } = require('child_process');
const path = require('path');

// Set environment variables
process.env.EXPO_NO_TELEMETRY = '1';
process.env.WATCHMAN_DISABLE = 'true';

// Start Expo
const expo = spawn('npx', [
  'expo',
  'start',
  '--clear',
  '--no-dev-client',
  '--port',
  '19001'
], {
  stdio: 'inherit',
  env: process.env
});

expo.on('error', (err) => {
  console.error('Failed to start Expo:', err);
  process.exit(1);
});