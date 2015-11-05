// SSHManager
// ==========

// Dependencies
// ------------

var req = require('./request');
var TaskManager = require('./task-manager');


var SshManager = module.exports = function (options, uidGenerator) {
    this.uidGenerator = uidGenerator;
    this.options = options;
    this.requestSigned = req.signed.bind(null, this.options, 'SshPtyManager');

    var taskManager = new TaskManager(this.options);
    this.ping = taskManager.pingTaskStatus.bind(taskManager);
};

// Verify a server
//
// session  - String
// uid      - String
//
// Returns a promise.
SshManager.prototype.verifyServer = function (session, uid) {
    var data = {};
    if (uid) {
        data.uid = uid;
    }

    return this.requestSigned('verifyServer', data, {
        'session_id' : session
    });
};

// Get ssh connection details of a given user.
//
// userName  - String
// container -
// sessionId - user session if needed
//
// Returns a promise.
SshManager.prototype.getSshConnectDetails = function (userName, container, sessionId) {
    var self = this;
    var options = {};
    if (sessionId) {
        options.session_id = sessionId;
    }
    return this.requestSigned('getContainerSsh', {
        container: container,
        userName: userName
    }, options)
    .then(function (data) {
        return self.ping(data.message, sessionId);
    });
};

// Get ssh connection of the current user.
//
// session   - String
// container -
//
// Returns a promise.
SshManager.prototype.getMySshConnectDetails = function (session, container) {
    var self = this;

    return this.requestSigned('getContainerSsh', {
        container: container
    }, {
        'session_id' : session
    })
    .then(function (data) {
        return self.ping(data.message, session);
    });
};
