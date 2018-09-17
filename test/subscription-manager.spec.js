/* global describe, it, expect,  sinon, beforeEach */

var Promise = require('bluebird');
var proxyquire = require('proxyquire');

var request = sinon.stub().returns(Promise.resolve());
request.signed = sinon.stub().returns(Promise.resolve({message: ''}));

var SubscriptionManager = proxyquire('../lib/subscription-manager', {
    './request': request
});

describe('SubscriptionManager', function () {
    it('should be instantiable', function () {
        var sm = new SubscriptionManager({origin: 'origin'});
        expect(sm).to.be.an.instanceof(SubscriptionManager);
        expect(sm.options).to.be.eql({origin: 'origin'});
    });

    describe('api methods', function () {
        var sm;
        beforeEach(function () {
            request.resetHistory();
            request.signed.resetHistory();
            sm = new SubscriptionManager({});
        });

        describe('getSubscriptions', function () {
            it('throws when session is not a string', function () {
                expect(function () {
                    sm.getSubscriptions(null);
                }).toThrow;
            });
            it('calls the correct request', function () {

                return sm.getSubscriptions('my id')
                .then(function () {

                    expect(request).to.have.been.calledWith(
                        {},
                        'SubscriptionManager',
                        'getSubscriptions',
                        {},
                        {
                            session_id: 'my id'
                        }
                    );
                });
            });
        });
        describe('getSubscription', function () {
            it('calls the correct request without params', function () {

                return sm.getSubscription()
                .then(function () {

                    expect(request.signed).to.have.been.calledWith(
                        {},
                        'SubscriptionManager',
                        'getSubscription',
                        {}, {}
                    );
                });
            });
            it('calls the correct request', function () {

                return sm.getSubscription('my id')
                .then(function () {

                    expect(request.signed).to.have.been.calledWith(
                        {},
                        'SubscriptionManager',
                        'getSubscription',
                        {
                            organizationId: 'my id'
                        }, {}
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

                    return sm.getPlans('ORGANIZATION', 'my id')
                    .then(function () {

                        expect(request).to.have.been.calledWith(
                            {},
                            'SubscriptionManager',
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
