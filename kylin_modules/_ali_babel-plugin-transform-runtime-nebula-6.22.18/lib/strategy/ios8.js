"use strict";

module.exports = {
  builtins: {
    Symbol: "symbol",

    WeakSet: "weak-set",

    Observable: "observable",

    setImmediate: "set-immediate",

    clearImmediate: "clear-immediate",

    asap: "asap"
  },

  methods: {
    Array: {
      copyWithin: "array/copy-within",

      from: "array/from",

      includes: "array/includes",

      of: "array/of",

      values: "array/values"
    },

    JSON: {},

    Object: {
      assign: "object/assign",

      entries: "object/entries",

      getOwnPropertyDescriptors: "object/get-own-property-descriptors",

      getOwnPropertySymbols: "object/get-own-property-symbols",

      is: "object/is",

      setPrototypeOf: "object/set-prototype-of",

      values: "object/values"
    },

    RegExp: {
      escape: "regexp/escape" },

    Math: {
      clz32: "math/clz32",

      sign: "math/sign",

      iaddh: "math/iaddh",

      isubh: "math/isubh",

      imulh: "math/imulh",

      umulh: "math/umulh"
    },

    Symbol: {
      asyncIterator: "symbol/async-iterator",

      for: "symbol/for",

      hasInstance: "symbol/has-instance",

      isConcatSpreadable: "symbol/is-concat-spreadable",

      iterator: "symbol/iterator",

      keyFor: "symbol/key-for",

      match: "symbol/match",

      observable: "symbol/observable",

      replace: "symbol/replace",

      search: "symbol/search",

      species: "symbol/species",

      split: "symbol/split",

      toPrimitive: "symbol/to-primitive",

      toStringTag: "symbol/to-string-tag",

      unscopables: "symbol/unscopables"
    },

    String: {
      at: "string/at",

      codePointAt: "string/code-point-at",

      endsWith: "string/ends-with",

      fromCodePoint: "string/from-code-point",

      includes: "string/includes",

      matchAll: "string/match-all",

      padLeft: "string/pad-left",
      padRight: "string/pad-right",
      padStart: "string/pad-start",

      padEnd: "string/pad-end",

      raw: "string/raw",

      repeat: "string/repeat",

      startsWith: "string/starts-with",

      trimStart: "string/trim-start",

      trimEnd: "string/trim-end"
    },

    Number: {
      EPSILON: "number/epsilon",

      isFinite: "number/is-finite",

      isInteger: "number/is-integer",

      isNaN: "number/is-nan",

      isSafeInteger: "number/is-safe-integer",

      MAX_SAFE_INTEGER: "number/max-safe-integer",

      MIN_SAFE_INTEGER: "number/min-safe-integer"
    },

    Reflect: {
      apply: "reflect/apply",

      construct: "reflect/construct",

      defineProperty: "reflect/define-property",

      deleteProperty: "reflect/delete-property",

      enumerate: "reflect/enumerate",
      getOwnPropertyDescriptor: "reflect/get-own-property-descriptor",

      getPrototypeOf: "reflect/get-prototype-of",

      get: "reflect/get",

      has: "reflect/has",

      isExtensible: "reflect/is-extensible",

      ownKeys: "reflect/own-keys",

      preventExtensions: "reflect/prevent-extensions",

      setPrototypeOf: "reflect/set-prototype-of",

      set: "reflect/set",

      defineMetadata: "reflect/define-metadata",

      deleteMetadata: "reflect/delete-metadata",

      getMetadata: "reflect/get-metadata",

      getMetadataKeys: "reflect/get-metadata-keys",

      getOwnMetadata: "reflect/get-own-metadata",

      getOwnMetadataKeys: "reflect/get-own-metadata-keys",

      hasMetadata: "reflect/has-metadata",

      hasOwnMetadata: "reflect/has-own-metadata",

      metadata: "reflect/metadata"
    },

    System: {
      global: "system/global"
    },

    Error: {
      isError: "error/is-error" },

    Date: {},

    Function: {}
  }
};