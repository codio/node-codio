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
                body = querystring.parse(body);
                body.acrequest = JSON.parse(body.acrequest);
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

    it('makes a simple http call', function (done) {
        server = fakeHttpServer({response: {msg: 'ok'}}, 200, function (body, req) {
            expect(req.method).to.be.eql('POST');
            expect(req.url).to.be.eql('/manager/stuff');
        });
        server.listen(1234);
        request({
            hostname: 'localhost',
            port: 1234,
            path: '/manager/stuff'
        }, 'object', 'method', {}, {}, function (err, body) {
            if (err) {
                throw err;
            }
            expect(body).to.be.eql({msg: 'ok'});
            server.close();
            done();
        });
    });
    it('sends passed in content', function (done) {
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
        request({
            hostname: 'localhost',
            port: 1234,
            path: '/manager/stuff'
        }, 'object', 'method', {my: 'data'}, {some: 'params'}, function (err, body) {
            expect(err).to.not.exist;
            expect(body).to.be.eql({msg: 'ok'});
            server.close();
            done();
        });
    });
    it('sends anon cookie when passed in the options', function (done) {
        server = fakeHttpServer({response: {msg: 'ok'}}, 200, function (body, req) {
            expect(req.method).to.be.eql('POST');
            expect(req.url).to.be.eql('/manager/stuff');
            expect(req.headers.cookie).to.be.eql('crafted_anonymous=anonsession');
        });
        server.listen(1234);
        request({
            hostname: 'localhost',
            port: 1234,
            path: '/manager/stuff'
        }, 'object', 'method', {my: 'data'}, {
            session_id: '{"anon": "anonsession", "session": "id"}'
        }, function (err, body) {
            expect(err).to.not.exist;
            expect(body).to.be.eql({msg: 'ok'});
            server.close();
            done();
        });
    });

    it('should call error callback', function (done) {
        server = fakeHttpServer({code: 0, response: {message: 'error'}, source: 'ACv2.Server.Core'}, 200, function (body, req) {
            expect(req.method).to.be.eql('POST');
            expect(req.url).to.be.eql('/manager/stuff');
        });
        server.listen(1234);
        request({
            hostname: 'localhost',
            port: 1234,
            path: '/manager/stuff'
        }, 'object', 'method', {my: 'data'}, {some: 'params'}, function (err) {
            expect(err.message).to.be.eql('Got error from ACv2.Server.Core: error');
            server.close();
            done();
        });
    });

    it('should generate proper sign', function (done) {
        server = fakeHttpServer({response: {msg: 'ok'}}, 200, function (body, req) {
            var timestamp = req.headers['x-codio-sign-timestamp'];
            expect(req.headers).to.have.property('x-codio-sign-timestamp').with.length(13);
            var shasum = crypto.createHmac('sha1', '123');
            var signature = shasum.update(timestamp +
                JSON.stringify({
                    object: 'object',
                    method: 'method',
                    data: {my: 'data'},
                    params: {some: 'params'}
                }) + 'provider').digest('base64');
            expect(req.headers).to.have.property('x-codio-sign').to.be.eql(signature);
        });
        server.listen(1234);
        request.signed({
            hostname: 'localhost',
            port: 1234,
            path: '/manager/stuff',
            secretKey: '123',
            provider: 'provider'
        }, 'object', 'method', {my: 'data'}, {some: 'params'}, function (err) {
            server.close();
            done();
        });
    });
});
