'use strict';

var express     = require('express'),
    bodyParser  = require('body-parser'),
    group       = require('../lib/model/group');

var urlencodedParser = bodyParser.urlencoded({ extended: false });

module.exports = express.Router()
    // middleware
    .use(                                 group.middleware)
    // group
    .get('/'                            , group.list)
    .post('/'       , urlencodedParser  , group.create)
    .get('/:id'                         , group.read)
    .put('/:id'     , urlencodedParser  , group.update)
    .delete('/:id'                      , group.delete)
    // user
    .post('/:groupId/user/:userId'      , group.user.create)
    .delete('/:groupId/user/:userId'    , group.user.delete);
