/* global Sandbox, describe, it, expect,  sinon, beforeEach */

var Promise = require('bluebird');
var request = sinon.stub().returns(Promise.resolve());

var AccountManager = Sandbox.require('../lib/account-manager', {
    requires: {'./request': request}
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
            request.reset();
            am = new AccountManager({});
        });

        describe('getMyInfo', function () {
            it('throws when session is not a string', function () {
                expect(function () {
                    am.getMyInfo(null);
                }).toThrow;
            });
            it('calls the correct request', function () {

                am.getMyInfo('my id')
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
    });
});
