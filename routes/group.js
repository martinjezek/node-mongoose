'use strict';

var express = require('express');

exports.router = express.Router()

    .get('/', function(req, res, next) {
        res.send('List of Groups');
    })

    .get('/:id', function(req, res, next) {
        res.send('Group ' + req.params.id);
    });
