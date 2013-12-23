// ProjectStructureManager
// =======================


var _ = require('lodash');
var request = require('./request');


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
    this.request('getFile', {
        userName: info.user,
        projectName: info.project,
        path: path,
        format: 'plain'
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
    this.request('updateFile', {
        userName : info.user,
        projectName : info.project,
        path : path,
        content : (new Buffer(content)).toString('base64')
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
// template - String, the file template name.
// info     - Object, with additional parameters
//            user    - String, the user name.
//            project - String, the project name.
//            session - String, the session key.
// callback - Function, to call with the result of the request.//
ProjectStructureManager.prototype.createFile = function (path, template, info, callback) {
    this.request('createFile', {
        userName: info.user,
        projectName: info.project,
        path: path,
        template: template || ''
    }, {
        session_id: info.session
    }, callback);
};

// Move an item from one location to another.
//
// src      - String, the source path of the item to move.
// dest     - String, the destination path of the item to move.
// info     - Object, with additional parameters
//            user    - String, the user name.
//            project - String, the project name.
//            session - String, the session key.
// callback - Function, to call with the result of the request.
ProjectStructureManager.prototype.moveItem = function (src, dest, info, callback) {
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
    this.request('makeDirectory', {
        userName: info.user,
        projectName: info.project,
        path: path
    }, {
        session_id: info.session
    }, callback);
};

