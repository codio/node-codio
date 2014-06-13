// ImportManager
// ==============


// Dependencies
// ------------

var assert = require('assert-plus');

var request = require('./request');
var TaskManager = require('./task-manager');

var ImportManager = module.exports = function (options) {
    this.options = options;
    this.request = request.file.bind(null, this.options, 'ImportManager');

    var taskManager = new TaskManager(this.options);
    this.ping = taskManager.pingTaskStatus.bind(taskManager);
};


// Import a project from the given zip file.
//
// fil      - String, Buffer or ReadStream, the content of the project.
// info     - Object, with additional parameters
//            filename - String, name of the new project
//            isPublic - Boolean, is public ?
//            desc     - String, description.
//            session  - String, the session key.
// callback - A callback function.
ImportManager.prototype.importFromHg = function (file, info, callback) {

    assert.object(info, 'info');
    assert.string(info.filename, 'info.filename');
    assert.bool(info.isPublic, 'info.isPublic');
    assert.optionalString(info.desc, 'info.description');

    assert.string(info.session, 'info.session');
    assert.func(callback, 'callback');

    var self = this;

    this.request('importFromZip', {
        file: file,
        fileName: info.filename,
        description: info.desc,
        is_public: info.isPublic.toString()
    }, {
        session_id: info.session
    }, function (error, data) {
        if (error) {
            return callback(error);
        }
        console.log('checking task status %s', data.message);
        self.ping(data.message, callback);
    });
};

// Import a project from the given HG repo.
//
// url      - String, mercurial repo url.
// info     - Object, with additional parameters
//            filename - String, name of the new project
//            isPublic - Boolean, is public ?
//            desc     - String, description.
//            session  - String, the session key.
// callback - A callback function.
ImportManager.prototype.importFromHg = function (url, info, callback) {

    assert.object(info, 'info');
    assert.string(info.filename, 'info.filename');
    assert.bool(info.isPublic, 'info.isPublic');
    assert.optionalString(info.desc, 'info.description');

    assert.string(info.session, 'info.session');
    assert.func(callback, 'callback');

    var self = this;

    this.request('importFromHg', {
        url: url,
        fileName: info.filename,
        description: info.desc,
        is_public: info.isPublic.toString()
    }, {
        session_id: info.session
    }, function (error, data) {
        if (error) {
            return callback(error);
        }
        console.log('checking task status %s', data.message);
        self.ping(data.message, callback);
    });
};

// Import a project from the given Git repo.
//
// url      - String, git repo url
// info     - Object, with additional parameters
//            filename - String, name of the new project
//            isPublic - Boolean, is public ?
//            desc     - String, description.
//            session  - String, the session key.
// callback - A callback function.
ImportManager.prototype.importFromGit = function (url, info, callback) {

    assert.object(info, 'info');
    assert.string(info.filename, 'info.filename');
    assert.bool(info.isPublic, 'info.isPublic');
    assert.optionalString(info.desc, 'info.description');

    assert.string(info.session, 'info.session');
    assert.func(callback, 'callback');

    var self = this;

    this.request('importFromGit', {
        url: url,
        fileName: info.filename,
        description: info.desc,
        is_public: info.isPublic.toString()
    }, {
        session_id: info.session
    }, function (error, data) {
        if (error) {
            return callback(error);
        }
        console.log('checking task status %s', data.message);
        self.ping(data.message, callback);
    });
};