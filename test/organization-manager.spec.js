/* global Sandbox, describe, it, expect,  sinon, beforeEach */

var Promise = require('bluebird');
var request = sinon.stub().returns(Promise.resolve());

var OrganizationManager = Sandbox.require('../lib/organization-manager', {
    requires: {'./request': request}
});

describe('OrganizationManager', function () {
    it('should be instantiable', function () {
        var om = new OrganizationManager({origin: 'origin'});
        expect(om).to.be.an.instanceof(OrganizationManager);
        expect(om.options).to.be.eql({origin: 'origin'});
    });

    describe('api methods', function () {
        var om;
        beforeEach(function () {
            request.reset();
            om = new OrganizationManager({});
        });

        describe('getById', function () {
            it('throws when id is not a string', function () {
                expect(function () {
                    om.getById(null, 'session');
                }).toThrow;
            });
            it('throws when session is not a string', function () {
                expect(function () {
                    om.getById('21', null);
                }).toThrow;
            });
            it('calls the correct request', function () {
                var cb = sinon.spy();
                om.getById('my id', 'session', cb);

                expect(request).to.have.been.calledWith(
                    {},
                    'OrganizationManager',
                    'get',
                    {
                        id: 'my id'
                    },
                    {
                        session_id: 'session'
                    }
                );
            });
        });

        describe('getByName', function () {
            it('throws when name is not a string', function () {
                expect(function () {
                    om.getByName(null, 'session');
                }).toThrow;
            });
            it('throws when session is not a string', function () {
                expect(function () {
                    om.getByName('21', null);
                }).toThrow;
            });
            it('calls the correct request', function () {

                return om.getByName('my name', 'session')
                .then(function () {

                    expect(request).to.have.been.calledWith(
                        {},
                        'OrganizationManager',
                        'get',
                        {
                            name: 'my name'
                        },
                        {
                            session_id: 'session'
                        }
                    );
                });
            });
        });

        describe('createTeam', function () {
            it('throws when name is not a string', function () {
                expect(function () {
                    om.createTeam(null, {org: 'a', session: 's'});
                }).toThrow;
            });
            it('throws when info is not an object', function () {
                expect(function () {
                    om.createTeam('21', null);
                }).toThrow;
            });
            it('throws when orgId is not a string', function () {
                expect(function () {
                    om.createTeam(null, {session: 's'});
                }).toThrow;
            });
            it('calls the correct request', function () {

                return om.createTeam('my team', {
                    org: 'orgId',
                    description: 'desc',
                    members: ['a', 'b', 'c'],
                    session: 'session',
                    data: {test: true}
                })
                .then(function () {

                    expect(request).to.have.been.calledWith(
                        {},
                        'OrganizationManager',
                        'createTeam',
                        {
                            name: 'my team',
                            orgId: 'orgId',
                            description: 'desc',
                            memberIds: ['a', 'b', 'c'],
                            customData: {test: true}
                        },
                        {
                            session_id: 'session'
                        }
                    );
                });
            });
        });

        describe('getTeamByName', function () {

            it('throws when name is not a string', function () {
                expect(function () {
                    om.getTeamByName(null, 'id', 'session');
                }).toThrow;
            });
            it('calls the correct request', function () {

                return om.getTeamByName('org', 'team', 'session')
                .then(function () {

                    expect(request).to.have.been.calledWith(
                        {},
                        'OrganizationManager',
                        'getTeam',
                        {
                            orgId: 'org',
                            teamName: 'team'
                        },
                        {
                            session_id: 'session'
                        }
                    );
                });
            });
        });

        describe('getMyOrganizations', function () {
            it('throws when session is not a string', function () {
                expect(function () {
                    om.getMyOrganizations(null);
                }).toThrow;
            });
            it('calls the correct request', function () {

                return om.getMyOrganizations('session')
                .then(function () {

                    expect(request).to.have.been.calledWith(
                        {},
                        'OrganizationManager',
                        'getMyOrganizations',
                        {},
                        {
                            session_id: 'session'
                        }
                    );
                });
            });
        });

        describe('isMemberOf', function () {

            it('throws when team is not an array', function () {
                expect(function () {
                    om.isMemberOf('org', 'id', 'session');
                }).toThrow;
            });
            it('calls the correct request', function () {

                return om.isMemberOf('org', ['1', '2'], 'session')
                .then(function () {

                    expect(request).to.have.been.calledWith(
                        {},
                        'OrganizationManager',
                        'isMemberOf',
                        {
                            organization: 'org',
                            team: ['1', '2']
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