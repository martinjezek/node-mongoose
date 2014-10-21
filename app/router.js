'use strict';

var express = require('express'),
    path    = require('path');

module.exports = function(app) {

    // Public files
    app.use(express.static(path.join(process.cwd(), '/public')));

    // App routes
    app.use('/'     , require('../routes/index'));
    app.use('/user' , require('../routes/user'));
    app.use('/group', require('../routes/group'));

};
