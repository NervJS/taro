"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = initNativeApi;

var _api = _interopRequireDefault(require("@tarojs/api"));

var _dataCache = require("./data-cache");

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var noPromiseApis = _api["default"].noPromiseApis,
    onAndSyncApis = _api["default"].onAndSyncApis,
    otherApis = _api["default"].otherApis,
    initPxTransform = _api["default"].initPxTransform,
    Link = _api["default"].Link,
    Current = _api["default"].Current;
var RequestQueue = {
  MAX_REQUEST: 5,
  queue: [],
  request: function request(options) {
    this.push(options); // 返回request task

    return this.run();
  },
  push: function push(options) {
    this.queue.push(options);
  },
  run: function run() {
    var _this = this;

    if (!this.queue.length) {
      return;
    }

    if (this.queue.length <= this.MAX_REQUEST) {
      var options = this.queue.shift();
      var completeFn = options.complete;

      options.complete = function () {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        completeFn && completeFn.apply(options, args);

        _this.run();
      };

      return jd.request(options);
    }
  }
};

function taroInterceptor(chain) {
  return request(chain.requestParams);
}

var link = new Link(taroInterceptor);

function request(options) {
  options = options || {};

  if (typeof options === 'string') {
    options = {
      url: options
    };
  }

  var originSuccess = options.success;
  var originFail = options.fail;
  var originComplete = options.complete;
  var requestTask;
  var p = new Promise(function (resolve, reject) {
    options.success = function (res) {
      originSuccess && originSuccess(res);
      resolve(res);
    };

    options.fail = function (res) {
      originFail && originFail(res);
      reject(res);
    };

    options.complete = function (res) {
      originComplete && originComplete(res);
    };

    requestTask = RequestQueue.request(options);
  });

  p.abort = function (cb) {
    cb && cb();

    if (requestTask) {
      requestTask.abort();
    }

    return p;
  };

  return p;
}

function processApis(taro) {
  var weApis = Object.assign({}, onAndSyncApis, noPromiseApis, otherApis);
  var useDataCacheApis = {
    navigateTo: true,
    redirectTo: true,
    reLaunch: true
  };
  var routerParamsPrivateKey = '__key_';
  Object.keys(weApis).forEach(function (key) {
    if (!(key in jd)) {
      taro[key] = function () {
        console.warn("\u5FAE\u4FE1\u5C0F\u7A0B\u5E8F\u6682\u4E0D\u652F\u6301 ".concat(key));
      };

      return;
    }

    if (!onAndSyncApis[key] && !noPromiseApis[key]) {
      taro[key] = function (options) {
        for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
          args[_key2 - 1] = arguments[_key2];
        }

        options = options || {};
        var task = null;
        var obj = Object.assign({}, options);

        if (typeof options === 'string') {
          if (args.length) {
            var _jd;

            return (_jd = jd)[key].apply(_jd, [options].concat(args));
          }

          return jd[key](options);
        }

        if (key === 'navigateTo' || key === 'redirectTo' || key === 'switchTab') {
          var url = obj.url ? obj.url.replace(/^\//, '') : '';
          if (url.indexOf('?') > -1) url = url.split('?')[0];
        }

        if (useDataCacheApis[key]) {
          var _url = obj.url = obj.url || '';

          var MarkIndex = _url.indexOf('?');

          var hasMark = MarkIndex > -1;
          var urlQueryStr = hasMark ? _url.substring(MarkIndex + 1, _url.length) : '';
          var params = (0, _utils.queryToJson)(urlQueryStr);
          var cacheKey = (0, _utils.getUniqueKey)();
          obj.url += (hasMark ? '&' : '?') + "".concat(routerParamsPrivateKey, "=").concat(cacheKey);
          (0, _dataCache.cacheDataSet)(cacheKey, params);
        }

        var p = new Promise(function (resolve, reject) {
          ['fail', 'success', 'complete'].forEach(function (k) {
            obj[k] = function (res) {
              options[k] && options[k](res);

              if (k === 'success') {
                if (key === 'connectSocket') {
                  resolve(Promise.resolve().then(function () {
                    return Object.assign(task, res);
                  }));
                } else {
                  resolve(res);
                }
              } else if (k === 'fail') {
                reject(res);
              }
            };
          });

          if (args.length) {
            var _jd2;

            task = (_jd2 = jd)[key].apply(_jd2, [obj].concat(args));
          } else {
            task = jd[key](obj);
          }
        });

        if (key === 'uploadFile' || key === 'downloadFile') {
          p.progress = function (cb) {
            if (task) {
              task.onProgressUpdate(cb);
            }

            return p;
          };

          p.abort = function (cb) {
            cb && cb();

            if (task) {
              task.abort();
            }

            return p;
          };
        }

        return p;
      };
    } else {
      taro[key] = function () {
        for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
          args[_key3] = arguments[_key3];
        }

        var argsLen = args.length;
        var newArgs = args.concat();
        var lastArg = newArgs[argsLen - 1];

        if (lastArg && lastArg.isTaroComponent && lastArg.$scope) {
          newArgs.splice(argsLen - 1, 1, lastArg.$scope);
        }

        return jd[key].apply(jd, newArgs);
      };
    }
  });
}

function pxTransform(size) {
  var _ref = this.config || {},
      _ref$designWidth = _ref.designWidth,
      designWidth = _ref$designWidth === void 0 ? 750 : _ref$designWidth,
      _ref$deviceRatio = _ref.deviceRatio,
      deviceRatio = _ref$deviceRatio === void 0 ? {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2
  } : _ref$deviceRatio;

  if (!(designWidth in deviceRatio)) {
    throw new Error("deviceRatio \u914D\u7F6E\u4E2D\u4E0D\u5B58\u5728 ".concat(designWidth, " \u7684\u8BBE\u7F6E\uFF01"));
  }

  return parseInt(size, 10) * deviceRatio[designWidth] + 'rpx';
}

function canIUseWebp() {
  var _jd$getSystemInfoSync = jd.getSystemInfoSync(),
      _jd$getSystemInfoSync2 = _jd$getSystemInfoSync.platform,
      platform = _jd$getSystemInfoSync2 === void 0 ? '' : _jd$getSystemInfoSync2;

  var platformLower = platform.toLowerCase();

  if (platformLower === 'android' || platformLower === 'devtools') {
    return true;
  }

  return false;
}

function jdCloud(taro) {
  var jdC = jd.cloud || {};
  var jdcloud = {};
  var apiList = ['init', 'database', 'uploadFile', 'downloadFile', 'getTempFileURL', 'deleteFile', 'callFunction', 'CloudID'];
  apiList.forEach(function (v) {
    jdcloud[v] = jdC[v];
  });
  taro.cloud = jdcloud;
}

function preload(key, val) {
  if (_typeof(key) === 'object') {
    Current.preloadData = key;
  } else if (key !== undefined && val !== undefined) {
    Current.preloadData = _defineProperty({}, key, val);
  }
}

function initNativeApi(taro) {
  processApis(taro);
  taro.request = link.request.bind(link);
  taro.addInterceptor = link.addInterceptor.bind(link);
  taro.cleanInterceptors = link.cleanInterceptors.bind(link);
  taro.getCurrentPages = getCurrentPages;
  taro.getApp = getApp;
  taro.requirePlugin = requirePlugin;
  taro.initPxTransform = initPxTransform.bind(taro);
  taro.pxTransform = pxTransform.bind(taro);
  taro.preload = preload;
  taro.canIUseWebp = canIUseWebp;
  taro.env = jd.env;
  jdCloud(taro);
}