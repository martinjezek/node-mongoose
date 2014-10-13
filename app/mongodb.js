'use strict';

var mongoose = require('mongoose'),
    config   = require('config'),
    colors   = require('colors');

module.exports = function(app) {

    mongoose.connect('mongodb://' + config.get('db.host') + ':' + config.get('db.port') + '/' + config.get('db.name'));
    mongoose.connection.once('open', function() {
        app.set('dbReady', true);
        console.log(colors.green('    ✓ ') + colors.grey('MongoDB connected'));
    }).on('error', console.error.bind(console, 'Mongoose:'));

};
