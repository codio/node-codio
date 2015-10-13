/* global Sandbox, describe, it, expect,  sinon, beforeEach*/

var Promise = require('bluebird');
var request = sinon.stub().returns(Promise.resolve({message: ''}));
request.file = sinon.stub().returns(Promise.resolve({message: ''}));
request.signed = sinon.stub().returns(Promise.resolve({message: ''}));

var TaskManager = function () {
    this.pingTaskStatus =  sinon.stub().returns(Promise.resolve());
};

var ImportManager = Sandbox.require('../lib/import-manager', {
    requires: {
        './request': request,
        './task-manager': TaskManager
    }
});


describe('ImportManager', function () {

    it('should be instantiable', function () {
        var importManager = new ImportManager({origin: 'origin'});
        expect(importManager).to.be.an.instanceof(ImportManager);
        expect(importManager.options).to.be.eql({origin: 'origin'});
    });

    describe('api methods', function () {
        var importManager;
        beforeEach(function () {
            request.reset();
            request.file.reset();
            importManager = new ImportManager({origin: 'origin'});
        });
        describe('importFromZip', function () {
            it('calls the correct request', function () {

                return importManager.importFromZip('file', {
                    filename: 'file.zip',
                    isPublic: false,
                    desc: 'desc',
                    session: 'id'
                })
                .then(function () {
                    expect(request.file).to.have.been.calledWithExactly(
                        {origin: 'origin'},
                        'ImportManager',
                        'importFromZip',
                        {
                            file: 'file',
                            is_public: 'false',
                            description: 'desc',
                            fileName: 'file.zip'
                        },
                        {
                            session_id: 'id'
                        }
                    );
                });
            });
        });
        describe('importFromS3', function () {
            it('calls the correct request', function () {

                return importManager.importFromS3('/path/to/file', {
                    name: 'my-proj',
                    isPublic: false,
                    description: 'description',
                    session: 'id'
                })
                .then(function () {
                    expect(request).to.have.been.calledWithExactly(
                        {origin: 'origin'},
                        'ImportManager',
                        'importFromS3',
                        {
                            filePath: '/path/to/file',
                            is_public: 'false',
                            description: 'description',
                            name: 'my-proj'
                        },
                        {
                            session_id: 'id'
                        }
                    );
                });
            });
        });

        describe('restoreContent', function () {
            it('calls the correct request', function () {

                return importManager.restoreContent('user', 'project', 'url', ['src'])
                .then(function () {
                    expect(request.signed).to.have.been.calledWithExactly(
                        {origin: 'origin'},
                        'ImportManager',
                        'restoreContent',
                        {
                            user: 'user',
                            project: 'project',
                            url: 'url',
                            restore: ['src']
                        }, {}
                    );
                });
            });
        });
    });
});
