var { Socket } = require('phoenix-channels');
const printer = require('./printer');
const tunnel = require('./tunnel');

class Channel {
    static init(url, printerId, token) {
        const channel = new Channel(url, printerId, token);
        channel.connect();

        return channel;
    }

    constructor(url, printerId, token) {
        this.url = url;
        this.printerId = printerId;
        this.token = token;
        this.socket = null;
        this.channel = null;
    }

    connect() {
        this.socket = new Socket(this.url, {
            params: {
                printer_id: this.printerId,
                token: this.token,
            }
        })

        this.socket.connect();

        // Now that you are connected, you can join channels with a topic:
        this.channel = this.socket.channel("printer:lobby", {});

        this.channel.onMessage = (event, payload, ref) => {
            console.log('onMessage', event, payload, ref);
            // this.channel.push('hello', {a: 1})
            return payload
        };

        this.channel.join();


        // this.channel.join().receive("ok", () => this.addListenEvents());
        // this.channel.join().receive("ok", () => this.channel.push('hello', {a: 1}));
    }

    addListenEvents() {
        this.channel.on('log', data => console.log);
        this.channel.on('ping', data => this.ping(data, this.requestHandler.bind(this, data.requestId)));
        this.channel.on('print-test', data => printer.test(data, this.requestHandler.bind(this, data.requestId)));
        this.channel.on('print', data => printer.print(data, this.requestHandler.bind(this, data.requestId)));
        this.channel.on('tunnel-open', data => tunnel.open(data, this.requestHandler.bind(this, data.requestId)));
        this.channel.on('tunnel-close', data => tunnel.close(data, this.requestHandler.bind(this, data.requestId)));
    }

    ping(data, callback) {
        callback(null, { id: this.printerId, ping: data });
    }

    requestHandler(requestId, err, response) {
        if (err) {
            console.error(err);
            return this.channel.push('error-response', {
                requestId,
                error: { message: err.message, stack: err.stack, details: err.details },
            });
        }
        this.channel.push('response', { requestId, response });
    }
}

module.exports = Channel;