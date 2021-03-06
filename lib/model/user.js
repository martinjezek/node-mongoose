'use strict';

var mongoose    = require('mongoose'),
    queries     = require('../queries');

var userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    age: {
        type: Number,
        require: true
    },
    groups: [{
        type: mongoose.Schema.ObjectId,
        require: true,
        ref: 'Group'
    }]
});

var User = mongoose.model('User', userSchema);

module.exports = {

    model: User,

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
        User
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
        new User({
            name: req.body.name,
            age: req.body.age,
            groups: []
        }).save(function (err, record) {
            if (err) return res.status(500).send(err);
            res.json(record);
        });
    },

    read: function(req, res) {
        var q = new queries(req.query);
        User
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
        User.findByIdAndUpdate(req.params.id, { $set: {
            name: req.body.name,
            age: req.body.age
        }}, function (err, record) {
            if (err) return res.status(500).send(err);
            res.json(record);
        });
    },

    delete: function(req, res) {
        User.findByIdAndRemove(req.params.id, function (err, record) {
            if (err) return res.status(500).send(err);
            res.json(record);
        });
    }

};
