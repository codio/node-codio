/* global Sandbox, describe, it, expect,  sinon, beforeEach */

var Promise = require('bluebird');
var request = sinon.stub().returns(Promise.resolve());
request.signed = sinon.stub().returns(Promise.resolve({message: ''}));

var StacksManager = Sandbox.require('../lib/stacks-manager', {
    requires: {'./request': request}
});

describe('StacksManager', function () {
    it('should be instantiable', function () {
        var sm = new StacksManager({origin: 'origin'});
        expect(sm).to.be.an.instanceof(StacksManager);
        expect(sm.options).to.be.eql({origin: 'origin'});
    });

    describe('api methods', function () {
        var sm;
        beforeEach(function () {
            request.reset();
            request.signed.reset();
            sm = new StacksManager({});
        });

        describe('getStacksByIdInternal', function () {
            it('throws when session is not a string', function () {
                expect(function () {
                    sm.getStacksByIdInternal(null, 'session');
                }).toThrow;
            });
            it('calls the correct request', function () {

                sm.getStacksByIdInternal(['id1'], 'session')
                .then(function () {

                    expect(request).to.have.been.calledWith(
                        {},
                        'StacksManager',
                        'getStacksByIdInternal',
                        {
                            'ids': ['id1']
                        },
                        {
                            session_id: 'session'
                        }
                    );
                });
            });
        });
    });
});
