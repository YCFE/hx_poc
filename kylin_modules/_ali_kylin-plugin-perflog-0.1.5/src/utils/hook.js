import { performanceRemoteLog, log, getRandom } from './log';

const KYLIN_PERFLOG_VERSION = 'kylin_perflog_version';
const NATIVE_NAVIGATION_START = 'page_navigation_start';
const BIZ_INIT_LOCAL = 'biz_init_local';
const BIZ_INIT_GLOBAL = 'biz_init_global';
const BIZ_INIT_PLUGIN = 'biz_init_plugin';
const PAGE_INITED = 'page_inited';
const PAGE_MOUNTED = 'page_mounted';
const PAGE_FIRST_RENDERED = 'page_first_rendered';
const STORE_CHANGE_START = 'store_change_start';
const STORE_CHANGE_IDLE = 'store_change_idle';
const STORE_CHANGE_COUNT = 'store_change_count';
const UPDATE_START = 'updated_start';
const UPDATE_IDLE = 'updated_idle';
const UPDATE_COUNT = 'update_count';
const UPDATE_BATCH_COUNT = 'update_batch_count';

const META_URL = 'meta_url';
const META_RANDOM = 'meta_random';

const REPORT_TYPE_RENDER = 'FIRST_RENDER';
const REPORT_TYPE_STORE = 'STORE_CHANGE';
const REPORT_TYPE_UPDATED = 'UPDATED';

const GLOBAL_MAP_CUSTOM = '__kylin_perflog_custom_map__';
const GLOBAL_MAP_CUSTOM_PREFIX = 'custom_';

let timeMap = {};
timeMap[KYLIN_PERFLOG_VERSION] = '201802110000';
if (typeof window !== 'undefined') {
  window.timeMap = timeMap;
}
let storeChangeLogCount = 1;
let storeChanging = false;
let storeChangeTId = null;
const storeChangeLogMax = 4;
let currentStoreChangeInfo = null;
// 不是一次commit，而是 一次同步执行中，触发的多次commit都算一次change

// 钩子勾住 beforeCreate, mounted 来拿到业务首次主动渲染时间, 以及后续的store变更时间
export function hookRender(options) {
  try {
    preprocessHook(options, 'mounted');
    preprocessHook(options, 'beforeCreate');

    options.beforeCreate.push(hookPageBeforeCreate);

    options.mounted.push(hookPageMounted);

    // if (options.store && typeof options.store.subscribe === 'function') {
    //   options.store.subscribe(hookStoreChange);
    // }

    monitorNavigationStart();
  } catch (ex) {
    if (typeof console.error === 'function') {
      console.error(ex);
    }
  }
}

let hookUpdatedProcessed = false;
// 钩子勾住所有 所有vm option的的updated钩子
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
    timeMapAdd(META_RANDOM, getRandom());
  } catch (ex) {
    try {
      console.error(ex);
    } catch (e) {}
  }
}

function addCustomKeyBeforeInited() {
  // 尝试读取下window下的已有数据
  // TODO: 该数据应在 build期间对html进行修改注入，放在 script src 所有标签之前
  try {
    if (typeof window !== 'undefined' && typeof window[GLOBAL_MAP_CUSTOM] === 'object') {
      const map = window[GLOBAL_MAP_CUSTOM];
      // 把里面的所有点全都上报上来
      Object.keys(map).forEach((k) => {
        if (typeof map[k] === 'number') {
          timeMapAdd(`${GLOBAL_MAP_CUSTOM_PREFIX}${k}`, map[k]);
        }
      });
    }
  } catch (ex) {
    try {
      console.error(ex);
    } catch (e) {}
  }
}

export function tryHookUpdated(_Vue) {
  try {
    const Vue = window.Vue || _Vue;

    if (Vue && !hookUpdatedProcessed) {
      hookUpdated(Vue, !!_Vue);
      hookUpdatedProcessed = true;
    }
  } catch (ex) {
    log(ex);
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

// function hookStoreChange(mutation, state) {
//   // queue 次数控制
//   if (storeChangeLogCount > storeChangeLogMax) {
//     return;
//   }

//   // 每个queue中的第一个
//   if (storeChanging === false) {
//     storeChanging = true;
//     timeMapAdd(`${STORE_CHANGE_START}_${storeChangeLogCount}`, now());
//     // console.time(`${STORE_CHANGE_START}_${storeChangeLogCount}`);
//   }

//   clearTimeout(storeChangeTId);
//   storeChangeTId = setTimeout(function () {
//     // 重置状态
//     storeChanging = false;
//     // console.timeEnd(`${STORE_CHANGE_START}_${storeChangeLogCount}`);
//     timeMapAdd(`${STORE_CHANGE_IDLE}_${storeChangeLogCount}`, now());
//     timeReport(REPORT_TYPE_STORE, {
//       [STORE_CHANGE_COUNT]: storeChangeLogCount
//     });
//     storeChangeLogCount++;
//   });
// }

function now() {
  return (new Date()).getTime();
}

function timeMapAdd(id, time) {
  time = time || now();
  // 应该在何时上报日志, 如果没上报怎么处理

  // 上报时，标注 kylin_log_version 控制过滤
  // 上报时，使用不同埋点
  timeMap[id] = time;
}

function timeReport(type, param1) {
  switch (type) {
    case REPORT_TYPE_RENDER:
      // 上报 init, mount, render
      performanceRemoteLog(REPORT_TYPE_RENDER, timeMap);
      break;
    case REPORT_TYPE_STORE:
      // 上报 store_count
      performanceRemoteLog(REPORT_TYPE_STORE, timeMap, param1);
      break;
    case REPORT_TYPE_UPDATED:
      // 上报 store_count
      performanceRemoteLog(REPORT_TYPE_UPDATED, timeMap, param1);
      break;
  }
}

function preprocessHook(options, hookName) {
  options[hookName] = options[hookName] || [];
  // 如果是非数组，修改成数组
  if (!Array.isArray(options[hookName])) {
    options[hookName] = [ options[hookName] ];
  }
}

// 是否在更新批次中
let currentUpdatedTick = false;
// 当前是第几次更新批次
let updatedBatchCount = 1;
// 当前更新批次里面触发了多少次updated回调
let currentUpdateComponentCount = 0;

// 只记录前几次更新批次
const updatedLogMax = 3;

function updatedProcess() {
  // 前3次
  if (updatedBatchCount > updatedLogMax) return;

  // 当前更新了几个组件
  currentUpdateComponentCount++;

  // 同步更新中的话，跳过
  if (currentUpdatedTick) return;

  currentUpdatedTick = true;

  timeMapAdd(`${UPDATE_START}_${updatedBatchCount}`);

  setTimeout(function () {
    // 当前同步过程结束
    timeMapAdd(`${UPDATE_IDLE}_${updatedBatchCount}`);

    var needReportMap = {};
    needReportMap[UPDATE_COUNT] = currentUpdateComponentCount;
    needReportMap[UPDATE_BATCH_COUNT] = updatedBatchCount;

    timeReport(REPORT_TYPE_UPDATED, needReportMap);

    currentUpdatedTick = false;
    updatedBatchCount++;
    currentUpdateComponentCount = 0;
  }, 0);
}

export function logPluginLoad() {
  timeMapAdd(BIZ_INIT_PLUGIN);
}
