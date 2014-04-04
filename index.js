var options = {};

module.exports = {
	stringify: function(value, replacer, space) {
		return JSON.stringify(value, fnReplacer(replacer), space);
	},
	parse: function(text, reviver) {
		return JSON.parse(text, fnReviver(reviver));
	},
	setOptions: function(opt) {
		options = opt;
	},
	getReviver: fnReviver,
	getReplacer: fnReplacer
};

function fnReviver(reviver) {
	return function(key, value) {
		if(isISO8601String(value))
			value = parseISO8601String(value);
		if(reviver)
			value = reviver(key, value);
		return value;
	};
}

function fnReplacer(replacer) {
	var fn = replacer;
	if(!options.utc) {
		fn = function(key, value) {
			if(isISO8601String(value)) {
				value = dateToString(parseISO8601String(value));
			}
			if(replacer)
				value = replacer(key, value);
			return value;
		};
	}
	
	return fn;
}

function fillZeros(v, n) {
	v = '' + v;
	while(v.length < n) {
		v = '0' + v;
	}
	return v;
}

function dateToString(d) {
	var str = d.getFullYear()
		+ '-' + fillZeros((d.getMonth() + 1), 2)
		+ '-' + fillZeros(d.getDate(), 2)
		+ 'T' + fillZeros(d.getHours(), 2)
		+ ':' + fillZeros(d.getMinutes(), 2)
		+ ':' + fillZeros(d.getSeconds(), 2)
		+ '.' + fillZeros(d.getMilliseconds(), 3);
	if(d.getTimezoneOffset() == 0)
		str += 'Z';
	else {
		if(d.getTimezoneOffset() > 0)
			str += '-';
		else
			str += '+';
		
		var h = parseInt(d.getTimezoneOffset() / 60);
		var m = d.getTimezoneOffset() - (h * 60);
		str += fillZeros(h, 2) + ':' + fillZeros(m, 2);
	}
	return str;
}

function isISO8601String(dateString) {
	var dateregex = /^([+-])?([0-9]{4})-?([0-9]{1,2})(-?([0-9]{1,2}))([T\s]([0-9]{1,2}):?([0-9]{1,2})(:?([0-9]{1,2})(\.?([0-9]+))?)?(Z|([+-])([0-9]{1,2})(:?([0-9]{1,2}))?)?)?$/;
	return dateregex.test(dateString);
}

function parseISO8601String(dateString) {
        var dateregex = /^([+-])?([0-9]{4})-?([0-9]{1,2})(-?([0-9]{1,2}))([T\s]([0-9]{1,2}):?([0-9]{1,2})(:?([0-9]{1,2})(\.?([0-9]+))?)?(Z|([+-])([0-9]{1,2})(:?([0-9]{1,2}))?)?)?$/;
        var r = dateregex.exec(dateString);
        var resultDate = null;
        if (r) {
                if(!r[6]) //time
                        resultDate = new Date(parseInt(r[2], 10), parseInt(r[3], 10)-1, (parseInt(r[5], 10) || 1));
                else {
                        resultDate = new Date(Date.UTC(
                                parseInt(r[2], 10), //year
                                parseInt(r[3], 10)-1, //month
                                parseInt(r[5], 10), //date
                                parseInt(r[7], 10), //hours
                                parseInt(r[8], 10), //minutes
                                parseInt(r[10], 10) || 0, //seconds
                                (parseFloat('.' + r[12]) * 1000) || 0)); //milliseconds
                        if(r[13] != 'Z') { //timezone
                                var offset = parseInt(r[15], 10) * 60 + (parseInt(r[17], 10) || 0);
                                offset *= (r[14] == '+' ? -1 : 1);
                                resultDate.setUTCMinutes(resultDate.getUTCMinutes() + offset);
                        }
                }
        }
        return resultDate;
}