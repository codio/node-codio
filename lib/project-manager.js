// ProjectManager
// ==============


// Dependencies
// ------------

var assert = require('assert-plus');

var request = require('./request');


var ProjectManager = module.exports = function (options) {
    this.options = options;
    this.requestSigned = request.signed.bind(null, this.options, 'ProjectManager');
    this.request = request.bind(null, this.options, 'ProjectManager');
};


// Get a project by name.
//
// name     - String, the project name.
// info     - Object, with additional parameters
//            user    - String, the user name.
//            session - String, the session key.
//
// Returns a promise.
ProjectManager.prototype.getProjectByName = function (name, info) {
    assert.string(name, 'name');
    assert.object(info, 'info');
    assert.string(info.user, 'info.user');

    if (info.session) {
        return this.request('getProjectByName', {
            accountName : info.user,
            projectName: name
        }, {
            'session_id' : info.session
        });
    }

    return this.requestSigned('getProjectByName', {
        accountName : info.user,
        projectName: name
    }, {});
};

// Get a project by id.
//
// name     - String, the project name.
// session  - String, session
//
// Returns a promise.
ProjectManager.prototype.get = function (id, session) {
    assert.string(id, 'id');
    assert.string(session, 'session');

    return this.request('getProject', {
        guid : id
    }, {
        'session_id' : session
    });
};

// Get users project by account(id or username).
//
// account  - String, user id or username.
// session  - String, session
//
// Returns a promise.
ProjectManager.prototype.getProjects = function (account, session) {
    assert.string(account, 'account');
    assert.string(session, 'session');

    return this.request('getProjects', {
        account : account
    }, {
        'session_id' : session
    });
};

// Check if the user has the right permissions.
//
// credentials - Object with user credentials
//               project - Object
//                 name  - Name of the project.
//                 owner - Name of the owner of the project.
//               session - Session ID.
//
// Returns a promise.
ProjectManager.prototype.getPermissionForProject = function (credentials) {
    assert.object(credentials, 'credentials');
    assert.object(credentials.project, 'credentials.project');
    assert.string(credentials.session, 'credentials.session');
    assert.string(credentials.project.name, 'credentials.project.name');
    assert.string(credentials.project.owner, 'credentials.project.owner');

    return this.request('getPermissionForProject', {
        accountName: credentials.project.owner,
        projectName: credentials.project.name
    }, {
        session_id: credentials.session
    });
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
//
// Returns a promise.
ProjectManager.prototype.updateProject = function (project, credentials) {
    assert.object(project, 'project');
    assert.object(credentials, 'credentials');
    assert.string(credentials.owner, 'credentials.owner');
    assert.string(credentials.session, 'credentials.session');

    return this.request('updateProject', {
        account: credentials.owner,
        project: project
    }, {
        session_id: credentials.session
    });
};

// Get a project by name.
//
// id      - String, the project guid.
// session - String
//
// Returns a promise.
ProjectManager.prototype.remove = function (id, session) {
    assert.string(id, 'id');

    if (session) {
        return this.request('removeProject', {
            guid: id
        }, {
            'session_id': session
        });
    }

    return this.requestSigned('removeProject', {
        guid: id
    }, {});
};

// Get list of active always on boxes projects
//
// fs      - String, the project fileserver
//
// Returns a promise.
ProjectManager.prototype.alwaysOnBoxesList = function (fs) {
    assert.string(fs, 'fs');

    return this.requestSigned('alwaysOnBoxesList', {
        fs: fs
    }, {});
};

// Get list of projects by guids
//
// guids    - array of project ids
// session  - String
//
// Returns a promise.
ProjectManager.prototype.getProjectsList = function (guids, session) {
    assert.arrayOfString(guids, 'guids');

    return this.request('getProjectsList', {
        guids: guids
    }, {
        'session_id': session
    });
};
