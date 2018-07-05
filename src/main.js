const Socket = require('./Socket');

const PRINTER_ID = process.env.PRINTER_ID || 'TEST-PRINTER';
const URL = process.env.URL || 'https://api.bistrohub.com';

if (!PRINTER_ID) {
  throw new Error('No PRINTER_ID');
}

Socket.init(URL, PRINTER_ID);

process.on('uncaughtException', err => {
  console.error(err);
});
