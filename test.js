var stringifyDate = require('./index');
stringifyDate.setOptions({utc: true});

var obj = {
	d: new Date(Date.UTC(2014, 01, 01, 9, 15, 32))
};

var testObj = {
	d: "2014-02-01T09:15:32.000Z"
};

try
{
	var assert = require('assert');
	
	testObj = JSON.stringify(testObj, null, 2);
	
	assert.equal(testObj, stringifyDate.stringify(obj, null, 2));
	
	testObj = stringifyDate.parse(testObj);
	assert.ok(testObj.d instanceof Date);
	
	console.log('ok');
}
catch(e)
{
	console.log('fail');
}
