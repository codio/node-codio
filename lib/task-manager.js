// TaskManager
// ===========


// Dependencies
// ------------

var assert = require('assert-plus');
var VError = require('verror');
var Promise = require('bluebird');

var request = require('./request');


var TaskManager = module.exports = function (options) {
    this.options = options;
    this.request = request.bind(null, this.options, 'TaskManager');
};


// Get the status of the given task by id.
//
// id       - String, id of the task.
//
// Returns a promise.
TaskManager.prototype.getTaskStatus = function (id) {
    assert.string(id, 'id');

    return this.request('getTaskStatus', {id: id}, {});
};

// Ping for the status of a given task.
//
// id       - String, id of the task.
//
// Returns a promise.
TaskManager.prototype.pingTaskStatus = function (id) {
    assert.string(id, 'id');

    var self = this;

    function ping() {
        return self.getTaskStatus(id)
        .then(function (response) {

            switch (response.status) {
            case 'ERROR':
                return Promise.reject(new VError('getTaskStatus returned an error: %s',
                                    response.errorMessage));
            case 'PROCESSING':
                return Promise.delay(100).then(ping);
            case 'COMPLETED':
                return Promise.resolve(response.result);
            default:
                return Promise.reject(new VError('Unkown response status: %s', response.status));
            }
        });
    }

    return ping();
};
