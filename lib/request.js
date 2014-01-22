// Request
// =======

// Dependencies
// ------------

var http = require('http');
var https = require('https');
var querystring = require('querystring');
var url = require('url');


// Send request to AC server
//
// options  - Object, configuration options
//            useOrigin -
//            hostname  -
//            path      -
//            port      -
//            origin    -
// object   - String, class name.
// method   - String, method name.
// data     - Object, request data.
// params   - Object, request parameters.
// callback - Function, method to execute afterwards.
module.exports = function (options, object, method, data, params, callback) {
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

    //make post data
    var post_data = querystring.stringify({
        'acrequest' : JSON.stringify({
            'object' : object,
            'method' : method,
            'data' : data,
            'params' : params
        })
    });

    var host = options.hostname;
    var port = options.port;
    var path = options.path;
    if (options.useOrigin) {
        var setOpts = function (fromUrl) {
            host =  fromUrl.hostname;
            if (fromUrl.port) {
                port = fromUrl.port;
            } else {
                port = fromUrl.protocol === 'https:' ? 443 : 80;
            }
        };
        if (serverUrl) {
            setOpts(serverUrl);
        }
        else if (options.origin) {
            setOpts(options.origin);
        }
    }

    var reqOptions = {
        hostname: host,
        port: port,
        path: path,
        rejectUnauthorized: false,
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': post_data.length,
            'Cookie': cookie
        }
    };

    var body = '';
    var client = (port === 443) ? https : http;
    var request = client.request(reqOptions, function (response) {
        response.on('data', function (chunk) {
            body += chunk;
        });
        response.on('end', function () {
            if (response.statusCode !== 200) {
                callback(new Error('Server error!', body));
            }
            else {
                try {
                    var parsedResponse = JSON.parse(body);
                    if (parsedResponse.response && parsedResponse.code === 1) {
                        callback(false, parsedResponse.response);
                    } else {
                        var message = 'Request error';

                        if (parsedResponse.response && parsedResponse.response.message) {
                            message = parsedResponse.response.message;
                        }
                        callback(true, message);
                    }
                } catch (ex) {
                    callback(new Error('Parse error: ' + ex.message));
                }
            }
        });
    });

    request.on('error', function (e) {
        callback(new Error('Request to server error: + e.message', e));
    });

    request.write(post_data);
    request.end();
};

module.exports.pingTaskStatus = function (options, taskId, params, callback) {
    var pingTimeout;

    function ping() {
        module.exports(options, 'TaskManager', 'getTaskStatus', {id: taskId},
            params, onPingRestart);
    }
    //process ping result
    function onPingRestart(error, response) {
        clearTimeout(pingTimeout);
        if (error) {
            callback(true, response);
        } else {
            if (response.status === 'ERROR') {
                callback(true, response.errorMessage);
            } else if (response.status === 'PROCESSING') {
                pingTimeout = setTimeout(function () {
                    ping();
                }, 3000);
            } else if (response.status === 'COMPLETED') {
                callback(false, response.result);
            }
        }
    }

    ping();
};

