// BuildManager
// ===========


// Dependencies
// ------------

var assert = require('assert-plus');

var request = require('./request');
var TaskManager = require('./task-manager');


var BuildManager = module.exports = function (options) {
    this.options = options;
    this.request = request.bind(null, this.options, 'BuildManager');
    this.signed = request.signed.bind(null, this.options, 'BuildManager');
    var taskManager = new TaskManager(this.options);
    this.ping = taskManager.pingTaskStatus.bind(taskManager);
};


// Export a project as a zip file.
//
// id       - String, id of project.
// session  - String, session.
//
// Returns a promise.
BuildManager.prototype.exportZip = function (id, session) {

    assert.string(id, 'id');
    assert.string(session, 'session');

    var self = this;

    return this.request('build', {guid: id}, {
        'session_id': session
    })
    .then(function (data) {
        return self.ping(data.message);
    });
};

// Export a git or hg repo as a zip file.
//
// type     - String, repo type (hg or git).
// repo     - String, repo path (http/https/ssh)
// userId   - String, for which user
// session  - String, session.
//
// Returns a promise.
BuildManager.prototype.zipRepository = function (type, repo, userId, session) {

    assert.string(type, 'type');
    assert.string(session, 'session');
    assert.string(repo, 'repo');
    assert.string(userId, 'userId');

    var self = this;

    return this.signed('zipRepository', {
        repoType: type,
        repo: repo,
        userId: userId
    }, {
        'session_id': session
    })
        .then(function (data) {
            return self.ping(data.message);
        });
};