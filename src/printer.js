const escpos = require('escpos');
const os = require('os');
const device = os.platform() === 'darwin' ? new escpos.USB() : new escpos.Serial('/dev/usb/lp0');
const printer = new escpos.Printer(device);

function print(body) {
  return new Promise((resolve, reject) => {
    const payload = Buffer.from(body, 'base64');

    device.open(() => {
      console.log('printing');
      try {
        device.write(payload, err => {
          if (err) {
            return reject(err);
          }

          resolve({ status: 'received' });
        });
      } catch (err) {
        return reject(err);
      }
    });
  });
}

function test() {
  device.open(() => {
    printer
      .text('Hello World')
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
  }
}

process.on('uncaughtException', err => {
  console.error(err);
});

module.exports = { print, test };
