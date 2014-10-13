'use strict';

var http    = require('http'),
    app     = require('./app');

http.createServer(app).listen(app.get('port'), function() {
    console.log('Server listening on port ' + app.get('port') + ', config=' + app.get('config'));
});
