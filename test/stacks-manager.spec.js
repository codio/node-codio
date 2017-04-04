/* global Sandbox, describe, it, expect,  sinon, beforeEach */

var Promise = require('bluebird');
var request = sinon.stub().returns(Promise.resolve());
request.signed = sinon.stub().returns(Promise.resolve({message: ''}));

var StacksManager = Sandbox.require('../lib/stacks-manager', {
  requires: {'./request': request}
});

describe('StacksManager', function () {
  it('should be instantiable', function () {
    var bm = new StacksManager({origin: 'origin'});
    expect(bm).to.be.an.instanceof(StacksManager);
    expect(bm.options).to.be.eql({origin: 'origin'});
  });

  describe('api methods', function () {
    var sm;
    beforeEach(function () {
      request.reset();
      sm = new StacksManager({});
    });

    describe('getStacksVersions', function () {
      it('throws when ids is not an array', function () {
        expect(function () {
          sm.exportZip(null, 'session');
        }).toThrow;
      });
      it('calls the correct request', function () {
        var ids = ['123'];
        sm.getStacksVersions(ids)
          .then(function () {

            expect(request).to.have.been.calledWith(
              {},
              'StacksManager',
              'getStacksVersions',
              {
                ids: ids
              },
              {
              }
            );
          });
      });
    });
  });
});
