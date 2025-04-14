import moment from 'moment';

export interface Options {
    utc?: boolean;
    fnCheck?: (key: string, value: any) => boolean;
    fnReplacerCheck?: (key: string, value: any) => boolean;
}

function defaultFnCheck(key: string, value: any): boolean {
    return (typeof value === 'string') && moment(value, moment.ISO_8601, true).isValid() && value.length >= 6;
}

let options = {
    utc: false,
    fnCheck: defaultFnCheck,
    fnReplacerCheck: function (key: string, value: any): boolean {
        return value instanceof Date || defaultFnCheck(key, value);
    },
};

export function fnReviver(reviver?: (key: string, value: any) => any): any {
    return function (key: string, value: any): any {
        if (options.fnCheck(key, value)) {
            value = moment(value).toDate();
        }
        if (reviver) {
            value = reviver(key, value);
        }
        return value;
    };
}

export function fnReplacer(replacer?: (key: string, value: any) => any): any {
    return function (key: string, value: any): any {
        if (replacer) {
            value = replacer(key, value);
        }
        if (options.fnReplacerCheck(key, value)) {
            if (options.utc) {
                value = moment(value).utc(false).format('YYYY-MM-DDTHH:mm:ss.SSS') + "Z";
            } else {
                value = moment(value).format('YYYY-MM-DDTHH:mm:ss.SSSZ');
            }
        }
        return value;
    };
}

export function stringify(value: any, replacer?:(key: string, value: any) => any, space?: string | number) {
    return JSON.stringify(value, fnReplacer(replacer), space);
}

export function parse(text: string, reviver?: (key: string, value: any) => any) {
    return JSON.parse(text, fnReviver(reviver));
}

export function getOptions(): {
    utc: boolean;
    fnCheck: (key: string, value: any) => boolean;
} {
    return { ...options };
}

export function setOptions(opt: Options): void {
    options = { ...options, ...opt };
}

export default {
    parse,
    stringify,
    getOptions,
    setOptions,
    fnReplacer,
    fnReviver
};
