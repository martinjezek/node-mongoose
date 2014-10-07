'use strict';

var mongoose    = require('mongoose');

var userSchema = mongoose.Schema({
    name    : String,
    age     : Number
});

var User = mongoose.model('User', userSchema);

module.exports = {

    list: function(req, res) {
        User.find({}, function (err, users) {
            if (err) res.status(500).send(err);
            res.json(users);
        });
    },

    create: function(req, res) {
        if (!req.body) return res.sendStatus(400);
        new User({
            name: req.body.name,
            age: req.body.age
        }).save(function (err, user) {
            if (err) res.status(500).send(err);
            res.json(user);
        });
    },

    read: function(req, res) {
        User.findById(req.params.id, function (err, user) {
            if (err) res.status(500).send(err);
            res.json(user);
        });
    },

    update: function(req, res) {
        if (!req.body) return res.sendStatus(400);
        User.findByIdAndUpdate(req.params.id, { $set: {
            name: req.body.name,
            age: req.body.age
        }}, function (err, user) {
            if (err) res.status(500).send(err);
            res.json(user);
        });
    },

    delete: function(req, res) {
        User.findByIdAndRemove(req.params.id, function (err, user) {
            if (err) res.status(500).send(err);
            res.json(user);
        });
    }

};
