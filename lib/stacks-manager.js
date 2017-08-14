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

// Get stack by id
//
// id - stack id
//
// Returns a promise.
StacksManager.prototype.getStackById = function (id) {
  assert.string(id, 'id');
  return this.requestSigned('getStackById', {id: id}, {});
};

// Publish new stack version
//
// Returns a promise.
StacksManager.prototype.publishVersion = function (data) {
  assert.string(data.source, 'source');
  assert.string(data.version, 'version');
  assert.optionalString(data.description, 'description');
  assert.string(data.stackId, 'stackId');
  assert.string(data.userId, 'userId');
  assert.optionalObject(data.replyParameters, 'replyParameters')
  return this.requestSigned('publishVersion', data, {});
}

// Create new stack
//
// Returns a promise.
StacksManager.prototype.createStack = function (data) {
  assert.string(data.source, 'source');
  assert.optionalString(data.image, 'image');
  assert.bool(data.isPrivate, 'isPrivate');
  assert.bool(data.isPrivate, 'isPublished');
  assert.optionalString(data.shortDescription, 'shortDescription');
  assert.optionalString(data.longDescription, 'longDescription');
  assert.string(data.name, 'name');
  assert.string(data.userId, 'userId');
  assert.optionalArrayOfString(data.tags, 'tags');
  assert.optionalString(data.owner, 'owner')
  assert.optionalObject(data.replyParameters, 'replyParameters')
  return this.requestSigned('createStack', data, {});
}
