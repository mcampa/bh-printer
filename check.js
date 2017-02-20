const escpos = require('escpos');

// Select the adapter based on your printer type
const device  = new escpos.USB();
// const device  = new escpos.Network('localhost');
// const device  = new escpos.Serial('/dev/usb/lp0');
// const device  = new escpos.Console();

const printer = new escpos.Printer(device);

device.open(() => {
  printer
  .font('a')
  .style('bu')
  .align('ct')
  .size(1, 1)
  .text('THIS IS A TEST')
  .size(1, 2)
  .text('THIS IS A TEST')
  .size(2, 1)
  .text('THIS IS A TEST')
  .size(1, 1)
  .text('________________________________________________')
  .barcode('12345678', 'EAN8')
  .qrimage('https://example.com', () => {
    printer.cut()
    // printer.close();

    setTimeout(() => {
      printer.close();
      process.exit();
    }, 1000);
  });
});
