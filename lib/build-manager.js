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
// callback - Function, node style callback.
BuildManager.prototype.exportZip = function (id, session, callback) {

    assert.string(id, 'id');
    assert.string(session, 'session');
    assert.func(callback, 'callback');

    var self = this;
    this.request('build', {guid: id}, {
        'session_id': session
    }, function (error, data) {
        if (error) {
            return callback(error);
        }

        self.ping(data.message, callback);
    });
};
