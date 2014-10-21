'use strict';

var app         = require('../app'),
    db          = require('../db/test'),
    request     = require('supertest'),
    should      = require('should');

describe('group', function() {

    before(function(done) {
        db.connect(done);
    });

    beforeEach(function(done) {
        db.clear(done);
    });

    after(function(done) {
        db.clear(done);
    });

    it('should create a group', function(done) {
        request(app).post('/group')
            .type('form')
            .send({
                name: 'Developers'
            })
            .end(function(err, res) {
                res.status.should.equal(200);
                res.body.should.be.type('object');
                res.body._id.should.be.type('string');
                res.body.name.should.equal('Developers');
                done();
            });
    });

    it('should get a group', function(done) {
        // add a group
        request(app).post('/group')
            .type('form')
            .send({
                name: 'Developers'
            })
            .end(function(err, res) {
                var groupId = res.body._id;
                // get the group
                request(app).get('/group/' + groupId)
                    .end(function(err, res) {
                        res.status.should.equal(200);
                        res.body.should.be.type('object');
                        res.body._id.should.equal(groupId);
                        res.body.name.should.equal('Developers');
                        done();
                    });
            });
    });

    it('should get a group with filters', function(done) {
        // add a group
        request(app).post('/group')
            .type('form')
            .send({
                name: 'Developers'
            })
            .end(function(err, res) {
                var groupId = res.body._id;
                // get the group
                request(app).get('/group/' + groupId + '?select=_id')
                    .end(function(err, res) {
                        res.status.should.equal(200);
                        res.body.should.be.type('object');
                        res.body._id.should.equal(groupId);
                        should.not.exist(res.body.name);
                        done();
                    });
            });
    });

    it('should update a group', function(done) {
        // add a group
        request(app).post('/group')
            .type('form')
            .send({
                name: 'Developers'
            })
            .end(function(err, res) {
                var groupId = res.body._id;
                // update a group
                request(app).put('/group/' + groupId)
                    .type('form')
                    .send({
                        name: 'Users'
                    })
                    .end(function(err, res) {
                        res.status.should.equal(200);
                        res.body.should.be.type('object');
                        res.body._id.should.equal(groupId);
                        res.body.name.should.equal('Users');
                        // get the group
                        request(app).get('/group/' + groupId)
                            .end(function(err, res) {
                                res.status.should.equal(200);
                                res.body.should.be.type('object');
                                res.body._id.should.equal(groupId);
                                res.body.name.should.equal('Users');
                                done();
                            });
                    });
            });
    });

    it('should delete a group', function(done) {
        // add a group
        request(app).post('/group')
            .type('form')
            .send({
                name: 'Developers'
            })
            .end(function(err, res) {
                var groupId = res.body._id;
                // delete a group
                request(app).del('/group/' + groupId)
                    .end(function(err, res) {
                        res.status.should.equal(200);
                        res.body.should.be.type('object');
                        res.body._id.should.equal(groupId);
                        res.body.name.should.equal('Developers');
                        // get the group
                        request(app).get('/group/' + groupId)
                            .end(function(err, res) {
                                res.status.should.equal(200);
                                res.text.should.equal('null');
                                should.not.exist(res.body._id);
                                should.not.exist(res.body.name);
                                done();
                            });
                    });
            });
    });

    it('should get a list of groups', function(done) {
        // add a group 1
        request(app).post('/group')
            .type('form')
            .send({
                name: 'Developers'
            })
            .end(function(err, res) {
                // add a group 2
                request(app).post('/group')
                    .type('form')
                    .send({
                        name: 'Users'
                    })
                    .end(function(err, res) {
                        // get a list of groups
                        request(app).get('/group')
                            .end(function(err, res) {
                                res.status.should.equal(200);
                                res.body.length.should.equal(2);
                                // group 1
                                res.body[0].name.should.equal('Developers');
                                // group 2
                                res.body[1].name.should.equal('Users');
                                done();
                            });
                    });
            });
    });

    it('should get a list of groups with filters', function(done) {
        // add a group 1
        request(app).post('/group')
            .type('form')
            .send({
                name: 'Developers'
            })
            .end(function(err, res) {
                // add a group 2
                request(app).post('/group')
                    .type('form')
                    .send({
                        name: 'Users'
                    })
                    .end(function(err, res) {
                        // add a group 3
                        request(app).post('/group')
                            .type('form')
                            .send({
                                name: 'Hosts'
                            })
                            .end(function(err, res) {
                                // get a list of groups with filters
                                request(app).get('/group?select=-_id,name&sort=name&limit=2&skip=1')
                                    .end(function(err, res) {
                                        res.status.should.equal(200);
                                        // filtered groups
                                        res.body.length.should.equal(2);
                                        res.body[0].name.should.equal('Hosts');
                                        should.not.exist(res.body[0]._id);
                                        res.body[1].name.should.equal('Users');
                                        should.not.exist(res.body[1]._id);
                                        done();
                                    });
                            });
                    });
            });
    });

    it('should check a valid JSON filter in queries', function(done) {
        request(app).get('/group?select=name&where={something:{$lt:99}}')
            .end(function(err, res) {
                res.status.should.equal(400);
                done();
            });
    });

    it('should assign a user to a group', function(done) {
        // add a group
        request(app).post('/group')
            .type('form')
            .send({
                name: 'Developers'
            })
            .end(function(err, res) {
                var groupId = res.body._id;
                // add a user
                request(app).post('/user')
                    .type('form')
                    .send({
                        name: 'Martin',
                        age: 27
                    })
                    .end(function(err, res) {
                        var userId = res.body._id;
                        // assign the user to the group
                        request(app).post('/group/' + groupId + '/user/' + userId)
                            .end(function(err, res) {
                                res.status.should.equal(200);
                                res.body.should.be.type('object');
                                res.body._id.should.equal(groupId);
                                res.body.users.length.should.equal(1);
                                res.body.users[0].should.equal(userId);
                                // get the group
                                request(app).get('/group/' + groupId)
                                    .end(function(err, res) {
                                        res.body.should.be.type('object');
                                        res.body._id.should.equal(groupId);
                                        res.body.users.length.should.equal(1);
                                        res.body.users[0].should.equal(userId);
                                        // get the user
                                        request(app).get('/user/' + userId)
                                            .end(function(err, res) {
                                                res.status.should.equal(200);
                                                res.body.should.be.type('object');
                                                res.body._id.should.equal(userId);
                                                res.body.groups.length.should.equal(1);
                                                res.body.groups[0].should.equal(groupId);
                                                done();
                                            });
                                    });
                            });
                    });
            });
    });

    it('should unassign a user from a group', function(done) {
        // add a group
        request(app).post('/group')
            .type('form')
            .send({
                name: 'Developers'
            })
            .end(function(err, res) {
                var groupId = res.body._id;
                // add a user
                request(app).post('/user')
                    .type('form')
                    .send({
                        name: 'Martin',
                        age: 27
                    })
                    .end(function(err, res) {
                        var userId = res.body._id;
                        // assign the user to the group
                        request(app).post('/group/' + groupId + '/user/' + userId)
                            .end(function(err, res) {
                                // unassign the user from the group
                                request(app).del('/group/' + groupId + '/user/' + userId)
                                    .end(function(err, res) {
                                        res.status.should.equal(200);
                                        res.body.should.be.type('object');
                                        res.body._id.should.equal(groupId);
                                        res.body.users.length.should.equal(0);
                                        // get the group
                                        request(app).get('/group/' + groupId)
                                            .end(function(err, res) {
                                                res.body.should.be.type('object');
                                                res.body._id.should.equal(groupId);
                                                res.body.users.length.should.equal(0);
                                                // get the user
                                                request(app).get('/user/' + userId)
                                                    .end(function(err, res) {
                                                        res.status.should.equal(200);
                                                        res.body.should.be.type('object');
                                                        res.body._id.should.equal(userId);
                                                        res.body.groups.length.should.equal(0);
                                                        done();
                                                    });
                                            });
                                    });
                            });
                    });
            });
    });

});
