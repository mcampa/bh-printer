const escpos = require('escpos');

const queue = [];
let device;
let printer;

function load() {
  device = undefined;
  printer = undefined;
  try {
    device = new escpos.USB();
    printer = new escpos.Printer(device);
    console.log(new Date(), 'printer connected');
    printQueue();
  } catch (error) {
    console.log(new Date(), error.message);
    setTimeout(() => {
      load();
    }, 1000);
  }
}

function print(body) {
  if (!device) {
    queue.push(body);
    return Promise.reject(new Error(''));
  }

  return new Promise((resolve, reject) => {
    const payload = Buffer.from(body, 'base64');

    try {
      device.open(() => {
        console.log(new Date(), 'printing');
        device.write(payload, err => {
          if (err) {
            return reject(err);
          }

          resolve({ status: 'received' });
        });
      });
    } catch (err) {
      console.log(new Date(), `Error opening device: ${err.message}`);
      queue.push(body);
      load();
      return reject(err);
    }
  });
}

async function printQueue() {
  while (queue.length > 0) {
    await print(queue.pop());
  }
}

function test() {
  if (!device) {
    return;
  }
  console.log('This is a test');
  device.open(() => {
    printer
      .text('This is a test')
      .feed()
      .close();
  });
}

module.exports = { print, test, load };
