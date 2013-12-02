// Codio API
// =========

var _ = require('lodash');
var url = require('url');

var ProjectManager = require('./lib/project-manager');
var ProjectStructureManager = require('./lib/project-structure-manager');



module.exports = function (options) {
    this.options = options || {};
    var origin = this.options.origin;
    if (_.isString(origin)) {
        this.options.origin = url.parse(origin);
    } else if (_.isObject(origin)) {
        this.options.origin = origin;
    } else {
        this.options.origin = null;
    }

    this.projectManager = new ProjectManager(this.options);
    this.projectStructureManager = new ProjectStructureManager(this.options);
};

