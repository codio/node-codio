// ForwardingManager
// ==========

// Dependencies
// ------------

var req = require('./request');
var TaskManager = require('./task-manager');

var ForwardingManager = module.exports = function (options, uidGenerator) {
    this.uidGenerator = uidGenerator;
    this.options = options;
    this.requestSigned = req.signed.bind(null, this.options, 'ForwardingManager');

    var taskManager = new TaskManager(this.options);
    this.ping = taskManager.pingTaskStatus.bind(taskManager);
};

// Get information for forwarding by proxy host + port
//
// host - a String hostname.
// port - an integer port number.
//
// Returns promise resolves to {host: 'string', port: number} object.
ForwardingManager.prototype.getForwardingInfo = function (proxy, port) {
    var self = this;
    return this.requestSigned('getForwardingInfo', {
        proxy: proxy,
        port: port
    }, {})
    .then(function (data) {
        return self.ping(data.message);
    });
};
