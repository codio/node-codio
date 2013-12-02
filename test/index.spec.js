/* global describe, it, expect */


var API = require('../index');

describe('api', function () {
    it('should be instantiable', function () {
        var api = new API('https://codio.com');
        expect(api).to.be.an.instanceof(API);
        expect(api).to.have.a.property('options');
        expect(api).to.have.a.property('projectManager');
        expect(api).to.have.a.property('projectStructureManager');
    });
    describe('arguments', function () {
        it('takes a url as origin argument', function () {
            var api = new API({origin: 'https://codio.com'});
            expect(api.options.origin).to.have.a.property('protocol', 'https:');
            expect(api.options.origin).to.have.a.property('href', 'https://codio.com/');
        });
        it('takes an object as origin argument', function () {
            var args = {origin: {hello: 'world'}};
            var api = new API(args);
            expect(api.options).to.have.a.property('origin', args.hello);
        });
        it('takes an object as options', function () {
            var args = {useOrigin: true};
            var api = new API(args);
            expect(api).to.have.a.property('options', args);
        });
    });
});