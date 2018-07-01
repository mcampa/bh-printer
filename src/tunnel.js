const ngrok = require('ngrok');

function close() {
  ngrok.disconnect();
  ngrok.kill();
}

function open(data) {
  const defaultToken = '6tywGLqjiQtvoD6wATeUD_86MgyZojffhj83sUmsirP';

  return new Promise((resolve, reject) => {
    ngrok.connect(
      { authtoken: data.authtoken || defaultToken, proto: 'tcp', addr: 22 },
      (err, url) => {
        if (err) {
          return reject(err);
        }
        resolve(url);
      },
    );
  });
}

module.exports = { close, open };
