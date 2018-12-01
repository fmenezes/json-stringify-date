/*jslint node: true, vars: true, sloppy: true */
/*global describe, it */
var should = require('should');
var stringifyDate = require('../index');

describe('JSON stringify date', function () {
    describe('UTC', function () {
        it('should return UTC date string', function () {
            stringifyDate.setOptions({utc: true});
            stringifyDate.stringify(new Date()).should.endWith("Z\"");
        });
        it('should return local date string', function () {
            stringifyDate.setOptions({utc: false});
            stringifyDate.stringify(new Date()).should.match(/[\+\-]\d{2}\:\d{2}\"$/);
        });
        it('should parse UTC date string', function () {
            stringifyDate.setOptions({utc: true});
            stringifyDate.stringify(stringifyDate.parse('{"d":"2014-03-04T00:00:00.000Z"}')).should.be.equal('{"d":"2014-03-04T00:00:00.000Z"}');
        });
        it('should parse local date string', function () {
            stringifyDate.setOptions({utc: true});
            stringifyDate.stringify(stringifyDate.parse('{"d":"2014-03-04T00:00:00.000-03:00"}')).should.be.equal('{"d":"2014-03-04T03:00:00.000Z"}');
        });
    });
});