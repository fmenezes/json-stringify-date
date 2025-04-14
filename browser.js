"use strict";
var JSONStringifyDate = (() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function(x) {
    if (typeof require !== "undefined") return require.apply(this, arguments);
    throw Error('Dynamic require of "' + x + '" is not supported');
  });
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // src/index.ts
  var index_exports = {};
  __export(index_exports, {
    default: () => index_default,
    fnReplacer: () => fnReplacer,
    fnReviver: () => fnReviver,
    getOptions: () => getOptions,
    parse: () => parse,
    setOptions: () => setOptions,
    stringify: () => stringify
  });
  var import_moment = __toESM(__require("moment"), 1);
  function defaultFnCheck(key, value) {
    return typeof value === "string" && (0, import_moment.default)(value, import_moment.default.ISO_8601, true).isValid() && value.length >= 6;
  }
  var options = {
    utc: false,
    fnCheck: defaultFnCheck,
    fnReplacerCheck: function(key, value) {
      return value instanceof Date || defaultFnCheck(key, value);
    }
  };
  function fnReviver(reviver) {
    return function(key, value) {
      if (options.fnCheck(key, value)) {
        value = (0, import_moment.default)(value).toDate();
      }
      if (reviver) {
        value = reviver(key, value);
      }
      return value;
    };
  }
  function fnReplacer(replacer) {
    return function(key, value) {
      if (replacer) {
        value = replacer(key, value);
      }
      if (options.fnReplacerCheck(key, value)) {
        if (options.utc) {
          value = (0, import_moment.default)(value).utc(false).format("YYYY-MM-DDTHH:mm:ss.SSS") + "Z";
        } else {
          value = (0, import_moment.default)(value).format("YYYY-MM-DDTHH:mm:ss.SSSZ");
        }
      }
      return value;
    };
  }
  function stringify(value, replacer, space) {
    return JSON.stringify(value, fnReplacer(replacer), space);
  }
  function parse(text, reviver) {
    return JSON.parse(text, fnReviver(reviver));
  }
  function getOptions() {
    return { ...options };
  }
  function setOptions(opt) {
    options = { ...options, ...opt };
  }
  var index_default = {
    parse,
    stringify,
    getOptions,
    setOptions,
    fnReplacer,
    fnReviver
  };
  return __toCommonJS(index_exports);
})();
