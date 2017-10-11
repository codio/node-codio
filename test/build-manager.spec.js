/* global Sandbox, describe, it, expect,  sinon, beforeEach */

var Promise = require('bluebird');
var request = sinon.stub().returns(Promise.resolve({}));
request.signed = sinon.stub().returns(Promise.resolve({message: ''}));

var TaskManager = function () {
  this.pingTaskStatus =  sinon.stub().returns(Promise.resolve());
};

var BuildManager = Sandbox.require('../lib/build-manager', {
    requires: {'./request': request, './task-manager': TaskManager}
});

describe('BuildManager', function () {
    it('should be instantiable', function () {
        var bm = new BuildManager({origin: 'origin'});
        expect(bm).to.be.an.instanceof(BuildManager);
        expect(bm.options).to.be.eql({origin: 'origin'});
    });

    describe('api methods', function () {
        var bm;
        beforeEach(function () {
            request.resetHistory();
            bm = new BuildManager({});
        });

        describe('exportZip', function () {
            it('throws when id is not a string', function () {
                expect(function () {
                    bm.exportZip(null, 'session');
                }).toThrow;
            });
            it('throws when session is not a string', function () {
                expect(function () {
                    bm.exportZip('world', null);
                }).toThrow;
            });
            it('calls the correct request', function () {
                bm.exportZip('id', 'session')
                .then(function () {

                    expect(request).to.have.been.calledWith(
                        {},
                        'BuildManager',
                        'build',
                        {
                            guid: 'id'
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
