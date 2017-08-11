// StacksManager
// ================


var assert = require('assert-plus');

var request = require('./request');

var StacksManager = module.exports = function (options) {
  this.options = options;
  this.requestSigned = request.signed.bind(null, this.options, 'StacksManager');
};


// Get container information for pier
//
// container - String, with the container name for fetch
//
// Returns a promise.
StacksManager.prototype.getStacksVersions = function (ids) {
  assert.arrayOfString(ids, 'ids');

  return this.requestSigned('getStacksVersions', {
    ids: ids
  }, {});
};

// Get stack by version id
//
// id - stack id
//
// Returns a promise.
StacksManager.prototype.getStackByVersionId = function (id) {
  assert.string(id, 'id');
  return this.requestSigned('getStackByVersionId', {id: id}, {});
};

StacksManager.prototype.publishVersion = function (data) {
  assert.string(data.source, 'source');
  assert.string(data.version, 'version');
  assert.string(data.description, 'description');
  assert.string(data.stackId, 'stackId');
  assert.string(data.userId, 'userId');
  assert.object(data.replyParameters, 'replyParameters')
  return this.requestSigned('publishVersion', data, {});
}