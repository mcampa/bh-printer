const escpos = require('escpos');
const os = require('os');
const device  = os.platform() === 'darwin'
    ? new escpos.USB()
    : new escpos.Serial('/dev/usb/lp0');
const printer = new escpos.Printer(device);

function print(body, callback) {
    console.log('body', body);
    const payload = Buffer.from(body, 'base64');

    device.open(() => {
        console.log('opened')
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

// process.on('SIGINT', exit);
// process.on('SIGTERM', exit);

function exit() {
    console.log('Stopping and halting ...');
    try {
        device.close(() => setTimeout(process.exit, 100));
    } catch (e) {
        process.exit();
    }}

process.on('uncaughtException', (err) => {
    console.error(err);
});

module.exports = { print, test };
