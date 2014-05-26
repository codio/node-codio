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
// callback - A callback function.
AccountManager.prototype.getMyInfo = function (session, callback) {
    assert.string(session, 'session_id');
    assert.func(callback, 'callback');

    this.request('getMyInfo', {}, {
        'session_id' : session
    }, callback);
};
