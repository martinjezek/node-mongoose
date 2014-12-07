'use strict';

var express     = require('express'),
    group       = require('../lib/model/group');

module.exports = express.Router()
    // middleware
    .use(                                 group.middleware)
    // group
    .get('/'                            , group.list)
    .post('/'                           , group.create)
    .get('/:id'                         , group.read)
    .put('/:id'                         , group.update)
    .delete('/:id'                      , group.delete)
    // user
    .post('/:groupId/user/:userId'      , group.user.create)
    .delete('/:groupId/user/:userId'    , group.user.delete);
