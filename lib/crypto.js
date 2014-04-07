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
exports.getToken = function (uid, name, secret) {
    assert.string(uid, 'uid');
    assert.string(name, 'name');
    assert.string(secret, 'secret');

    var shasum = crypto.createHash('sha1');
    return shasum.update(uid + secret + name).digest('hex');
};
