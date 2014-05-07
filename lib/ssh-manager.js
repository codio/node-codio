var req = require('./request');
var TaskManager = require('./task-manager');


var SshManager = module.exports = function (options, uidGenerator) {
    this.uidGenerator = uidGenerator;
    this.options = options;
    this.requestSigned = req.signed.bind(null, this.options, 'SshManager');
    var taskManager = new TaskManager(this.options);
    this.ping = taskManager.pingTaskStatus.bind(taskManager);
};


SshManager.prototype.getSshConnectDetails = function (userName, container, callback) {
    var self = this;
    this.requestSigned('getSshConnectDetails', {
        container: container,
        userName: userName
    }, {
    }, function (error, data) {
        if (!error) {
            self.ping(data.message, callback);
        } else {
            callback(error, data);
        }
    });
};

SshManager.prototype.getMySshConnectDetails = function (session, container, callback) {
    var self = this;
    this.requestSigned('getMySshConnectDetails', {
        container: container
    }, {
        'session_id' : session
    }, function (error, data) {
        if (!error) {
            self.ping(data.message, callback);
        } else {
            callback(error, data);
        }
    });
};

SshManager.prototype.getHostDetailsBySsh = function (host, port, callback) {
    this.requestSigned('getHostDetailsBySsh', {
        host: host,
        port: port
    }, {},
    function (error, data) {
        callback(error, data);
    });
};
