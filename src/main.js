const DEVICE_ID = process.argv[2];
const printer = require('./printer');
const tunnel = require('./tunnel');

if (!DEVICE_ID) {
    throw new Error('No DEVICE_ID');
}

// Connect to server
var io = require('socket.io-client');
var socket = io.connect('https://printer-server.bistrohub.net', { reconnect: true });

console.log({ DEVICE_ID });
// Add a connect listener
socket.on('connect', () => socket.emit('join', { id: DEVICE_ID }));

function respond(requestId) {
    return (err, response) => {
        if (err) {
            console.error(err);
            return socket.emit('error-response', {
                requestId,
                error: { message: err.message, stack: err.stack, details: err.details },
            });
        }
        socket.emit('response', { requestId, response });
    };
}

socket.on('log', data => console.log);
socket.on('ping', data => ping(data, respond(data.requestId)));
socket.on('print-test', data => printer.test(data, respond(data.requestId)));
socket.on('print', data => printer.print(data, respond(data.requestId)));
socket.on('tunnel-open', data => tunnel.open(data, respond(data.requestId)));
socket.on('tunnel-close', data => tunnel.close(data, respond(data.requestId)));

function ping(data, callback) {
    callback(null, { id: DEVICE_ID, ping: data });
}
