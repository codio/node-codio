/* global Sandbox, describe, it, expect,  sinon, beforeEach */

var req = {
    request: sinon.stub(),
    pingTaskStatus: sinon.stub()
};

var request = req.request;

var ContainerManager = Sandbox.require('../lib/container-manager', {
    requires: {'./request': req}
});

describe('ContainerManager', function () {

    it('should be instantiable', function () {
        var cm = new ContainerManager({origin: 'origin'});
        expect(cm).to.be.an.instanceof(ContainerManager);
        expect(cm.options).to.be.eql({origin: 'origin'});
    });

    describe('api methods', function () {
        var cm;
        beforeEach(function () {
            request.reset();
            cm = new ContainerManager({containerSecretKey: '1'}, function () { return '1'; });
        });

        describe('start', function () {
            it('calls the correct request', function () {
                var cb = sinon.spy();
                cm.start('test/test', cb);

                expect(request).to.have.been.calledWith(
                    {containerSecretKey: '1'},
                    'ContainerManager',
                    'start',
                    {
                        container: 'test/test',
                        uid: '1',
                        token: 'be7ec5502a6417d1c708108ba67002242d44f09d'
                    },
                    {
                    }
                );
            });
        });

        describe('stop', function () {
            it('calls the correct request', function () {
                var cb = sinon.spy();
                cm.stop('test/test', cb);

                expect(request).to.have.been.calledWith(
                    {containerSecretKey: '1'},
                    'ContainerManager',
                    'stop',
                    {
                        container: 'test/test',
                        uid: '1',
                        token: 'be7ec5502a6417d1c708108ba67002242d44f09d'
                    },
                    {
                    }
                );
            });
        });

    });
});
