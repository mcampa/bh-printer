const socketIO = require('socket.io-client');
const printer = require('./printer');
const tunnel = require('./tunnel');

class Socket {
  static init(url, printerId) {
    const channel = new Socket(url, printerId);
    channel.connect();

    return channel;
  }

  constructor(url, printerId) {
    this.url = url;
    this.printerId = printerId;
    this.socket = null;
  }

  connect() {
    this.socket = socketIO(this.url, {
      path: '/wss',
      query: {
        id: `printer:${this.printerId}`,
      },
    });

    this.socket.on('connect', () => {
      console.log('connected');
    });

    this.socket.on('welcome', data => {
      console.log('welcome', data);
    });

    this.socket.on('command', async ({ event, data }) => {
      console.log(`command received ${event}`, data);

      if (event === 'print' || event === 'printOrder') {
        await printer.print(data);
        this.socket.emit('OK');
      }

      if (event === 'tunnel_open') {
        const tunnel = await tunnel.open(data);
        this.socket.emit({ tunnel });
      }

      if (event === 'tunnel_close') {
        tunnel.close();
      }

      if (event === 'print_test') {
        printer.test();
      }

      if (event === 'health') {
        socket.emit({ id: this.printerId, date: new Date() });
      }
    });
  }
}

module.exports = Socket;
