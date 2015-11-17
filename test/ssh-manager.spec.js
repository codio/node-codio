/* global Sandbox, describe, it, expect,  sinon, beforeEach */

var Promise = require('bluebird');
var request = sinon.stub();
request.signed = sinon.stub().returns(Promise.resolve({message: ''}));

var TaskManager = function () {
    this.pingTaskStatus =  sinon.stub().returns(Promise.resolve());
};

var SshManager = Sandbox.require('../lib/ssh-manager', {
    requires: {
        './request': request,
        './task-manager': TaskManager
    }
});


describe('SshManager', function () {

    it('should be instantiate', function () {
        var ssh = new SshManager({origin: 'origin'});
        expect(ssh).to.be.an.instanceof(SshManager);
        expect(ssh.options).to.be.eql({origin: 'origin'});
    });

    describe('api methods', function () {
        var ssh;

        beforeEach(function () {
            request.signed.reset();
            ssh = new SshManager({origin: 'origin'});
        });

        describe('getSshConnectDetails', function () {
            it('calls the correct request', function () {
                return ssh.getSshConnectDetails('user', 'container')
                .then(function () {
                    expect(request.signed).to.have.been.calledWith(
                        {origin: 'origin'},
                        'SshPtyManager',
                        'getContainerSsh',
                        {
                            container: 'container',
                            userName: 'user'
                        },
                        {}
                    );
                });
            });

            it('calls the correct request with session', function () {
                return ssh.getSshConnectDetails('user', 'container', 'session')
                    .then(function () {
                        expect(request.signed).to.have.been.calledWith(
                            {origin: 'origin'},
                            'SshPtyManager',
                            'getContainerSsh',
                            {
                                container: 'container',
                                userName: 'user'
                            },
                            {
                                session_id: 'session'
                            }
                        );
                    });
            });
        });

        describe('getMySshConnectDetails', function () {
            it('calls the correct request', function () {
                return ssh.getMySshConnectDetails('session', 'container')
                .then(function () {

                    expect(request.signed).to.have.been.calledWith(
                        {origin: 'origin'},
                        'SshPtyManager',
                        'getContainerSsh',
                        {
                            container: 'container'
                        },
                        { session_id: 'session' }
                    );
                });
            });
        });
    });
});
