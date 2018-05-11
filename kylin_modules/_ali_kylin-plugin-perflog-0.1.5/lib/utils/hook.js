'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hookRender = hookRender;
exports.tryHookUpdated = tryHookUpdated;
exports.logPluginLoad = logPluginLoad;

var _log = require('./log');

var KYLIN_PERFLOG_VERSION = 'kylin_perflog_version';
var NATIVE_NAVIGATION_START = 'page_navigation_start';
var BIZ_INIT_LOCAL = 'biz_init_local';
var BIZ_INIT_GLOBAL = 'biz_init_global';
var BIZ_INIT_PLUGIN = 'biz_init_plugin';
var PAGE_INITED = 'page_inited';
var PAGE_MOUNTED = 'page_mounted';
var PAGE_FIRST_RENDERED = 'page_first_rendered';
var STORE_CHANGE_START = 'store_change_start';
var STORE_CHANGE_IDLE = 'store_change_idle';
var STORE_CHANGE_COUNT = 'store_change_count';
var UPDATE_START = 'updated_start';
var UPDATE_IDLE = 'updated_idle';
var UPDATE_COUNT = 'update_count';
var UPDATE_BATCH_COUNT = 'update_batch_count';

var META_URL = 'meta_url';
var META_RANDOM = 'meta_random';

var REPORT_TYPE_RENDER = 'FIRST_RENDER';
var REPORT_TYPE_STORE = 'STORE_CHANGE';
var REPORT_TYPE_UPDATED = 'UPDATED';

var GLOBAL_MAP_CUSTOM = '__kylin_perflog_custom_map__';
var GLOBAL_MAP_CUSTOM_PREFIX = 'custom_';

var timeMap = {};
timeMap[KYLIN_PERFLOG_VERSION] = '201802110000';
if (typeof window !== 'undefined') {
  window.timeMap = timeMap;
}
var storeChangeLogCount = 1;
var storeChanging = false;
var storeChangeTId = null;
var storeChangeLogMax = 4;
var currentStoreChangeInfo = null;
function hookRender(options) {
  try {
    preprocessHook(options, 'mounted');
    preprocessHook(options, 'beforeCreate');

    options.beforeCreate.push(hookPageBeforeCreate);

    options.mounted.push(hookPageMounted);

    monitorNavigationStart();
  } catch (ex) {
    if (typeof console.error === 'function') {
      console.error(ex);
    }
  }
}

var hookUpdatedProcessed = false;

function hookUpdated(Vue, isLocalVue) {
  Vue.mixin({
    updated: updatedProcess
  });
  if (isLocalVue) {
    timeMapAdd(BIZ_INIT_LOCAL, now());
  } else {
    timeMapAdd(BIZ_INIT_GLOBAL, now());
  }

  addCustomKeyBeforeInited();
  addMeta();
}

function addMeta() {
  try {
    timeMapAdd(META_URL, window.location.href);
    timeMapAdd(META_RANDOM, (0, _log.getRandom)());
  } catch (ex) {
    try {
      console.error(ex);
    } catch (e) {}
  }
}

function addCustomKeyBeforeInited() {
  try {
    if (typeof window !== 'undefined' && typeof window[GLOBAL_MAP_CUSTOM] === 'object') {
      var map = window[GLOBAL_MAP_CUSTOM];

      Object.keys(map).forEach(function (k) {
        if (typeof map[k] === 'number') {
          timeMapAdd('' + GLOBAL_MAP_CUSTOM_PREFIX + k, map[k]);
        }
      });
    }
  } catch (ex) {
    try {
      console.error(ex);
    } catch (e) {}
  }
}

function tryHookUpdated(_Vue) {
  try {
    var Vue = window.Vue || _Vue;

    if (Vue && !hookUpdatedProcessed) {
      hookUpdated(Vue, !!_Vue);
      hookUpdatedProcessed = true;
    }
  } catch (ex) {
    (0, _log.log)(ex);
  }

  return hookUpdatedProcessed;
}

function monitorNavigationStart() {
  if (window.performance && window.performance.timing && window.performance.timing.navigationStart) {
    timeMapAdd(NATIVE_NAVIGATION_START, window.performance.timing.navigationStart);
  }
}

function hookPageBeforeCreate() {
  timeMapAdd(PAGE_INITED, now());
}

function hookPageMounted() {
  timeMapAdd(PAGE_MOUNTED, now());
  setTimeout(function () {
    timeMapAdd(PAGE_FIRST_RENDERED, now());
    timeReport(REPORT_TYPE_RENDER);
  }, 0);
}

function now() {
  return new Date().getTime();
}

function timeMapAdd(id, time) {
  time = time || now();

  timeMap[id] = time;
}

function timeReport(type, param1) {
  switch (type) {
    case REPORT_TYPE_RENDER:
      (0, _log.performanceRemoteLog)(REPORT_TYPE_RENDER, timeMap);
      break;
    case REPORT_TYPE_STORE:
      (0, _log.performanceRemoteLog)(REPORT_TYPE_STORE, timeMap, param1);
      break;
    case REPORT_TYPE_UPDATED:
      (0, _log.performanceRemoteLog)(REPORT_TYPE_UPDATED, timeMap, param1);
      break;
  }
}

function preprocessHook(options, hookName) {
  options[hookName] = options[hookName] || [];

  if (!Array.isArray(options[hookName])) {
    options[hookName] = [options[hookName]];
  }
}

var currentUpdatedTick = false;

var updatedBatchCount = 1;

var currentUpdateComponentCount = 0;

var updatedLogMax = 3;

function updatedProcess() {
  if (updatedBatchCount > updatedLogMax) return;

  currentUpdateComponentCount++;

  if (currentUpdatedTick) return;

  currentUpdatedTick = true;

  timeMapAdd(UPDATE_START + '_' + updatedBatchCount);

  setTimeout(function () {
    timeMapAdd(UPDATE_IDLE + '_' + updatedBatchCount);

    var needReportMap = {};
    needReportMap[UPDATE_COUNT] = currentUpdateComponentCount;
    needReportMap[UPDATE_BATCH_COUNT] = updatedBatchCount;

    timeReport(REPORT_TYPE_UPDATED, needReportMap);

    currentUpdatedTick = false;
    updatedBatchCount++;
    currentUpdateComponentCount = 0;
  }, 0);
}

function logPluginLoad() {
  timeMapAdd(BIZ_INIT_PLUGIN);
}
//# sourceMappingURL=hook.js.map