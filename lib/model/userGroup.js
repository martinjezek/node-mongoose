'use strict';

var mongoose    = require('mongoose'),
    queries     = require('../queries');

var userGroupSchema = mongoose.Schema({
    userId    : { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    groupId   : { type: mongoose.Schema.Types.ObjectId, ref: 'Group' }
});

var UserGroup = mongoose.model('UserGroup', userGroupSchema);

module.exports = {

    middleware: function(req, res, next) {
        if (req.method === 'GET') {
            var q = new queries(req.query);
            q.valid('where', function(err) {
                if (err) return res.status(400).send(err.toString());
                next();
            });
        } else {
            next();
        }
    },

    list: function(req, res) {
        var q           = new queries(req.query),
            findBy      = null,
            populateBy  = null;

        // sort out two way approach (User or Group route)
        if (req.params.userId) {
            findBy = { userId: req.params.userId };
            populateBy = 'groupId';
        } else if (req.params.groupId) {
            findBy = { groupId: req.params.groupId };
            populateBy = 'userId';
        }

        UserGroup
            .find(findBy)
            // MongoDB (non-relational database) can't do sort and other extra
            // operations by pupulated items, like SQL JOINs can do.
            .populate({
                path    : populateBy,
                select  : q.select()
            })
            .limit(q.limit())
            .skip(q.skip())
            .exec(function (err, records) {
                if (err) res.status(500).send(err);
                res.json(records);
            });
    },

    create: function(req, res) {
        UserGroup
            .findOne({ $and: [{ userId: req.params.userId}, {groupId : req.params.groupId }] })
            .exec(function (err, record) {
                if (err) res.status(500).send(err);
                if (record) return res.status(400).send('Record already exists.');
                new UserGroup({
                    userId  : req.params.userId,
                    groupId : req.params.groupId
                }).save(function (err, record) {
                    if (err) res.status(500).send(err);
                    res.json(record);
                });
            });
    },

    read: function(req, res) {
        var q           = new queries(req.query),
            populateBy  = null,
            routeRegExp = new RegExp(/.*\/user\/.*/);

        // sort out two way approach (User or Group route)
        if (req.route.path.match(/.*\/user\/.*/)) {
            populateBy = 'userId';
        } else {
            populateBy = 'groupId';
        }

        UserGroup
            .findOne({ $and: [{ userId: req.params.userId}, {groupId : req.params.groupId }] })
            .populate({
                path    : populateBy,
                select  : q.select()
            })
            .exec(function (err, record) {
                if (err) res.status(500).send(err);
                res.json(record);
            });
    },

    update: function(req, res) {
        var updateRecord = null;

        // sort out two way approach (User or Group route)
        if (req.route.path.match(/.*\/user\/.*/)) {
            updateRecord = {
                userId : req.body.userId
            };
        } else {
            updateRecord = {
                groupId : req.body.groupId
            };
        }

        UserGroup
            .findOne({ $and: [{ userId: req.params.userId}, {groupId : req.params.groupId }] })
            .exec(function (err, record) {
                if (err) res.status(500).send(err);
                if (!record) return res.status(400).send('Record doesn\'t exists.');
                UserGroup.findByIdAndUpdate(record.id, {
                    $set: updateRecord
                }, function (err, record) {
                    if (err) res.status(500).send(err);
                    res.json(record);
                });
            });
    },

    delete: function(req, res) {
        UserGroup
            .findOne({ $and: [{ userId: req.params.userId}, {groupId : req.params.groupId }] })
            .exec(function (err, record) {
                if (err) res.status(500).send(err);
                if (!record) return res.status(400).send('Record doesn\'t exists.');
                UserGroup.findByIdAndRemove(record.id, function (err, record) {
                    if (err) res.status(500).send(err);
                    res.json(record);
                });
            });
    }
};
