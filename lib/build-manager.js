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
