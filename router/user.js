'use strict';

var express = require('express');

exports.router = express.Router()

    .get('/', function(req, res) {
        res.send('List of Users');
    })

    .get('/:id', function(req, res) {
        res.send('User ' + req.params.id);
    });
