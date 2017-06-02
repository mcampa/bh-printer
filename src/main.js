const DEVICE_ID = process.argv[2] || "A4812B812";
const TOKEN = process.argv[3] || "4830917EE0CADD49AF1C3EEC3C49D8CBA5FFFB9B";
const Channel = require('./channel');

if (!DEVICE_ID) {
    throw new Error('No DEVICE_ID');
}

Channel.init("http://bistrohub.dev:4000/sockets/printer", DEVICE_ID, TOKEN);
