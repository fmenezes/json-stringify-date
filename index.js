/*jslint node: true, vars: true, sloppy: true */
var options = {};

function fillZeros(v, n) {
    v = String(v);
    while (v.length < n) {
        v = '0' + v;
    }
    return v;
}

function dateToString(d) {
    var h, m;
    var str = d.getFullYear()
        + '-' + fillZeros((d.getMonth() + 1), 2)
        + '-' + fillZeros(d.getDate(), 2)
        + 'T' + fillZeros(d.getHours(), 2)
        + ':' + fillZeros(d.getMinutes(), 2)
        + ':' + fillZeros(d.getSeconds(), 2)
        + '.' + fillZeros(d.getMilliseconds(), 3);
    if (d.getTimezoneOffset() === 0) {
        str += 'Z';
    } else {
        if (d.getTimezoneOffset() > 0) {
            str += '-';
        } else {
            str += '+';
        }

        h = parseInt(d.getTimezoneOffset() / 60, 10);
        m = d.getTimezoneOffset() - (h * 60);
        str += fillZeros(h, 2) + ':' + fillZeros(m, 2);
    }
    return str;
}

function isISO8601String(dateString) {
    var dateregex = /^([0-9]{4})\-([0-9]{1,2})\-([0-9]{1,2})([T\s]([0-9]{1,2}):([0-9]{1,2})(:([0-9]{1,2})(\.([0-9]+))?)?(Z|([+\-])([0-9]{1,2})(:([0-9]{1,2}))?)?)?$/;
    return dateregex.test(dateString);
}

function parseISO8601String(dateString) {
    var resultDate;
    var offset;
    var dateregex = /^([0-9]{4})\-([0-9]{1,2})\-([0-9]{1,2})([T\s]([0-9]{1,2}):([0-9]{1,2})(:([0-9]{1,2})(\.([0-9]+))?)?(Z|([+\-])([0-9]{1,2})(:([0-9]{1,2}))?)?)?$/;
    var r = dateregex.exec(dateString);
    if (r) {
        if (!r[4]) { //time
            resultDate = new Date(parseInt(r[1], 10), parseInt(r[2], 10) - 1, (parseInt(r[3], 10) || 1));
        } else {
            resultDate = new Date(
                Date.UTC(
                    parseInt(r[1], 10), //year
                    parseInt(r[2], 10) - 1, //month
                    parseInt(r[3], 10), //date
                    parseInt(r[5], 10), //hours
                    parseInt(r[6], 10), //minutes
                    parseInt(r[8], 10), //seconds
                    (parseFloat('0' + r[9], 10) * 1000) || 0 //milliseconds
                )
            );
            if (r[11] !== 'Z') { //timezone
                offset = (parseInt(r[13], 10) * 60) + parseInt(r[15], 10);
                offset *= (r[12] === '+' ? -1 : 1);
                resultDate.setUTCMinutes(resultDate.getUTCMinutes() + offset);
            }
        }
    }
    return resultDate;
}

function fnReviver(reviver) {
    return function (key, value) {
        if (isISO8601String(value)) {
            value = parseISO8601String(value);
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
                value = dateToString(parseISO8601String(value));
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
        return JSON.stringify(value, fnReplacer(replacer), space);
    },
    parse: function (text, reviver) {
        return JSON.parse(text, fnReviver(reviver));
    },
    setOptions: function (opt) {
        options = opt;
    },
    getReviver: fnReviver,
    getReplacer: fnReplacer
};
