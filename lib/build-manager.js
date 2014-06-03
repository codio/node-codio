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
// id       - String, id of the task.
// callback - Function, node style callback.
BuildManager.prototype.exportZip = function (id, callback) {

    assert.string(id, 'id');
    assert.func(callback, 'callback');

    var self = this;
    this.request('build', {guid: id}, {}, function (error, data) {
        if (error) {
            return callback(error);
        }

        self.ping(data.message, callback);
    });
};
