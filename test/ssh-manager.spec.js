/* global Sandbox, describe, it, expect,  sinon, beforeEach */

var request = sinon.stub();
request.signed = sinon.stub();

var SshManager = Sandbox.require('../lib/ssh-manager', {
    requires: {'./request': request}
});


describe('SshManager', function () {
    it('should be instantiate', function () {
        var psm = new SshManager({origin: 'origin'});
        expect(psm).to.be.an.instanceof(SshManager);
        expect(psm.options).to.be.eql({origin: 'origin'});
    });

    describe('api methods', function () {
        var psm;

        beforeEach(function () {
            request.signed.reset();
            psm = new SshManager({origin: 'origin'});
        });

        describe('getSshConnectDetails', function () {
            it('calls the correct request', function () {
                var cb = sinon.spy();
                psm.getSshConnectDetails('user', 'container', cb);

                expect(request.signed).to.have.been.calledWith(
                    {origin: 'origin'},
                    'SshManager',
                    'getSshConnectDetails',
                    {
                        container: 'container',
                        userName: 'user'
                    },
                    {},
                    cb
                );
            });
        });

        describe('getMySshConnectDetails', function () {
            it('calls the correct request', function () {
                var cb = sinon.spy();
                psm.getMySshConnectDetails('session', 'container', cb);

                expect(request.signed).to.have.been.calledWith(
                    {origin: 'origin'},
                    'SshManager',
                    'getMySshConnectDetails',
                    {
                        container: 'container',
                    },
                    { session_id: 'session' },
                    cb
                );
            });
        });

        describe('getHostDetailsBySsh', function () {
            it('calls the correct request', function () {
                var cb = sinon.spy();
                psm.getHostDetailsBySsh('host', 'port', cb);

                expect(request.signed).to.have.been.calledWith(
                    {origin: 'origin'},
                    'SshManager',
                    'getHostDetailsBySsh',
                    {
                        host: 'host',
                        port: 'port'
                    },
                    {},
                    cb
                );
            });
        });
    });
});