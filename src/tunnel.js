const ngrok = require('ngrok');

function close(data, callback) {
    ngrok.disconnect();
    ngrok.kill();
    callback();
}

function open(data, callback) {
    const defaultToken = '6tywGLqjiQtvoD6wATeUD_86MgyZojffhj83sUmsirP';
    // ngrok.kill(() => {
        ngrok.connect({ authtoken: data.authtoken || defaultToken, proto: 'tcp', addr: 22 }, (err, url) => {
            if (err) {
                return callback(err);
            }
            callback(null, url);
        });
    // });
}

module.exports = { close, open };
