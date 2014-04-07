// TaskManager
// ===========


// Dependencies
// ------------

var assert = require('assert-plus');
var VError = require('verror');

var request = require('./request');


var TaskManager = module.exports = function (options) {
    this.options = options;
    this.request = request.bind(null, this.options, 'TaskManager');
};


// Get the status of the given task by id.
//
// id       - String, id of the task.
// callback - Function, node style callback.
TaskManager.prototype.getTaskStatus = function (id, callback) {
    assert.string(id, 'id');
    assert.func(callback, 'callback');

    this.request('getTaskStatus', {id: id}, {}, callback);
};

// Ping for the status of a given task.
//
// id       - String, id of the task.
// callback - Function, node style callback.
TaskManager.prototype.pingTaskStatus = function (id, callback) {
    assert.string(id, 'id');
    assert.func(callback, 'callback');

    var ping = this.getTaskStatus.bind(this, id, function (error, response) {
        clearTimeout(pingTimeout);
        if (error) {
            return callback(new VError(error, 'getTaskStatus failed for: %s', id));
        }
        switch (response.status) {
        case 'ERROR':
            callback(new VError('getTaskStatus returned an error: %s',
                                response.errorMessage));
            break;
        case 'PROCESSING':
            pingTimeout = setTimeout(ping, 100);
            break;
        case 'COMPLETED':
            callback(null, response.result);
            break;
        default:
            callback(new VError('Unkown response status: %s', response.status));
            break;
        }
    });
    var pingTimeout;

    ping();
};
