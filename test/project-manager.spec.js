/* global Sandbox, describe, it, expect,  sinon, beforeEach */

var Promise = require('bluebird');
var request = sinon.stub().returns(Promise.resolve());
request.signed = sinon.stub().returns(Promise.resolve({message: ''}));

var ProjectManager = Sandbox.require('../lib/project-manager', {
    requires: {'./request': request}
});


describe('ProjectManager', function () {
    var info = {
        user: 'user',
        project: 'project',
        session: 'id'
    };

    it('should be instantiable', function () {
        var psm = new ProjectManager({origin: 'origin'});
        expect(psm).to.be.an.instanceof(ProjectManager);
        expect(psm.options).to.be.eql({origin: 'origin'});
    });

    describe('api methods', function () {
        var psm;
        beforeEach(function () {
            request.reset();
            psm = new ProjectManager({origin: 'origin'});
        });
        describe('getBrojectByName', function () {
            it('calls the correct request', function () {
                return psm.getProjectByName('name', info)
                .then(function () {
                    expect(request).to.have.been.calledWithExactly(
                        {origin: 'origin'},
                        'ProjectManager',
                        'getProjectByName',
                        {
                            accountName: 'user',
                            projectName: 'name'
                        },
                        {
                            session_id: 'id'
                        }
                    );
                });
            });
        });

        describe('getProjects', function () {
            it('calls the correct request', function () {
                return psm.getProjects(info.user, info.session)
                    .then(function () {
                        expect(request).to.have.been.calledWithExactly(
                            {origin: 'origin'},
                            'ProjectManager',
                            'getProjects',
                            {
                                account: 'user'
                            },
                            {
                                session_id: 'id'
                            }
                        );
                    });
            });
        });

        describe('getPermissionForProject', function () {
            it('calls the correct request', function () {
                var cred = {
                    project: {
                        owner: 'owner',
                        name: 'name'
                    },
                    session: 'id'
                };

                return psm.getPermissionForProject(cred, function () {
                    expect(request).to.have.been.calledWithExactly(
                        {origin: 'origin'},
                        'ProjectManager',
                        'getPermissionForProject',
                        {
                            accountName: 'owner',
                            projectName: 'name'
                        },
                        {
                            session_id: 'id'
                        }
                    );
                });
            });
        });
        describe('getBrojectByName', function () {
            it('calls the correct request', function () {

                var project = {
                    guid: 'guid',
                    name: 'name',
                    description: 'desc',
                    is_public: false,
                    permissions: {}
                };
                return psm.updateProject(project, {
                    owner: 'owner',
                    session: 'id'
                })
                .then(function () {

                    expect(request).to.have.been.calledWithExactly(
                        {origin: 'origin'},
                        'ProjectManager',
                        'updateProject',
                        {
                            account: 'owner',
                            project: project
                        },
                        {
                            session_id: 'id'
                        }
                    );
                });
            });
        });

        describe('remove', function () {
            it('calls the correct request', function () {

                return psm.remove('id')
                .then(function () {

                    expect(request.signed).to.have.been.calledWithExactly(
                        { origin: 'origin'},
                        'ProjectManager',
                        'removeProject',
                        {
                            guid: 'id'
                        },
                        {}
                    );
                });
            });
        });

        describe('removeProjects', function () {
            it('calls the correct request', function () {

                return psm.removeProjects(['id', 'id2'])
                  .then(function () {

                      expect(request.signed).to.have.been.calledWithExactly(
                          { origin: 'origin'},
                          'ProjectManager',
                          'removeProjects',
                          {
                              guids: ['id', 'id2']
                          },
                          {}
                      );
                  });
            });
        });

        describe('resolveUserProjectInfo', function () {
            it('calls the correct request', function () {

                return psm.resolveUserProjectInfo('id')
                  .then(function () {

                    expect(request.signed).to.have.been.calledWithExactly(
                        { origin: 'origin'},
                        'ProjectManager',
                        'resolveUserProjectInfo',
                        {
                            guid: 'id'
                        },
                        {}
                    );
                });
            });
        });

        describe('alwaysOnBoxesList', function () {
            it('calls the correct request', function () {

                return psm.alwaysOnBoxesList('fs')
                    .then(function () {

                        expect(request.signed).to.have.been.calledWithExactly(
                            { origin: 'origin'},
                            'ProjectManager',
                            'alwaysOnBoxesList',
                            {
                                fs: 'fs'
                            },
                            {}
                        );
                    });
            });
        });

        describe('getProjectsList', function () {
            it('calls the correct request', function () {

                return psm.getProjectsList(['id'], 'session_id')
                .then(function () {
                    expect(request).to.have.been.calledWithExactly(
                        {origin: 'origin'},
                        'ProjectManager',
                        'getProjectsList',
                        {
                            guids: ['id']
                        },
                        {
                            session_id: 'session_id'
                        }
                    );
                });
            });
        });

        describe('subscribeToProject', function () {
            it('calls the correct request', function () {
                return psm.subscribeToProject(info.user, 'project', info.session)
                    .then(function () {
                        expect(request).to.have.been.calledWithExactly(
                            {origin: 'origin'},
                            'ProjectManager',
                            'subscribeToProject',
                            {
                                accountName: 'user',
                                projectName: 'project'
                            },
                            {
                                session_id: 'id'
                            }
                        );
                    });
            });
        });

        describe('setReadOnly', function () {
            it('calls the correct request', function () {

                return psm.setReadOnly({id: 'id', isReadOnly: true})
                .then(function () {
                    expect(request.signed).to.have.been.calledWithExactly(
                        { origin: 'origin'},
                        'ProjectManager',
                        'setReadOnly',
                        {
                            projectId: 'id',
                            projectIds: undefined,
                            isReadOnly: true
                        },
                        {}
                    );
                });
            });
        });
    });
});
