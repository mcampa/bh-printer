const DEVICE_ID = process.argv[2] || 'A4812B812';
const TOKEN = process.argv[3] || '4830917EE0CADD49AF1C3EEC3C49D8CBA5FFFB9B';
const Socket = require('./Socket');
const url = 'https://bistrohub.com' || process.env['URL'];

if (!DEVICE_ID || !TOKEN) {
  throw new Error('No DEVICE_ID or TOKEN');
}

Socket.init(url, DEVICE_ID, TOKEN);
