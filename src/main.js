const Socket = require('./Socket');

const PRINTER_ID = process.env.PRINTER_ID || 'TEST-PRINTER';
const URL = process.env.URL || 'https://api.bistrohub.com';

if (!PRINTER_ID) {
  throw new Error('No PRINTER_ID');
}

Socket.init(URL, PRINTER_ID);

// process.on('SIGINT', exit);
// process.on('SIGTERM', exit);

// function exit() {
//   console.log('Stopping and halting ...');
//   try {
//     device.close(() => setTimeout(process.exit, 100));
//   } catch (e) {
//     process.exit();
//   }
// }

process.on('uncaughtException', err => {
  console.error(err);
});
