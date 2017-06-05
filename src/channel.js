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
        console.log('connect');
        this.socket = new Socket(this.url, {
            params: {
                printer_id: this.printerId,
                token: this.token,
            }
        })

        this.socket.connect();

        // Now that you are connected, you can join channels with a topic:
        this.channel = this.socket.channel(`printer:${this.printerId}`);

        // this.channel.onMessage = (event, payload, ref) => {
        //     console.log('onMessage', event, payload, ref);
        //     return payload
        // };

        this.channel.join().receive("ok", () => {
            console.log('Connected to server');
        });

        this.addListenEvents();
    }

    addListenEvents() {
        const actions = [
            {
                event: 'health',
                method: this.health,
            },
            {
                event: 'print_test',
                method: printer.test,
            },
            {
                event: 'print',
                method: printer.print,
            },
            {
                event: 'tunnel_open',
                method: tunnel.open,
            },
            {
                event: 'tunnel_close',
                method: tunnel.close,
            },
        ];

        actions.forEach(action => {
            this.channel.on(action.event, req => {
                action.method(req.body, this.requestHandler.bind(this, req.request_id));
            });
        });
    }

    health(data, callback) {
        console.log('health', new Date);
        callback(null, { id: this.printerId, date: new Date });
    }

    requestHandler(requestId, err, response) {
        const error = err && { message: err.message, stack: err.stack, details: err.details };

        this.channel.push(`request:${requestId}`, { error, response });
    }
}

module.exports = Channel;