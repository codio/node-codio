// ProjectStructureManager
// =======================

var assert = require('assert-plus');
var _ = require('lodash');

var request = require('./request');
var crypto = require('./crypto');


var ProjectStructureManager = module.exports = function (options) {
    this.options = options;
    this.request = request.bind(null, this.options, 'ProjectStructureManager');
};


// Get the content of a file
//
// path     - String, the path to the file.
// info     - Object, with additional parameters
//            user    - String, the user name.
//            project - String, the project name.
//            session - String, the session key.
// callback - A callback function.
ProjectStructureManager.prototype.getFile = function (path, info, callback) {
    assert.string(path, 'path');
    assert.object(info, 'info');
    assert.string(info.user, 'info.user');
    assert.string(info.project, 'info.project');
    assert.string(info.session, 'info.session');
    assert.func(callback, 'callback');

    this.request('getFile', {
        userName: info.user,
        projectName: info.project,
        path: path,
        format: 'plain'
    }, {
        session_id: info.session
    }, callback);
};

// Get the content of a file without session
//
// path     - String, the path to the file.
// info     - Object, with additional parameters
//            user    - String, the user name.
//            project - String, the project name.
//            session - String, the session key.
// callback - A callback function.
ProjectStructureManager.prototype.getFileForListener = function (path, info, callback) {
    assert.string(path, 'path');
    assert.object(info, 'info');
    assert.string(info.user, 'info.user');
    assert.string(info.project, 'info.project');
    assert.func(callback, 'callback');

    var token = crypto.getToken(info.user, info.project, this.options.containerSecretKey);
    this.request('getFileForShare', {
        userName: info.user,
        projectName: info.project,
        path: path,
        format: 'plain',
        token: token
    }, {
        session_id: info.session
    }, callback);
};

// Update a file.
//
// path     - String, the path to the file.
// content  - String, the content to update the file with.
// info     - Object, with additional parameters
//            user    - String, the user name.
//            project - String, the project name.
//            session - String, the session key.
// callback - A callback function.
ProjectStructureManager.prototype.updateFile = function (path, content, info, callback) {
    assert.string(path, 'path');
    assert.string(content, 'content');
    assert.object(info, 'info');
    assert.string(info.user, 'info.user');
    assert.string(info.project, 'info.project');
    assert.string(info.session, 'info.session');
    assert.func(callback, 'callback');

    this.request('updateFile', {
        userName : info.user,
        projectName : info.project,
        path : path,
        content : (new Buffer(content)).toString('base64')
    }, {
        session_id : info.session
    }, callback);
};

// Update a file with ot operation.
//
// path     - String, the path to the file.
// ops      - Array, the sharejs ot operations.
// info     - Object, with additional parameters
//            user    - String, the user name.
//            project - String, the project name.
//            session - String, the session key.
// callback - A callback function.
ProjectStructureManager.prototype.updateFileWithOt = function (path, ops, info, callback) {
    assert.string(path, 'path');
    assert.object(info, 'info');
    assert.string(info.user, 'info.user');
    assert.string(info.project, 'info.project');
    assert.string(info.session, 'info.session');
    assert.func(callback, 'callback');

    this.request('updateFileWithOt', {
        userName : info.user,
        projectName : info.project,
        path : path,
        ops : ops
    }, {
        session_id : info.session
    }, callback);
};

// Delete one or more items.
//
// path     - String or array of paths for the items to delete.
// info     - Object, with additional parameters
//            user    - String, the user name.
//            project - String, the project name.
//            session - String, the session key.
// callback - Function, to call with the result of the request.
ProjectStructureManager.prototype.removePath = function (path, info, callback) {
    assert.object(info, 'info');
    assert.string(info.user, 'info.user');
    assert.string(info.project, 'info.project');
    assert.string(info.session, 'info.session');
    assert.func(callback, 'callback');

    this.request('removePath', {
        userName: info.user,
        projectName: info.project,
        path: _.isString(path) ? [path] :path
    }, {
        session_id: info.session
    }, callback);
};

// Create a file.
//
// path     - String, the destination path of the file.
// template - String, optional, the file template name.
// info     - Object, with additional parameters
//            user    - String, the user name.
//            project - String, the project name.
//            session - String, the session key.
// callback - Function, to call with the result of the request.//
ProjectStructureManager.prototype.createFile = function (path, template, info, callback) {
    assert.string(path, 'path');
    if (template) {
        assert.string(template, 'template');
    }
    assert.object(info, 'info');
    assert.string(info.user, 'info.user');
    assert.string(info.project, 'info.project');
    assert.string(info.session, 'info.session');
    assert.func(callback, 'callback');

    this.request('createFile', {
        userName: info.user,
        projectName: info.project,
        path: path,
        template: template || ''
    }, {
        session_id: info.session
    }, callback);
};

// Move items from one location to another.
//
// src      - Array, list of source paths of the items to move.
// dest     - Array, list of destination paths of the items to move.
// info     - Object, with additional parameters
//            user    - String, the user name.
//            project - String, the project name.
//            session - String, the session key.
// callback - Function, to call with the result of the request.
ProjectStructureManager.prototype.moveItem = function (src, dest, info, callback) {
    assert.arrayOfString(src, 'src');
    assert.arrayOfString(dest, 'dest');
    assert.object(info, 'info');
    assert.object(info, 'info');
    assert.string(info.user, 'info.user');
    assert.string(info.project, 'info.project');
    assert.string(info.session, 'info.session');
    assert.func(callback, 'callback');

    this.request('moveItem', {
        userName: info.user,
        projectName: info.project,
        sourcePath: src,
        destinationPath: dest
    }, {
        session_id: info.session
    }, callback);
};

// Copy an Item from one location to another.
//
// src      - String, the source path of the item to move.
// dest     - String, the destination path of the item to move.
// info     - Object, with additional parameters
//            user    - String, the user name.
//            project - String, the project name.
//            session - String, the session key.
// callback - Function, to call with the result of the request.
ProjectStructureManager.prototype.copyItem = function (src, dest, info, callback) {
    assert.string(src, 'src');
    assert.string(dest, 'dest');
    assert.object(info, 'info');
    assert.string(info.user, 'info.user');
    assert.string(info.project, 'info.project');
    assert.string(info.session, 'info.session');
    assert.func(callback, 'callback');

    this.request('copyItem', {
        userName: info.user,
        projectName: info.project,
        sourcePath: src,
        destinationPath: dest
    }, {
        'session_id' : info.session
    }, callback);
};

// Create a directory.
//
// path     - String, the destination path of the directory.
// info     - Object, with additional parameters
//            user    - String, the user name.
//            project - String, the project name.
//            session - String, the session key.
// callback - Function, to call with the result of the request.
ProjectStructureManager.prototype.makeDirectory = function (path, info, callback) {
    assert.string(path, 'path');
    assert.object(info, 'info');
    assert.string(info.user, 'info.user');
    assert.string(info.project, 'info.project');
    assert.string(info.session, 'info.session');
    assert.func(callback, 'callback');

    this.request('makeDirectory', {
        userName: info.user,
        projectName: info.project,
        path: path
    }, {
        session_id: info.session
    }, callback);
};
