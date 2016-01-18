/* global Sandbox, describe, it, expect,    sinon, beforeEach */

var Promise = require('bluebird');
var request = sinon.stub();
request.signed = sinon.stub().returns(Promise.resolve({message: ''}));

var TaskManager = function () {
    this.pingTaskStatus =    sinon.stub().returns(Promise.resolve());
};

var ForwardingManager = Sandbox.require('../lib/forwarding-manager', {
    requires: {
        './request': request,
        './task-manager': TaskManager
    }
});

describe('ForwardingManager', function () {

    it('should be instantiate', function () {
        var manager = new ForwardingManager({origin: 'origin'});
        expect(manager).to.be.an.instanceof(ForwardingManager);
        expect(manager.options).to.be.eql({origin: 'origin'});
    });

    describe('api methods', function () {
        var manager;

        beforeEach(function () {
            request.signed.reset();
            manager = new ForwardingManager({origin: 'origin'});
        });

        describe('getForwardingInfo', function () {
            it('calls the correct request', function () {
                return manager.getForwardingInfo('localhost', 1000)
                    .then(function () {
                        expect(request.signed).to.have.been.calledWith(
                            {origin: 'origin'},
                            'ForwardingManager',
                            'getForwardingInfo',
                            {
                                proxy: 'localhost',
                                port: 1000
                            },
                            {}
                        );
                    });
            });
        });
    });
});
