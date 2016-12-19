// EducationTrialManager
// ==========

// Dependencies
// ------------

var req = require('./request');

var EducationTrialManager = module.exports = function (options, uidGenerator) {
  this.uidGenerator = uidGenerator;
  this.options = options;
  this.requestSigned = req.signed.bind(null, this.options, 'EducationTrialManager');
};

// Verify a server
//
// session  - String
// uid      - String
//
// Returns a promise.
EducationTrialManager.prototype.fetchRequest = function (id) {
  return this.requestSigned('fetchRequest', {id: id}, {});
};
