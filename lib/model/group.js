'use strict';

var mongoose    = require('mongoose'),
    queries     = require('../queries'),
    User        = require('./user').model;

var groupSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    users: [{
        type: mongoose.Schema.ObjectId,
        require: true,
        ref: 'User'
    }]
});

var Group = mongoose.model('Group', groupSchema);

module.exports = {

    model: Group,

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
        var q = new queries(req.query);
        Group
            .find(q.where())
            .select(q.select())
            .sort(q.sort())
            .limit(q.limit())
            .skip(q.skip())
            .populate(q.populate())
            .exec(function (err, records) {
                if (err) return res.status(500).send(err);
                res.json(records);
            });
    },

    create: function(req, res) {
        if (!req.body) return res.sendStatus(400);
        new Group({
            name: req.body.name,
            users: []
        }).save(function (err, record) {
            if (err) return res.status(500).send(err);
            res.json(record);
        });
    },

    read: function(req, res) {
        var q = new queries(req.query);
        Group
            .findById(req.params.id)
            .select(q.select())
            .populate(q.populate())
            .exec(function (err, record) {
                if (err) return res.status(500).send(err);
                res.json(record);
            });
    },

    update: function(req, res) {
        if (!req.body) return res.sendStatus(400);
        Group.findByIdAndUpdate(req.params.id, { $set: {
            name: req.body.name
        }}, function (err, record) {
            if (err) return res.status(500).send(err);
            res.json(record);
        });
    },

    delete: function(req, res) {
        Group.findByIdAndRemove(req.params.id, function (err, record) {
            if (err) return res.status(500).send(err);
            res.json(record);
        });
    },

    user: {

        create: function(req, res) {

            // find the group
            Group
                .findById(req.params.groupId)
                .select('_id users')
                .exec(function (err, group) {
                    if (err) return res.status(500).send(err);
                    if (group === null) return res.status(400).send('Group does not exist.');

                    // find the user
                    User
                        .findById(req.params.userId)
                        .select('_id groups')
                        .exec(function (err, user) {
                            if (err) return res.status(500).send(err);
                            if (user === null) return res.status(400).send('User does not exist.');
                            if (group.users.indexOf(user._id) !== -1) return res.status(400).send('User has been already assigned to the group.');

                            // assign: user -> group
                            group.users.push(user._id);
                            Group.findByIdAndUpdate(group._id, { $set: {
                                users: group.users
                            }}, function (err, groupRecord) {
                                if (err) return res.status(500).send(err);
                                if (user.groups.indexOf(group._id) !== -1) return res.json(groupRecord);

                                // assign: group -> user
                                user.groups.push(group._id);
                                User.findByIdAndUpdate(user._id, { $set: {
                                    groups: user.groups
                                }}, function (err, userRecord) {
                                    if (err) return res.status(500).send(err);

                                    // return a new group record
                                    res.json(groupRecord);
                                });
                            });

                        });
                });
        },

        delete: function(req, res) {

            // find the group
            Group
                .findById(req.params.groupId)
                .select('_id users')
                .exec(function (err, group) {
                    if (err) return res.status(500).send(err);
                    if (group === null) return res.status(400).send('Group does not exist.');

                    // find the user
                    User
                        .findById(req.params.userId)
                        .select('_id groups')
                        .exec(function (err, user) {
                            if (err) return res.status(500).send(err);
                            if (user === null) return res.status(400).send('User does not exist.');

                            // unassign: user -> group
                            group.users.splice(group.users.indexOf(user._id), 1);
                            Group.findByIdAndUpdate(group._id, { $set: {
                                users: group.users
                            }}, function (err, groupRecord) {
                                if (err) return res.status(500).send(err);

                                // unassign: group -> user
                                user.groups.splice(user.groups.indexOf(group._id), 1);
                                User.findByIdAndUpdate(user._id, { $set: {
                                    groups: user.groups
                                }}, function (err, userRecord) {
                                    if (err) return res.status(500).send(err);

                                    // return a new group record
                                    res.json(groupRecord);
                                });
                            });

                        });
                });
        }

    }

};
