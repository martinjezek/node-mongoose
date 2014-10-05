'use strict';

var express = require('express');

module.exports = express.Router()

    .get('/', function(req, res) {
        res.send('List of Users');
    })

    .get('/:id', function(req, res) {
        res.send('User ' + req.params.id);
    });
