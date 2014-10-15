'use strict';

var config  = require('config'),
    mongodb = require('./mongodb');

module.exports = {

    // connect to the test database using Test Mode
    connect: function(cb) {
        mongodb.connect(function() {
            cb();
        }, true);
    },

    // clear the test database
    clear: function(cb) {
        mongodb.clear(function() {
            cb();
        });
    }

};
