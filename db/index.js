'use strict';

var colors  = require('colors'),
    mongodb = require('./mongodb');

module.exports = {

    // connect to the database
    connect: function(cb) {
        mongodb.connect(function() {
            cb(colors.green('    ✓ ') + colors.grey('MongoDB connected'));
        });
    }

};
