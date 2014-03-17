/* global Sandbox, describe, it, expect,  sinon */

var http = require('http');
var https = require('http');

var noop = function () {};

var request = Sandbox.require('../lib/request', {
    requires: {
        'http': http,
        'https': https
    }
});


describe('request', function () {
    describe('request', function () {
        it('should exits', function () {
            expect(request.request).to.be.a('function');
        });
        it('makes a simple http call', function () {
            var on = sinon.spy();
            var write = sinon.spy();
            var end = sinon.spy();
            sinon.stub(http, 'request').returns({on: on, write: write, end: end});

            request.request({}, 'hello', 'world', {}, {}, noop, 'branch');

            expect(http.request).to.have.been.calledOnce;
            expect(on).to.have.been.calledWith('error');
            expect(write).to.have.been.calledOnce;
            expect(write).to.have.been.calledOnce;
        });
    });
    describe('pingTaskStatus', function () {
        expect(request.pingTaskStatus).to.be.a('function');
    });
});
