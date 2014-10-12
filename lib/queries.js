'use strict';

module.exports = Queries;

function Queries(query) {
    this.query = query;
}

Queries.prototype.valid = function(type, cb) {
    switch (type) {
        case 'where':
            if (this.query.where) {
                try {
                    JSON.parse(this.query.where);
                    cb();
                } catch(err) {
                    cb(new Error('It\'s not valid JSON at WHERE query.'));
                }
            } else {
                cb();
            }
            break;
        default:
            cb();
    }
};

Queries.prototype.where = function() {
    var where = {};
    if (this.query.where) {
        where = JSON.parse(this.query.where);
    }
    return where;
};

Queries.prototype.select = function() {
    var select = '';
    if (this.query.select) {
        select = this.query.select.replace(/,/g, ' ');
    }
    return select;
};

Queries.prototype.sort = function() {
    var sort = '';
    if (this.query.sort) {
        sort = this.query.sort.replace(/,/g, ' ');
    }
    return sort;
};

Queries.prototype.limit = function() {
    var limit;
    if (this.query.limit && !isNaN(this.query.limit)) {
        limit = this.query.limit;
    }
    return limit;
};

Queries.prototype.skip = function() {
    var skip;
    if (this.query.skip && !isNaN(this.query.skip)) {
        skip = this.query.skip;
    }
    return skip;
};
