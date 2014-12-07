'use strict';

var express = require('express'),
    path    = require('path');

module.exports = function(app) {

    // Public files
    app.use(express.static(path.join(process.cwd(), '/public')));

    // CORS - Cross Origin Resource Sharing
    app.use(function(req, res, next) {
        res.set('Access-Control-Allow-Origin', '*');
        res.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        next();
    });

    // App routes
    app.use('/'     , require('../routes/index'));
    app.use('/user' , require('../routes/user'));
    app.use('/group', require('../routes/group'));

};
