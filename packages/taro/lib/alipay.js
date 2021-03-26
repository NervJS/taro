"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = initNativeApi;

var _api = _interopRequireDefault(require("@tarojs/api"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var noPromiseApis = _api["default"].noPromiseApis,
    onAndSyncApis = _api["default"].onAndSyncApis,
    otherApis = _api["default"].otherApis,
    initPxTransform = _api["default"].initPxTransform,
    Link = _api["default"].Link,
    Current = _api["default"].Current;
var apiDiff = {
  showActionSheet: {
    options: {
      change: [{
        old: 'itemList',
        "new": 'items'
      }]
    }
  },
  showToast: {
    options: {
      change: [{
        old: 'title',
        "new": 'content'
      }, {
        old: 'icon',
        "new": 'type'
      }]
    }
  },
  showLoading: {
    options: {
      change: [{
        old: 'title',
        "new": 'content'
      }]
    }
  },
  setNavigationBarTitle: {
    alias: 'setNavigationBar'
  },
  setNavigationBarColor: {
    alias: 'setNavigationBar'
  },
  saveImageToPhotosAlbum: {
    alias: 'saveImage',
    options: {
      change: [{
        old: 'filePath',
        "new": 'url'
      }]
    }
  },
  previewImage: {
    options: {
      set: [{
        key: 'current',
        value: function value(options) {
          return options.urls.indexOf(options.current || options.urls[0]);
        }
      }]
    }
  },
  getFileInfo: {
    options: {
      change: [{
        old: 'filePath',
        "new": 'apFilePath'
      }]
    }
  },
  getSavedFileInfo: {
    options: {
      change: [{
        old: 'filePath',
        "new": 'apFilePath'
      }]
    }
  },
  removeSavedFile: {
    options: {
      change: [{
        old: 'filePath',
        "new": 'apFilePath'
      }]
    }
  },
  saveFile: {
    options: {
      change: [{
        old: 'tempFilePath',
        "new": 'apFilePath'
      }]
    }
  },
  openLocation: {
    options: {
      set: [{
        key: 'latitude',
        value: function value(options) {
          return String(options.latitude);
        }
      }, {
        key: 'longitude',
        value: function value(options) {
          return String(options.longitude);
        }
      }]
    }
  },
  uploadFile: {
    options: {
      change: [{
        old: 'name',
        "new": 'fileName'
      }]
    }
  },
  getClipboardData: {
    alias: 'getClipboard'
  },
  setClipboardData: {
    alias: 'setClipboard',
    options: {
      change: [{
        old: 'data',
        "new": 'text'
      }]
    }
  },
  makePhoneCall: {
    options: {
      change: [{
        old: 'phoneNumber',
        "new": 'number'
      }]
    }
  },
  scanCode: {
    alias: 'scan',
    options: {
      change: [{
        old: 'onlyFromCamera',
        "new": 'hideAlbum'
      }],
      set: [{
        key: 'type',
        value: function value(options) {
          return options.scanType && options.scanType[0].slice(0, -4) || 'qr';
        }
      }]
    }
  },
  setScreenBrightness: {
    options: {
      change: [{
        old: 'value',
        "new": 'brightness'
      }]
    }
  }
};
var nativeRequest = my.canIUse('request') ? my.request : my.httpRequest;
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
    var _arguments = arguments,
        _this = this;

    if (!this.queue.length) {
      return;
    }

    if (this.queue.length <= this.MAX_REQUEST) {
      var options = this.queue.shift();
      var completeFn = options.complete;

      options.complete = function () {
        completeFn && completeFn.apply(options, _toConsumableArray(_arguments));

        _this.run();
      };

      return nativeRequest(options);
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

  var defaultHeaders = {
    'content-type': 'application/json'
  };
  options.headers = defaultHeaders;

  if (options.header) {
    for (var k in options.header) {
      var lowerK = k.toLocaleLowerCase();
      options.headers[lowerK] = options.header[k];
    }

    delete options.header;
  }

  var originSuccess = options.success;
  var originFail = options.fail;
  var originComplete = options.complete;
  var requestTask;
  var p = new Promise(function (resolve, reject) {
    options.success = function (res) {
      res.statusCode = res.status;
      delete res.status;
      res.header = res.headers;
      delete res.headers;
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
  Object.keys(weApis).forEach(function (key) {
    if (!onAndSyncApis[key] && !noPromiseApis[key]) {
      taro[key] = function (options) {
        for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        var result = generateSpecialApis(key, options || {});
        var newKey = result.api;
        options = result.options;
        var task = null;
        var obj = Object.assign({}, options);

        if (!(newKey in my)) {
          console.warn("\u652F\u4ED8\u5B9D\u5C0F\u7A0B\u5E8F\u6682\u4E0D\u652F\u6301 ".concat(newKey));
          return;
        }

        if (typeof options === 'string') {
          if (args.length) {
            var _my;

            return (_my = my)[newKey].apply(_my, [options].concat(args));
          }

          return my[newKey](options);
        }

        if (key === 'navigateTo' || key === 'redirectTo' || key === 'switchTab') {
          var url = obj.url ? obj.url.replace(/^\//, '') : '';
          if (url.indexOf('?') > -1) url = url.split('?')[0];
        }

        var p = new Promise(function (resolve, reject) {
          ['fail', 'success', 'complete'].forEach(function (k) {
            obj[k] = function (res) {
              if (k === 'success') {
                if (newKey === 'saveFile') {
                  res.savedFilePath = res.apFilePath;
                } else if (newKey === 'downloadFile') {
                  res.tempFilePath = res.apFilePath;
                } else if (newKey === 'chooseImage') {
                  res.tempFilePaths = res.apFilePaths;
                } else if (newKey === 'getClipboard') {
                  res.data = res.text;
                } else if (newKey === 'scan') {
                  res.result = res.code;
                } else if (newKey === 'getScreenBrightness') {
                  res.value = res.brightness;
                  delete res.brightness;
                }
              }

              options[k] && options[k](res);

              if (k === 'success') {
                resolve(res);
              } else if (k === 'fail') {
                reject(res);
              }
            };
          });

          if (args.length) {
            var _my2;

            task = (_my2 = my)[newKey].apply(_my2, [obj].concat(args));
          } else {
            task = my[newKey](obj);
          }
        });

        if (newKey === 'uploadFile' || newKey === 'downloadFile') {
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
        if (!(key in my)) {
          console.warn("\u652F\u4ED8\u5B9D\u5C0F\u7A0B\u5E8F\u6682\u4E0D\u652F\u6301 ".concat(key));
          return;
        }

        for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }

        if (key === 'getStorageSync') {
          var arg1 = args[0];

          if (arg1 != null) {
            var res = my[key]({
              key: arg1
            }); // 支付宝小程序遗留bug：值可能在data或APDataStorage字段下

            var data = null;

            if (res.hasOwnProperty('data')) {
              data = res.data;
            } else if (res.hasOwnProperty('APDataStorage')) {
              data = res.APDataStorage;
            }

            return data === null ? '' : data;
          }

          return console.log('getStorageSync 传入参数错误');
        }

        if (key === 'setStorageSync') {
          var _arg = args[0];
          var arg2 = args[1];

          if (_arg != null) {
            return my[key]({
              key: _arg,
              data: arg2
            });
          }

          return console.log('setStorageSync 传入参数错误');
        }

        if (key === 'removeStorageSync') {
          var _arg2 = args[0];

          if (_arg2 != null) {
            return my[key]({
              key: _arg2
            });
          }

          return console.log('removeStorageSync 传入参数错误');
        }

        if (key === 'createSelectorQuery') {
          var query = my[key]();

          query["in"] = function () {
            return query;
          };

          return query;
        }

        var argsLen = args.length;
        var newArgs = args.concat();
        var lastArg = newArgs[argsLen - 1];

        if (lastArg && lastArg.isTaroComponent && lastArg.$scope) {
          newArgs.splice(argsLen - 1, 1, lastArg.$scope);
        }

        return my[key].apply(my, newArgs);
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

function generateSpecialApis(api, options) {
  var apiAlias = api;

  if (api === 'showModal') {
    options.cancelButtonText = options.cancelText || '取消';
    options.confirmButtonText = options.confirmText || '确定';
    apiAlias = 'confirm';

    if (options.showCancel === false) {
      options.buttonText = options.confirmText || '确定';
      apiAlias = 'alert';
    }
  } else {
    Object.keys(apiDiff).forEach(function (item) {
      var apiItem = apiDiff[item];

      if (api === item) {
        if (apiItem.alias) {
          apiAlias = apiItem.alias;
        }

        if (apiItem.options) {
          var change = apiItem.options.change;
          var set = apiItem.options.set;

          if (change) {
            change.forEach(function (changeItem) {
              options[changeItem["new"]] = options[changeItem.old];
            });
          }

          if (set) {
            set.forEach(function (setItem) {
              options[setItem.key] = typeof setItem.value === 'function' ? setItem.value(options) : setItem.value;
            });
          }
        }
      }
    });
  }

  return {
    api: apiAlias,
    options: options
  };
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
  taro.initPxTransform = initPxTransform.bind(taro);
  taro.pxTransform = pxTransform.bind(taro);
  taro.preload = preload;
  taro.env = my.env;
}