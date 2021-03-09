/*jshint node: true */
/*global describe, it, before */
'use strict';

if (typeof module !== 'undefined' && module.exports) {
    var Should = require('should');
    var JSONStringifyDate = require('../index');
}

describe('JSON stringify date', function () {
    describe('#stringify', function () {
        describe('utc option false', function () {
            before(function () {
                JSONStringifyDate.setOptions({utc: false});
            });
            it('should stringify local date correctly', function () {
                JSONStringifyDate.stringify({a: new Date()}).should.match(/^\{\"a\"\:\"\d{4}-\d{2}-\d{2}T\d{2}\:\d{2}\:\d{2}\.\d{3}[\+\-]\d{2}\:\d{2}\"\}$/);
            });
            it('should return local date string', function () {
                JSONStringifyDate.stringify(new Date()).should.match(/[\+\-]\d{2}\:\d{2}\"$/);
            });
        });
        describe('utc option true', function () {
            before(function () {
                JSONStringifyDate.setOptions({utc: true});
            });
            it('should stringify UTC date correctly', function () {
                JSONStringifyDate.stringify({a: new Date()}).should.match(/^\{\"a\"\:\"\d{4}-\d{2}-\d{2}T\d{2}\:\d{2}\:\d{2}\.\d{3}Z\"\}$/);
            });
            it('should return UTC date string', function () {
                JSONStringifyDate.stringify(new Date()).should.endWith("Z\"");
            });
        });
    });
    describe('#parse', function () {
        it('should parse UTC date string', function () {
            var res = JSONStringifyDate.parse('{"d":"2014-03-04T00:00:00.000Z"}');
            res.should.have.property('d');
            res.d.should.be.instanceof(Date);
        });
        it('should parse local date string', function () {
            var res = JSONStringifyDate.parse('{"d":"2014-03-04T00:00:00.000-03:00"}');
            res.should.have.property('d');
            res.d.should.be.instanceof(Date);
        });
        it('should not parse a 4 digit string', function () {
            var res = JSONStringifyDate.parse('{"d":"2500"}');
            res.should.have.property('d');
            res.d.should.be.instanceof(String);
        });
    });
    describe('#getReviver', function () {
        describe('without customization', function () {
            it('should parse a UTC date string', function () {
                var reviver = JSONStringifyDate.getReviver();
                reviver("d", "2014-03-04T00:00:00.000Z").should.be.instanceof(Date);
            });
            it('should parse local date string', function () {
                var reviver = JSONStringifyDate.getReviver();
                reviver("d", "2014-03-04T00:00:00.000-03:00").should.be.instanceof(Date);
            });
        });
        describe('with customization', function () {
            it('should parse a UTC date string', function () {
                var reviver = JSONStringifyDate.getReviver(function (key, value) { return value.toString(); });
                reviver("d", "2014-03-04T00:00:00.000Z").should.be.instanceof(String);
            });
            it('should parse local date string', function () {
                var reviver = JSONStringifyDate.getReviver(function (key, value) { return value.toString(); });
                reviver("d", "2014-03-04T00:00:00.000-03:00").should.be.instanceof(String);
            });
            it('should be able to customize', function () {
                var reviver = JSONStringifyDate.getReviver(function (key, value) { return 'custom ' + value.getDate(); });
                reviver("d", "2014-03-04T00:00:00.000-03:00").should.match(/custom \d+/);
            });
        });
    });
    describe('#getReplacer', function () {
        describe('UTC option false', function () {
            before(function () {
                JSONStringifyDate.setOptions({utc: false});
            });
            describe('without customization', function () {
                it('should return local date correctly', function () {
                    var replacer = JSONStringifyDate.getReplacer();
                    replacer('a', new Date()).should.match(/^\d{4}-\d{2}-\d{2}T\d{2}\:\d{2}\:\d{2}\.\d{3}[\+\-]\d{2}\:\d{2}$/);
                });
            });
            describe('with customization', function () {
                it('should return local date correctly', function () {
                    var replacer = JSONStringifyDate.getReplacer(function (key, value) {
                        return value;
                    });
                    replacer('a', new Date()).should.match(/^\d{4}-\d{2}-\d{2}T\d{2}\:\d{2}\:\d{2}\.\d{3}[\+\-]\d{2}\:\d{2}$/);
                });

                it('should be able to customize', function () {
                    var replacer = JSONStringifyDate.getReplacer(function (key, value) {
                        return 'custom ' + value.getDate();
                    });
                    replacer('a', new Date()).should.match(/custom \d+$/);
                });
            });
        });
        describe('UTC option true', function () {
            before(function () {
                JSONStringifyDate.setOptions({utc: true});
            });
            describe('without customization', function () {
                it('should return UTC date string', function () {
                    var replacer = JSONStringifyDate.getReplacer();
                    replacer('a', new Date()).should.match(/^\d{4}-\d{2}-\d{2}T\d{2}\:\d{2}\:\d{2}\.\d{3}Z$/);
                });
            });
            describe('with customization', function () {
                it('should return local date correctly', function () {
                    var replacer = JSONStringifyDate.getReplacer(function (key, value) {
                        return value;
                    });
                    replacer('a', new Date()).should.match(/^\d{4}-\d{2}-\d{2}T\d{2}\:\d{2}\:\d{2}\.\d{3}Z$/);
                });

                it('should be able to customize', function () {
                    var replacer = JSONStringifyDate.getReplacer(function (key, value) {
                        return 'custom ' + value.getDate();
                    });
                    replacer('a', new Date()).should.match(/custom \d+$/);
                });
            });
        });
    });
});