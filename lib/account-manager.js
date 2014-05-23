// AccountManager
// ==============


// Dependencies
// ------------

var assert = require('assert-plus');

var request = require('./request');


var ProjectManager = module.exports = function (options) {
    this.options = options;
    this.request = request.bind(null, this.options, 'AccountManager');
};


// Get a the account according to the session key.
//
// session  - String, the session key.
// callback - A callback function.
ProjectManager.prototype.getMyInfo = function (session, callback) {
    assert.string(session, 'session_id');
    assert.func(callback, 'callback');

    this.request('getMyInfo', {}, {
        'session_id' : session
    }, callback);
};
