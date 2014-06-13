/* global Sandbox, describe, it, expect,  sinon, beforeEach */

var Promise = require('bluebird');
var request = sinon.stub().returns(Promise.resolve());

var TaskManager = Sandbox.require('../lib/task-manager', {
    requires: {'./request': request}
});


describe('TaskManager', function () {
    it('should be instantiable', function () {
        var taskManager = new TaskManager({origin: 'origin'});
        expect(taskManager).to.be.an.instanceof(TaskManager);
        expect(taskManager.options).to.be.eql({origin: 'origin'});
    });

    describe('api methods', function () {
        var taskManager;
        beforeEach(function () {
            request.reset();
            taskManager = new TaskManager({origin: 'origin'});
        });
        describe('getTaskStatus', function () {
            it('throws when id is not a string', function () {
                expect(function () {
                    taskManager.getTaskStatus({id: 'hello'});
                }).toThrow;
            });
            it('calls the correct request', function () {
                return taskManager.getTaskStatus('id')
                .then(function () {

                    expect(request).to.have.been.calledWithExactly(
                        {origin: 'origin'},
                        'TaskManager',
                        'getTaskStatus',
                        {
                            id: 'id'
                        },
                        {}
                    );
                });
            });
        });
        describe('pingTaskStatus', function () {
            it('throws when id is not a string', function () {
                expect(function () {
                    taskManager.pingTaskStatus({id: 'hello'});
                }).toThrow;
            });
            it('returns an error when getTaskStatus fails', function () {
                sinon.stub(taskManager, 'getTaskStatus').returns(
                    Promise.reject(new Error('error'))
                );

                return taskManager.pingTaskStatus('id')
                .then(function (response) {
                    expect(response).to.be.Undefined;
                })
                .catch(function (err) {
                    expect(err.message).to.be.eql('error');
                });
            });
            it('retries when when still processing', function () {
                sinon.stub(taskManager, 'getTaskStatus');

                taskManager.getTaskStatus.onCall(0).returns(Promise.resolve({
                    status: 'PROCESSING'
                }));

                taskManager.getTaskStatus.onCall(1).returns(Promise.resolve({
                    status: 'COMPLETED',
                    result: 'success'
                }));

                return taskManager.pingTaskStatus('id')
                .then(function (response) {

                    expect(response).to.be.eql('success');
                    expect(taskManager.getTaskStatus).to.have.beenCalledTwice;
                });
            });

            it('returns an error when the response status is an error', function () {
                sinon.stub(taskManager, 'getTaskStatus').returns(Promise.resolve({
                    status: 'ERROR',
                    errorMessage: 'broken'
                }));

                return taskManager.pingTaskStatus('id')
                .then(function (response) {
                    expect(response).to.be.Undefined;
                })
                .catch(function (err) {
                    expect(err.message).to.be.eql('getTaskStatus returned an error: broken');
                });
            });

            it('returns an error when the response status is unkown', function () {
                sinon.stub(taskManager, 'getTaskStatus').returns(Promise.resolve({
                    status: 'STRANGE'
                }));

                return taskManager.pingTaskStatus('id')
                .then(function (response) {
                    expect(response).to.be.Undefined;
                })
                .catch(function (err) {
                    expect(err.message).to.be.eql('Unkown response status: STRANGE');
                });
            });
        });
    });
});
