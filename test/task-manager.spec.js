/* global Sandbox, describe, it, expect,  sinon, beforeEach */

var Promise = require('bluebird');
var request = sinon.stub().returns(Promise.resolve());

var TaskManager = Sandbox.require('../lib/task-manager', {
    requires: {'./request': request}
});

var ns = {
    auth: function () {},
    unsubscribe: function () {},
    subscribeAuthLast: function () {}
};

describe('TaskManager', function () {
    it('should be instantiable', function () {
        var taskManager = new TaskManager({origin: 'origin'});
        expect(taskManager).to.be.an.instanceof(TaskManager);
        expect(taskManager.options).to.be.eql({origin: 'origin'});
    });

    describe('api methods', function () {
        var taskManager;
        beforeEach(function () {
            request.resetHistory();
            taskManager = new TaskManager({origin: 'origin'});
            taskManager.setNs(ns);
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
            it('returns an error when the response status is an error', function () {
                sinon.stub(ns, 'subscribeAuthLast').callsFake(function (channelId, session, callback) {
                    setTimeout(function () {
                        callback({status: 'ERROR', errorMessage: 'error'}, 1);
                    }, 50);
                });

                return taskManager.pingTaskStatus('id')
                .then(function (response) {
                    expect(response).to.be.Undefined;
                })
                .catch(function (err) {
                    expect(err.message).to.be.eql('getTaskStatus returned an error: error');
                    ns.subscribeAuthLast.restore();
                });
            });

            it('returns task body in normal way', function () {
                sinon.stub(ns, 'subscribeAuthLast').callsFake(function (channelId, session, callback) {
                    setTimeout(function () {
                        callback({status: 'COMPLETED', result: 'done'}, 1);
                    }, 50);
                });

                return taskManager.pingTaskStatus('id')
                    .then(function (response) {
                        expect(response).to.be.eql('done');
                        ns.subscribeAuthLast.restore();
                    });
            });

            it('returns an error when the response status is unknown', function () {
                sinon.stub(ns, 'subscribeAuthLast').callsFake(function (channelId, session, callback) {
                    setTimeout(function () {
                        callback({status: 'STRANGE'}, 1);
                    }, 50);
                });

                return taskManager.pingTaskStatus('id')
                .then(function (response) {
                    expect(response).to.be.Undefined;
                })
                .catch(function (err) {
                    expect(err.message).to.be.eql('Unknown response status: STRANGE');
                    ns.subscribeAuthLast.restore();
                });
            });
        });
    });
});
