'use strict';

var config  = require('config'),
    colors  = require('colors'),
    mongodb = require('./mongodb');

module.exports = {

    connect: function(app, cb) {
        mongodb.connect(function() {
            app.set('dbReady', true);
            cb(colors.green('    ✓ ') + colors.grey('MongoDB connected'));
        });
    }

};
