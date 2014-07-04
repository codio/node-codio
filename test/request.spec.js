/* global describe, it, expect */

var http = require('http');
var querystring = require('querystring');
var crypto = require('crypto');

var request = require('../lib/request');

function fakeHttpServer(json, code, callback) {
    return http.createServer(function (req, res) {
        var body = '';
        req.on('data', function (chunk) {
            body += chunk;
        });
        req.on('end', function () {
            res.writeHead(code, {'Content-Type': 'application/json'});
            if (body) {
                try {
                    body = querystring.parse(body);
                    body.acrequest = JSON.parse(body.acrequest);

                } catch (e) {}
            }
            if (callback) {
                callback(body, req);
            }
            res.end(JSON.stringify(json));
        });
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
        server = fakeHttpServer({response: {msg: 'ok'}}, 200, function (body, req) {
            expect(req.method).to.be.eql('POST');
            expect(req.url).to.be.eql('/manager/stuff');
        });
        server.listen(1234);
        return request({
            hostname: 'localhost',
            port: 1234,
            path: '/manager/stuff'
        }, 'object', 'method', {}, {})
        .then(function (body) {
            expect(body).to.be.eql({msg: 'ok'});
            server.close();
        });
    });
    it('sends passed in content', function () {
        server = fakeHttpServer({response: {msg: 'ok'}}, 200, function (body, req) {
            expect(req.method).to.be.eql('POST');
            expect(req.url).to.be.eql('/manager/stuff');
            expect(body.acrequest).to.be.eql({
                object: 'object',
                method: 'method',
                data: {my: 'data'},
                params: {some: 'params'}
            });
        });
        server.listen(1234);
        return request({
            hostname: 'localhost',
            port: 1234,
            path: '/manager/stuff'
        }, 'object', 'method', {my: 'data'}, {some: 'params'})
        .then(function (body) {
            expect(body).to.be.eql({msg: 'ok'});
            server.close();
        });
    });
    it('sends anon cookie when passed in the options', function () {
        server = fakeHttpServer({response: {msg: 'ok'}}, 200, function (body, req) {
            expect(req.method).to.be.eql('POST');
            expect(req.url).to.be.eql('/manager/stuff');
            expect(req.headers.cookie).to.be.eql('crafted_anonymous=anonsession');
        });
        server.listen(1234);
        return request({
            hostname: 'localhost',
            port: 1234,
            path: '/manager/stuff'
        }, 'object', 'method', {my: 'data'}, {
            session_id: '{"anon": "anonsession", "session": "id"}'
        })
        .then(function (body) {
            expect(body).to.be.eql({msg: 'ok'});
            server.close();
        });
    });

    it('should call error callback', function () {
        server = fakeHttpServer({code: 0, response: {message: 'error'}, source: 'ACv2.Server.Core'}, 200, function (body, req) {
            expect(req.method).to.be.eql('POST');
            expect(req.url).to.be.eql('/manager/stuff');
        });
        server.listen(1234);
        return request({
            hostname: 'localhost',
            port: 1234,
            path: '/manager/stuff'
        }, 'object', 'method', {my: 'data'}, {some: 'params'})
        .catch(function (err) {
            expect(err.message).to.be.eql('Got error from ACv2.Server.Core: error');
            server.close();
        });
    });

    it('should generate proper sign', function () {
        server = fakeHttpServer({response: {msg: 'ok'}}, 200, function (body, req) {
            expect(req.headers).to.have.property('x-codio-sign-timestamp').with.length(13);
            var shasum = crypto.createHash('sha1');
            var signature = shasum.update(req.headers['x-codio-sign-timestamp'] +
                JSON.stringify({
                    object: 'object',
                    method: 'method',
                    data: {my: 'data'},
                    params: {some: 'params'}
                }) + '123').digest('hex');
            expect(req.headers).to.have.property('x-codio-sign').to.be.eql(signature);
        });
        server.listen(1234);
        return request.signed({
            hostname: 'localhost',
            port: 1234,
            path: '/manager/stuff',
            remoteSecretKey: '123'
        }, 'object', 'method', {my: 'data'}, {some: 'params'})
        .finally(function () {
            server.close();
        });
    });

    describe('request.file', function () {
        it('uploads a given file', function () {
            server = fakeHttpServer({response: {msg: 'ok'}}, 200, function (body, req) {
                expect(req.method).to.be.eql('POST');
                expect(req.url).to.be.eql('/manager/stuff/file/');
            });
            server.listen(1234);
            return request.file({
                hostname: 'localhost',
                port: 1234,
                path: '/manager/stuff/'
            }, 'object', 'method', {
                file: 'hello world'
            }, {})
            .then(function (body) {
                expect(body).to.be.eql({msg: 'ok'});
                server.close();
            });
        });
    });
});
