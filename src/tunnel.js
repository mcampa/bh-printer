const ngrok = require('ngrok');
const { exec } = require('child_process');

async function close() {
  await ngrok.disconnect(); // stops all
  await ngrok.kill();
  exec('killall ngrok');
}

function open(data = {}) {
  return ngrok.connect({
    authtoken: data.authtoken || '6tywGLqjiQtvoD6wATeUD_86MgyZojffhj83sUmsirP',
    proto: 'tcp',
    addr: 22,
  });
}

module.exports = { close, open };
