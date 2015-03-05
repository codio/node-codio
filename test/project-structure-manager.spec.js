/* global Sandbox, describe, it, expect,  sinon, beforeEach */

var Promise = require('bluebird');
var request = sinon.stub().returns(Promise.resolve());
request.signed = sinon.stub().returns(Promise.resolve());

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

                return psm.getFile('path', info)
                .then(function () {

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
                        }
                    );
                });
            });
        });
        describe('updateFile', function () {
            it('calls the correct request', function () {

                return psm.updateFile('path', 'content', info)
                .then(function () {

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
                        }
                    );
                });
            });
        });
        describe('removePath', function () {
            it('works with a string', function () {

                return psm.removePath('path', info)
                .then(function () {

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
                        }
                    );
                });
            });
            it('works with an array of paths', function () {

                return psm.removePath(['path1', 'path2'], info)
                .then(function () {

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
                        }
                    );
                });
            });
        });
        describe('createFile', function () {
            it('calls the correct request', function () {

                return psm.createFile('path', null, info)
                .then(function () {

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
                        }
                    );
                });
            });
        });
        describe('moveItem', function () {
            it('calls the correct request', function () {

                return psm.moveItem(['srcPath'], ['destPath'], info)
                .then(function () {

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
                        }
                    );
                });
            });
        });
        describe('copyItem', function () {
            it('calls the correct request', function () {

                return psm.copyItem(['srcPath'], ['destPath'], info)
                .then(function () {

                    expect(request).to.have.been.calledWithExactly(
                        {origin: 'origin'},
                        'ProjectStructureManager',
                        'copyItem',
                        {
                            userName: 'user',
                            projectName: 'project',
                            sourcePath: ['srcPath'],
                            destinationPath: ['destPath']
                        },
                        {
                            session_id: 'id'
                        }
                    );
                });
            });
        });
        describe('makeDirectory', function () {
            it('calls the correct request', function () {

                return psm.makeDirectory('path', info)
                .then(function () {

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
                        }
                    );
                });
            });
        });
        describe('internalUpdateFile', function () {
            it('calls the correct request', function () {

                return psm.internalUpdateFile('path', 'content', info)
                    .then(function () {

                        expect(request.signed).to.have.been.calledWithExactly(
                            {origin: 'origin'},
                            'ProjectStructureManager',
                            'internalUpdateFile',
                            {
                                userName: 'user',
                                projectName: 'project',
                                path: 'path',
                                content : (new Buffer('content')).toString('base64')
                            },
                            {
                                session_id: 'id'
                            }
                        );
                    });
            });
        });
        describe('getFileInfo', function () {
            it('calls the correct request', function () {

                return psm.getFileInfo('path', info)
                    .then(function () {

                        expect(request.signed).to.have.been.calledWithExactly(
                            {origin: 'origin'},
                            'ProjectStructureManager',
                            'getFileInfo',
                            {
                                userName: 'user',
                                projectName: 'project',
                                path: 'path'
                            },
                            {
                                session_id: 'id'
                            }
                        );
                    });
            });
        });
    });
});
