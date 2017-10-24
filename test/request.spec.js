/* global describe, it, expect, sinon */
var Promise = require('bluebird');
var req = require('../lib/curl');
var crypto = require('crypto');
var request = require('../lib/request');

function fakeRequest(json, code) {
    req.request.restore && req.request.restore();
    sinon.stub(req, 'request').callsFake(function () {
        var body = {
            body: JSON.stringify(json),
            statusCode: code
        };
        return code === 200 ? Promise.resolve(body) : Promise.reject(body);
    });
}

describe('request', function () {
    var server;
    it('should exits', function () {
        expect(request).to.be.a('function');
    });

    it('should signed exits', function () {
        expect(request.signed).to.be.a('function');
    });

    it('makes a simple http call', function () {
        server = fakeRequest({response: {msg: 'ok'}}, 200, function (body, req) {
            expect(req.method).to.be.eql('POST');
            expect(req.url).to.be.eql('http://localhost:1234/manager/stuff');
        });

        return request({
            hostname: 'localhost',
            port: 1234,
            path: '/manager/stuff'
        }, 'object', 'method', {}, {})
        .then(function (body) {
            expect(body).to.be.eql({msg: 'ok'});
        });
    });
    it('sends passed in content', function () {
        server = fakeRequest({response: {msg: 'ok'}}, 200, function (body, req) {
            expect(req.method).to.be.eql('POST');
            expect(req.url).to.be.eql('http://localhost:1234/manager/stuff');

            console.log('got body', body);

            expect(body).to.be.eql({
                object: 'object',
                method: 'method',
                data: {my: 'data'},
                params: {some: 'params'}
            });
        });
        return request({
            hostname: 'localhost',
            port: 1234,
            path: '/manager/stuff'
        }, 'object', 'method', {my: 'data'}, {some: 'params'})
        .then(function (body) {
            expect(body).to.be.eql({msg: 'ok'});
        });
    });
    it('sends anon cookie when passed in the options', function () {
        server = fakeRequest({response: {msg: 'ok'}}, 200, function (body, req) {
            expect(req.method).to.be.eql('POST');
            expect(req.url).to.be.eql('http://localhost:1234/manager/stuff');
            expect(req.headers.Cookie).to.be.eql('crafted_anonymous=anonsession');
        });
        return request({
            hostname: 'localhost',
            port: 1234,
            path: '/manager/stuff'
        }, 'object', 'method', {my: 'data'}, {
            session_id: '{"anon": "anonsession", "session": "id"}'
        })
        .then(function (body) {
            expect(body).to.be.eql({msg: 'ok'});
        });
    });

    it('should call error callback', function () {
        server = fakeRequest({code: 0, response: {message: 'error'}, source: 'ACv2.Server.Core'}, 200, function (body, req) {
            expect(req.method).to.be.eql('POST');
            expect(req.url).to.be.eql('http://localhost:1234/manager/stuff');
        });
        return request({
            hostname: 'localhost',
            port: 1234,
            path: '/manager/stuff'
        }, 'object', 'method', {my: 'data'}, {some: 'params'})
        .catch(function (err) {
            expect(err.message).to.be.eql('Got error from ACv2.Server.Core: error');
        });
    });

    it('should generate proper sign', function () {
        server = fakeRequest({response: {msg: 'ok'}}, 200, function (body, req) {
            var timestamp = req.headers['X-Codio-Sign-Timestamp'];
            expect(req.headers).to.have.property('X-Codio-Provider').with.length(8);
            var shasum = crypto.createHmac('sha1', '123');
            var signature = shasum.update(timestamp +
                JSON.stringify({
                    object: 'object',
                    method: 'method',
                    data: {my: 'data'},
                    params: {some: 'params'}
                }) + 'provider').digest('base64');
            expect(req.headers).to.have.property('X-Codio-Sign').to.be.eql(signature);
        });
        return request.signed({
            hostname: 'localhost',
            port: 1234,
            path: '/manager/stuff',
            secretKey: '123',
            provider: 'provider'
        }, 'object', 'method', {my: 'data'}, {some: 'params'});
    });
});
