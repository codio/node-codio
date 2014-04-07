// ContainerManager
// ================


var assert = require('assert-plus');

var request = require('./request');
var TaskManager = require('./task-manager');
var crypto = require('./crypto');

var ContainerManager = module.exports = function (options, uidGenerator) {
    this.uidGenerator = uidGenerator;
    this.options = options;
    this.request = request.bind(null, this.options, 'ContainerManager');
    var taskManager = new TaskManager(this.options);
    this.ping = taskManager.pingTaskStatus.bind(taskManager);
};


// Generate a uid for a request.
ContainerManager.prototype._getUid = function () {
    if (typeof this.uidGenerator === 'function') {
        return this.uidGenerator();
    }
    return (new Date()).getMilliseconds() + '';
};

// Start backend container
//
// container - String, with the container name for to start.
// callback  - Function, node style callback.
ContainerManager.prototype.start = function (container, callback) {
    assert.string(container, 'container');
    assert.func(callback, 'callback');

    var uid = this._getUid();
    var token = crypto.getToken(uid, container, this.options.containerSecretKey);
    var self = this;
    this.request('start', {
        container: container,
        uid: uid,
        token: token
    }, {
    }, function (error, data) {
        if (error) {
            return callback(error);
        }
        self.ping(data.message, callback);
    });
};

// Stop backend container
//
// container - String, with the container name for to start.
// callback  - Function, node style callback.
ContainerManager.prototype.stop = function (container, callback) {
    assert.string(container, 'container');
    assert.func(callback, 'callback');

    var uid = this._getUid();
    var token = crypto.getToken(uid, container, this.options.containerSecretKey);
    var self = this;
    this.request('stop', {
        container: container,
        uid: uid,
        token: token
    }, {
    }, function (error, data) {
        if (error) {
            return callback(error);
        }
        self.ping(data.message, callback);
    });
};

// Info about give backend container.
//
// container - String, with the container name for to start.
// callback  - Function, node style callback.
ContainerManager.prototype.info = function (container, callback) {
    assert.string(container, 'container');
    assert.func(callback, 'callback');

    var uid = this._getUid();
    var token = crypto.getToken(uid, container, this.options.containerSecretKey);
    var self = this;
    this.request('info', {
        container: container,
        uid: uid,
        token: token
    }, {
    }, function (error, data) {
        if (error) {
            return callback(error);
        }
        self.ping(data.message, callback);
    });
};

// Loads container data
ContainerManager.prototype.myContainerInfo = function (user, project, callback) {
    var params = {
        userName: user,
        projectName: project,
    };
    this.request('getContainerSsh', params, { }, callback);

};
