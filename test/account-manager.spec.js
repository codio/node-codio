/* global describe, it, expect,  sinon, beforeEach */

var Promise = require('bluebird');
var proxyquire = require('proxyquire');

var request = sinon.stub().returns(Promise.resolve());
request.signed = sinon.stub().returns(Promise.resolve({message: ''}));

var AccountManager = proxyquire('../lib/account-manager',
    {
        './request': request
    });

describe('AccountManager', function () {
    it('should be instantiable', function () {
        var am = new AccountManager({origin: 'origin'});
        expect(am).to.be.an.instanceof(AccountManager);
        expect(am.options).to.be.eql({origin: 'origin'});
    });

    describe('api methods', function () {
        var am;
        beforeEach(function () {
            request.resetHistory();
            am = new AccountManager({});
        });

        describe('getMyInfo', function () {
            it('throws when session is not a string', function () {
                expect(function () {
                    am.getMyInfo(null);
                }).toThrow;
            });
            it('calls the correct request', function () {

                return am.getMyInfo('my id')
                .then(function () {

                    expect(request).to.have.been.calledWith(
                        {},
                        'AccountManager',
                        'getMyInfo',
                        {},
                        {
                            session_id: 'my id'
                        }
                    );
                });
            });
        });

        describe('get', function () {
            it('throws when id is not a string', function () {
                expect(function () {
                    am.get(null, 'session');
                }).toThrow;
            });

            it('throws when session is not a string', function () {
                expect(function () {
                    am.get('id', null);
                }).toThrow;
            });

            it('calls the correct request', function () {

                return am.get('id', 'session')
                .then(function () {

                    expect(request).to.have.been.calledWith(
                        {},
                        'AccountManager',
                        'getAccount',
                        {
                            id: 'id'
                        },
                        {
                            session_id: 'session'
                        }
                    );
                });
            });
        });

        describe('ensureLtiUser', function () {
            it('calls the correct request', function () {
                var data = {id: 'id'};
                return am.ensureLtiUser(data)
                .then(function () {

                    expect(request.signed).to.have.been.calledWith(
                        {},
                        'AccountManager',
                        'ensureLtiUser',
                        data,
                        {}
                    );
                });
            });
        });

        describe('isEmailInUse', function () {
            it('calls the correct request', function () {
                return am.isEmailInUse('email')
                .then(function () {

                    expect(request).to.have.been.calledWith(
                        {},
                        'AccountManager',
                        'isEmailInUse',
                        {email: 'email'},
                        {}
                    );
                });
            });
        });

        describe('removeAccount', function () {
            it('calls the correct request', function () {
                return am.removeAccount('session')
                .then(function () {

                    expect(request).to.have.been.calledWith(
                        {},
                        'AccountManager',
                        'removeAccount',
                        {},
                        {session_id: 'session'}
                    );
                });
            });
        });

        describe('getSessionStats', function () {
            it('calls the correct request', function () {
                return am.getSessionStats(['1'], '2W')
                .then(function () {

                    expect(request.signed).to.have.been.calledWith(
                        {},
                        'AccountManager',
                        'getSessionStats',
                        {ids: ['1'], period: '2W'},
                        {}
                    );
                });
            });
        });
    });
});
