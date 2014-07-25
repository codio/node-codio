/* global Sandbox, describe, it, expect,  sinon, beforeEach */

var request = {signed: sinon.stub()};
var noop = function () {};

var ContainerManager = Sandbox.require('../lib/container-manager', {
    requires: {'./request': request}
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
            request.signed.reset();
            cm = new ContainerManager({containerSecretKey: '1'}, function () { return '1'; });
        });

        describe('start', function () {
            it('throws when container is not a string', function () {
                expect(function () {
                    cm.start({hello: 'world'}, noop);
                }).toThrow;
            });
            it('throws when callback is not a function', function () {
                expect(function () {
                    cm.start('world');
                }).toThrow;
            });
            it('calls the correct request', function () {
                var cb = sinon.spy();
                cm.start('test/test', cb);

                expect(request.signed).to.have.been.calledWith(
                    {containerSecretKey: '1'},
                    'ContainerManager',
                    'start',
                    {
                        container: 'test/test'
                    },
                    {
                    }
                );
            });
        });

        describe('stop', function () {
            it('throws when container is not a string', function () {
                expect(function () {
                    cm.stop({hello: 'world'}, noop);
                }).toThrow;
            });
            it('throws when callback is not a function', function () {
                expect(function () {
                    cm.stop('world');
                }).toThrow;
            });
            it('calls the correct request', function () {
                var cb = sinon.spy();
                cm.stop('test/test', cb);

                expect(request.signed).to.have.been.calledWith(
                    {containerSecretKey: '1'},
                    'ContainerManager',
                    'stop',
                    {
                        container: 'test/test'
                    },
                    {
                    }
                );
            });
        });
        describe('info', function () {
            it('throws when container is not a string', function () {
                expect(function () {
                    cm.info({hello: 'world'}, noop);
                }).toThrow;
            });
            it('throws when callback is not a function', function () {
                expect(function () {
                    cm.info('world');
                }).toThrow;
            });
            it('calls the correct request', function () {
                var cb = sinon.spy();
                cm.info('test/test', cb);

                expect(request.signed).to.have.been.calledWith(
                    {containerSecretKey: '1'},
                    'ContainerManager',
                    'info',
                    {
                        container: 'test/test'
                    },
                    {
                    }
                );
            });
        });
        describe('getPierContainerInfo', function () {
            it('throws when container is not a string', function () {
                expect(function () {
                    cm.info({hello: 'world'}, noop);
                }).toThrow;
            });
            it('throws when callback is not a function', function () {
                expect(function () {
                    cm.info('world');
                }).toThrow;
            });
            it('calls the correct request', function () {
                var cb = sinon.spy();
                cm.getPierContainerInfo('test/test', cb);

                expect(request.signed).to.have.been.calledWith(
                    {containerSecretKey: '1'},
                    'ContainerManager',
                    'getPierContainerInfo',
                    {
                        container: 'test/test'
                    },
                    {
                    }
                );
            });
        });
    });
});
