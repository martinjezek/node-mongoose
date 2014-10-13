'use strict';

var express     = require('express'),
    bodyParser  = require('body-parser'),
    user        = require('../lib/model/user'),
    userGroup   = require('../lib/model/userGroup');

var urlencodedParser = bodyParser.urlencoded({ extended: false });

module.exports = express.Router()
    // middleware
    .use(                                     user.middleware)
    // user
    .get('/'                                , user.list)
    .post('/'           , urlencodedParser  , user.create)
    .get('/:id'                             , user.read)
    .put('/:id'         , urlencodedParser  , user.update)
    .delete('/:id'                          , user.delete)
    // user in group
    .get('/:userId/group'                                   , userGroup.list)
    .post('/:userId/group/:groupId'                         , userGroup.create)
    .get('/:userId/group/:groupId'                          , userGroup.read)
    .put('/:userId/group/:groupId',     urlencodedParser    , userGroup.update)
    .delete('/:userId/group/:groupId'                       , userGroup.delete);
