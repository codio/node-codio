// ContainerManager
// ================


var assert = require('assert-plus');

var request = require('./request');
var TaskManager = require('./task-manager');

var ContainerManager = module.exports = function (options, uidGenerator) {
    this.uidGenerator = uidGenerator;
    this.options = options;
    this.requestSigned = request.signed.bind(null, this.options, 'ContainerManager');
    this.request = request.bind(null, this.options, 'ContainerManager');
    var taskManager = new TaskManager(this.options);
    this.ping = taskManager.pingTaskStatus.bind(taskManager);
};

// Run command in container
//
// options - object {
//   container: container name
//   or
//   projectId: project guid
//   run {
//     cmd: "command name",
//     args: ["array with arguments"]
//   }
// }
//
// Returns a promise.
ContainerManager.prototype.run = function (options, session, waitTask) {
    assert.object(options, 'options');
    assert.string(session, 'session');
    assert.object(options.run, 'options.run');
    assert.string(options.run.cmd, 'options.run.cmd');

    var self = this;
    return this.request('run', options, {
        session_id: session
    })
    .then(function (data) {
        if (waitTask) {
            return self.ping(data.message);
        } else {
            return data.message;
        }
    });
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

    var self = this;

    return this.requestSigned('start', {
        container: container
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

    var self = this;

    return this.requestSigned('stop', {
        container: container
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

    var self = this;

    return this.requestSigned('info', {
        container: container
    }, {})
    .then(function (data) {
        return self.ping(data.message);
    });
};

// Get container information for pier
//
// container - String, with the container name for fetch
//
// Returns a promise.
ContainerManager.prototype.getPierContainerInfo = function (container, callback) {
    assert.string(container, 'container');

    return this.requestSigned('getPierContainerInfo', {
        container: container
    }, {});
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

    return this.request('getContainerSsh', params, {});
};
