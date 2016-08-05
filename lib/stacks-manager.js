// StacksManager
// ====================


// Dependencies
// ------------

var assert = require('assert-plus');
var request = require('./request');


var StacksManager = module.exports = function (options) {
    this.options = options;
    this.request = request.bind(null, this.options, 'StacksManager');
    this.signed = request.signed.bind(null, this.options, 'StacksManager');
};

// Get the stacks according to the given Id
//
// ids      - Array of string, ids of stacks.
// session  - String, the session key.
//
// Returns a promise.

StacksManager.prototype.getStacksByIdInternal = function (ids, session) {
    assert.arrayOfString(ids, 'ids');
    assert.string(session, 'session_id');

    return this.signed('getStacksByIdInternal', {
        'ids': ids
    }, {
        'session_id': session
    });
};

// Get the stacks according to the given versionIds
//
// ids      - Array of string, version ids of stacks.
// session  - String, the session key.
//
// Returns a promise.

StacksManager.prototype.getStacksByVersionIdInternal = function (ids, session) {
    assert.arrayOfString(ids, 'ids');
    assert.string(session, 'session_id');

    return this.signed('getStacksByVersionIdInternal', {
        'ids': ids
    }, {
        'session_id': session
    });
};
