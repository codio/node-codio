// AccountManager
// ==============


// Dependencies
// ------------

var assert = require('assert-plus');

var request = require('./request');


var AccountManager = module.exports = function (options) {
    this.options = options;
    this.request = request.bind(null, this.options, 'AccountManager');
    this.signed = request.signed.bind(null, this.options, 'AccountManager');
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


// Get a the accounts according to the ids.
//
// userIds    - List of String, the user ids.
//
// Returns a promise.
AccountManager.prototype.getUsers = function (userIds, includeSubscriptionInfo, includeProjectInfo) {
    assert.arrayOfString(userIds, 'userIds');

    return this.signed('getUsers', {
        userIds: userIds,
        includeSubscriptionInfo: includeSubscriptionInfo !== false,
        includeProjectInfo: includeProjectInfo !== false
    }, {});
};

// Reset user password
//
// account - user id
//
// Returns a promise.
AccountManager.prototype.resetPasswordInternal = function (account) {
    assert.string(account, 'account');

    return this.signed('resetPasswordInternal', {
        account: account
    }, {});
};

// Ensure user is registered
//
// createData - data for create user if not found
//
// Returns a promise.
AccountManager.prototype.ensureLtiUser = function (createData) {
    assert.object(createData, 'createData');

    return this.signed('ensureLtiUser', createData, {});
};

// Register a new user
//
// userData - data for user creation
//
// Returns a promise with an object with the fields 'user_id', 'session_id'.
AccountManager.prototype.register = function (userData) {
    assert.object(userData, 'userData');

    return this.request('register', userData, {});
};

// Check an email in use
//
// email - email for check
//
// Returns a promise with true/false
AccountManager.prototype.isEmailInUse = function (email) {
    assert.string(email, 'email');

    return this.request('isEmailInUse', {email: email}, {});
};

// Remove an account
//
// session - user session
//
// Returns a promise with task
AccountManager.prototype.removeAccount = function (session) {
    return this.request('removeAccount', {}, {'session_id' : session});
};

// Get account access log
//
// Returns a promise.
AccountManager.prototype.getSessionStats = function (ids, period) {
  assert.arrayOfString(ids, 'ids');
  assert.string(period, 'period');
  return this.signed('getSessionStats', {ids: ids, period: period}, {});
};