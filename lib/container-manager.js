// ContainerManager
// =============

var crypto = require('crypto');
var request = require('./request');

var ContainerManager = module.exports = function (options, uidGenerator) {
    this.uidGenerator = uidGenerator;
    this.options = options;
    this.request = request.bind(null, this.options, 'ContainerManager');
    this.ping = request.pingTaskStatus.bind(null, this.options);
};

// Private function for get token for access to container functionality
//
// uid - The String with generated id
// container - The String with container name
ContainerManager.prototype._getToken = function (uid, container) {
    var shasum = crypto.createHash('sha1');
    return shasum.update(uid + this.options.containerSecretKey + container).digest('hex');
};

// Generate uid for request
ContainerManager.prototype._getUid = function () {
    if (typeof this.uidGenerator === 'function') {
        return this.uidGenerator();
    } else {
        return (new Date()).getMilliseconds() + '';
    }
};

// Start backend container
//
// container - The String with container name for start
// callback - Function, to call with the result of the request.
ContainerManager.prototype.start = function (container, callback) {
    var uid = this._getUid();
    var token = this._getToken(uid, container);
    var self = this;
    this.request('start', {
        container: container,
        uid: uid,
        token: token
    }, {
    }, function (error, data) {
        if (!error) {
            self.ping(data.message, {}, callback);
        } else {
            callback(error, data);
        }
    });
};

// Stop backend container
//
// container - The String with container name for stop
// callback - Function, to call with the result of the request.
ContainerManager.prototype.stop = function (container, callback) {
    var uid = this._getUid();
    var token = this._getToken(uid, container);
    var self = this;
    this.request('stop', {
        container: container,
        uid: uid,
        token: token
    }, {
    }, function (error, data) {
        if (!error) {
            self.ping(data.message, {}, callback);
        } else {
            callback(error, data);
        }
    });
};

// Info about backend container
//
// container - The String with container name for stop
// callback - Function, to call with the result of the request.
ContainerManager.prototype.info = function (container, callback) {
    var uid = this._getUid();
    var token = this._getToken(uid, container);
    var self = this;
    this.request('info', {
        container: container,
        uid: uid,
        token: token
    }, {
    }, function (error, data) {
        if (!error) {
            self.ping(data.message, {}, callback);
        } else {
            callback(error, data);
        }
    });
};