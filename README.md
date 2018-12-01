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

## With ExpressJS

To use it with ExpressJS, follow an example.  
The magic really happens in passing `getReviver([reviver])` to `body-parser` 'reviver option', it makes the json parser to serialize date strings into date objects.  
Also, optionally you can pass `getReplacer([replacer])` to `body-parser` 'json replacer setting', it makes the resulting json to preserve timezones.

```javascript
var express = require('express');
var bodyParser = require('body-parser');
var jsonStringifyDate = require('./index');
var app = express();
app.use(bodyParser.json({reviver: jsonStringifyDate.getReviver()}));
app.set('json replacer', jsonStringifyDate.getReplacer());
app.post('/test', function (req, res) {
  // do something
  res.json({date: new Date()});
});
app.listen(3000);
```

## Details

```
stringifyDate.stringify(value [, replacer [, space]])
```

Executes exactly the ```JSON.stringify```, but can preserve time zones in dates.

```
stringifyDate.parse(text [, reviver])
```

Returns the object containing dates.

```
stringifyDate.getReviver([reviver])
```

Gets the function passed to ```JSON.parser```, has the ability to pass an inner function through optional parameter ```reviver```.

```
stringifyDate.getReplacer([replacer])
```

Gets the function passed to ```JSON.stringify```, has the ability to pass an inner function through optional parameter ```replacer```.

## Legal

See [LICENSE](LICENSE)
