// AccountManager
// ==============


var request = require('./request').request;


var AccountManager = module.exports = function (options) {
    this.options = options;
    this.request = request.bind(null, this.options, 'AccountManager');
};


// Get a project by name.
//
// session  - String, session key.
// callback - A callback function.
AccountManager.prototype.getMyInfo = function (session, callback) {
    this.request('getMyInfo', {}, {
        'session_id' : session
    }, callback);
};
