const escpos = require('escpos');
const os = require('os');
const device = new escpos.USB();
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
  console.log('This is a test');
  device.open(() => {
    printer
      .text('This is a test')
      .feed()
      .close();
  });
}

module.exports = { print, test };
