// ProjectStructureManager
// =======================

var assert = require('assert-plus');
var _ = require('lodash');

var request = require('./request');

var ProjectStructureManager = module.exports = function (options) {
    this.options = options;
    this.request = request.bind(null, this.options, 'ProjectStructureManager');
    this.requestSigned = request.signed.bind(null, this.options, 'ProjectStructureManager');
};


// Get the content of a file
//
// path     - String, the path to the file.
// info     - Object, with additional parameters
//            user    - String, the user name.
//            project - String, the project name.
//            session - String, the session key.
//
// Returns a promise.
ProjectStructureManager.prototype.getFile = function (path, info) {
    assert.string(path, 'path');
    assert.object(info, 'info');
    assert.string(info.user, 'info.user');
    assert.string(info.project, 'info.project');
    assert.string(info.session, 'info.session');

    return this.request('getFile', {
        userName: info.user,
        projectName: info.project,
        path: path,
        format: 'plain'
    }, {
        session_id: info.session
    });
};

// Get the content of a file without session
//
// path     - String, the path to the file.
// info     - Object, with additional parameters
//            user    - String, the user name.
//            project - String, the project name.
//            session - String, the session key.
//
// Returns a promise.
ProjectStructureManager.prototype.getFileForListener = function (path, info) {
    assert.string(path, 'path');
    assert.object(info, 'info');
    assert.string(info.user, 'info.user');
    assert.string(info.project, 'info.project');

    return this.requestSigned('getFileForShare', {
        userName: info.user,
        projectName: info.project,
        path: path,
        format: 'plain'
    }, {
        session_id: info.session
    });
};

// Update a file.
//
// path     - String, the path to the file.
// content  - String, the content to update the file with.
// info     - Object, with additional parameters
//            user    - String, the user name.
//            project - String, the project name.
//            session - String, the session key.
//
// Returns a promise.
ProjectStructureManager.prototype.updateFile = function (path, content, info) {
    assert.string(path, 'path');
    assert.string(content, 'content');
    assert.object(info, 'info');
    assert.string(info.user, 'info.user');
    assert.string(info.project, 'info.project');
    assert.string(info.session, 'info.session');

    return this.request('updateFile', {
        userName : info.user,
        projectName : info.project,
        path : path,
        content : (new Buffer(content)).toString('base64')
    }, {
        session_id : info.session
    });
};

// Update a file without session.
//
// path     - String, the path to the file.
// content  - String, the content to update the file with.
// info     - Object, with additional parameters
//            user    - String, the user name.
//            project - String, the project name.
//
// Returns a promise.
ProjectStructureManager.prototype.internalUpdateFile = function (path, content, info) {
    assert.string(path, 'path');
    assert.string(content, 'content');
    assert.object(info, 'info');
    assert.string(info.user, 'info.user');
    assert.string(info.project, 'info.project');

    return this.requestSigned('internalUpdateFile', {
        userName : info.user,
        projectName : info.project,
        path : path,
        content : (new Buffer(content)).toString('base64')
    }, {
        session_id : info.session
    });
};

// Fetch information about file
//
// path     - String, the path to the file.
// content  - String, the content to update the file with.
// info     - Object, with additional parameters
//            user    - String, the user name.
//            project - String, the project name.
//
// Returns a promise with structure: {
//    exists: true|false,
//    isFile: true|false,
//    isDir: true|false,
//    isSymlink: true|false,
//    timestamp: file modified time
// }.
ProjectStructureManager.prototype.getFileInfo = function (path, info) {
    assert.string(path, 'path');
    assert.object(info, 'info');
    assert.string(info.user, 'info.user');
    assert.string(info.project, 'info.project');

    return this.requestSigned('getFileInfo', {
        userName : info.user,
        projectName : info.project,
        path : path
    }, {
        session_id : info.session
    });
};

// Delete one or more items.
//
// path     - String or array of paths for the items to delete.
// info     - Object, with additional parameters
//            user    - String, the user name.
//            project - String, the project name.
//            session - String, the session key.
//
// Returns a promise.
ProjectStructureManager.prototype.removePath = function (path, info) {
    assert.object(info, 'info');
    assert.string(info.user, 'info.user');
    assert.string(info.project, 'info.project');
    assert.string(info.session, 'info.session');

    return this.request('removePath', {
        userName: info.user,
        projectName: info.project,
        path: _.isString(path) ? [path] :path
    }, {
        session_id: info.session
    });
};

// Create a file.
//
// path     - String, the destination path of the file.
// template - String, optional, the file template name.
// info     - Object, with additional parameters
//            user    - String, the user name.
//            project - String, the project name.
//            session - String, the session key.
//
// Returns a promise.
ProjectStructureManager.prototype.createFile = function (path, template, info) {
    assert.string(path, 'path');
    if (template) {
        assert.string(template, 'template');
    }
    assert.object(info, 'info');
    assert.string(info.user, 'info.user');
    assert.string(info.project, 'info.project');
    assert.string(info.session, 'info.session');

    return this.request('createFile', {
        userName: info.user,
        projectName: info.project,
        path: path,
        template: template || ''
    }, {
        session_id: info.session
    });
};

// Move items from one location to another.
//
// src      - Array, list of source paths of the items to move.
// dest     - Array, list of destination paths of the items to move.
// info     - Object, with additional parameters
//            user    - String, the user name.
//            project - String, the project name.
//            session - String, the session key.
//
// Returns a promise.
ProjectStructureManager.prototype.moveItem = function (src, dest, info) {
    assert.arrayOfString(src, 'src');
    assert.arrayOfString(dest, 'dest');
    assert.object(info, 'info');
    assert.string(info.user, 'info.user');
    assert.string(info.project, 'info.project');
    assert.string(info.session, 'info.session');

    return this.request('moveItem', {
        userName: info.user,
        projectName: info.project,
        sourcePath: src,
        destinationPath: dest
    }, {
        session_id: info.session
    });
};

// Copy an Item from one location to another.
//
// src      - String, the source path of the item to move.
// dest     - String, the destination path of the item to move.
// info     - Object, with additional parameters
//            user    - String, the user name.
//            project - String, the project name.
//            session - String, the session key.
//
// Returns a promise.
ProjectStructureManager.prototype.copyItem = function (src, dest, info) {
    assert.arrayOfString(src, 'src');
    assert.arrayOfString(dest, 'dest');
    assert.object(info, 'info');
    assert.string(info.user, 'info.user');
    assert.string(info.project, 'info.project');
    assert.string(info.session, 'info.session');

    return this.request('copyItem', {
        userName: info.user,
        projectName: info.project,
        sourcePath: src,
        destinationPath: dest
    }, {
        'session_id' : info.session
    });
};

// Create a directory.
//
// path     - String, the destination path of the directory.
// info     - Object, with additional parameters
//            user    - String, the user name.
//            project - String, the project name.
//            session - String, the session key.
//
// Returns a promise.
ProjectStructureManager.prototype.makeDirectory = function (path, info) {
    assert.string(path, 'path');
    assert.object(info, 'info');
    assert.string(info.user, 'info.user');
    assert.string(info.project, 'info.project');
    assert.string(info.session, 'info.session');

    return this.request('makeDirectory', {
        userName: info.user,
        projectName: info.project,
        path: path
    }, {
        session_id: info.session
    });
};
