"use strict";

module.exports = {
  builtins: {
    Observable: "observable",

    setImmediate: "set-immediate",

    clearImmediate: "clear-immediate",

    asap: "asap"
  },

  methods: {
    Array: {},

    JSON: {},

    Object: {
      entries: "object/entries",

      getOwnPropertyDescriptors: "object/get-own-property-descriptors",

      values: "object/values"
    },

    RegExp: {
      escape: "regexp/escape" },

    Math: {
      iaddh: "math/iaddh",

      isubh: "math/isubh",

      imulh: "math/imulh",

      umulh: "math/umulh"
    },

    Symbol: {
      asyncIterator: "symbol/async-iterator",

      hasInstance: "symbol/has-instance",

      isConcatSpreadable: "symbol/is-concat-spreadable",

      match: "symbol/match",

      observable: "symbol/observable",

      replace: "symbol/replace",

      search: "symbol/search",

      species: "symbol/species",

      split: "symbol/split",

      toPrimitive: "symbol/to-primitive",

      toStringTag: "symbol/to-string-tag"
    },

    String: {
      at: "string/at",

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

    Number: {},

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