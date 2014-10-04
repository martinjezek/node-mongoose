'use strict';

var express = require('express');

exports.router = express.Router()

    .get('/', function(req, res) {
        res.send('API is ready to use.');
    });
