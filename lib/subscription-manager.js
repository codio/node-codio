// SubscriptionManager
// ==============


// Dependencies
// ------------

var assert = require('assert-plus');

var request = require('./request');


var SubscriptionManager = module.exports = function (options) {
    this.options = options;
    this.request = request.bind(null, this.options, 'SubscriptionManager');
};


// Get subscription of the current user and the organizations where the user is a member.
//
// session  - String, the session key.
//
// Returns a promise.
SubscriptionManager.prototype.getSubscriptions = function (session) {
    assert.string(session, 'session_id');

    return this.request('getSubscriptions', {}, {
        'session_id' : session
    });
};

// Get subscription of the current user and the organizations where the user is a member.
//
// customerType - String, required, 'USER' or 'ORGANIZATION'
// session      - String, the session key.
//
// Returns a promise.
SubscriptionManager.prototype.getPlans = function (customerType, session) {
    assert.string(session, 'session_id');

    return this.request('getPlans', {
        customerType: customerType
    }, {
        'session_id' : session
    });
};