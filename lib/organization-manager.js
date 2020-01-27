// OrganizationManager
// ====================


// Dependencies
// ------------

var assert = require('assert-plus');
var request = require('./request');


var OrganizationManager = module.exports = function (options) {
    this.options = options;
    this.request = request.bind(null, this.options, 'OrganizationManager');
    this.signed = request.signed.bind(null, this.options, 'OrganizationManager');
};


// Get a the organizations according to the given Id
//
// id       - String, id of the organization.
// session  - String, the session key.
//
// Returns a promise.
OrganizationManager.prototype.getById = function (id, session) {

    assert.string(id, 'id');
    assert.string(session, 'session_id');

    return this.request('getOrganization', {
        id: id
    }, {
        'session_id' : session
    });
};

// Get a the organizations according to the given name
//
// name     - String, name of the organization.
// session  - String, the session key.
//
// Returns a promise.
OrganizationManager.prototype.getByName = function (name, session) {

    assert.string(name, 'name');
    assert.string(session, 'session_id');

    return this.request('getOrganization', {
        name: name
    }, {
        'session_id' : session
    });
};

// Create a new team.
//
// name     - String, name of the team to create.
// info     - Object,
//            org         - String, id of the organization.
//            description - String, description (optional).
//            members     - Array, list of members (optional).
//            session     - String, session id.
//
// Returns a promise.
OrganizationManager.prototype.createTeam = function (name, info) {

    assert.string(name, 'name');
    assert.object(info, 'info');
    assert.string(info.org, 'organization');
    assert.optionalString(info.description, 'description');
    assert.optionalArrayOfString(info.members, 'members');
    assert.optionalObject(info.data, 'data');
    assert.string(info.session, 'session id');


    return this.signed('createTeam', {
        name: name,
        orgId: info.org,
        description: info.description,
        memberIds: info.members,
        customData: info.data
    }, {
        'session_id' : info.session
    });
};

// Remove a team.
//
// orgId   - String, id of the organization.
// teamId  - String, id of the team.
// session - String, session id.
// removeLastUsers - Boolean, flag to delete last users in educational org.
//
// Returns a promise.
OrganizationManager.prototype.removeTeam = function (organization, id, session, removeLastUsers) {

    assert.string(organization, 'organization');
    assert.string(id, 'id');
    assert.string(session, 'session_id');
    assert.optionalBool(removeLastUsers, 'remove_last_users');


    return this.signed('removeTeam', {
        orgId: organization,
        teamId: id,
        removeLastUsers: removeLastUsers
    }, {
        'session_id' : session
    });
};

// Get a team by name.
//
// organization - String, organization id.
// name         - String, name of the team.
// session      - String, the session key.
//
// Returns a promise.
OrganizationManager.prototype.getTeamByName = function (organization, name, session) {

    assert.string(organization, 'organization');
    assert.string(name, 'name');
    assert.string(session, 'session_id');


    return this.request('getTeam', {
        orgId: organization,
        teamName: name
    }, {
        'session_id' : session
    });
};

// Get the organizations of the current user.
//
// session  - String, the session key.
//
// Returns a promise.
OrganizationManager.prototype.getMyOrganizations = function (session) {

    assert.string(session, 'session_id');

    return this.request('getMyOrganizations', {}, {
        'session_id' : session
    });
};

// Add members to the given team.
//
// data     - Object,
// session  - String, the session key.
//
// Returns a promise.
OrganizationManager.prototype.addMembers = function (data, session) {

    assert.string(data.orgId, 'organization');
    assert.string(data.teamId, 'team');
    data.memberIds && assert.arrayOfString(data.memberIds, 'memberIds');
    data.memberNames && assert.arrayOfString(data.memberNames, 'memberNames');
    session && assert.string(session, 'session_id');

    return this.signed('addMembers', data, {
        'session_id' : session
    });
};

// Add members to the given team.
//
// data     - Object,
// session  - String, the session key.
//
// Returns a promise.
OrganizationManager.prototype.removeMembers = function (data, session) {

    assert.string(data.orgId, 'organization');
    assert.string(data.teamId, 'team');
    data.memberIds && assert.arrayOfString(data.memberIds, 'memberIds');
    data.memberNames && assert.arrayOfString(data.memberNames, 'memberNames');
    session && assert.string(session, 'session_id');

    return this.signed('removeMembers', data, {
        'session_id' : session
    });
};

// Check if the current user is the member of the given teams.
//
// organization - String, organization id.
// teams        - Array, list of team ids.
// session      - String, the session key.
//
// Returns a promise.
OrganizationManager.prototype.isMemberOf = function (organization, teams, session) {

    assert.string(organization, 'organization');
    teams && assert.arrayOfString(teams, 'teams');
    assert.string(session, 'session_id');

    return this.request('isMemberOf', {
        organization: organization,
        team: teams
    }, {
        'session_id' : session
    });
};

// Get the organizations of the user.
//
// userId - String, user id.
// options    - Object, options (booleans: withTeam, withMembers, withTeamMembers)
//
// Returns a promise.
OrganizationManager.prototype.getUserOrganizations = function (userId, options) {

    assert.string(userId, 'userId');
    assert.object(options, 'options');

    var data = options;
    data.userId = userId;

    return this.signed('getUserOrganizations', data, {});
};

// Get the members of a team.
//
// orgId   - String, organization id.
// teamId  - String, team id.
// session - String, the session key.
//
// Returns a promise.
OrganizationManager.prototype.getMembers = function (orgId, teamId, session) {

    assert.string(orgId, 'org id');
    assert.string(teamId, 'team id');
    assert.string(session, 'session_id');

    return this.signed('getMembers', {
        orgId: orgId,
        teamId: teamId
    }, {
        'session_id': session
    });
};


// Get the organizations according with ids
//
// orgIds  - List of String, organization ids.
//
// Returns a promise.
OrganizationManager.prototype.getOrganizationsInternal = function (orgIds) {

    assert.arrayOfString(orgIds, 'orgIds');

    return this.signed('getOrganizationsInternal', {
        ids: orgIds
    }, {});
};

// Get the organization according with ids
//
// id       - String, id of the organization.
// session  - String, the session key.
//
// Returns a promise.
OrganizationManager.prototype.getOrganizationInternal = function (id) {

    assert.string(id, 'id');

    return this.signed('getOrganizationInternal', {
        id: id
    }, {});
};

OrganizationManager.prototype.sendInvitation = function (orgId, email, isOwner, session, useSigned) {

    assert.string(orgId, 'org id');
    assert.string(email, 'email');
    assert.bool(isOwner, 'isOwner');
    assert.string(session, 'session_id');

    var request = useSigned ? this.signed : this.request;

    return request('sendInvitation', {
        organizationId: orgId,
        email: email,
        isOwner: isOwner
    }, {
        'session_id': session
    });
};

OrganizationManager.prototype.resendInvitation = function (orgId, invitation, session, useSigned) {

    assert.string(orgId, 'org id');
    assert.string(invitation, 'invitation');
    assert.string(session, 'session_id');

    var request = useSigned ? this.signed : this.request;

    return request('resendInvitation', {
        organization: orgId,
        invite: invitation
    }, {
        'session_id': session
    });
};

OrganizationManager.prototype.revokeInvitation = function (orgId, invitation, session, useSigned) {

    assert.string(orgId, 'org id');
    assert.string(invitation, 'invitation');
    assert.string(session, 'session_id');

    var request = useSigned ? this.signed : this.request;

    return request('revokeInvitation', {
        organization: orgId,
        invite: invitation
    }, {
        'session_id': session
    });
};

OrganizationManager.prototype.getInvites = function (orgId, session, useSigned) {

    assert.string(orgId, 'org id');
    assert.string(session, 'session_id');

    var request = useSigned ? this.signed : this.request;

    return request('getInvites', {
        organization: orgId
    }, {
        'session_id': session
    });
};

OrganizationManager.prototype.addSelfByInvitation = function (invitation, session) {

  assert.string(invitation, 'invitation');

  return this.request('addSelfByInvitation', {
    invitation: invitation
  }, {
    'session_id': session
  });
};

OrganizationManager.prototype.create = function (orgData, sessionId) {
    sessionId && assert.string(sessionId, 'sessionId');
    assert.object(orgData, 'org data');

    if (sessionId) {
        return this.request('create', orgData, {
            'session_id': sessionId
        });
    } else {
        return this.signed('create', orgData, {});
    }
};


// Check an org name in use
//
// name - name for check
//
// Returns a promise with true/false
OrganizationManager.prototype.isOrganizationNameTaken = function (name) {
  assert.string(name, 'name');

  return this.request('isOrganizationNameTaken', {
    name: name
  }, {});
};


// Remove an organization
//
// id - organizationId
//
// Returns a promise with true/false
OrganizationManager.prototype.remove = function (id, sessionId) {
  assert.string(id, 'id');
  assert.string(sessionId, 'sessionId');

  return this.request('remove', {
    id: id
  }, {'session_id': sessionId});
};

OrganizationManager.prototype.memberOneOfGroup = function (organization, teamIds, memberId) {
    assert.string(organization, 'organization');
    assert.arrayOfString(teamIds, 'memberIds');
    assert.string(memberId, 'organization');

    return this.signed('memberOneOfGroup', {
        organization: organization,
        teamIds: teamIds,
        userId: userId
    });
};
