'use strict';

require('./gunzip');
var Primus = require('primus');
var _ = require('lodash');
var atob = require('atob');
var jsdom = require('jsdom');
var window = jsdom.jsdom('<html/>').parentWindow;
var read = require('fs').readFileSync;
var path = require('path');
window.eval(read(path.join(__dirname, 'gunzip.js'), 'utf-8'));// jshint ignore:line
var Zlib = window.Zlib;

var Notifications = function (url, session, params) {
    this.url = url;
    this.params = params;
    this.writable = false;
    this.pendingMessages = [];
    this.connect(session);
    this.subs = {};
};

var p = Notifications.prototype;

p.connect = function (session) {
    if (this.primus) {
        return;
    }
    var params = _.extend(this.params, {
        reconnect: {
            retries: Infinity,
            max: 5000
        },
        strategy: ['online', 'disconnect']
    });
    var self = this;
    var Socket = Primus.createSocket({
        transformer: 'sockjs',
        pathname: 'p',
        parser: {
            encoder: function (data, fn) {
                fn(null, data);
            },
            decoder: function (data, fn) {
                fn(null, data);
            }
        }
    });

    var primus = this.primus = new Socket(this.url, params);
    var isReconnect = false;
    primus.on('open', function () {
        self.auth(session, isReconnect);
        _.each(self.pendingMessages, function (message) {
            self.write(message);
        });
        self.pendingMessages.length = 0;
        if (isReconnect) {
            self.reconnect();
        }
        isReconnect = true;
    });
    primus.on('readyStateChange', function (state) {
        self.writable = state === 'open';
    });
    primus.on('data', function (data) {
        self.handleMessage(data);
    });
    primus.on('error', function (error) {
        console.log('Connection Error', error);
        if (error && error.type === 'close') {
            self.writable = false;
        }
    });
};

p.handleMessage = function (data) {
    var parts;
    var channelId;
    var version;
    if (data.indexOf('SUBSCRIBED') === 0) {
        parts = data.split(' ');
        version = parseInt(parts.pop(), 10);
        parts.shift();
        channelId = parts.join(' ');
        if (this.subs[channelId]) {
            this.subs[channelId].version = version;
            this.subs[channelId].active = true;
        }
    } else {
        parts = data.split('\n');
        channelId = parts.shift();
        version = parseInt(parts.shift(), 10);
        var isArchived = parts[0] === 'GZIP';
        if (isArchived) {
            parts.shift();
        }
        var rawData = parts.join('\n');
        if (isArchived) {
            var source = atob(rawData);
            var len = source.length;
            var bytes = new Uint8Array(len);
            for (var i = 0; i < len; i++)        {
                bytes[i] = source.charCodeAt(i);
            }
            /* globals Zlib */
            var gunzip = new Zlib.Gunzip(bytes);
            var plain = gunzip.decompress();
            rawData = '';
            var plainLen = plain.byteLength;
            if (plainLen > 65534) {
                //https://bugs.webkit.org/show_bug.cgi?id=80797
                for (var iterator = 0; iterator < plainLen; iterator++) {
                    rawData += String.fromCharCode(plain[iterator]);
                }
            } else {
                rawData = String.fromCharCode.apply(null, plain);
            }
        }
        if (rawData && rawData[0] === '{') {
            try {
                rawData = JSON.parse(rawData);
            } catch (ex) {
            }
        } else if (rawData === 'null') {
            rawData = null;
        }
        if (this.subs[channelId]) {
            this.subs[channelId].version = version;
            _.each(this.subs[channelId].callbacks, function (callback) {
                callback && callback(rawData, version);
            });
        }
    }
};

p.reconnect = function () {
    var self = this;
    _.each(this.subs, function (info, channelId) {
        if (info.version) {
            // sub to next message
            var version = parseInt(info.version, 10) + 1;
            self.subscribe(channelId, undefined, 'FROM ' + version, info.auth, true);
        } else {
            self.subscribe(channelId, undefined, info.params, info.auth, true);
        }
    });
};

p.auth = function (session, reconnect) {
    if (reconnect || this.session !== session) {
        this.write('AUTH ' + session);
        this.session = session;
    }
};

p.subscribe = function (channelId, callback, params, auth, force) {
    var needSub = false;
    if (!this.subs[channelId]) {
        needSub = true;
        this.subs[channelId] = {params: params, callbacks: {}, auth: auth};
    }
    var id = this.guid();
    if (typeof callback === 'function') {
        this.subs[channelId].callbacks[id] = callback;
    }
    if (needSub || force) {
        params = params ? ' ' + params : '';
        if (auth) {
            this.write('AUTHSUB ' + auth + ' ' + channelId + params);
        } else {
            this.write('SUB ' + channelId + params);
        }
    }
    return id;
};

p.subscribeAuthLast = function (channelId, auth, callback) {
    this.subscribe(channelId, callback, 'LAST', auth);
};

p.subscribeLast = function (channelId, callback) {
    this.subscribe(channelId, callback, 'LAST');
};

p.subscribeAll = function (channelId, callback) {
    this.subscribe(channelId, callback, 'ALL');
};

p.subscribeFrom = function (channelId, number, callback) {
    this.subscribe(channelId, callback, 'FROM ' + number);
};

p.unsubscribe = function (channelId, id) {
    var self = this;
    if (this.subs[channelId]) {
        if (_.isFunction(id)) {
            _.each(this.subs[channelId].callbacks, function (callback, callbackId) {
                delete self.subs[channelId].callbacks[callbackId];
            });
        } else if (_.isString(id)) {
            delete this.subs[channelId].callbacks[id];
        }
        var count = _.size(this.subs[channelId].callbacks);
        if (count === 0 || !id) {
            this.write('UNSUB ' + channelId);
            delete this.subs[channelId];
        }
    }
};

p.write = function (message) {
    if (this.primus && this.writable) {
        this.primus.write(message);
    } else {
        this.pendingMessages.push(message);
    }
};

p.guid = function () {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
};

// Export
// ------

exports.NS = Notifications;
