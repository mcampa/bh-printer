const escpos = require('escpos');
const device  = new escpos.Serial('/dev/usb/lp0');
const printer = new escpos.Printer(device);

function print(data, callback) {
    // const payload = new Buffer(data.payload, 'base64');
    // const buffer = new MutableBuffer();
    const payload = Buffer.from(data.payload, 'base64');

    device.open(() => {
        try {
            device.write(payload, (err) => {
                if (err) {
                    return callback(err);
                }

                callback(null, { status: 'received' });
            });
        } catch (err) {
            return callback(err);
        }
    });
}

function test(data, callback) {
    device.open(() => {
        printer.text('Hello World')
            .feed()
            .close();
    });
}

process.on('SIGINT', exit);
process.on('SIGTERM', exit);

function exit() {
    console.log('Stopping and halting ...');
    device.close(() => setTimeout(process.exit, 10));
}

process.on('uncaughtException', (err) => {
    console.error(err);
});

module.exports = { print, test };
