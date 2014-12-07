'use strict';

var express     = require('express'),
    config      = require('config'),
    bodyParser  = require('body-parser');

module.exports = function(app) {

    // Port & Config Name
    app.set('port', config.get('http.port'));
    app.set('config', config.get('name'));

    // Body Parser
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

};
