window.AlipayJSBridge || (function() {
  console.log("begin load AlipayJSBridge");
  var messenger = window.__alipayConsole__ || window.console,
  log = messenger.log;
  var postMessage = function(msg) {
    log.call(messenger, "h5container.message: " + msg)
  };
  var callbackPool = {};
  window.AlipayJSBridge = {
    call: function(func, param, callback) {
      if ('string' !== typeof func) {
        return
      }
      if ('function' === typeof param) {
        callback = param;
        param = null
      } else if (typeof param !== 'object') {
        param = null
      }
      var clientId = '' + new Date().getTime() + (Math.random());
      if ('function' === typeof callback) {
        callbackPool[clientId] = callback
      }
      var invokeMsg = JSON.stringify({
        func: func,
        param: param,
        msgType: 'call',
        clientId: clientId
      });
      postMessage(invokeMsg)
    },
    callback: function(clientId, param) {
      var invokeMsg = JSON.stringify({
        clientId: clientId,
        param: param
      });
      postMessage(invokeMsg)
    },
    trigger: function(name, param, clientId) {
      if (name) {
        var evt = document.createEvent('Events');
        evt.initEvent(name, !1, !0);
        if (typeof param === 'object') {
          for (var k in param) {
            evt[k] = param[k]
          }
        }
        evt.clientId = clientId;
        var prevent = !document.dispatchEvent(evt);
        if (clientId && name === 'back') {
          AlipayJSBridge.callback(clientId, {
            prevent: prevent
          })
        }
        if (clientId && name === 'closeWindow') {
          AlipayJSBridge.callback(clientId, {
            prevent: prevent
          })
        }
        if (clientId && name === 'firePullToRefresh') {
          AlipayJSBridge.callback(clientId, {
            prevent: prevent
          })
        }
        if (clientId && name === 'onShare') {
          AlipayJSBridge.callback(clientId, {
            prevent: prevent
          })
        }
      }
    },
    _invokeJS: function(resp) {
      resp = JSON.parse(resp);
      console.log("invokeJS msgType " + resp.msgType + " func " + resp.func);
      if (resp.msgType === 'callback') {
        var func = callbackPool[resp.clientId];
        if (! (typeof resp.keepCallback == 'boolean' && resp.keepCallback)) {
          delete callbackPool[resp.clientId]
        }
        if ('function' === typeof func) {
          setTimeout(function() {
            func(resp.param)
          },
          1)
        }
      } else if (resp.msgType === 'call') {
        resp.func && this.trigger(resp.func, resp.param, resp.clientId)
      }
    },
    devPerformance4Test: ""
  };
  AlipayJSBridge.startupParams = '{startupParams}';
  window.APVIEWID = '{APVIEWID}';
  var readyEvent = document.createEvent('Events');
  readyEvent.initEvent('AlipayJSBridgeReady', !1, !1);
  var docAddEventListener = document.addEventListener;
  document.addEventListener = function(name, func) {
    if (name === readyEvent.type) {
      setTimeout(function() {
        func(readyEvent)
      },
      1)
    }
    docAddEventListener.apply(document, arguments)
  };
  document.dispatchEvent(readyEvent);
  console.log("load AlipayJSBridge  dispatchEvent AlipayJSBridgeReady")
})()