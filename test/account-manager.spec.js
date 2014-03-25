/* global Sandbox, describe, it, expect,  sinon, beforeEach */

var req = {
    request: sinon.stub(),
    pingTaskStatus: sinon.stub()
};

var request = req.request;

var AccountManager = Sandbox.require('../lib/account-manager', {
    requires: {'./request': req}
});


describe('AccountManager', function () {
    it('should be instantiable', function () {
        var asm = new AccountManager({origin: 'origin'});
        expect(asm).to.be.an.instanceof(AccountManager);
        expect(asm.options).to.be.eql({origin: 'origin'});
    });

    describe('api methods', function () {
        var asm;
        beforeEach(function () {
            request.reset();
            asm = new AccountManager({origin: 'origin'});
        });
        describe('getMyInfo', function () {
            it('calls the correct request', function () {
                var cb = sinon.spy();
                asm.getMyInfo('id', cb);

                expect(request).to.have.been.calledWithExactly(
                    {origin: 'origin'},
                    'AccountManager',
                    'getMyInfo',
                    {},
                    {session_id: 'id'},
                    cb
                );
            });
        });
    });
});
