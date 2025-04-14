import 'should';
import { setOptions, getOptions, stringify, parse, fnReviver, fnReplacer } from '../src/index';

describe('JSON stringify date', () => {
    describe('#stringify', () => {
        describe('utc option false', () => {
            beforeAll(() => {
                setOptions({ utc: false });
            });
            it('should stringify local date correctly', () => {
                expect(stringify({a: new Date()})).toMatch(/^\{"a":"\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}[+-]\d{2}:\d{2}"\}$/);
            });
            it('should return local date string', () => {
                expect(stringify(new Date())).toMatch(/[+-]\d{2}:\d{2}"$/);
            });
        });
        describe('utc option true', () => {
            beforeAll(() => {
                setOptions({ utc: true });
            });
            it('should stringify UTC date correctly', () => {
                expect(stringify({a: new Date()})).toMatch(/^\{"a":"\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z"\}$/);
            });
            it('should return UTC date string', () => {
                expect(stringify(new Date())).toMatch(/Z"$/);
            });
        });
    });
    describe('#parse', () => {
        it('should parse UTC date string', () => {
            const res = parse('{"d":"2014-03-04T00:00:00.000Z"}');
            expect(res).toHaveProperty('d');
            expect(res.d instanceof Date).toBe(true);
        });
        it('should parse local date string', () => {
            const res = parse('{"d":"2014-03-04T00:00:00.000-03:00"}');
            expect(res).toHaveProperty('d');
            expect(res.d instanceof Date).toBe(true);
        });
        it('should not parse a 4 digit string', () => {
            const res = parse('{"d":"2500"}');
            expect(res).toHaveProperty('d');
            expect(typeof res.d).toBe('string');
        });
    });
    describe('#getReviver', () => {
        describe('without customization', () => {
            it('should parse a UTC date string', () => {
                const reviver = fnReviver();
                expect(reviver("d", "2014-03-04T00:00:00.000Z") instanceof Date).toBe(true);
            });
            it('should parse local date string', () => {
                const reviver = fnReviver();
                expect(reviver("d", "2014-03-04T00:00:00.000-03:00") instanceof Date).toBe(true);
            });
        });
        describe('with customization', () => {
            it('should parse a UTC date string', () => {
                const reviver = fnReviver((key, value) => value.toString());
                expect(typeof reviver("d", "2014-03-04T00:00:00.000Z")).toBe('string');
            });
            it('should parse local date string', () => {
                const reviver = fnReviver((key, value) => value.toString());
                expect(typeof reviver("d", "2014-03-04T00:00:00.000-03:00")).toBe('string');
            });
            it('should be able to customize', () => {
                const reviver = fnReviver((key, value) => 'custom ' + value.getDate());
                expect(reviver("d", "2014-03-04T00:00:00.000-03:00")).toMatch(/custom \d+/);
            });
        });
    });
    describe('#getReplacer', () => {
        describe('UTC option false', () => {
            beforeAll(() => {
                setOptions({ utc: false });
            });
            describe('without customization', () => {
                it('should return local date correctly', () => {
                    const replacer = fnReplacer();
                    const value = replacer('a', new Date());
                    expect(value).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}[+-]\d{2}:\d{2}$/);
                });
            });
            describe('with customization', () => {
                it('should return local date correctly', () => {
                    const replacer = fnReplacer((key, value) => {
                        return value;
                    });
                    const value = replacer('a', new Date());
                    expect(value).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}[+-]\d{2}:\d{2}$/);
                });

                it('should be able to customize', () => {
                    const replacer = fnReplacer((key, value) => {
                        return 'custom ' + value.getDate();
                    });
                    const value = replacer('a', new Date());
                    expect(value).toMatch(/custom \d+$/);
                });
            });
        });
        describe('UTC option true', () => {
            beforeAll(() => {
                setOptions({ utc: true });
            });
            describe('without customization', () => {
                it('should return UTC date string', () => {
                    const replacer = fnReplacer();
                    const value = replacer('a', new Date());
                    expect(value).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
                });
            });
            describe('with customization', () => {
                it('should return local date correctly', () => {
                    const replacer = fnReplacer((key, value) => {
                        return value;
                    });
                    const value = replacer('a', new Date());
                    expect(value).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
                });

                it('should be able to customize', () => {
                    const replacer = fnReplacer((key, value) => {
                        return 'custom ' + value.getDate();
                    });
                    const value = replacer('a', new Date());
                    expect(value).toMatch(/custom \d+$/);
                });
            });
        });
        describe('fnCheck option', () => {
            let originalFnCheck: (key: string, value: any) => boolean;
            
            beforeAll(() => {
                originalFnCheck = getOptions().fnCheck;
                setOptions({
                    fnCheck: (key: string, value: any) => {
                        return /\d{8}/.test(value);
                    }
                });
            });
            
            afterAll(() => {
                setOptions({
                    fnCheck: originalFnCheck
                });
            });
            
            it('should not parse dates on different format', () => {
                const value = parse('{"d": "2020-01-01"}');
                expect(typeof value.d).toBe('string');
            });

            it('should parse dates on specified format', () => {
                expect(parse('{"d": "20200101"}').d).toBeInstanceOf(Date);
            });
        });
    });
});
