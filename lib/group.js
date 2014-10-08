'use strict';

var mongoose    = require('mongoose');

var groupSchema = mongoose.Schema({
    name    : String
});

var Group = mongoose.model('Group', groupSchema);

module.exports = {

    list: function(req, res) {
        Group.find({}, function (err, records) {
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
        Group.findById(req.params.id, function (err, record) {
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
