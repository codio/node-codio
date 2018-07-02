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
          sm.getStacksVersions(null);
        }).toThrow;
      });
      it('calls the correct request', function () {
        var ids = ['123'];
        sm.getStacksVersions(ids)
          .then(function () {

            expect(request.signed).to.have.been.calledWith(
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

    describe('getStackById', function () {
      it('throws when id is not an string', function () {
        expect(function () {
          sm.getStackById(null);
        }).toThrow;
      });
      it('calls the correct request', function () {
        var id = '123';
        sm.getStackById(id)
          .then(function () {

            expect(request.signed).to.have.been.calledWith(
              {},
              'StacksManager',
              'getStackById',
              {
                id: id
              },
              {
              }
            );
          });
      });
    });

    describe('publishVersion', function () {
      it('throws when data is not passed', function () {
        expect(function () {
          sm.publishVersion(null);
        }).toThrow;
      });
      it('calls the correct request', function () {
        var data = {
          source: 'source',
          version: '1',
          description: 'description',
          stackId: 'stack-id',
          userId: 'user-id',
          replyParameters: {task: 'task'}
        };
        sm.publishVersion(data)
          .then(function () {

            expect(request.signed).to.have.been.calledWith(
              {},
              'StacksManager',
              'publishVersion',
              data,
              {}
            );
          });
      });
    });

    describe('createStack', function () {
      it('throws when data is not passed', function () {
        expect(function () {
          sm.createStack(null, 'session');
        }).toThrow;
      });
      it('calls the correct request', function () {
        var data = {
          source: 'source',
          image: 'image-url',
          isPrivate: true,
          isPublished: false,
          shortDescription: 'short',
          longDescription: 'long',
          owner: 'owner-id',
          name: 'stack-name',
          userId: 'user-id',
          replyParameters: {task: 'task'},
          tags: []
        };
        sm.createStack(data)
          .then(function () {

            expect(request.signed).to.have.been.calledWith(
              {},
              'StacksManager',
              'createStack',
              data,
              {}
            );
          });
      });
    });
  });
});
