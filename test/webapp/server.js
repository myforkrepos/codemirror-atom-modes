require('marko/node-require').install();

require('lasso').configure({
    fingerprintsEnabled: false,
    bundlingEnabled: false
});

var express = require('express');
var app = express();

var template = require('./test-page.marko');

app.use(require('lasso/middleware').serveStatic());

app.get('/', function(req, res) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');

    template.render({}, res);
});

app.listen(8080, function(err) {
    if (err) {
        throw err;
    }

    console.log('Listening on port 8080');
});