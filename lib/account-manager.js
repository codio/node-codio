// AccountManager
// ==============


// Dependencies
// ------------

var assert = require('assert-plus');

var request = require('./request');


var AccountManager = module.exports = function (options) {
    this.options = options;
    this.request = request.bind(null, this.options, 'AccountManager');
};


// Get a the account according to the session key.
//
// session  - String, the session key.
//
// Returns a promise.
AccountManager.prototype.getMyInfo = function (session) {
    assert.string(session, 'session_id');

    return this.request('getMyInfo', {}, {
        'session_id' : session
    });
};

// Get a the account according to the id.
//
// id       - String, the id of the requested user.
// session  - String, the session key.
//
// Returns a promise.
AccountManager.prototype.get = function (id, session) {
    assert.string(id, 'id');
    assert.string(session, 'session_id');

    return this.request('getAccount', {
        id: id
    }, {
        'session_id' : session
    });
};
