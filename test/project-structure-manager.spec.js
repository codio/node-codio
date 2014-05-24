/* global Sandbox, describe, it, expect,  sinon, beforeEach */

var request = sinon.stub();

var ProjectStructureManager = Sandbox.require('../lib/project-structure-manager', {
    requires: {'./request': request}
});


describe('ProjectStructureManager', function () {
    var info = {
        user: 'user',
        project: 'project',
        session: 'id'
    };

    it('should be instantiable', function () {
        var psm = new ProjectStructureManager({origin: 'origin'});
        expect(psm).to.be.an.instanceof(ProjectStructureManager);
        expect(psm.options).to.be.eql({origin: 'origin'});
    });

    describe('api methods', function () {
        var psm;
        beforeEach(function () {
            request.reset();
            psm = new ProjectStructureManager({origin: 'origin'});
        });

        describe('getFile', function () {
            it('calls the correct request', function () {
                var cb = sinon.spy();
                psm.getFile('path', info, cb);

                expect(request).to.have.been.calledWithExactly(
                    {origin: 'origin'},
                    'ProjectStructureManager',
                    'getFile',
                    {
                        userName: 'user',
                        projectName: 'project',
                        path: 'path',
                        format: 'plain'
                    },
                    {
                        session_id: 'id'
                    },
                    cb
                );
            });
        });
        describe('updateFile', function () {
            it('calls the correct request', function () {
                var cb = sinon.spy();
                psm.updateFile('path', 'content', info, cb);

                expect(request).to.have.been.calledWithExactly(
                    {origin: 'origin'},
                    'ProjectStructureManager',
                    'updateFile',
                    {
                        userName: 'user',
                        projectName: 'project',
                        path: 'path',
                        content: (new Buffer('content')).toString('base64')
                    },
                    {
                        session_id: 'id'
                    },
                    cb
                );
            });
        });
        describe('updateFileWithOt', function () {
            it('calls the correct request', function () {
                var cb = sinon.spy();
                psm.updateFileWithOt('path', ['1'], info, cb);

                expect(request).to.have.been.calledWithExactly(
                    {origin: 'origin'},
                    'ProjectStructureManager',
                    'updateFileWithOt',
                    {
                        userName: 'user',
                        projectName: 'project',
                        path: 'path',
                        ops: ['1']
                    },
                    {
                        session_id: 'id'
                    },
                    cb
                );
            });
        });
        describe('removePath', function () {
            it('works with a string', function () {
                var cb = sinon.spy();
                psm.removePath('path', info, cb);

                expect(request).to.have.been.calledWithExactly(
                    {origin: 'origin'},
                    'ProjectStructureManager',
                    'removePath',
                    {
                        userName: 'user',
                        projectName: 'project',
                        path: ['path'],
                    },
                    {
                        session_id: 'id'
                    },
                    cb
                );
            });
            it('works with an array of paths', function () {
                var cb = sinon.spy();
                psm.removePath(['path1', 'path2'], info, cb);

                expect(request).to.have.been.calledWithExactly(
                    {origin: 'origin'},
                    'ProjectStructureManager',
                    'removePath',
                    {
                        userName: 'user',
                        projectName: 'project',
                        path: ['path1', 'path2'],
                    },
                    {
                        session_id: 'id'
                    },
                    cb
                );
            });
        });
        describe('createFile', function () {
            it('calls the correct request', function () {
                var cb = sinon.spy();
                psm.createFile('path', null, info, cb);

                expect(request).to.have.been.calledWithExactly(
                    {origin: 'origin'},
                    'ProjectStructureManager',
                    'createFile',
                    {
                        userName: 'user',
                        projectName: 'project',
                        path: 'path',
                        template: ''
                    },
                    {
                        session_id: 'id'
                    },
                    cb
                );
            });
        });
        describe('moveItem', function () {
            it('calls the correct request', function () {
                var cb = sinon.spy();
                psm.moveItem(['srcPath'], ['destPath'], info, cb);

                expect(request).to.have.been.calledWithExactly(
                    {origin: 'origin'},
                    'ProjectStructureManager',
                    'moveItem',
                    {
                        userName: 'user',
                        projectName: 'project',
                        sourcePath: ['srcPath'],
                        destinationPath: ['destPath']
                    },
                    {
                        session_id: 'id'
                    },
                    cb
                );
            });
        });
        describe('copyItem', function () {
            it('calls the correct request', function () {
                var cb = sinon.spy();
                psm.copyItem('srcPath', 'destPath', info, cb);

                expect(request).to.have.been.calledWithExactly(
                    {origin: 'origin'},
                    'ProjectStructureManager',
                    'copyItem',
                    {
                        userName: 'user',
                        projectName: 'project',
                        sourcePath: 'srcPath',
                        destinationPath: 'destPath'
                    },
                    {
                        session_id: 'id'
                    },
                    cb
                );
            });
        });
        describe('makeDirectory', function () {
            it('calls the correct request', function () {
                var cb = sinon.spy();
                psm.makeDirectory('path', info, cb);

                expect(request).to.have.been.calledWithExactly(
                    {origin: 'origin'},
                    'ProjectStructureManager',
                    'makeDirectory',
                    {
                        userName: 'user',
                        projectName: 'project',
                        path: 'path'
                    },
                    {
                        session_id: 'id'
                    },
                    cb
                );
            });
        });
    });
});
