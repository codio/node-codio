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
//
// Returns a promise.
ContainerManager.prototype.start = function (container) {
    assert.string(container, 'container');

    var uid = this._getUid();
    var token = crypto.getToken(uid, container, this.options.containerSecretKey);
    var self = this;

    return this.request('start', {
        container: container,
        uid: uid,
        token: token
    }, {})
    .then(function (data) {
        return self.ping(data.message);
    });
};

// Stop backend container
//
// container - String, with the container name for to start.
//
// Returns a promise.
ContainerManager.prototype.stop = function (container) {
    assert.string(container, 'container');

    var uid = this._getUid();
    var token = crypto.getToken(uid, container, this.options.containerSecretKey);
    var self = this;

    return this.request('stop', {
        container: container,
        uid: uid,
        token: token
    }, {})
    .then(function (data) {
        return self.ping(data.message);
    });
};

// Info about give backend container.
//
// container - String, with the container name for to start.
//
// Returns a promise.
ContainerManager.prototype.info = function (container) {
    assert.string(container, 'container');

    var uid = this._getUid();
    var token = crypto.getToken(uid, container, this.options.containerSecretKey);
    var self = this;

    return this.request('info', {
        container: container,
        uid: uid,
        token: token
    }, {})
    .then(function (data) {
        return self.ping(data.message);
    });
};

// Loads container data
//
// user      -
// container -
//
// Returns a promise.
ContainerManager.prototype.myContainerInfo = function (user, project) {

    var params = {
        userName: user,
        projectName: project
    };

    return this.request('getContainerSsh', params, { });
};
