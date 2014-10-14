'use strict';

var mongoose = require('mongoose'),
    config   = require('config');

module.exports = {

    connect: function(cb) {
        mongoose.connect('mongodb://' + config.get('db.host') + ':' + config.get('db.port') + '/' + config.get('db.name'));
        mongoose.connection.once('open', function() {
            cb();
        }).on('error', console.error.bind(console, 'Mongoose:'));
    }

};
