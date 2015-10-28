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
    this.requestSigned = request.signed.bind(null, this.options, 'ImportManager');

    var taskManager = new TaskManager(this.options);
    this.ping = taskManager.pingTaskStatus.bind(taskManager);
};


// Import a project from the given zip file.
//
// file     - String, Buffer or ReadStream, the content of the project.
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
    assert.optionalString(info.stack, 'info.stack');

    assert.string(info.session, 'info.session');

    var self = this;

    var data = {
        file: file,
        fileName: info.filename,
        description: info.desc,
        is_public: info.isPublic.toString()
    };

    if (info.stack) {
        data.stack = info.stack;
    }

    return this.fileRequest('importFromZip', data, {
        session_id: info.session
    })
    .then(function (data) {
        return self.ping(data.message, info.session);
    });
};

// Import a project from the given S3 path.
//
// filePath - String, Buffer or ReadStream, the content of the project.
// info     - Object, with additional parameters
//            name     - String, name of the new project
//            isPublic - Boolean, is public ?
//            desc     - String, description.
//            session  - String, the session key.
//
// Returns a promise.
ImportManager.prototype.importFromS3 = function (filePath, info) {

    assert.string(filePath, 'filePath');
    assert.object(info, 'info');
    assert.string(info.name, 'info.name');
    assert.bool(info.isPublic, 'info.isPublic');
    assert.bool(info.isFree, 'info.isFree');
    assert.optionalString(info.description, 'info.description');
    assert.optionalString(info.stack, 'info.stack');

    assert.string(info.session, 'info.session');

    var self = this;

    var data = {
        filePath: filePath,
        name: info.name,
        description: info.description,
        is_public: info.isPublic.toString(),
        is_free: info.isFree.toString()
    };

    if (info.stack) {
        data.stack = info.stack;
    }

    return this.fileRequest('importFromS3', data, {
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
    assert.optionalString(info.stack, 'info.stack');

    assert.string(info.session, 'info.session');

    var self = this;

    var data = {
        url: url,
        fileName: info.filename,
        description: info.desc,
        is_public: info.isPublic
    };

    if (info.stack) {
        data.stack = info.stack;
    }

    return this.request('importFromHG', data, {
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
    assert.optionalString(info.stack, 'info.stack');

    assert.string(info.session, 'info.session');

    var self = this;

    var data = {
        url: url,
        fileName: info.filename,
        description: info.desc,
        is_public: info.isPublic
    };

    if (info.stack) {
        data.stack = info.stack;
    }
    return this.request('importFromGit', data, {
        session_id: info.session
    })
    .then(function (data) {
        return self.ping(data.message, info.session);
    });
};

ImportManager.prototype.restoreContent = function (user, project, url, restore) {
    assert.string(user, 'user');
    assert.string(project, 'project');
    assert.string(url, 'url');
    assert.arrayOfString(restore, 'restore');
    var data = {
        user: user,
        project: project,
        url: url,
        restore: restore
    };
    var self = this;
    return this.requestSigned('restoreContent', data, {})
      .then(function (data) {
        return self.ping(data.message);
    });

};
