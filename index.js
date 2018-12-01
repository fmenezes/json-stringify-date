/*jslint node: true, vars: true, sloppy: true */
var jsonStringifySafe = require('json-stringify-safe');
var moment = require('moment');

var options = {
    utc: false,
    handleCircular: true
};

function isISO8601String(dateString) {
    return moment(dateString).isValid();
}

function fnReviver(reviver) {
    return function (key, value) {
        if (isISO8601String(value)) {
            value = moment(value).toDate();
        }
        if (reviver) {
            value = reviver(key, value);
        }
        return value;
    };
}

function fnReplacer(replacer) {
    var fn = replacer;
    if (!options.utc) {
        fn = function (key, value) {
            if (isISO8601String(value)) {
                value = moment(value).format('YYYY-MM-DDTHH:mm:ss.SSSZ');
            }
            if (replacer) {
                value = replacer(key, value);
            }
            return value;
        };
    }

    return fn;
}

module.exports = {
    stringify: function (value, replacer, space) {
        var strFn;
        if (options.handleCircular) {
            strFn = jsonStringifySafe;
        } else {
            strFn = JSON.stringify;
        }
        return strFn(value, fnReplacer(replacer), space);
    },
    parse: function (text, reviver) {
        return JSON.parse(text, fnReviver(reviver));
    },
    setOptions: function (opt) {
        var key;
        for (key in opt) {
            if (opt.hasOwnProperty(key)) {
                options[key] = opt[key];
            }
        }
    },
    getReviver: fnReviver,
    getReplacer: fnReplacer
};
