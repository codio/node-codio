// ForwardingManager
// ==========

// Dependencies
// ------------

var assert = require('assert-plus');
var request = require('./request');

var PlagiarismDetectionManager = module.exports = function (options) {
    this.options = options;
    this.request = request.bind(null, this.options, 'PlagiarismDetectionManager');
};

// Start plagiarism detection
//
// classId    - String, class id.
// unitId     - String, unit id.
// projectIds - Array, project ids.
// unitSource - String, unit source.
// masks      - Array, masks
// bucket     - Previous sources s3 bucket
// key        - Previous sources s3 key
//
// Returns promise resolves to {message: 'taskId'} object.
PlagiarismDetectionManager.prototype.detectPlagiarism = function (
  classId, unitId, projectIds, unitSource, masks, rootPath, bucket, key, session) {
    var previousSources = null;
    if (key) {
        previousSources = {
            bucket: bucket,
            key: key
        }
    }

    assert.string(session, 'session_id');
    assert.string(classId, 'classId');
    assert.string(unitId, 'unitId');
    assert.arrayOfString(projectIds, 'projectIds');
    assert.string(unitSource, 'unitSource');
    assert.arrayOfString(masks, 'masks');
    assert.string(rootPath, 'rootPath');
    assert.optionalObject(previousSources, 'previousSources');

    return this.request('detectPlagiarism', {
        classId: classId,
        unitId: unitId,
        projectIds: projectIds,
        unitSource: unitSource,
        masks: masks,
        rootPath: rootPath,
        previousSources: previousSources
    }, {
        'session_id' : session
    });
};

// Gets plagiarism detection runs
//
// classId    - String, class id.
// unitId     - String, unit id.
//
// Returns promise resolves to [Array of results] object.
PlagiarismDetectionManager.prototype.getPlagiarismDetectionRuns = function (classId, unitId, session) {

    assert.string(session, 'session_id');
    assert.string(classId, 'classId');
    assert.string(unitId, 'unitId');

    return this.request('getPlagiarismDetectionRuns', {
        classId: classId,
        unitId: unitId
    }, {
        'session_id' : session
    });
};
