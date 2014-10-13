'use strict';

var express     = require('express'),
    bodyParser  = require('body-parser'),
    group       = require('../lib/model/group'),
    userGroup   = require('../lib/model/userGroup');

var urlencodedParser = bodyParser.urlencoded({ extended: false });

module.exports = express.Router()
    // middleware
    .use(                                 group.middleware)
    // user
    .get('/'                            , group.list)
    .post('/'       , urlencodedParser  , group.create)
    .get('/:id'                         , group.read)
    .put('/:id'     , urlencodedParser  , group.update)
    .delete('/:id'                      , group.delete)
    // user in group
    .get('/:groupId/user'                                  , userGroup.list)
    .post('/:groupId/user/:userId'                         , userGroup.create)
    .get('/:groupId/user/:userId'                          , userGroup.read)
    .put('/:groupId/user/:userId',     urlencodedParser    , userGroup.update)
    .delete('/:groupId/user/:userId'                       , userGroup.delete);
