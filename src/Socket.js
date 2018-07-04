const socketIO = require('socket.io-client');
const printer = require('./printer');
const tunnel = require('./tunnel');

class Socket {
  static init(url, printerId) {
    const socket = new Socket(url, printerId);
    socket.connect();
    printer.load();

    return socket;
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
      console.log(new Date(), 'connected');
    });

    this.socket.on('welcome', data => {
      console.log(new Date(), 'welcome', data);
    });

    this.socket.on('health_request', async ({ replyTo }) => {
      this.socket.emit('health_reply', {
        id: replyTo,
        health: {
          printerId: this.printerId,
          printerConnected: await printer.isConnected(),
        },
      });
    });

    this.socket.on('command', async ({ event, data }) => {
      console.log(new Date(), `command received ${event}`, data);

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
    });
  }
}

module.exports = Socket;
