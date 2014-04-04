# json-stringify-date

Like JSON.stringify, but preserve date-timezones and parse dates

## Usage

Takes the same arguments as `JSON.stringify` and `JSON.parse`.

```javascript
var stringifyDate = require('json-stringify-date');
var obj = {d: new Date(2014, 02, 4)};
console.log(stringifyDate.stringify(obj, null, 2));
```

Output:

```json
{
  "d": "2014-03-04T00:00:00.000-03:00"
}
```

```javascript
var stringifyDate = require('json-stringify-date');
var text = '{"d": "2014-03-04T00:00:00.000-03:00"}';
console.log(stringifyDate.parse(obj));
```

Output:

```
{ d: Tue Mar 04 2014 00:00:00 GMT-0300 (BRT) }
```

## Details

```
stringifyDate.stringify(value, replacer, space)
```

The three arguments are the same as to JSON.stringify.

```
stringifyDate.parse(text, reviver)
```

Returns the object containing dates.

## Legal

Copyright (c) 2014 by Filipe Constantinov Menezes
BSD License
