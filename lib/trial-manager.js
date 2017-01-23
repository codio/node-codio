// EducationTrialManager
// ==========

// Dependencies
// ------------

var req = require('./request');

var EducationTrialManager = module.exports = function (options) {
  this.options = options;
  this.requestSigned = req.signed.bind(null, this.options, 'EducationTrialManager');
};

// Fetch trial request
//
// id - Trial request id
//
// Returns a promise.
EducationTrialManager.prototype.fetchRequest = function (id) {
  return this.requestSigned('fetchRequest', {id: id}, {});
};

// Mark dummy data as completed
//
// id - Trial request id
//
// Returns a promise.
EducationTrialManager.prototype.markDummyDataCompleted = function (id) {
  return this.requestSigned('markDummyDataCompleted', {id: id}, {});
};
