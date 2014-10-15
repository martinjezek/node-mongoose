'use strict';

var mongoose    = require('mongoose'),
    config      = require('config'),
    clearDB     = require('mocha-mongoose');

module.exports = {

    db          : 'mongodb://' + config.get('db.host')      + ':' + config.get('db.port')       + '/' + config.get('db.name'),
    testdb      : 'mongodb://' + config.get('test.db.host') + ':' + config.get('test.db.port')  + '/' + config.get('test.db.name'),

    // Connect /database/
    // relates on NODE_ENV/config/testMode configuration
    //
    connect: function(cb, testMode) {
        // check if connection is already opened
        if (mongoose.connection.db) return cb();

        // if test mode change to the test database
        var db = testMode ? this.testdb : this.db;

        // connect to MongoDB using Moongoose
        mongoose.connect(db);
        mongoose.connection.once('open', function() {
            cb();
        }).on('error', console.error.bind(console, 'Mongoose:'));
    },

    // Clear /database/
    // function is provided just for the test database
    //
    clear: function(cb) {
        clearDB(this.testdb);
        cb();
    }

};
