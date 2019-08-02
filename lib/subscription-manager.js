// SubscriptionManager
// ==============


// Dependencies
// ------------

var assert = require('assert-plus');

var request = require('./request');


var SubscriptionManager = module.exports = function (options) {
    this.options = options;
    this.requestSigned = request.signed.bind(null, this.options, 'SubscriptionManager');
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

// Get subscription for the given organization(or of the current user if orgId not provided)
//
// optOrgId  - String, optional organization id.
//
// Returns a promise.
SubscriptionManager.prototype.getSubscription = function (optOrgId) {
    var request = {};
    if (optOrgId) {
        assert.string(optOrgId, 'organizationId');
        request.organizationId = optOrgId;
    }

    return this.requestSigned('getSubscription', request, {});
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

SubscriptionManager.prototype.setCustomSubscriptionExpiration = function (orgId, expirationTimestamp) {
    assert.string(orgId);
    assert.number(expirationTimestamp);

    return this.requestSigned('setCustomSubscriptionExpiration', {
        orgId: orgId,
        expirationTimestamp: expirationTimestamp
    }, {});
};

SubscriptionManager.prototype.activateSelfPaidSubscriptionByCode = function (session, selfPayOrgId, code) {
    assert.string(selfPayOrgId);
    assert.string(code);

    return this.request('activateSelfPaidSubscriptionByCode', {
        selfPaidOrgId: selfPayOrgId,
        code: code
    }, {
        'session_id' : session
    });
}
