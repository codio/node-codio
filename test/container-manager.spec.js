/* global Sandbox, describe, it, expect,  sinon, beforeEach */

var Promise = require('bluebird');
var request = sinon.stub().returns(Promise.resolve({message: ''}));

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
            request.reset();
            cm = new ContainerManager({containerSecretKey: '1'}, function () { return '1'; });
        });

        describe('start', function () {
            it('throws when container is not a string', function () {
                expect(function () {
                    cm.start({hello: 'world'});
                }).toThrow;
            });
            it('calls the correct request', function () {
                cm.start('test/test');

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
            it('throws when container is not a string', function () {
                expect(function () {
                    cm.stop({hello: 'world'});
                }).toThrow;
            });
            it('calls the correct request', function () {
                cm.stop('test/test');

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
        describe('info', function () {
            it('throws when container is not a string', function () {
                expect(function () {
                    cm.info({hello: 'world'});
                }).toThrow;
            });
            it('calls the correct request', function () {
                cm.info('test/test');

                expect(request).to.have.been.calledWith(
                    {containerSecretKey: '1'},
                    'ContainerManager',
                    'info',
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
