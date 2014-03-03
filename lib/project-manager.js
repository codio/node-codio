// ProjectManager
// =============


var request = require('./request');
var crypto = require('crypto');


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
//            session - String, the session key.
// callback - A callback function.
ProjectManager.prototype.getProjectForListener = function (name, info, callback) {
    var shasum = crypto.createHash('sha1');
    var token = shasum.update(info.user + this.options.containerSecretKey + name).digest('hex');
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
// credentials - Object with user credentials
//               user    - Name of the user.
//               session - Session ID.
// callback - Function, to call with the result of the request.
ProjectManager.prototype.checkPermissionForUser = function (credentials, callback) {
    this.request('checkPermissionForUser', {
        userName: credentials.user
    }, {
        session_id: credentials.session
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
    this.request('checkPermissionForProject', {
        userName: credentials.project.owner,
        projectName: credentials.project.name,
    }, {
        session_id: credentials.session
    }, callback);
};

// Check if the user has the right permissions.
//
// project     - Object with the new project details.
//               guid        - project guid
//               name        - project name
//               description - project description
//               is_public   - public state
//               permissions - project permission
// credentials - Object with user credentials
//               owner - Name of the owner of the owner.
//               session - Session ID.
// callback    - Function to call with the result.
ProjectManager.prototype.updateProject = function (project, credentials, callback) {
    this.request('updateProject', {
        account: credentials.owner,
        project: project,
    }, {
        session_id: credentials.session
    }, callback);
};

