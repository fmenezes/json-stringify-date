![Build Status](https://github.com/fmenezes/json-stringify-date/workflows/Node.js%20CI/badge.svg?event=push)
[![npm](https://img.shields.io/npm/v/json-stringify-date.svg)](http://npmjs.com/package/json-stringify-date) 
[![NpmLicense](https://img.shields.io/npm/l/json-stringify-date.svg)](http://npmjs.com/package/json-stringify-date) 
[![npm](https://img.shields.io/npm/dm/json-stringify-date.svg)](http://npmjs.com/package/json-stringify-date)

# json-stringify-date

Like JSON.stringify, but preserve timezones in date objects and parse dates into ```Date``` object.

## Install

`npm install json-stringify-date`

## Usage

Takes the same arguments as `JSON.stringify` and `JSON.parse`.

```javascript
var stringifyDate = require('json-stringify-date');
var obj = {d: new Date(2014, 02, 4)};
console.log(stringifyDate.stringify(obj, null, 2));
var text = '{"d": "2014-03-04T00:00:00.000-03:00"}';
console.log(stringifyDate.parse(text));
```

Output:

```
{
  "d": "2014-03-04T00:00:00.000-03:00"
}
{ d: Tue Mar 04 2014 00:00:00 GMT-0300 (BRT) }
```

## Methods

### stringify
```
stringifyDate.stringify(value [, replacer [, space]])
```

Executes exactly the ```JSON.stringify```, but can preserve time zones in dates.

### parse
```
stringifyDate.parse(text [, reviver])
```

Returns the object containing dates.

### getReviver
```
stringifyDate.getReviver([reviver])
```

Gets the function passed to ```JSON.parse```, has the ability to pass an inner function through optional parameter ```reviver```.

### getReplacer
```
stringifyDate.getReplacer([replacer])
```

Gets the function passed to ```JSON.stringify```, has the ability to pass an inner function through optional parameter ```replacer```.

### setOptions

#### utc
_type_: boolean _default_: false  
Format date in utc format  
```javascript
var stringifyDate = require('json-stringify-date');
var obj = {d: new Date(2014, 02, 4)};
stringifyDate.setOptions({utc: true});
console.log(stringifyDate.stringify(obj));
stringifyDate.setOptions({utc: false}); //this is the default
console.log(stringifyDate.stringify(obj));
```
Output:

```
{"d": "2014-03-04T00:00:00.000Z"}
{"d": "2014-03-04T00:00:00.000-03:00"}
```

## Using with [ExpressJS](http://expressjs.com/)

To use it with [ExpressJS](http://expressjs.com/), follow this example.  
The magic really happens in passing `getReviver([reviver])` to `body-parser` 'reviver option', it makes the json parser to serialize date strings into date objects.  
Also, optionally you can pass `getReplacer([replacer])` to `body-parser` 'json replacer setting', it makes the resulting json to preserve timezones.

```javascript
var express = require('express');
var bodyParser = require('body-parser');
var jsonStringifyDate = require('json-stringify-date');
var app = express();
app.use(bodyParser.json({reviver: jsonStringifyDate.getReviver()}));
app.set('json replacer', jsonStringifyDate.getReplacer());
app.post('/test', function (req, res) {
  req.body.somedate // do something
  res.json({date: new Date()});
});
app.listen(3000);
```

## Using with Browser

Add tag `<script type="text/javascript" src="https://raw.githubusercontent.com/fmenezes/json-stringify-date/master/browser.js"></script>`, you can also use webpack or any other packaging system.

Than you will have the object `JSONStringifyDate` in the global context (`window`) so you can run things like

```javascript
JSONStringifyDate.parse('{"d": "2014-03-04T00:00:00.000-03:00"}');
```

Output:

```
{ d: Tue Mar 04 2014 00:00:00 GMT-0300 (BRT) }
```

## Legal

See [LICENSE](LICENSE)
