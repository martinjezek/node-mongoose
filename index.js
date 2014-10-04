'use strict';

var config      = require('config'),
    http        = require('http'),
    mongoose    = require('mongoose'),
    express     = require('express'),
    path        = require('path');

var router = {
    index       : require('./router/index.js'),
    user        : require('./router/user.js'),
    group       : require('./router/group.js'),
};

var app = express();

// public files
app.use(express.static(path.join(__dirname, '/public')));

// app routes
app.use('/', router.index.router);
app.use('/user', router.user.router);
app.use('/group', router.group.router);

http.createServer(app).listen(config.get('http.port', config.get('http.host')), function() {
    console.log('[config:' + config.get('name') + '] -> Server running at http://' + config.get('http.host') + ':' + config.get('http.port') + '/');
});
