// Request
// =======

// Dependencies
// ------------

var url = require('url');
var assert = require('assert-plus');
var Promise = require('bluebird');
var req = Promise.promisifyAll(require('request'));
var FormData = require('form-data');
var VError = require('verror');
var _ = require('lodash');
var crypto = require('./crypto');


function createDone(pathname, object, method) {
    return function done(res) {
        var body = res.body;
        if (res.statusCode !== 200) {
            return Promise.reject(new VError('Got non 200 code: %d',
                                             res.statusCode));
        }

        var result = JSON.parse(body);

        if (result.code === 0) {
            return Promise.reject(new VError('Got error from %s: %s',
                                             result.source,
                                             result.response.message));
        }

        return result.response;
    };
}


// Parse options
//
// options - Object
// params  - Object
//
// Returns an object with two keys `url` and `cookie`.
function parseOpts(options, params) {
    var cookie = '';
    var serverUrl = null;
    try {
        var session = JSON.parse(params.session_id);

        if (session.session) {
            params.session_id = session.session;
        } else {
            delete params.session_id;
        }
        if (session.anon) {
            cookie = 'crafted_anonymous=' + session.anon;
        }
        if (session.serverUrl) {
            serverUrl = url.parse(session.serverUrl);
        }
    } catch (er) {}

    if (options.useOrigin) {
        if (!serverUrl) {
            serverUrl = options.origin;
        }
    } else {
        serverUrl = url.format({
            hostname: options.hostname,
            port: options.port,
            protocol: options.protocol || 'http'
        });
    }

    return {
        url: serverUrl,
        cookie: cookie
    };
}

function sign(text, provider, key) {
    var timestamp = new Date().getTime();
    var signature = crypto.getToken(timestamp, text, provider, key);
    return {
        signature: signature,
        timestamp: timestamp
    };
}

// Send a request to the Java server.
//
// options  - Object, configuration options
//            useOrigin - Boolean,
//            hostname  - String,
//            path      - String,
//            protocol  - String, optional defaults to `http`.
//            port      - Number,
//            origin    - String, only used when `useOrigin` is true.
// object   - String, class name.
// method   - String, method name.
// data     - Object, request data.
// params   - Object, request parameters.
// shouldSign - Boolean, should request be signed.
module.exports = function request(options, object, method, data, params, shouldSign) {
    assert.object(options, 'options');
    assert.string(options.hostname, 'options.hostname');
    assert.string(options.path, 'options.path');
    assert.number(options.port, 'options.port');
    if (options.useOrigin) {
        assert.string(options.origin, 'options.origin');
    }

    assert.string(object, 'object');
    assert.string(method, 'method');
    assert.object(data, 'data');
    assert.object(params, 'params');

    var opts = parseOpts(options, params);
    var pathname = options.path;

    // Actual JSON data to post
    var acrequest = JSON.stringify({
        object: object,
        method: method,
        data: data,
        params: params
    });

    var postData = {
        acrequest: acrequest
    };

    var headers = {'Cookie': opts.cookie};
    if (shouldSign) {
        var signature = sign(acrequest, options.provider, options.secretKey);
        headers['X-Codio-Sign-Timestamp'] = signature.timestamp;
        headers['X-Codio-Sign'] = signature.signature;
        headers['X-Codio-Provider'] = options.provider;
    }

    return req.postAsync({
        url: opts.url + pathname,
        headers: headers,
        form: postData
    }).then(createDone(pathname, object, method));
};

module.exports.signed = function () {
    var args = Array.prototype.slice.call(arguments);
    while (args.length < 5) {
        args.push(undefined);
    }
    args.push(true); // push 7th argument to true to sign the request
    return module.exports.apply(null, args);
};

// File Upload
//
// Returns a promise.
module.exports.file = function (options, object, method, data, params) {
    var form = new FormData();

    form.append('object', object);
    form.append('method', method);

    _.forEach(data, function (value, key) {
        form.append(key, value);
    });

    _.forEach(params, function (value, key) {
        form.append(key, value);
    });

    var opts = parseOpts(options, params);
    var pathname = options.path + 'file/';

    var uri = opts.url + pathname;

    var done = createDone(pathname, object, method);

    return new Promise(function (resolve, reject) {
        form.submit(uri, function (err, res) {
            if (err) {
                return reject(err);
            }

            res.resume();

            var body = '';

            res.on('data', function (chunk) {
                body += chunk.toString();
            });

            res.on('end', function () {
                res.body = body;
                resolve(done(res));
            });
        });
    });
};
