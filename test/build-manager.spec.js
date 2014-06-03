/* global Sandbox, describe, it, expect,  sinon, beforeEach */

var request = sinon.stub();
var noop = function () {};

var BuildManager = Sandbox.require('../lib/build-manager', {
    requires: {'./request': request}
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
            request.reset();
            bm = new BuildManager({});
        });

        describe('exportZip', function () {
            it('throws when id is not a string', function () {
                expect(function () {
                    bm.exportZip({hello: 'world'}, noop);
                }).toThrow;
            });
            it('throws when callback is not a function', function () {
                expect(function () {
                    bm.exportZip('world');
                }).toThrow;
            });
            it('calls the correct request', function () {
                var cb = sinon.spy();
                bm.exportZip('id', cb);

                expect(request).to.have.been.calledWith(
                    {},
                    'BuildManager',
                    'build',
                    {
                        guid: 'id',
                    },
                    {
                    }
                );
            });
        });
    });
});
