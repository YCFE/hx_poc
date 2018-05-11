'use strict';

/*global window:true*/
var req = require.context("__kylinI18NLangDir__");
var kylinI18NGlobalLoader = '_kylin_i18n_lang_';

if (typeof window !== 'undefined') {
  window[kylinI18NGlobalLoader] = function kylinI18NGlobalLoader(langKey) {
    var result = null;
    try {
      result = req('./' + langKey + '.js');
    } catch (ex) {
      warn('language [' + langKey + '] not found in kylinI18NGlobalLoader');
    }
    if (result) {
      return result.default || result;
    } else {
      return undefined;
    }
  };
}

function warn() {
  if (window.console) {
    if (window.console.warn) {
      window.console.warn.apply(window.console, arguments);
    } else if (window.console.log) {
      window.console.log.apply(window.console, arguments);
    }
  }
}