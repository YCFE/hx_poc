'use strict';

exports.__esModule = true;
exports.createConnect = undefined;
exports.hasConnectProperty = hasConnectProperty;

var _vue = require('vue');

var _vue2 = _interopRequireDefault(_vue);

var _vuex = require('vuex');

var _utils = require('./utils');

var _utils2 = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var connectProperties = {
  'mapStateToProps': true,
  'mapMethodsToProps': true,
  'mapMethodsToEvents': true,
  'mapEvents': true,
  'mapMethods': true,
  'mapActionsToMethods': true,
  'mapMutationsToMethods': true
};

function hasConnectProperty(obj) {
  if (!obj) return false;

  var ret = false;
  Object.keys(obj).forEach(function (k) {
    ret = ret || connectProperties[k];
  });

  return ret;
}

var connectEmitArgChildToParent = '$$__child_to_parent__$$';
var connectEmitArgParentToChild = '$$__parent_to_child__$$';

var createConnect = exports.createConnect = function createConnect(transform) {
  return function () {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var _mapValues = (0, _utils.mapValues)(options, normalizeOptions),
        _mapValues$mapStateTo = _mapValues.mapStateToProps,
        mapStateToProps = _mapValues$mapStateTo === undefined ? {} : _mapValues$mapStateTo,
        _mapValues$mapMethods = _mapValues.mapMethodsToProps,
        mapMethodsToProps = _mapValues$mapMethods === undefined ? {} : _mapValues$mapMethods,
        _mapValues$mapMethods2 = _mapValues.mapMethodsToEvents,
        mapMethodsToEvents = _mapValues$mapMethods2 === undefined ? {} : _mapValues$mapMethods2,
        _mapValues$mapActions = _mapValues.mapActionsToMethods,
        mapActionsToMethods = _mapValues$mapActions === undefined ? {} : _mapValues$mapActions,
        _mapValues$mapMutatio = _mapValues.mapMutationsToMethods,
        mapMutationsToMethods = _mapValues$mapMutatio === undefined ? {} : _mapValues$mapMutatio,
        _mapValues$mapMethods3 = _mapValues.mapMethods,
        mapMethods = _mapValues$mapMethods3 === undefined ? [] : _mapValues$mapMethods3,
        _mapValues$mapEvents = _mapValues.mapEvents,
        mapEvents = _mapValues$mapEvents === undefined ? [] : _mapValues$mapEvents;

    var stateToProps = mapStateToProps;
    var methodsToProps = mapMethodsToProps;
    var methodsToEvents = mapMethodsToEvents;
    var eventsTransport = (0, _utils.keys)(mapEvents);

    var mapMethodsAll = mapMethods === true;

    var mapMethodsDisable = !mapMethods || mapMethods.length === 0;
    var methodsTransport = mapMethodsAll || mapMethodsDisable ? [] : (0, _utils.keys)(mapMethods);

    var mutationsToMethods = mapMutationsToMethods;
    var actionsToMethods = mapActionsToMethods;

    return function (name, Component) {
      if (typeof name !== 'string') {
        Component = name;
        name = getOptions(Component).name || 'wrapped-anonymous-component';
      }

      var propKeys = (0, _utils.keys)(stateToProps, methodsToProps);

      var eventKeys = (0, _utils.keys)(methodsToEvents);

      applyStoreMapToComponent(Component, mutationsToMethods, actionsToMethods);

      var needTransportMethods = {};

      if (!mapMethodsDisable) {
        var methods = getOptions(Component).methods || {};

        needTransportMethods = (0, _utils.pick)(methods, mapMethodsAll ? Object.keys(methods) : methodsTransport);
      }

      var containerProps = (0, _utils.omit)(getOptions(Component).props || {}, propKeys);

      var componentsProps = {};
      componentsProps[name] = Component;

      var options = {
        name: 'connect-' + name,
        props: containerProps,
        components: componentsProps,
        computed: (0, _vuex.mapState)(stateToProps),
        methods: (0, _utils.merge)((0, _utils.mapValues)((0, _utils.merge)(methodsToProps, methodsToEvents), bindStore), (0, _utils.mapValues)((0, _utils.merge)(needTransportMethods), bindMethodsTransport)),
        beforeCreate: [function bindEvents() {
          var _this = this;

          eventsTransport.forEach(function (eventKey) {
            var middleConnectSelf = _this;

            middleConnectSelf.$on(eventKey, function (q) {
              if (arguments[arguments.length - 1] === connectEmitArgChildToParent) {
                return;
              }

              var args = [eventKey].concat((0, _utils.toArray)(arguments));
              args.push(connectEmitArgParentToChild);
              middleConnectSelf.$refs.child.$emit.apply(middleConnectSelf.$refs.child, args);
            });
          });
        }]
      };

      insertRenderer(options, name, propKeys.concat(Object.keys(containerProps)), eventKeys, eventsTransport);

      return options;
    };
  };
};

function insertRenderer(options, name, propKeys, eventKeys, eventsTransport) {

  options.render = function (h) {
    return h(name, {
      props: (0, _utils.pick)(this, propKeys),
      on: (0, _utils.merge)((0, _utils.pick)(this, eventKeys), bindEventEmit(this, eventsTransport)),
      ref: 'child'
    });
  };
}

function bindEventEmit(middleConnectSelf, eventsTransport) {
  var ret = {};

  eventsTransport.forEach(function (k) {
    ret[k] = function () {
      if (arguments[arguments.length - 1] === connectEmitArgParentToChild) {
        return;
      }

      var args = [k].concat((0, _utils.toArray)(arguments));
      args.push(connectEmitArgChildToParent);
      middleConnectSelf.$emit.apply(middleConnectSelf, args);
    };
  });

  return ret;
}

function getOptions(Component) {
  if (typeof Component === 'function') {
    return Component.options;
  }
  return Component;
}

function bindStore(fn) {
  return function boundFunctionWithStore() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return fn.call.apply(fn, [this, this.$store].concat(args));
  };
}

function bindMethodsTransport(v, k) {
  return function boundFunctionWithMethodTransport() {
    var child = this.$refs.child;
    if (typeof child[k] === 'function') {
      var _child$k;

      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      return (_child$k = child[k]).call.apply(_child$k, [child].concat(args));
    }
  };
}

function normalizeOptions(options) {
  return Array.isArray(options) ? options.reduce(function (obj, value) {
    obj[value] = value;
    return obj;
  }, {}) : options;
}

function applyStoreMapToComponent(ComponentOption, mutationsToMethods, actionsToMethods) {
  try {
    var option = getOptions(ComponentOption);

    option.methods = option.methods || {};

    if (mutationsToMethods && Object.keys(mutationsToMethods).length) {
      (0, _utils2.objectAssign)(option.methods, (0, _vuex.mapMutations)(mutationsToMethods));
    }
    if (actionsToMethods && Object.keys(actionsToMethods).length) {
      (0, _utils2.objectAssign)(option.methods, (0, _vuex.mapActions)(actionsToMethods));
    }
  } catch (ex) {
    if (typeof console !== 'undefined' && typeof console.error === 'function') {
      console.error(ex);
    }
  }
}
//# sourceMappingURL=connect.js.map