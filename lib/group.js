'use strict';

var mongoose    = require('mongoose'),
    queries     = require('../lib/queries');

var groupSchema = mongoose.Schema({
    name    : String
});

var Group = mongoose.model('Group', groupSchema);

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
        var q = new queries(req.query);
        Group
            .find(q.where())
            .select(q.select())
            .sort(q.sort())
            .limit(q.limit())
            .skip(q.skip())
            .exec(function (err, records) {
                if (err) res.status(500).send(err);
                res.json(records);
            });
    },

    create: function(req, res) {
        if (!req.body) return res.sendStatus(400);
        new Group({
            name: req.body.name
        }).save(function (err, record) {
            if (err) res.status(500).send(err);
            res.json(record);
        });
    },

    read: function(req, res) {
        var q = new queries(req.query);
        Group
            .findById(req.params.id)
            .select(q.select())
            .exec(function (err, record) {
                if (err) res.status(500).send(err);
                res.json(record);
            });
    },

    update: function(req, res) {
        if (!req.body) return res.sendStatus(400);
        Group.findByIdAndUpdate(req.params.id, { $set: {
            name: req.body.name
        }}, function (err, record) {
            if (err) res.status(500).send(err);
            res.json(record);
        });
    },

    delete: function(req, res) {
        Group.findByIdAndRemove(req.params.id, function (err, record) {
            if (err) res.status(500).send(err);
            res.json(record);
        });
    }

};
