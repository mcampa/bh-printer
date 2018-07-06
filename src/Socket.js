const socketIO = require('socket.io-client');
const printer = require('./printer');
const tunnel = require('./tunnel');
const revision = require('child_process')
  .execSync('git rev-parse HEAD')
  .toString()
  .trim();

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
      this.serverLog({ printerId: this.printerId, revision });
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
          revision,
        },
      });
    });

    this.socket.on('command', async ({ event, data }) => {
      console.log(new Date(), `command received ${event}`, data);

      if (event === 'print' || event === 'printOrder') {
        await printer.print(data);
        this.serverLog({ print: 'OK' });
      }

      if (event === 'tunnel_open') {
        console.log(event, data);
        try {
          const url = await tunnel.open(data || {});
          this.serverLog({ tunnel: url });
        } catch (error) {
          this.serverLog({ tunnel: { error: error.message } });
        }
      }

      if (event === 'tunnel_close') {
        tunnel.close();
        this.serverLog({ tunnel: null });
      }

      if (event === 'print_test') {
        printer.test();
      }
    });
  }

  serverLog(data) {
    this.socket.emit('log', data);
    console.log(new Date(), 'serverLog', data);
  }
}

module.exports = Socket;
