'use strict';

var http    = require('http'),
    app     = require('./app'),
    db      = require('./db');

http.createServer(app).listen(app.get('port'), function() {
    console.log('Server listening on port ' + app.get('port') + ', config=' + app.get('config'));
    db.connect(app, function(status) {
        console.log(status);
    });
});
