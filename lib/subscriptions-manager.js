// SubscriptionsManager
// ==============


// Dependencies
// ------------

var assert = require('assert-plus');

var request = require('./request');


var SubscriptionsManager = module.exports = function (options) {
    this.options = options;
    this.request = request.bind(null, this.options, 'SubscriptionsManager');
};


// Get subscription of the current user and the organizations where the user is a member.
//
// session  - String, the session key.
//
// Returns a promise.
SubscriptionsManager.prototype.getSubscriptions = function (session) {
    assert.string(session, 'session_id');

    return this.request('getSubscriptions', {}, {
        'session_id' : session
    });
};