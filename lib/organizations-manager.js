// OrganizationsManager
// ====================


// Dependencies
// ------------

var assert = require('assert-plus');

var request = require('./request');


var OrganizationsManager = module.exports = function (options) {
    this.options = options;
    this.request = request.bind(null, this.options, 'OrganizationsManager');
};


// Get a the organizations according to the given Id
//
// id       - String, id of the organization.
// session  - String, the session key.
// callback - A callback function.
OrganizationsManager.prototype.getById = function (id, session, callback) {

    assert.string(id, 'id');
    assert.string(session, 'session_id');
    assert.func(callback, 'callback');

    this.request('get', {
        id: id
    }, {
        'session_id' : session
    }, callback);
};

// Get a the organizations according to the given name
//
// name     - String, name of the organization.
// session  - String, the session key.
// callback - A callback function.
OrganizationsManager.prototype.getByName = function (name, session, callback) {

    assert.string(name, 'name');
    assert.string(session, 'session_id');
    assert.func(callback, 'callback');

    this.request('get', {
        name: name
    }, {
        'session_id' : session
    }, callback);
};

// Create a new team.
//
// name     - String, name of the team to create.
// info     - Object,
//            org         - String, id of the organization.
//            description - String, description (optional).
//            members     - Array, list of members (optional).
//            session     - String, session id.
// callback - A callback function.
OrganizationsManager.prototype.createTeam = function (name, info, callback) {

    assert.string(name, 'name');
    assert.object(info, 'info');
    assert.string(info.org, 'organization');
    assert.optionalString(info.description, 'description');
    assert.optionalArrayOfString(info.members, 'members');
    assert.string(info.session, 'session id');
    assert.func(callback, 'callback');

    this.request('createTeam', {
        name: name,
        orgId: info.org,
        description: info.description,
        memberIds: info.members
    }, {
        'session_id' : info.session
    }, callback);
};

// Get a the organizations of the current user.
//
// session  - String, the session key.
// callback - A callback function.
OrganizationsManager.prototype.getMyOrganizations = function (session, callback) {

    assert.string(session, 'session_id');
    assert.func(callback, 'callback');

    this.request('getMyOrganizations', {}, {
        'session_id' : session
    }, callback);
};
