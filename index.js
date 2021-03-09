var moment = require('moment');

module.exports = (function () {
    var options = {
        utc: false
    };

    function isDateString(dateString) {
        return (typeof dateString === 'string') && moment(dateString, moment.ISO_8601, true).isValid() && dateString.length >= 6;
    }

    function fnReviver(reviver) {
        return function (key, value) {
            if (isDateString(value)) {
                value = moment(value).toDate();
            }
            if (reviver) {
                value = reviver(key, value);
            }
            return value;
        };
    }

    function fnReplacer(replacer) {
        var fn = replacer || function (key, value) { return value; };
        if (!options.utc) {
            fn = function (key, value) {
                if (isDateString(value)) {
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

    return {
        stringify: function (value, replacer, space) {
            return JSON.stringify(value, fnReplacer(replacer), space);
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
}());
