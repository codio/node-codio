/* global Sandbox, describe, it, expect,  sinon, beforeEach */

var request = sinon.stub();
var ProjectManager = Sandbox.require('../lib/project-manager', {
    requires: {'./request': request}
});


describe('ProjectManager', function () {
    var info = {
        user: 'user',
        project: 'project',
        session: 'id',
        branch: 'branch'
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
                var cb = sinon.spy();
                psm.getProjectByName('name', info, cb);

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
                    },
                    cb,
                    'branch'
                );
            });
        });
        describe('checkPermissionForUser', function () {
            it('calls the correct request', function () {
                var cb = sinon.spy();
                psm.checkPermissionForUser(info, cb);

                expect(request).to.have.been.calledWithExactly(
                    {origin: 'origin'},
                    'ProjectManager',
                    'checkPermissionForUser',
                    {
                        userName: 'user'
                    },
                    {
                        session_id: 'id'
                    },
                    cb
                );
            });
        });
        describe('checkPermissionForProject', function () {
            it('calls the correct request', function () {
                var cb = sinon.spy();
                var cred = {
                    project: {
                        owner: 'owner',
                        name: 'name'
                    },
                    session: 'id'
                };
                psm.checkPermissionForProject(cred, cb);

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
                    },
                    cb
                );
            });
        });
    });
});