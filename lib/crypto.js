// Crypto
// ======


// Dependencies
// ------------

var assert = require('assert-plus');
var crypto = require('crypto');

// Function to generate an access token:
//
// uid    - String, with generated the id.
// name   - String, with the name.
// secret - String, secret key.
exports.getToken = function (uid, data, provider, secret) {
    assert.string(uid + '', 'uid');
    assert.string(data, 'data');
    assert.string(secret, 'secret');

    var shasum = crypto.createHmac('sha1', secret);
    return shasum.update(new Buffer(uid + data + provider, 'utf-8')).digest('base64');
};
