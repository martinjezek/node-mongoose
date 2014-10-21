'use strict';

var express     = require('express'),
    bodyParser  = require('body-parser'),
    user        = require('../lib/model/user');

var urlencodedParser = bodyParser.urlencoded({ extended: false });

module.exports = express.Router()
    // middleware
    .use(                                     user.middleware)
    // user
    .get('/'                                , user.list)
    .post('/'           , urlencodedParser  , user.create)
    .get('/:id'                             , user.read)
    .put('/:id'         , urlencodedParser  , user.update)
    .delete('/:id'                          , user.delete);
