'use strict';

var express = require('express'),
    config  = require('config');

module.exports = function(app) {

    // Port
    app.set('port', config.get('http.port'));

    // Config Name
    app.set('config', config.get('name'));

};
