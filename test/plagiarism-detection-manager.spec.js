/* global Sandbox, describe, it, expect,    sinon, beforeEach */

var Promise = require('bluebird');

var request = sinon.stub().returns(Promise.resolve());

var PlagiarismDetectionManager = Sandbox.require('../lib/plagiarism-detection-manager', {
    requires: {
        './request': request
    }
});

describe('PlagiarismDetectionManager', function () {

    it('should be instantiate', function () {
        var manager = new PlagiarismDetectionManager({origin: 'origin'});
        expect(manager).to.be.an.instanceof(PlagiarismDetectionManager);
        expect(manager.options).to.be.eql({origin: 'origin'});
    });

    describe('api methods', function () {
        var manager;

        beforeEach(function () {
            request.reset();
            manager = new PlagiarismDetectionManager({origin: 'origin'});
        });

        describe('detectPlagiarism', function () {
            it('calls the correct request', function () {
                return manager.detectPlagiarism('classId', 'unitId',
                    ['id', 'id1'], 'unit_source', ['mask1', 'mask2'],
                    'root', 'bucket', 'key', 'session')
                    .then(function () {
                        expect(request).to.have.been.calledWith(
                            {origin: 'origin'},
                            'PlagiarismDetectionManager',
                            'detectPlagiarism',
                            {
                                classId: 'classId',
                                unitId: 'unitId',
                                projectIds: ['id', 'id1'],
                                unitSource: 'unit_source',
                                masks: ['mask1', 'mask2'],
                                rootPath: 'root',
                                previousSources: {bucket: 'bucket', key: 'key'}
                            },
                            {
                                session_id: 'session'
                            }
                        );
                    });
            });
        });
        describe('getPlagiarismDetectionRuns', function () {
            it('calls the correct request', function () {
                return manager.getPlagiarismDetectionRuns('classId', 'unitId', 'session')
                    .then(function () {
                        expect(request).to.have.been.calledWith(
                            {origin: 'origin'},
                            'PlagiarismDetectionManager',
                            'getPlagiarismDetectionRuns',
                            {
                                classId: 'classId',
                                unitId: 'unitId'
                            },
                            {
                                session_id: 'session'
                            }
                        );
                    });
            });
        });
    });
});
