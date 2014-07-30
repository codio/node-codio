/* global Sandbox, describe, it, expect,  sinon, beforeEach */

var Promise = require('bluebird');
var request = sinon.stub().returns(Promise.resolve({message: ''}));
request.signed = sinon.stub().returns(Promise.resolve({message: ''}));

var TaskManager = function () {
    this.pingTaskStatus =  sinon.stub().returns(Promise.resolve());
};

var ContainerManager = Sandbox.require('../lib/container-manager', {
    requires: {
        './request': request,
        './task-manager': TaskManager
    }
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
            request.signed.reset();
            cm = new ContainerManager({
                containerSecretKey: '1'
            }, function () { return '1'; });
        });

        describe('start', function () {
            it('throws when container is not a string', function () {
                expect(function () {
                    cm.start({hello: 'world'});
                }).toThrow;
            });
            it('calls the correct request', function () {
                return cm.start('test/test')
                .then(function () {
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
        });

        describe('stop', function () {
            it('throws when container is not a string', function () {
                expect(function () {
                    cm.stop({hello: 'world'});
                }).toThrow;
            });
            it('calls the correct request', function () {
                return cm.stop('test/test')
                .then(function () {
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
        });
        describe('info', function () {
            it('throws when container is not a string', function () {
                expect(function () {
                    cm.info({hello: 'world'});
                }).toThrow;
            });
            it('calls the correct request', function () {
                return cm.info('test/test')
                .then(function () {
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
        });
        describe('getPierContainerInfo', function () {
            it('throws when container is not a string', function () {
                expect(function () {
                    cm.info({hello: 'world'});
                }).toThrow;
            });
            it('calls the correct request', function () {
                return cm.getPierContainerInfo('test/test')
                .then(function () {
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
});
