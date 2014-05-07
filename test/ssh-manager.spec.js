/* global Sandbox, describe, it, expect,  sinon, beforeEach */

var request = {};
request.signed = sinon.stub();

var SshManager = Sandbox.require('../lib/ssh-manager', {
    requires: {'./request': request}
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
                var cb = sinon.spy();
                ssh.getSshConnectDetails('user', 'container', cb);

                expect(request.signed).to.have.been.calledWith(
                    {origin: 'origin'},
                    'SshManager',
                    'getSshConnectDetails',
                    {
                        container: 'container',
                        userName: 'user'
                    },
                    {}
                );
            });
        });

        describe('getMySshConnectDetails', function () {
            it('calls the correct request', function () {
                var cb = sinon.spy();
                ssh.getMySshConnectDetails('session', 'container', cb);

                expect(request.signed).to.have.been.calledWith(
                    {origin: 'origin'},
                    'SshManager',
                    'getMySshConnectDetails',
                    {
                        container: 'container',
                    },
                    { session_id: 'session' }
                );
            });
        });

        describe('getHostDetailsBySsh', function () {
            it('calls the correct request', function () {
                var cb = sinon.spy();
                ssh.getHostDetailsBySsh('host', 'port', cb);

                expect(request.signed).to.have.been.calledWith(
                    {origin: 'origin'},
                    'SshManager',
                    'getHostDetailsBySsh',
                    {
                        host: 'host',
                        port: 'port'
                    },
                    {}
                );
            });
        });
    });
});
