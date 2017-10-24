var Curl = require('node-libcurl').Curl;
var Promise = require('bluebird');
var _ = require('lodash');

var BASE_TIMEOUT = 30;

module.exports = function (url, options, postData) {
    return new Promise(function (resolve, reject) {
        var curl = new Curl();

        curl.setOpt(Curl.option.URL, url);
        curl.setOpt(Curl.option.CONNECTTIMEOUT, 10);
        curl.setOpt(Curl.option.TIMEOUT, options && options.timeout || BASE_TIMEOUT);
        curl.setOpt(Curl.option.LOW_SPEED_TIME, BASE_TIMEOUT);
        if (postData) {
            curl.setOpt(Curl.option.POSTFIELDS, postData);
        }
        if (options && options.headers) {
            curl.setOpt(Curl.option.HTTPHEADER, options.headers);
        }

        curl.on('end', function (statusCode, body, headers) {
            headers = _.mapKeys(headers[0], function (value, key) {
                return _.isFunction(key.toLowerCase) ? key.toLowerCase() : key;
            });
            resolve({
                statusCode: statusCode,
                headers: headers,
                body: body
            });
            this.close();
        });

        curl.on('error', function (error, code) {
            reject({
                error: error,
                code: code
            });
            this.close();
        });
        curl.perform();
    });
};