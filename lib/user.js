'use strict';

var mongoose    = require('mongoose'),
    queries     = require('../lib/queries');

var userSchema = mongoose.Schema({
    name    : String,
    age     : Number
});

var User = mongoose.model('User', userSchema);

module.exports = {

    list: function(req, res) {
        var q = new queries(req.query);
        User
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
        new User({
            name: req.body.name,
            age: req.body.age
        }).save(function (err, record) {
            if (err) res.status(500).send(err);
            res.json(record);
        });
    },

    read: function(req, res) {
        var q = new queries(req.query);
        User
            .findById(req.params.id)
            .select(q.select())
            .exec(function (err, record) {
                if (err) res.status(500).send(err);
                res.json(record);
            });
    },

    update: function(req, res) {
        if (!req.body) return res.sendStatus(400);
        User.findByIdAndUpdate(req.params.id, { $set: {
            name: req.body.name,
            age: req.body.age
        }}, function (err, record) {
            if (err) res.status(500).send(err);
            res.json(record);
        });
    },

    delete: function(req, res) {
        User.findByIdAndRemove(req.params.id, function (err, record) {
            if (err) res.status(500).send(err);
            res.json(record);
        });
    }

};
