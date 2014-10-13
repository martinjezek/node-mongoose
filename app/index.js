'use strict';

var express = require('express'),
    app     = express();

// Configuration
require('./config')(app);

// Database
require('./mongodb')(app);

// Router
require('./router')(app);

module.exports = app;
