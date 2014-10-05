'use strict';

var config      = require('config'),
    http        = require('http'),
    mongoose    = require('mongoose'),
    express     = require('express'),
    path        = require('path');

var routes = {
    index       : require('./routes/index.js'),
    user        : require('./routes/user.js'),
    group       : require('./routes/group.js'),
};

var app = express();

// public files
app.use(express.static(path.join(__dirname, '/public')));

// app routes
app.use('/', routes.index.router);
app.use('/user', routes.user.router);
app.use('/group', routes.group.router);

http.createServer(app).listen(config.get('http.port', config.get('http.host')), function() {
    console.log('[config:' + config.get('name') + '] -> Server running at http://' + config.get('http.host') + ':' + config.get('http.port') + '/');
});
