'use strict';

var app         = require('../app'),
    db          = require('../db/test'),
    request     = require('supertest'),
    should      = require('should');

describe('user', function() {

    before(function(done) {
        db.connect(done);
    });

    beforeEach(function(done) {
        db.clear(done);
    });

    after(function(done) {
        db.clear(done);
    });

    it('should create a user', function(done) {
        request(app).post('/user')
            .type('form')
            .send({
                name: 'Martin',
                age: 27
            })
            .end(function(err, res) {
                res.status.should.equal(200);
                res.body.should.be.type('object');
                res.body._id.should.be.type('string');
                res.body.name.should.equal('Martin');
                res.body.age.should.equal(27);
                done();
            });
    });

    it('should get a user', function(done) {
        // add a user
        request(app).post('/user')
            .type('form')
            .send({
                name: 'Martin',
                age: 27
            })
            .end(function(err, res) {
                var userId = res.body._id;
                // get the user
                request(app).get('/user/' + userId)
                    .end(function(err, res) {
                        res.status.should.equal(200);
                        res.body.should.be.type('object');
                        res.body._id.should.equal(userId);
                        res.body.name.should.equal('Martin');
                        res.body.age.should.equal(27);
                        done();
                    });
            });
    });

    it('should get a user with filters', function(done) {
        // add a user
        request(app).post('/user')
            .type('form')
            .send({
                name: 'Martin',
                age: 27
            })
            .end(function(err, res) {
                var userId = res.body._id;
                // get the user
                request(app).get('/user/' + userId + '?select=name')
                    .end(function(err, res) {
                        res.status.should.equal(200);
                        res.body.should.be.type('object');
                        res.body._id.should.equal(userId);
                        res.body.name.should.equal('Martin');
                        should.not.exist(res.body.age);
                        done();
                    });
            });
    });

    it('should update a user', function(done) {
        // add a user
        request(app).post('/user')
            .type('form')
            .send({
                name: 'Martin',
                age: 27
            })
            .end(function(err, res) {
                var userId = res.body._id;
                // update a user
                request(app).put('/user/' + userId)
                    .type('form')
                    .send({
                        name: 'Michal',
                        age: 31
                    })
                    .end(function(err, res) {
                        res.status.should.equal(200);
                        res.body.should.be.type('object');
                        res.body._id.should.equal(userId);
                        res.body.name.should.equal('Michal');
                        res.body.age.should.equal(31);
                        // get the user
                        request(app).get('/user/' + userId)
                            .end(function(err, res) {
                                res.status.should.equal(200);
                                res.body.should.be.type('object');
                                res.body._id.should.equal(userId);
                                res.body.name.should.equal('Michal');
                                res.body.age.should.equal(31);
                                done();
                            });
                    });
            });
    });

    it('should delete a user', function(done) {
        // add a user
        request(app).post('/user')
            .type('form')
            .send({
                name: 'Martin',
                age: 27
            })
            .end(function(err, res) {
                var userId = res.body._id;
                // delete a user
                request(app).del('/user/' + userId)
                    .end(function(err, res) {
                        res.status.should.equal(200);
                        res.body.should.be.type('object');
                        res.body._id.should.equal(userId);
                        res.body.name.should.equal('Martin');
                        res.body.age.should.equal(27);
                        // get the user
                        request(app).get('/user/' + userId)
                            .end(function(err, res) {
                                res.status.should.equal(200);
                                res.text.should.equal('null');
                                should.not.exist(res.body._id);
                                should.not.exist(res.body.name);
                                should.not.exist(res.body.age);
                                done();
                            });
                    });
            });
    });

    it('should get a list of users', function(done) {
        // add a user 1
        request(app).post('/user')
            .type('form')
            .send({
                name: 'Martin',
                age: 27
            })
            .end(function(err, res) {
                // add a user 2
                request(app).post('/user')
                    .type('form')
                    .send({
                        name: 'Michal',
                        age: 31
                    })
                    .end(function(err, res) {
                        // get a list of users
                        request(app).get('/user')
                            .end(function(err, res) {
                                res.status.should.equal(200);
                                res.body.length.should.equal(2);
                                // user 1
                                res.body[0].name.should.equal('Martin');
                                res.body[0].age.should.equal(27);
                                // user 2
                                res.body[1].name.should.equal('Michal');
                                res.body[1].age.should.equal(31);
                                done();
                            });
                    });
            });
    });

    it('should get a list of users with filters', function(done) {
        // add a user 1
        request(app).post('/user')
            .type('form')
            .send({
                name: 'Martin',
                age: 27
            })
            .end(function(err, res) {
                // add a user 2
                request(app).post('/user')
                    .type('form')
                    .send({
                        name: 'Michal',
                        age: 31
                    })
                    .end(function(err, res) {
                        // add a user 3
                        request(app).post('/user')
                            .type('form')
                            .send({
                                name: 'Peter',
                                age: 2
                            })
                            .end(function(err, res) {
                                // get a list of users with filters
                                request(app).get('/user?select=name&where={"age":{"$lt":30}}&sort=age&limit=2&skip=1')
                                    .end(function(err, res) {
                                        res.status.should.equal(200);
                                        // filtered users
                                        res.body.length.should.equal(1);
                                        res.body[0].name.should.equal('Martin');
                                        should.not.exist(res.body[0].age);
                                        done();
                                    });
                            });
                    });
            });
    });

    it('should check a valid JSON filter in queries', function(done) {
        request(app).get('/user?select=name&where={age:{$lt:30}}')
            .end(function(err, res) {
                res.status.should.equal(400);
                done();
            });
    });

});
