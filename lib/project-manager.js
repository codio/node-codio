// ProjectManager
// ==============


// Dependencies
// ------------

var assert = require('assert-plus');

var request = require('./request');
var crypto = require('./crypto');


var ProjectManager = module.exports = function (options) {
    this.options = options;
    this.request = request.bind(null, this.options, 'ProjectManager');
};


// Get a project by name.
//
// name     - String, the project name.
// info     - Object, with additional parameters
//            user    - String, the user name.
//            session - String, the session key.
// callback - A callback function.
ProjectManager.prototype.getProjectByName = function (name, info, callback) {
    assert.string(name, 'name');
    assert.object(info, 'info');
    assert.string(info.user, 'info.user');
    assert.string(info.session, 'info.session');
    assert.func(callback, 'callback');

    this.request('getProjectByName', {
        accountName : info.user,
        projectName: name
    }, {
        'session_id' : info.session
    }, callback);
};

// Get a project by name without session.
//
// name     - String, the project name.
// info     - Object, with additional parameters
//            user    - String, the user name.
// callback - A callback function.
ProjectManager.prototype.getProjectForListener = function (name, info, callback) {
    assert.string(name, 'name');
    assert.object(info, 'info');
    assert.string(info.user, 'info.user');
    assert.func(callback, 'callback');

    var token = crypto.getToken(info.user, name, this.options.containerSecretKey);
    this.request('getProjectForShare', {
        accountName : info.user,
        projectName: name,
        token: token
    }, {
        'session_id' : info.session
    }, callback);
};


// Check if the user has the right permissions.
//
// info     - Object with user credentials
//            user    - Name of the user.
//            session - Session ID.
// callback - Function, to call with the result of the request.
ProjectManager.prototype.checkPermissionForUser = function (info, callback) {
    assert.object(info, 'info');
    assert.string(info.user, 'info.user');
    assert.string(info.session, 'info.session');
    assert.func(callback, 'callback');

    this.request('checkPermissionForUser', {
        userName: info.user
    }, {
        session_id: info.session
    }, callback);
};


// Check if the user has the right permissions.
//
// credentials - Object with user credentials
//               project - Object
//                 name  - Name of the project.
//                 owner - Name of the owner of the project.
//               session - Session ID.
// callback    - Function to call with the result.
ProjectManager.prototype.checkPermissionForProject = function (credentials, callback) {
    assert.object(credentials, 'credentials');
    assert.object(credentials.project, 'credentials.project');
    assert.string(credentials.session, 'credentials.session');
    assert.string(credentials.project.name, 'credentials.project.name');
    assert.string(credentials.project.owner, 'credentials.project.owner');
    assert.func(callback, 'callback');

    this.request('checkPermissionForProject', {
        userName: credentials.project.owner,
        projectName: credentials.project.name
    }, {
        session_id: credentials.session
    }, callback);
};

// Check if the user has the right permissions.
//
// project     - Object with the new project details.
//               guid        - String, project guid
//               name        - String, project name
//               description - String, project description
//               is_public   - Boolean, public state
//               permissions - Object, project permission
// credentials - Object with user credentials
//               owner - Name of the owner of the owner.
//               session - Session ID.
// callback    - Function to call with the result.
ProjectManager.prototype.updateProject = function (project, credentials, callback) {
    assert.object(project, 'project');
    assert.object(credentials, 'credentials');
    assert.string(credentials.owner, 'credentials.owner');
    assert.string(credentials.session, 'credentials.session');
    assert.func(callback, 'callback');

    this.request('updateProject', {
        account: credentials.owner,
        project: project
    }, {
        session_id: credentials.session
    }, callback);
};

// Get a project by name.
//
// name     - String, the project name.
// info     - Object, with additional parameters
//            user    - String, the user name.
//            session - String, the session key.
// callback - A callback function.
ProjectManager.prototype.getFreePrivateProjects = function (session, callback) {
    assert.string(session, 'session');
    assert.func(callback, 'callback');

    this.request('getFreePrivateProjects', {}, {
        'session_id' : session
    }, callback);
};
