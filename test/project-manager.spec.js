/* global Sandbox, describe, it, expect,  sinon, beforeEach */

var Promise = require('bluebird');
var request = sinon.stub().returns(Promise.resolve());

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

        describe('checkPermissionForUser', function () {
            it('calls the correct request', function () {
                return psm.checkPermissionForUser(info)
                .then(function () {

                    expect(request).to.have.been.calledWithExactly(
                        {origin: 'origin'},
                        'ProjectManager',
                        'checkPermissionForUser',
                        {
                            userName: 'user'
                        },
                        {
                            session_id: 'id'
                        }
                    );
                });
            });
        });
        describe('checkPermissionForProject', function () {
            it('calls the correct request', function () {

                var cred = {
                    project: {
                        owner: 'owner',
                        name: 'name'
                    },
                    session: 'id'
                };
                return psm.checkPermissionForProject(cred)
                .then(function () {
                    expect(request).to.have.been.calledWithExactly(
                        {origin: 'origin'},
                        'ProjectManager',
                        'checkPermissionForProject',
                        {
                            userName: 'owner',
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
    });
});
