// ImportManager
// ==============


// Dependencies
// ------------

var assert = require('assert-plus');

var request = require('./request');
var TaskManager = require('./task-manager');

var ImportManager = module.exports = function (options) {
    this.options = options;
    this.fileRequest = request.file.bind(null, this.options, 'ImportManager');
    this.request = request.bind(null, this.options, 'ImportManager');

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
//
// Returns a promise.
ImportManager.prototype.importFromZip = function (file, info) {

    assert.object(info, 'info');
    assert.string(info.filename, 'info.filename');
    assert.bool(info.isPublic, 'info.isPublic');
    assert.optionalString(info.desc, 'info.description');

    assert.string(info.session, 'info.session');

    var self = this;

    return this.fileRequest('importFromZip', {
        file: file,
        fileName: info.filename,
        description: info.desc,
        is_public: info.isPublic.toString()
    }, {
        session_id: info.session
    })
    .then(function (data) {
        return self.ping(data.message, info.session);
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
//
// Returns a promise.
ImportManager.prototype.importFromHg = function (url, info) {

    assert.object(info, 'info');
    assert.string(info.filename, 'info.filename');
    assert.bool(info.isPublic, 'info.isPublic');
    assert.optionalString(info.desc, 'info.description');

    assert.string(info.session, 'info.session');

    var self = this;

    return this.request('importFromHG', {
        url: url,
        fileName: info.filename,
        description: info.desc,
        is_public: info.isPublic
    }, {
        session_id: info.session
    })
    .then(function (data) {
        return self.ping(data.message, info.session);
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
//
// Returns a promise.
ImportManager.prototype.importFromGit = function (url, info) {

    assert.object(info, 'info');
    assert.string(info.filename, 'info.filename');
    assert.bool(info.isPublic, 'info.isPublic');
    assert.optionalString(info.desc, 'info.description');

    assert.string(info.session, 'info.session');

    var self = this;

    return this.request('importFromGit', {
        url: url,
        fileName: info.filename,
        description: info.desc,
        is_public: info.isPublic
    }, {
        session_id: info.session
    })
    .then(function (data) {
        return self.ping(data.message, info.session);
    });
};
