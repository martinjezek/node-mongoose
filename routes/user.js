'use strict';

var express     = require('express'),
    user        = require('../lib/model/user');

module.exports = express.Router()
    // middleware
    .use(                                     user.middleware)
    // user
    .get('/'                                , user.list)
    .post('/'                               , user.create)
    .get('/:id'                             , user.read)
    .put('/:id'                             , user.update)
    .delete('/:id'                          , user.delete);
