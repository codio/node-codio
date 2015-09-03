/* global Sandbox, describe, it, expect,  sinon, beforeEach */

var Promise = require('bluebird');
var request = sinon.stub().returns(Promise.resolve());

var SubscriptionsManager = Sandbox.require('../lib/subscriptions-manager', {
    requires: {'./request': request}
});

describe('SubscriptionsManager', function () {
    it('should be instantiable', function () {
        var sm = new SubscriptionsManager({origin: 'origin'});
        expect(sm).to.be.an.instanceof(SubscriptionsManager);
        expect(sm.options).to.be.eql({origin: 'origin'});
    });

    describe('api methods', function () {
        var sm;
        beforeEach(function () {
            request.reset();
            sm = new SubscriptionsManager({});
        });

        describe('getSubscriptions', function () {
            it('throws when session is not a string', function () {
                expect(function () {
                    sm.getSubscriptions(null);
                }).toThrow;
            });
            it('calls the correct request', function () {

                sm.getSubscriptions('my id')
                .then(function () {

                    expect(request).to.have.been.calledWith(
                        {},
                        'SubscriptionsManager',
                        'getSubscriptions',
                        {},
                        {
                            session_id: 'my id'
                        }
                    );
                });
            });
        });
        describe('getPlans', function () {
            it('throws when session is not a string', function () {
                expect(function () {
                    sm.getPlans(null);
                }).toThrow;
            });
            it('calls the correct request', function () {

                sm.getPlans('ORGANIZATION', 'my id')
                    .then(function () {

                        expect(request).to.have.been.calledWith(
                            {},
                            'SubscriptionsManager',
                            'getPlans',
                            {
                                customerType: 'ORGANIZATION'
                            },
                            {
                                session_id: 'my id'
                            }
                        );
                    });
            });
        });

    });
});
