// Request
// =======

// Dependencies
// ------------

var url = require('url');
var assert = require('assert-plus');

var req = require('request');
var VError = require('verror');


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
// callback - Function, node style callback.
module.exports = function request(options, object, method, data, params, callback) {
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
    assert.func(callback, 'callback');

    var opts = parseOpts(options, params);
    var pathname = options.path;

    // Actual JSON data to post
    var postData = {
        acrequest: JSON.stringify({
            object: object,
            method: method,
            data: data,
            params: params
        })
    };

    req.post({
        url: opts.url + pathname,
        headers: {
            'Cookie': opts.cookie
        },
        form: postData,
    }, function (err, res, body) {
        if (err) {
            return callback(
                new VError(err, 'POST to %s with %s/%s failed', pathname, object, method));
        }
        if (res.statusCode !== 200) {
            return callback(new VError('Got non 200 code: %d', res.statusCode));
        }

        var result;
        try {
            result = JSON.parse(body);
        } catch (err) {
            return callback(new VError(err, 'parse error'));
        }

        if (body.code === 0) {
            return callback(new VError('Got error from %s: %s', body.source, body.response.message));
        }
        callback(null, result.response);
    });
};
