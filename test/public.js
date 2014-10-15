'use strict';

var app         = require('../app'),
    request     = require('supertest'),
    should      = require('should');

describe('public', function() {

    it('should get a public file', function(done) {
        request(app).get('/image.gif')
            .end(function(err, res) {
                res.status.should.equal(200);
                res.type.should.equal('image/gif');
                done();
            });
    });

});
