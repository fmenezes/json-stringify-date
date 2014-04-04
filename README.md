# json-stringify-date

Like JSON.stringify, but preserve date-timezones and parse dates

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

## Details

```
stringifyDate.stringify(value [, replacer [, space]])
```

Executes exactly the ```JSON.stringify```, but can preserve time zones in dates.

```
stringifyDate.parse(text [, reviver])
```

Returns the object containing dates.

## Legal

Copyright (c) 2014 by Filipe Constantinov Menezes

BSD License
