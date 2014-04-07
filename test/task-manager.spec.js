/* global Sandbox, describe, it, expect,  sinon, beforeEach */


var request = sinon.stub();

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
                    taskManager.getTaskStatus({id: 'hello'}, function () {});
                }).toThrow;
            });
            it('throws when callback is not a function', function () {
                expect(function () {
                    taskManager.getTaskStatus('hello');
                }).toThrow;
            });
            it('calls the correct request', function () {
                var cb = sinon.spy();
                taskManager.getTaskStatus('id', cb);

                expect(request).to.have.been.calledWithExactly(
                    {origin: 'origin'},
                    'TaskManager',
                    'getTaskStatus',
                    {
                        id: 'id'
                    },
                    {},
                    cb
                );
            });
        });
        describe('pingTaskStatus', function () {
            it('throws when id is not a string', function () {
                expect(function () {
                    taskManager.pingTaskStatus({id: 'hello'}, function () {});
                }).toThrow;
            });
            it('throws when callback is not a function', function () {
                expect(function () {
                    taskManager.pingTaskStatus('hello');
                }).toThrow;
            });
            it('returns an error when getTaskStatus fails', function (done) {
                sinon.stub(taskManager, 'getTaskStatus').callsArgWith(1, new Error('error'));
                taskManager.pingTaskStatus('id', function (err, response) {
                    expect(err.message).to.be.eql('getTaskStatus failed for: id: error');
                    expect(response).to.be.Undefined;
                    done();
                });
            });
            it('retries when when still processing', function (done) {
                sinon.stub(taskManager, 'getTaskStatus');
                taskManager.getTaskStatus.onCall(0).callsArgWith(1, null, {
                    status: 'PROCESSING'
                });
                taskManager.getTaskStatus.onCall(1).callsArgWith(1, null, {
                    status: 'COMPLETED',
                    result: 'success'
                });
                taskManager.pingTaskStatus('id', function (err, response) {
                    expect(err).to.be.Undefined;
                    expect(response).to.be.eql('success');
                    expect(taskManager.getTaskStatus).to.have.beenCalledTwice;
                    done();
                });
            });
            it('returns an error when the response status is an error', function (done) {
                sinon.stub(taskManager, 'getTaskStatus').callsArgWith(1, null, {
                    status: 'ERROR',
                    errorMessage: 'broken'
                });
                taskManager.pingTaskStatus('id', function (err, response) {
                    expect(err.message).to.be.eql('getTaskStatus returned an error: broken');
                    expect(response).to.be.Undefined;
                    done();
                });
            });
            it('returns an error when the response status is unkown', function (done) {
                sinon.stub(taskManager, 'getTaskStatus').callsArgWith(1, null, {
                    status: 'STRANGE'
                });
                taskManager.pingTaskStatus('id', function (err, response) {
                    expect(err.message).to.be.eql('Unkown response status: STRANGE');
                    expect(response).to.be.Undefined;
                    done();
                });
            });
        });
    });
});
