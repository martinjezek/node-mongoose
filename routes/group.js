'use strict';

var express     = require('express'),
    bodyParser  = require('body-parser'),
    group       = require('../lib/group');

var urlencodedParser = bodyParser.urlencoded({ extended: false });

module.exports = express.Router()
    .get(   '/'                         , group.list)
    .post(  '/'     , urlencodedParser  , group.create)
    .get(   '/:id'                      , group.read)
    .put(   '/:id'  , urlencodedParser  , group.update)
    .delete('/:id'                      , group.delete);
