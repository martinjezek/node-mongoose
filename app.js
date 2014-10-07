'use strict';

var config      = require('config'),
    http        = require('http'),
    mongoose    = require('mongoose'),
    express     = require('express'),
    path        = require('path');

mongoose.connect('mongodb://' + config.get('db.host') + ':' + config.get('db.port') + '/' + config.get('db.name'));
mongoose.connection.once('open', function() {

    var app     = express(),
        routes  = {
            index   : require('./routes/index'),
            user    : require('./routes/user'),
            group   : require('./routes/group'),
        };

    // public files
    app.use(express.static(path.join(__dirname, '/public')));

    // app routes
    app.use('/'     , routes.index);
    app.use('/user' , routes.user);
    app.use('/group', routes.group);

    http.createServer(app).listen(config.get('http.port'), config.get('http.host'), function() {
        console.log('[config:' + config.get('name') + '] -> Server running at http://' + config.get('http.host') + ':' + config.get('http.port') + '/');
    });

}).on('error', console.error.bind(console, 'Mongoose:'));
