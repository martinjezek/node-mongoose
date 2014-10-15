'use strict';

var express = require('express'),
    app     = express();

// Configuration
require('./config')(app);

// Router
require('./router')(app);

module.exports = app;
