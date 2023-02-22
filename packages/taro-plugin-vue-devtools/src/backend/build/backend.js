/* 
 * The MIT License (MIT)
 * 
 * Copyright (c) 2014-present Evan You
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "../../node_modules/after/index.js":
/*!*****************************************!*\
  !*** ../../node_modules/after/index.js ***!
  \*****************************************/
/***/ ((module) => {

module.exports = after

function after(count, callback, err_cb) {
    var bail = false
    err_cb = err_cb || noop
    proxy.count = count

    return (count === 0) ? callback() : proxy

    function proxy(err, result) {
        if (proxy.count <= 0) {
            throw new Error('after called too many times')
        }
        --proxy.count

        // after first error, rest are passed to err_cb
        if (err) {
            bail = true
            callback(err)
            // future error callbacks will go to error handler
            callback = err_cb
        } else if (proxy.count === 0 && !bail) {
            callback(null, result)
        }
    }
}

function noop() {}


/***/ }),

/***/ "../../node_modules/arraybuffer.slice/index.js":
/*!*****************************************************!*\
  !*** ../../node_modules/arraybuffer.slice/index.js ***!
  \*****************************************************/
/***/ ((module) => {

/**
 * An abstraction for slicing an arraybuffer even when
 * ArrayBuffer.prototype.slice is not supported
 *
 * @api public
 */

module.exports = function(arraybuffer, start, end) {
  var bytes = arraybuffer.byteLength;
  start = start || 0;
  end = end || bytes;

  if (arraybuffer.slice) { return arraybuffer.slice(start, end); }

  if (start < 0) { start += bytes; }
  if (end < 0) { end += bytes; }
  if (end > bytes) { end = bytes; }

  if (start >= bytes || start >= end || bytes === 0) {
    return new ArrayBuffer(0);
  }

  var abv = new Uint8Array(arraybuffer);
  var result = new Uint8Array(end - start);
  for (var i = start, ii = 0; i < end; i++, ii++) {
    result[ii] = abv[i];
  }
  return result.buffer;
};


/***/ }),

/***/ "../../node_modules/backo2/index.js":
/*!******************************************!*\
  !*** ../../node_modules/backo2/index.js ***!
  \******************************************/
/***/ ((module) => {


/**
 * Expose `Backoff`.
 */

module.exports = Backoff;

/**
 * Initialize backoff timer with `opts`.
 *
 * - `min` initial timeout in milliseconds [100]
 * - `max` max timeout [10000]
 * - `jitter` [0]
 * - `factor` [2]
 *
 * @param {Object} opts
 * @api public
 */

function Backoff(opts) {
  opts = opts || {};
  this.ms = opts.min || 100;
  this.max = opts.max || 10000;
  this.factor = opts.factor || 2;
  this.jitter = opts.jitter > 0 && opts.jitter <= 1 ? opts.jitter : 0;
  this.attempts = 0;
}

/**
 * Return the backoff duration.
 *
 * @return {Number}
 * @api public
 */

Backoff.prototype.duration = function(){
  var ms = this.ms * Math.pow(this.factor, this.attempts++);
  if (this.jitter) {
    var rand =  Math.random();
    var deviation = Math.floor(rand * this.jitter * ms);
    ms = (Math.floor(rand * 10) & 1) == 0  ? ms - deviation : ms + deviation;
  }
  return Math.min(ms, this.max) | 0;
};

/**
 * Reset the number of attempts.
 *
 * @api public
 */

Backoff.prototype.reset = function(){
  this.attempts = 0;
};

/**
 * Set the minimum duration
 *
 * @api public
 */

Backoff.prototype.setMin = function(min){
  this.ms = min;
};

/**
 * Set the maximum duration
 *
 * @api public
 */

Backoff.prototype.setMax = function(max){
  this.max = max;
};

/**
 * Set the jitter
 *
 * @api public
 */

Backoff.prototype.setJitter = function(jitter){
  this.jitter = jitter;
};



/***/ }),

/***/ "../../node_modules/base64-arraybuffer/lib/base64-arraybuffer.js":
/*!***********************************************************************!*\
  !*** ../../node_modules/base64-arraybuffer/lib/base64-arraybuffer.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, exports) => {

/*
 * base64-arraybuffer
 * https://github.com/niklasvh/base64-arraybuffer
 *
 * Copyright (c) 2012 Niklas von Hertzen
 * Licensed under the MIT license.
 */
(function(chars){
  "use strict";

  exports.encode = function(arraybuffer) {
    var bytes = new Uint8Array(arraybuffer),
    i, len = bytes.length, base64 = "";

    for (i = 0; i < len; i+=3) {
      base64 += chars[bytes[i] >> 2];
      base64 += chars[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)];
      base64 += chars[((bytes[i + 1] & 15) << 2) | (bytes[i + 2] >> 6)];
      base64 += chars[bytes[i + 2] & 63];
    }

    if ((len % 3) === 2) {
      base64 = base64.substring(0, base64.length - 1) + "=";
    } else if (len % 3 === 1) {
      base64 = base64.substring(0, base64.length - 2) + "==";
    }

    return base64;
  };

  exports.decode =  function(base64) {
    var bufferLength = base64.length * 0.75,
    len = base64.length, i, p = 0,
    encoded1, encoded2, encoded3, encoded4;

    if (base64[base64.length - 1] === "=") {
      bufferLength--;
      if (base64[base64.length - 2] === "=") {
        bufferLength--;
      }
    }

    var arraybuffer = new ArrayBuffer(bufferLength),
    bytes = new Uint8Array(arraybuffer);

    for (i = 0; i < len; i+=4) {
      encoded1 = chars.indexOf(base64[i]);
      encoded2 = chars.indexOf(base64[i+1]);
      encoded3 = chars.indexOf(base64[i+2]);
      encoded4 = chars.indexOf(base64[i+3]);

      bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
      bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
      bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
    }

    return arraybuffer;
  };
})("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/");


/***/ }),

/***/ "../../node_modules/blob/index.js":
/*!****************************************!*\
  !*** ../../node_modules/blob/index.js ***!
  \****************************************/
/***/ ((module) => {

/**
 * Create a blob builder even when vendor prefixes exist
 */

var BlobBuilder = typeof BlobBuilder !== 'undefined' ? BlobBuilder :
  typeof WebKitBlobBuilder !== 'undefined' ? WebKitBlobBuilder :
  typeof MSBlobBuilder !== 'undefined' ? MSBlobBuilder :
  typeof MozBlobBuilder !== 'undefined' ? MozBlobBuilder : 
  false;

/**
 * Check if Blob constructor is supported
 */

var blobSupported = (function() {
  try {
    var a = new Blob(['hi']);
    return a.size === 2;
  } catch(e) {
    return false;
  }
})();

/**
 * Check if Blob constructor supports ArrayBufferViews
 * Fails in Safari 6, so we need to map to ArrayBuffers there.
 */

var blobSupportsArrayBufferView = blobSupported && (function() {
  try {
    var b = new Blob([new Uint8Array([1,2])]);
    return b.size === 2;
  } catch(e) {
    return false;
  }
})();

/**
 * Check if BlobBuilder is supported
 */

var blobBuilderSupported = BlobBuilder
  && BlobBuilder.prototype.append
  && BlobBuilder.prototype.getBlob;

/**
 * Helper function that maps ArrayBufferViews to ArrayBuffers
 * Used by BlobBuilder constructor and old browsers that didn't
 * support it in the Blob constructor.
 */

function mapArrayBufferViews(ary) {
  return ary.map(function(chunk) {
    if (chunk.buffer instanceof ArrayBuffer) {
      var buf = chunk.buffer;

      // if this is a subarray, make a copy so we only
      // include the subarray region from the underlying buffer
      if (chunk.byteLength !== buf.byteLength) {
        var copy = new Uint8Array(chunk.byteLength);
        copy.set(new Uint8Array(buf, chunk.byteOffset, chunk.byteLength));
        buf = copy.buffer;
      }

      return buf;
    }

    return chunk;
  });
}

function BlobBuilderConstructor(ary, options) {
  options = options || {};

  var bb = new BlobBuilder();
  mapArrayBufferViews(ary).forEach(function(part) {
    bb.append(part);
  });

  return (options.type) ? bb.getBlob(options.type) : bb.getBlob();
};

function BlobConstructor(ary, options) {
  return new Blob(mapArrayBufferViews(ary), options || {});
};

if (typeof Blob !== 'undefined') {
  BlobBuilderConstructor.prototype = Blob.prototype;
  BlobConstructor.prototype = Blob.prototype;
}

module.exports = (function() {
  if (blobSupported) {
    return blobSupportsArrayBufferView ? Blob : BlobConstructor;
  } else if (blobBuilderSupported) {
    return BlobBuilderConstructor;
  } else {
    return undefined;
  }
})();


/***/ }),

/***/ "../api/lib/esm/api/api.js":
/*!*********************************!*\
  !*** ../api/lib/esm/api/api.js ***!
  \*********************************/
/***/ (() => {



/***/ }),

/***/ "../api/lib/esm/api/app.js":
/*!*********************************!*\
  !*** ../api/lib/esm/api/app.js ***!
  \*********************************/
/***/ (() => {



/***/ }),

/***/ "../api/lib/esm/api/component.js":
/*!***************************************!*\
  !*** ../api/lib/esm/api/component.js ***!
  \***************************************/
/***/ (() => {



/***/ }),

/***/ "../api/lib/esm/api/context.js":
/*!*************************************!*\
  !*** ../api/lib/esm/api/context.js ***!
  \*************************************/
/***/ (() => {



/***/ }),

/***/ "../api/lib/esm/api/hooks.js":
/*!***********************************!*\
  !*** ../api/lib/esm/api/hooks.js ***!
  \***********************************/
/***/ (() => {



/***/ }),

/***/ "../api/lib/esm/api/index.js":
/*!***********************************!*\
  !*** ../api/lib/esm/api/index.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _api__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./api */ "../api/lib/esm/api/api.js");
/* harmony import */ var _api__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_api__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ var __WEBPACK_REEXPORT_OBJECT__ = {};
/* harmony reexport (unknown) */ for(const __WEBPACK_IMPORT_KEY__ in _api__WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== "default") __WEBPACK_REEXPORT_OBJECT__[__WEBPACK_IMPORT_KEY__] = () => _api__WEBPACK_IMPORTED_MODULE_0__[__WEBPACK_IMPORT_KEY__]
/* harmony reexport (unknown) */ __webpack_require__.d(__webpack_exports__, __WEBPACK_REEXPORT_OBJECT__);
/* harmony import */ var _app__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./app */ "../api/lib/esm/api/app.js");
/* harmony import */ var _app__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_app__WEBPACK_IMPORTED_MODULE_1__);
/* harmony reexport (unknown) */ var __WEBPACK_REEXPORT_OBJECT__ = {};
/* harmony reexport (unknown) */ for(const __WEBPACK_IMPORT_KEY__ in _app__WEBPACK_IMPORTED_MODULE_1__) if(__WEBPACK_IMPORT_KEY__ !== "default") __WEBPACK_REEXPORT_OBJECT__[__WEBPACK_IMPORT_KEY__] = () => _app__WEBPACK_IMPORTED_MODULE_1__[__WEBPACK_IMPORT_KEY__]
/* harmony reexport (unknown) */ __webpack_require__.d(__webpack_exports__, __WEBPACK_REEXPORT_OBJECT__);
/* harmony import */ var _component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./component */ "../api/lib/esm/api/component.js");
/* harmony import */ var _component__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_component__WEBPACK_IMPORTED_MODULE_2__);
/* harmony reexport (unknown) */ var __WEBPACK_REEXPORT_OBJECT__ = {};
/* harmony reexport (unknown) */ for(const __WEBPACK_IMPORT_KEY__ in _component__WEBPACK_IMPORTED_MODULE_2__) if(__WEBPACK_IMPORT_KEY__ !== "default") __WEBPACK_REEXPORT_OBJECT__[__WEBPACK_IMPORT_KEY__] = () => _component__WEBPACK_IMPORTED_MODULE_2__[__WEBPACK_IMPORT_KEY__]
/* harmony reexport (unknown) */ __webpack_require__.d(__webpack_exports__, __WEBPACK_REEXPORT_OBJECT__);
/* harmony import */ var _context__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./context */ "../api/lib/esm/api/context.js");
/* harmony import */ var _context__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_context__WEBPACK_IMPORTED_MODULE_3__);
/* harmony reexport (unknown) */ var __WEBPACK_REEXPORT_OBJECT__ = {};
/* harmony reexport (unknown) */ for(const __WEBPACK_IMPORT_KEY__ in _context__WEBPACK_IMPORTED_MODULE_3__) if(__WEBPACK_IMPORT_KEY__ !== "default") __WEBPACK_REEXPORT_OBJECT__[__WEBPACK_IMPORT_KEY__] = () => _context__WEBPACK_IMPORTED_MODULE_3__[__WEBPACK_IMPORT_KEY__]
/* harmony reexport (unknown) */ __webpack_require__.d(__webpack_exports__, __WEBPACK_REEXPORT_OBJECT__);
/* harmony import */ var _hooks__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./hooks */ "../api/lib/esm/api/hooks.js");
/* harmony import */ var _hooks__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_hooks__WEBPACK_IMPORTED_MODULE_4__);
/* harmony reexport (unknown) */ var __WEBPACK_REEXPORT_OBJECT__ = {};
/* harmony reexport (unknown) */ for(const __WEBPACK_IMPORT_KEY__ in _hooks__WEBPACK_IMPORTED_MODULE_4__) if(__WEBPACK_IMPORT_KEY__ !== "default") __WEBPACK_REEXPORT_OBJECT__[__WEBPACK_IMPORT_KEY__] = () => _hooks__WEBPACK_IMPORTED_MODULE_4__[__WEBPACK_IMPORT_KEY__]
/* harmony reexport (unknown) */ __webpack_require__.d(__webpack_exports__, __WEBPACK_REEXPORT_OBJECT__);
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./util */ "../api/lib/esm/api/util.js");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_util__WEBPACK_IMPORTED_MODULE_5__);
/* harmony reexport (unknown) */ var __WEBPACK_REEXPORT_OBJECT__ = {};
/* harmony reexport (unknown) */ for(const __WEBPACK_IMPORT_KEY__ in _util__WEBPACK_IMPORTED_MODULE_5__) if(__WEBPACK_IMPORT_KEY__ !== "default") __WEBPACK_REEXPORT_OBJECT__[__WEBPACK_IMPORT_KEY__] = () => _util__WEBPACK_IMPORTED_MODULE_5__[__WEBPACK_IMPORT_KEY__]
/* harmony reexport (unknown) */ __webpack_require__.d(__webpack_exports__, __WEBPACK_REEXPORT_OBJECT__);








/***/ }),

/***/ "../api/lib/esm/api/util.js":
/*!**********************************!*\
  !*** ../api/lib/esm/api/util.js ***!
  \**********************************/
/***/ (() => {



/***/ }),

/***/ "../api/lib/esm/const.js":
/*!*******************************!*\
  !*** ../api/lib/esm/const.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HOOK_SETUP": () => (/* binding */ HOOK_SETUP)
/* harmony export */ });
var HOOK_SETUP = 'devtools-plugin:setup';


/***/ }),

/***/ "../api/lib/esm/env.js":
/*!*****************************!*\
  !*** ../api/lib/esm/env.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getDevtoolsGlobalHook": () => (/* binding */ getDevtoolsGlobalHook),
/* harmony export */   "getTarget": () => (/* binding */ getTarget)
/* harmony export */ });
function getDevtoolsGlobalHook() {
    return getTarget().__VUE_DEVTOOLS_GLOBAL_HOOK__;
}
function getTarget() {
    // @ts-ignore
    return typeof navigator !== 'undefined'
        ? window
        : typeof __webpack_require__.g !== 'undefined'
            ? __webpack_require__.g
            : {};
}


/***/ }),

/***/ "../api/lib/esm/index.js":
/*!*******************************!*\
  !*** ../api/lib/esm/index.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "setupDevtoolsPlugin": () => (/* binding */ setupDevtoolsPlugin)
/* harmony export */ });
/* harmony import */ var _env__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./env */ "../api/lib/esm/env.js");
/* harmony import */ var _const__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./const */ "../api/lib/esm/const.js");
/* harmony import */ var _api__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./api */ "../api/lib/esm/api/index.js");
/* harmony reexport (unknown) */ var __WEBPACK_REEXPORT_OBJECT__ = {};
/* harmony reexport (unknown) */ for(const __WEBPACK_IMPORT_KEY__ in _api__WEBPACK_IMPORTED_MODULE_0__) if(["default","setupDevtoolsPlugin"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) __WEBPACK_REEXPORT_OBJECT__[__WEBPACK_IMPORT_KEY__] = () => _api__WEBPACK_IMPORTED_MODULE_0__[__WEBPACK_IMPORT_KEY__]
/* harmony reexport (unknown) */ __webpack_require__.d(__webpack_exports__, __WEBPACK_REEXPORT_OBJECT__);



function setupDevtoolsPlugin(pluginDescriptor, setupFn) {
    var hook = (0,_env__WEBPACK_IMPORTED_MODULE_1__.getDevtoolsGlobalHook)();
    if (hook) {
        hook.emit(_const__WEBPACK_IMPORTED_MODULE_2__.HOOK_SETUP, pluginDescriptor, setupFn);
    }
    else {
        var target = (0,_env__WEBPACK_IMPORTED_MODULE_1__.getTarget)();
        var list = target.__VUE_DEVTOOLS_PLUGINS__ = target.__VUE_DEVTOOLS_PLUGINS__ || [];
        list.push({
            pluginDescriptor: pluginDescriptor,
            setupFn: setupFn
        });
    }
}


/***/ }),

/***/ "../app-backend-api/lib/api.js":
/*!*************************************!*\
  !*** ../app-backend-api/lib/api.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DevtoolsPluginApiInstance = exports.DevtoolsApi = void 0;
var shared_utils_1 = __webpack_require__(/*! @vue-devtools/shared-utils */ "../shared-utils/lib/index.js");
var hooks_1 = __webpack_require__(/*! ./hooks */ "../app-backend-api/lib/hooks.js");
var backendOn;
var pluginOn = [];
var DevtoolsApi = function DevtoolsApi(bridge, ctx) {
    this.bridge = bridge;
    this.ctx = ctx;
    if (!backendOn) {
        backendOn = new hooks_1.DevtoolsHookable(ctx);
    }
};

var prototypeAccessors = { on: { configurable: true } };
prototypeAccessors.on.get = function () {
    return backendOn;
};
DevtoolsApi.prototype.callHook = async function callHook (eventType, payload, ctx) {
        if ( ctx === void 0 ) ctx = this.ctx;

    payload = await backendOn.callHandlers(eventType, payload, ctx);
    for (var on of pluginOn) {
        payload = await on.callHandlers(eventType, payload, ctx);
    }
    return payload;
};
DevtoolsApi.prototype.transformCall = async function transformCall (callName) {
        var args = [], len = arguments.length - 1;
        while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

    var payload = await this.callHook("transformCall" /* TRANSFORM_CALL */, {
        callName: callName,
        inArgs: args,
        outArgs: args.slice()
    });
    return payload.outArgs;
};
DevtoolsApi.prototype.getAppRecordName = async function getAppRecordName (app, id) {
    var payload = await this.callHook("getAppRecordName" /* GET_APP_RECORD_NAME */, {
        app: app,
        name: null
    });
    if (payload.name) {
        return payload.name;
    }
    else {
        return ("App " + (id + 1));
    }
};
DevtoolsApi.prototype.getAppRootInstance = async function getAppRootInstance (app) {
    var payload = await this.callHook("getAppRootInstance" /* GET_APP_ROOT_INSTANCE */, {
        app: app,
        root: null
    });
    return payload.root;
};
DevtoolsApi.prototype.registerApplication = async function registerApplication (app) {
    await this.callHook("registerApplication" /* REGISTER_APPLICATION */, {
        app: app
    });
};
DevtoolsApi.prototype.walkComponentTree = async function walkComponentTree (instance, maxDepth, filter) {
        if ( maxDepth === void 0 ) maxDepth = -1;
        if ( filter === void 0 ) filter = null;

    var payload = await this.callHook("walkComponentTree" /* WALK_COMPONENT_TREE */, {
        componentInstance: instance,
        componentTreeData: null,
        maxDepth: maxDepth,
        filter: filter
    });
    return payload.componentTreeData;
};
DevtoolsApi.prototype.visitComponentTree = async function visitComponentTree (instance, treeNode, filter, app) {
        if ( filter === void 0 ) filter = null;

    var payload = await this.callHook("visitComponentTree" /* VISIT_COMPONENT_TREE */, {
        app: app,
        componentInstance: instance,
        treeNode: treeNode,
        filter: filter
    });
    return payload.treeNode;
};
DevtoolsApi.prototype.walkComponentParents = async function walkComponentParents (instance) {
    var payload = await this.callHook("walkComponentParents" /* WALK_COMPONENT_PARENTS */, {
        componentInstance: instance,
        parentInstances: []
    });
    return payload.parentInstances;
};
DevtoolsApi.prototype.inspectComponent = async function inspectComponent (instance, app) {
    var payload = await this.callHook("inspectComponent" /* INSPECT_COMPONENT */, {
        app: app,
        componentInstance: instance,
        instanceData: null
    });
    return payload.instanceData;
};
DevtoolsApi.prototype.getComponentBounds = async function getComponentBounds (instance) {
    var payload = await this.callHook("getComponentBounds" /* GET_COMPONENT_BOUNDS */, {
        componentInstance: instance,
        bounds: null
    });
    return payload.bounds;
};
DevtoolsApi.prototype.getComponentName = async function getComponentName (instance) {
    var payload = await this.callHook("getComponentName" /* GET_COMPONENT_NAME */, {
        componentInstance: instance,
        name: null
    });
    return payload.name;
};
DevtoolsApi.prototype.getComponentInstances = async function getComponentInstances (app) {
    var payload = await this.callHook("getComponentInstances" /* GET_COMPONENT_INSTANCES */, {
        app: app,
        componentInstances: []
    });
    return payload.componentInstances;
};
DevtoolsApi.prototype.getElementComponent = async function getElementComponent (element) {
    var payload = await this.callHook("getElementComponent" /* GET_ELEMENT_COMPONENT */, {
        element: element,
        componentInstance: null
    });
    return payload.componentInstance;
};
DevtoolsApi.prototype.getComponentRootElements = async function getComponentRootElements (instance) {
    var payload = await this.callHook("getComponentRootElements" /* GET_COMPONENT_ROOT_ELEMENTS */, {
        componentInstance: instance,
        rootElements: []
    });
    return payload.rootElements;
};
DevtoolsApi.prototype.editComponentState = async function editComponentState (instance, dotPath, type, state, app) {
    var arrayPath = dotPath.split('.');
    var payload = await this.callHook("editComponentState" /* EDIT_COMPONENT_STATE */, {
        app: app,
        componentInstance: instance,
        path: arrayPath,
        type: type,
        state: state,
        set: function (object, path, value, cb) {
                if ( path === void 0 ) path = arrayPath;
                if ( value === void 0 ) value = state.value;

                return shared_utils_1.set(object, path, value, cb || createDefaultSetCallback(state));
        }
    });
    return payload.componentInstance;
};
DevtoolsApi.prototype.getComponentDevtoolsOptions = async function getComponentDevtoolsOptions (instance) {
    var payload = await this.callHook("getAppDevtoolsOptions" /* GET_COMPONENT_DEVTOOLS_OPTIONS */, {
        componentInstance: instance,
        options: null
    });
    return payload.options || {};
};
DevtoolsApi.prototype.getComponentRenderCode = async function getComponentRenderCode (instance) {
    var payload = await this.callHook("getComponentRenderCode" /* GET_COMPONENT_RENDER_CODE */, {
        componentInstance: instance,
        code: null
    });
    return {
        code: payload.code
    };
};
DevtoolsApi.prototype.inspectTimelineEvent = async function inspectTimelineEvent (eventData, app) {
    var payload = await this.callHook("inspectTimelineEvent" /* INSPECT_TIMELINE_EVENT */, {
        event: eventData.event,
        layerId: eventData.layerId,
        app: app,
        data: eventData.event.data,
        all: eventData.all
    });
    return payload.data;
};
DevtoolsApi.prototype.clearTimeline = async function clearTimeline () {
    await this.callHook("timelineCleared" /* TIMELINE_CLEARED */, {});
};
DevtoolsApi.prototype.getInspectorTree = async function getInspectorTree (inspectorId, app, filter) {
    var payload = await this.callHook("getInspectorTree" /* GET_INSPECTOR_TREE */, {
        inspectorId: inspectorId,
        app: app,
        filter: filter,
        rootNodes: []
    });
    return payload.rootNodes;
};
DevtoolsApi.prototype.getInspectorState = async function getInspectorState (inspectorId, app, nodeId) {
    var payload = await this.callHook("getInspectorState" /* GET_INSPECTOR_STATE */, {
        inspectorId: inspectorId,
        app: app,
        nodeId: nodeId,
        state: null
    });
    return payload.state;
};
DevtoolsApi.prototype.editInspectorState = async function editInspectorState (inspectorId, app, nodeId, dotPath, type, state) {
    var arrayPath = dotPath.split('.');
    await this.callHook("editInspectorState" /* EDIT_INSPECTOR_STATE */, {
        inspectorId: inspectorId,
        app: app,
        nodeId: nodeId,
        path: arrayPath,
        type: type,
        state: state,
        set: function (object, path, value, cb) {
                if ( path === void 0 ) path = arrayPath;
                if ( value === void 0 ) value = state.value;

                return shared_utils_1.set(object, path, value, cb || createDefaultSetCallback(state));
        }
    });
};

Object.defineProperties( DevtoolsApi.prototype, prototypeAccessors );
exports.DevtoolsApi = DevtoolsApi;
function createDefaultSetCallback(state) {
    return function (obj, field, value) {
        if (state.remove || state.newKey) {
            if (Array.isArray(obj)) {
                obj.splice(field, 1);
            }
            else {
                delete obj[field];
            }
        }
        if (!state.remove) {
            obj[state.newKey || field] = value;
        }
    };
}
var DevtoolsPluginApiInstance = function DevtoolsPluginApiInstance(plugin, ctx) {
    this.bridge = ctx.bridge;
    this.ctx = ctx;
    this.plugin = plugin;
    this.on = new hooks_1.DevtoolsHookable(ctx, plugin);
    pluginOn.push(this.on);
};

var prototypeAccessors$1 = { enabled: { configurable: true } };
// Plugin API
DevtoolsPluginApiInstance.prototype.notifyComponentUpdate = async function notifyComponentUpdate (instance) {
        var ref;

        if ( instance === void 0 ) instance = null;
    if (!this.enabled || !this.hasPermission(shared_utils_1.PluginPermission.COMPONENTS))
        { return; }
    if (instance) {
        (ref = this.ctx.hook).emit.apply(ref, [ shared_utils_1.HookEvents.COMPONENT_UPDATED ].concat( await this.ctx.api.transformCall(shared_utils_1.HookEvents.COMPONENT_UPDATED, instance) ));
    }
    else {
        this.ctx.hook.emit(shared_utils_1.HookEvents.COMPONENT_UPDATED);
    }
};
DevtoolsPluginApiInstance.prototype.addTimelineLayer = function addTimelineLayer (options) {
    if (!this.enabled || !this.hasPermission(shared_utils_1.PluginPermission.TIMELINE))
        { return false; }
    this.ctx.hook.emit(shared_utils_1.HookEvents.TIMELINE_LAYER_ADDED, options, this.plugin);
    return true;
};
DevtoolsPluginApiInstance.prototype.addTimelineEvent = function addTimelineEvent (options) {
    if (!this.enabled || !this.hasPermission(shared_utils_1.PluginPermission.TIMELINE))
        { return false; }
    this.ctx.hook.emit(shared_utils_1.HookEvents.TIMELINE_EVENT_ADDED, options, this.plugin);
    return true;
};
DevtoolsPluginApiInstance.prototype.addInspector = function addInspector (options) {
    if (!this.enabled || !this.hasPermission(shared_utils_1.PluginPermission.CUSTOM_INSPECTOR))
        { return false; }
    this.ctx.hook.emit(shared_utils_1.HookEvents.CUSTOM_INSPECTOR_ADD, options, this.plugin);
    return true;
};
DevtoolsPluginApiInstance.prototype.sendInspectorTree = function sendInspectorTree (inspectorId) {
    if (!this.enabled || !this.hasPermission(shared_utils_1.PluginPermission.CUSTOM_INSPECTOR))
        { return false; }
    this.ctx.hook.emit(shared_utils_1.HookEvents.CUSTOM_INSPECTOR_SEND_TREE, inspectorId, this.plugin);
    return true;
};
DevtoolsPluginApiInstance.prototype.sendInspectorState = function sendInspectorState (inspectorId) {
    if (!this.enabled || !this.hasPermission(shared_utils_1.PluginPermission.CUSTOM_INSPECTOR))
        { return false; }
    this.ctx.hook.emit(shared_utils_1.HookEvents.CUSTOM_INSPECTOR_SEND_STATE, inspectorId, this.plugin);
    return true;
};
DevtoolsPluginApiInstance.prototype.selectInspectorNode = function selectInspectorNode (inspectorId, nodeId) {
    if (!this.enabled || !this.hasPermission(shared_utils_1.PluginPermission.CUSTOM_INSPECTOR))
        { return false; }
    this.ctx.hook.emit(shared_utils_1.HookEvents.CUSTOM_INSPECTOR_SELECT_NODE, inspectorId, nodeId, this.plugin);
    return true;
};
DevtoolsPluginApiInstance.prototype.getComponentBounds = function getComponentBounds (instance) {
    return this.ctx.api.getComponentBounds(instance);
};
DevtoolsPluginApiInstance.prototype.getComponentName = function getComponentName (instance) {
    return this.ctx.api.getComponentName(instance);
};
DevtoolsPluginApiInstance.prototype.getComponentInstances = function getComponentInstances (app) {
    return this.ctx.api.getComponentInstances(app);
};
DevtoolsPluginApiInstance.prototype.highlightElement = function highlightElement (instance) {
    if (!this.enabled || !this.hasPermission(shared_utils_1.PluginPermission.COMPONENTS))
        { return false; }
    this.ctx.hook.emit(shared_utils_1.HookEvents.COMPONENT_HIGHLIGHT, instance.__VUE_DEVTOOLS_UID__, this.plugin);
    return true;
};
DevtoolsPluginApiInstance.prototype.unhighlightElement = function unhighlightElement () {
    if (!this.enabled || !this.hasPermission(shared_utils_1.PluginPermission.COMPONENTS))
        { return false; }
    this.ctx.hook.emit(shared_utils_1.HookEvents.COMPONENT_UNHIGHLIGHT, this.plugin);
    return true;
};
prototypeAccessors$1.enabled.get = function () {
    return shared_utils_1.hasPluginPermission(this.plugin.descriptor.id, shared_utils_1.PluginPermission.ENABLED);
};
DevtoolsPluginApiInstance.prototype.hasPermission = function hasPermission (permission) {
    return shared_utils_1.hasPluginPermission(this.plugin.descriptor.id, permission);
};

Object.defineProperties( DevtoolsPluginApiInstance.prototype, prototypeAccessors$1 );
exports.DevtoolsPluginApiInstance = DevtoolsPluginApiInstance;
//# sourceMappingURL=api.js.map

/***/ }),

/***/ "../app-backend-api/lib/app-record.js":
/*!********************************************!*\
  !*** ../app-backend-api/lib/app-record.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
//# sourceMappingURL=app-record.js.map

/***/ }),

/***/ "../app-backend-api/lib/backend-context.js":
/*!*************************************************!*\
  !*** ../app-backend-api/lib/backend-context.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createBackendContext = void 0;
var api_1 = __webpack_require__(/*! ./api */ "../app-backend-api/lib/api.js");
function createBackendContext(options) {
    var ctx = {
        bridge: options.bridge,
        hook: options.hook,
        api: null,
        appRecords: [],
        currentTab: null,
        currentAppRecord: null,
        currentInspectedComponentId: null,
        plugins: [],
        currentPlugin: null,
        timelineLayers: [],
        nextTimelineEventId: 0,
        timelineEventMap: new Map(),
        perfUniqueGroupId: 0,
        customInspectors: []
    };
    ctx.api = new api_1.DevtoolsApi(options.bridge, ctx);
    return ctx;
}
exports.createBackendContext = createBackendContext;
//# sourceMappingURL=backend-context.js.map

/***/ }),

/***/ "../app-backend-api/lib/backend.js":
/*!*****************************************!*\
  !*** ../app-backend-api/lib/backend.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BuiltinBackendFeature = void 0;
var BuiltinBackendFeature;
(function (BuiltinBackendFeature) {
    BuiltinBackendFeature["COMPONENTS"] = "components";
    BuiltinBackendFeature["EVENTS"] = "events";
    BuiltinBackendFeature["VUEX"] = "vuex";
    BuiltinBackendFeature["FLUSH"] = "flush";
})(BuiltinBackendFeature = exports.BuiltinBackendFeature || (exports.BuiltinBackendFeature = {}));
//# sourceMappingURL=backend.js.map

/***/ }),

/***/ "../app-backend-api/lib/global-hook.js":
/*!*********************************************!*\
  !*** ../app-backend-api/lib/global-hook.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

/* eslint-disable @typescript-eslint/ban-types */
Object.defineProperty(exports, "__esModule", ({ value: true }));
//# sourceMappingURL=global-hook.js.map

/***/ }),

/***/ "../app-backend-api/lib/hooks.js":
/*!***************************************!*\
  !*** ../app-backend-api/lib/hooks.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DevtoolsHookable = void 0;
var shared_utils_1 = __webpack_require__(/*! @vue-devtools/shared-utils */ "../shared-utils/lib/index.js");
var DevtoolsHookable = function DevtoolsHookable(ctx, plugin) {
    if ( plugin === void 0 ) plugin = null;

    this.handlers = {};
    this.ctx = ctx;
    this.plugin = plugin;
};
DevtoolsHookable.prototype.hook = function hook (eventType, handler, pluginPermision) {
        var this$1 = this;
        if ( pluginPermision === void 0 ) pluginPermision = null;

    var handlers = (this.handlers[eventType] = this.handlers[eventType] || []);
    if (this.plugin) {
        var originalHandler = handler;
        handler = function () {
                var args = [], len = arguments.length;
                while ( len-- ) args[ len ] = arguments[ len ];

            // Plugin permission
            if (!shared_utils_1.hasPluginPermission(this$1.plugin.descriptor.id, shared_utils_1.PluginPermission.ENABLED) ||
                (pluginPermision && !shared_utils_1.hasPluginPermission(this$1.plugin.descriptor.id, pluginPermision)))
                { return; }
            // App scope
            if (!this$1.plugin.descriptor.disableAppScope &&
                this$1.ctx.currentAppRecord.options.app !== this$1.plugin.descriptor.app)
                { return; }
            return originalHandler.apply(void 0, args);
        };
    }
    handlers.push({
        handler: handler,
        plugin: this.ctx.currentPlugin
    });
};
DevtoolsHookable.prototype.callHandlers = async function callHandlers (eventType, payload, ctx) {
    if (this.handlers[eventType]) {
        var handlers = this.handlers[eventType];
        for (var i = 0; i < handlers.length; i++) {
            var ref = handlers[i];
                var handler = ref.handler;
                var plugin = ref.plugin;
            try {
                await handler(payload, ctx);
            }
            catch (e) {
                console.error(("An error occured in hook " + eventType + (plugin ? (" registered by plugin " + (plugin.descriptor.id)) : '')));
                console.error(e);
            }
        }
    }
    return payload;
};
DevtoolsHookable.prototype.transformCall = function transformCall (handler) {
    this.hook("transformCall" /* TRANSFORM_CALL */, handler);
};
DevtoolsHookable.prototype.getAppRecordName = function getAppRecordName (handler) {
    this.hook("getAppRecordName" /* GET_APP_RECORD_NAME */, handler);
};
DevtoolsHookable.prototype.getAppRootInstance = function getAppRootInstance (handler) {
    this.hook("getAppRootInstance" /* GET_APP_ROOT_INSTANCE */, handler);
};
DevtoolsHookable.prototype.registerApplication = function registerApplication (handler) {
    this.hook("registerApplication" /* REGISTER_APPLICATION */, handler);
};
DevtoolsHookable.prototype.walkComponentTree = function walkComponentTree (handler) {
    this.hook("walkComponentTree" /* WALK_COMPONENT_TREE */, handler, shared_utils_1.PluginPermission.COMPONENTS);
};
DevtoolsHookable.prototype.visitComponentTree = function visitComponentTree (handler) {
    this.hook("visitComponentTree" /* VISIT_COMPONENT_TREE */, handler, shared_utils_1.PluginPermission.COMPONENTS);
};
DevtoolsHookable.prototype.walkComponentParents = function walkComponentParents (handler) {
    this.hook("walkComponentParents" /* WALK_COMPONENT_PARENTS */, handler, shared_utils_1.PluginPermission.COMPONENTS);
};
DevtoolsHookable.prototype.inspectComponent = function inspectComponent (handler) {
    this.hook("inspectComponent" /* INSPECT_COMPONENT */, handler, shared_utils_1.PluginPermission.COMPONENTS);
};
DevtoolsHookable.prototype.getComponentBounds = function getComponentBounds (handler) {
    this.hook("getComponentBounds" /* GET_COMPONENT_BOUNDS */, handler, shared_utils_1.PluginPermission.COMPONENTS);
};
DevtoolsHookable.prototype.getComponentName = function getComponentName (handler) {
    this.hook("getComponentName" /* GET_COMPONENT_NAME */, handler, shared_utils_1.PluginPermission.COMPONENTS);
};
DevtoolsHookable.prototype.getComponentInstances = function getComponentInstances (handler) {
    this.hook("getComponentInstances" /* GET_COMPONENT_INSTANCES */, handler, shared_utils_1.PluginPermission.COMPONENTS);
};
DevtoolsHookable.prototype.getElementComponent = function getElementComponent (handler) {
    this.hook("getElementComponent" /* GET_ELEMENT_COMPONENT */, handler, shared_utils_1.PluginPermission.COMPONENTS);
};
DevtoolsHookable.prototype.getComponentRootElements = function getComponentRootElements (handler) {
    this.hook("getComponentRootElements" /* GET_COMPONENT_ROOT_ELEMENTS */, handler, shared_utils_1.PluginPermission.COMPONENTS);
};
DevtoolsHookable.prototype.editComponentState = function editComponentState (handler) {
    this.hook("editComponentState" /* EDIT_COMPONENT_STATE */, handler, shared_utils_1.PluginPermission.COMPONENTS);
};
DevtoolsHookable.prototype.getComponentDevtoolsOptions = function getComponentDevtoolsOptions (handler) {
    this.hook("getAppDevtoolsOptions" /* GET_COMPONENT_DEVTOOLS_OPTIONS */, handler, shared_utils_1.PluginPermission.COMPONENTS);
};
DevtoolsHookable.prototype.getComponentRenderCode = function getComponentRenderCode (handler) {
    this.hook("getComponentRenderCode" /* GET_COMPONENT_RENDER_CODE */, handler, shared_utils_1.PluginPermission.COMPONENTS);
};
DevtoolsHookable.prototype.inspectTimelineEvent = function inspectTimelineEvent (handler) {
    this.hook("inspectTimelineEvent" /* INSPECT_TIMELINE_EVENT */, handler, shared_utils_1.PluginPermission.TIMELINE);
};
DevtoolsHookable.prototype.timelineCleared = function timelineCleared (handler) {
    this.hook("timelineCleared" /* TIMELINE_CLEARED */, handler, shared_utils_1.PluginPermission.TIMELINE);
};
DevtoolsHookable.prototype.getInspectorTree = function getInspectorTree (handler) {
    this.hook("getInspectorTree" /* GET_INSPECTOR_TREE */, handler, shared_utils_1.PluginPermission.CUSTOM_INSPECTOR);
};
DevtoolsHookable.prototype.getInspectorState = function getInspectorState (handler) {
    this.hook("getInspectorState" /* GET_INSPECTOR_STATE */, handler, shared_utils_1.PluginPermission.CUSTOM_INSPECTOR);
};
DevtoolsHookable.prototype.editInspectorState = function editInspectorState (handler) {
    this.hook("editInspectorState" /* EDIT_INSPECTOR_STATE */, handler, shared_utils_1.PluginPermission.CUSTOM_INSPECTOR);
};
exports.DevtoolsHookable = DevtoolsHookable;
//# sourceMappingURL=hooks.js.map

/***/ }),

/***/ "../app-backend-api/lib/index.js":
/*!***************************************!*\
  !*** ../app-backend-api/lib/index.js ***!
  \***************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) { k2 = k; }
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) { k2 = k; }
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) { if (p !== "default" && !exports.hasOwnProperty(p)) { __createBinding(exports, m, p); } }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(/*! ./api */ "../app-backend-api/lib/api.js"), exports);
__exportStar(__webpack_require__(/*! ./app-record */ "../app-backend-api/lib/app-record.js"), exports);
__exportStar(__webpack_require__(/*! ./backend */ "../app-backend-api/lib/backend.js"), exports);
__exportStar(__webpack_require__(/*! ./backend-context */ "../app-backend-api/lib/backend-context.js"), exports);
__exportStar(__webpack_require__(/*! ./global-hook */ "../app-backend-api/lib/global-hook.js"), exports);
__exportStar(__webpack_require__(/*! ./hooks */ "../app-backend-api/lib/hooks.js"), exports);
__exportStar(__webpack_require__(/*! ./plugin */ "../app-backend-api/lib/plugin.js"), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "../app-backend-api/lib/plugin.js":
/*!****************************************!*\
  !*** ../app-backend-api/lib/plugin.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
//# sourceMappingURL=plugin.js.map

/***/ }),

/***/ "../app-backend-core/lib/app.js":
/*!**************************************!*\
  !*** ../app-backend-core/lib/app.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports._legacy_getAndRegisterApps = exports.removeApp = exports.sendApps = exports.waitForAppsRegistration = exports.getAppRecord = exports.getAppRecordId = exports.mapAppRecord = exports.selectApp = exports.registerApp = void 0;
var shared_utils_1 = __webpack_require__(/*! @vue-devtools/shared-utils */ "../shared-utils/lib/index.js");
var queue_1 = __webpack_require__(/*! ./util/queue */ "../app-backend-core/lib/util/queue.js");
var scan_1 = __webpack_require__(/*! ./legacy/scan */ "../app-backend-core/lib/legacy/scan.js");
var app_backend_vue1_1 = __webpack_require__(/*! @vue-devtools/app-backend-vue1 */ "../app-backend-vue1/lib/index.js");
var app_backend_vue2_1 = __webpack_require__(/*! @vue-devtools/app-backend-vue2 */ "../app-backend-vue2/lib/index.js");
var app_backend_vue3_1 = __webpack_require__(/*! @vue-devtools/app-backend-vue3 */ "../app-backend-vue3/lib/index.js");
var timeline_1 = __webpack_require__(/*! ./timeline */ "../app-backend-core/lib/timeline.js");
var availableBackends = [
    app_backend_vue1_1.backend,
    app_backend_vue2_1.backend,
    app_backend_vue3_1.backend
];
var enabledBackends = new Set();
var jobs = new queue_1.JobQueue();
var recordId = 0;
var appRecordPromises = new Map();
async function registerApp(options, ctx) {
    return jobs.queue(function () { return registerAppJob(options, ctx); });
}
exports.registerApp = registerApp;
async function registerAppJob(options, ctx) {
    var _a;
    // Dedupe
    if (ctx.appRecords.find(function (a) { return a.options === options; })) {
        return;
    }
    var record;
    var baseFrameworkVersion = parseInt(options.version.substr(0, options.version.indexOf('.')));
    for (var i = 0; i < availableBackends.length; i++) {
        var backend = availableBackends[i];
        if (backend.frameworkVersion === baseFrameworkVersion) {
            // Enabled backend
            if (!enabledBackends.has(backend)) {
                backend.setup(ctx.api);
                enabledBackends.add(backend);
            }
            // Create app record
            var rootInstance = await ctx.api.getAppRootInstance(options.app);
            if (rootInstance) {
                var id = getAppRecordId(options.app);
                var name = await ctx.api.getAppRecordName(options.app, id);
                var ref = await ctx.api.getComponentRootElements(rootInstance);
                var el = ref[0];
                record = {
                    id: id,
                    name: name,
                    options: options,
                    backend: backend,
                    lastInspectedComponentId: null,
                    instanceMap: new Map(),
                    rootInstance: rootInstance,
                    perfGroupIds: new Map(),
                    iframe: document !== el.ownerDocument ? el.ownerDocument.location.pathname : null,
                    meta: (_a = options.meta) !== null && _a !== void 0 ? _a : {}
                };
                options.app.__VUE_DEVTOOLS_APP_RECORD__ = record;
                var rootId = (record.id) + ":root";
                record.instanceMap.set(rootId, record.rootInstance);
                record.rootInstance.__VUE_DEVTOOLS_UID__ = rootId;
                await ctx.api.registerApplication(record);
                ctx.appRecords.push(record);
                timeline_1.addBuiltinLayers(options.app, ctx);
                ctx.bridge.send(shared_utils_1.BridgeEvents.TO_FRONT_APP_ADD, {
                    appRecord: mapAppRecord(record)
                });
                if (backend.setupApp) {
                    backend.setupApp(ctx.api, record);
                }
                if (appRecordPromises.has(options.app)) {
                    for (var r of appRecordPromises.get(options.app)) {
                        await r(record);
                    }
                }
                // Auto select first app
                if (ctx.currentAppRecord == null) {
                    await selectApp(record, ctx);
                }
            }
            else {
                console.warn('[Vue devtools] No root instance found for app, it might have been unmounted', options.app);
            }
            break;
        }
    }
}
async function selectApp(record, ctx) {
    ctx.currentAppRecord = record;
    ctx.currentInspectedComponentId = record.lastInspectedComponentId;
    ctx.bridge.send(shared_utils_1.BridgeEvents.TO_FRONT_APP_SELECTED, {
        id: record.id,
        lastInspectedComponentId: record.lastInspectedComponentId
    });
}
exports.selectApp = selectApp;
function mapAppRecord(record) {
    return {
        id: record.id,
        name: record.name,
        version: record.options.version,
        iframe: record.iframe
    };
}
exports.mapAppRecord = mapAppRecord;
function getAppRecordId(app) {
    if (app.__VUE_DEVTOOLS_APP_RECORD_ID__ != null) {
        return app.__VUE_DEVTOOLS_APP_RECORD_ID__;
    }
    var id = recordId++;
    app.__VUE_DEVTOOLS_APP_RECORD_ID__ = id;
    return id;
}
exports.getAppRecordId = getAppRecordId;
async function getAppRecord(app, ctx) {
    var record = ctx.appRecords.find(function (ar) { return ar.options.app === app; });
    if (record) {
        return record;
    }
    return new Promise(function (resolve, reject) {
        var timedOut = false;
        var timer = setTimeout(function () {
            timedOut = true;
            reject(new Error(("Timed out getting app record for app " + app)));
        }, 2000);
        var resolvers = appRecordPromises.get(app);
        if (!resolvers) {
            resolvers = [];
            appRecordPromises.set(app, resolvers);
        }
        resolvers.push(function (record) {
            if (!timedOut) {
                clearTimeout(timer);
                resolve(record);
            }
        });
    });
}
exports.getAppRecord = getAppRecord;
function waitForAppsRegistration() {
    return jobs.queue(async function () { });
}
exports.waitForAppsRegistration = waitForAppsRegistration;
async function sendApps(ctx) {
    var appRecords = [];
    for (var appRecord of ctx.appRecords) {
        if (!(await ctx.api.getComponentDevtoolsOptions(appRecord.rootInstance)).hide) {
            appRecords.push(appRecord);
        }
    }
    ctx.bridge.send(shared_utils_1.BridgeEvents.TO_FRONT_APP_LIST, {
        apps: appRecords.map(mapAppRecord)
    });
}
exports.sendApps = sendApps;
async function removeApp(app, ctx) {
    try {
        var appRecord = await getAppRecord(app, ctx);
        if (appRecord) {
            var index = ctx.appRecords.indexOf(appRecord);
            if (index !== -1)
                { ctx.appRecords.splice(index, 1); }
            timeline_1.removeLayersForApp(app, ctx);
            ctx.bridge.send(shared_utils_1.BridgeEvents.TO_FRONT_APP_REMOVE, { id: appRecord.id });
        }
    }
    catch (e) {
        if (true) {
            console.error(e);
        }
    }
}
exports.removeApp = removeApp;
// eslint-disable-next-line camelcase
async function _legacy_getAndRegisterApps(Vue, ctx) {
    var apps = scan_1.scan();
    apps.forEach(function (app) {
        registerApp({
            app: app,
            types: {},
            version: Vue.version,
            meta: {
                Vue: Vue
            }
        }, ctx);
    });
}
exports._legacy_getAndRegisterApps = _legacy_getAndRegisterApps;
//# sourceMappingURL=app.js.map

/***/ }),

/***/ "../app-backend-core/lib/component-pick.js":
/*!*************************************************!*\
  !*** ../app-backend-core/lib/component-pick.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
var shared_utils_1 = __webpack_require__(/*! @vue-devtools/shared-utils */ "../shared-utils/lib/index.js");
var highlighter_1 = __webpack_require__(/*! ./highlighter */ "../app-backend-core/lib/highlighter.js");
var ComponentPicker = function ComponentPicker(ctx) {
    this.ctx = ctx;
    this.bindMethods();
};
/**
 * Adds event listeners for mouseover and mouseup
 */
ComponentPicker.prototype.startSelecting = function startSelecting () {
    if (!shared_utils_1.isBrowser)
        { return; }
    window.addEventListener('mouseover', this.elementMouseOver, true);
    window.addEventListener('click', this.elementClicked, true);
    window.addEventListener('mouseout', this.cancelEvent, true);
    window.addEventListener('mouseenter', this.cancelEvent, true);
    window.addEventListener('mouseleave', this.cancelEvent, true);
    window.addEventListener('mousedown', this.cancelEvent, true);
    window.addEventListener('mouseup', this.cancelEvent, true);
};
/**
 * Removes event listeners
 */
ComponentPicker.prototype.stopSelecting = function stopSelecting () {
    if (!shared_utils_1.isBrowser)
        { return; }
    window.removeEventListener('mouseover', this.elementMouseOver, true);
    window.removeEventListener('click', this.elementClicked, true);
    window.removeEventListener('mouseout', this.cancelEvent, true);
    window.removeEventListener('mouseenter', this.cancelEvent, true);
    window.removeEventListener('mouseleave', this.cancelEvent, true);
    window.removeEventListener('mousedown', this.cancelEvent, true);
    window.removeEventListener('mouseup', this.cancelEvent, true);
    highlighter_1.unHighlight();
};
/**
 * Highlights a component on element mouse over
 */
ComponentPicker.prototype.elementMouseOver = async function elementMouseOver (e) {
    this.cancelEvent(e);
    var el = e.target;
    if (el) {
        this.selectedInstance = await this.ctx.api.getElementComponent(el);
    }
    highlighter_1.unHighlight();
    if (this.selectedInstance) {
        highlighter_1.highlight(this.selectedInstance, this.ctx);
    }
};
/**
 * Selects an instance in the component view
 */
ComponentPicker.prototype.elementClicked = async function elementClicked (e) {
    this.cancelEvent(e);
    if (this.selectedInstance) {
        var parentInstances = await this.ctx.api.walkComponentParents(this.selectedInstance);
        this.ctx.bridge.send(shared_utils_1.BridgeEvents.TO_FRONT_COMPONENT_PICK, { id: this.selectedInstance.__VUE_DEVTOOLS_UID__, parentIds: parentInstances.map(function (i) { return i.__VUE_DEVTOOLS_UID__; }) });
    }
    else {
        this.ctx.bridge.send(shared_utils_1.BridgeEvents.TO_FRONT_COMPONENT_PICK_CANCELED, null);
    }
    this.stopSelecting();
};
/**
 * Cancel a mouse event
 */
ComponentPicker.prototype.cancelEvent = function cancelEvent (e) {
    e.stopImmediatePropagation();
    e.preventDefault();
};
/**
 * Bind class methods to the class scope to avoid rebind for event listeners
 */
ComponentPicker.prototype.bindMethods = function bindMethods () {
    this.startSelecting = this.startSelecting.bind(this);
    this.stopSelecting = this.stopSelecting.bind(this);
    this.elementMouseOver = this.elementMouseOver.bind(this);
    this.elementClicked = this.elementClicked.bind(this);
};
exports.default = ComponentPicker;
//# sourceMappingURL=component-pick.js.map

/***/ }),

/***/ "../app-backend-core/lib/component.js":
/*!********************************************!*\
  !*** ../app-backend-core/lib/component.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getComponentInstance = exports.getComponentId = exports.editComponentState = exports.sendEmptyComponentData = exports.markSelectedInstance = exports.sendSelectedComponentData = exports.sendComponentTreeData = void 0;
var shared_utils_1 = __webpack_require__(/*! @vue-devtools/shared-utils */ "../shared-utils/lib/index.js");
var app_1 = __webpack_require__(/*! ./app */ "../app-backend-core/lib/app.js");
var MAX_$VM = 10;
var $vmQueue = [];
async function sendComponentTreeData(appRecord, instanceId, filter, maxDepth, ctx) {
    if ( filter === void 0 ) filter = '';
    if ( maxDepth === void 0 ) maxDepth = null;

    if (!instanceId || appRecord !== ctx.currentAppRecord)
        { return; }
    var instance = getComponentInstance(appRecord, instanceId, ctx);
    if (!instance) {
        ctx.bridge.send(shared_utils_1.BridgeEvents.TO_FRONT_COMPONENT_TREE, {
            instanceId: instanceId,
            treeData: null,
            notFound: true
        });
    }
    else {
        if (filter)
            { filter = filter.toLowerCase(); }
        if (maxDepth == null) {
            maxDepth = instance === ctx.currentAppRecord.rootInstance ? 2 : 1;
        }
        var payload = {
            instanceId: instanceId,
            treeData: shared_utils_1.stringify(await ctx.api.walkComponentTree(instance, maxDepth, filter))
        };
        ctx.bridge.send(shared_utils_1.BridgeEvents.TO_FRONT_COMPONENT_TREE, payload);
    }
}
exports.sendComponentTreeData = sendComponentTreeData;
async function sendSelectedComponentData(appRecord, instanceId, ctx) {
    if (!instanceId || appRecord !== ctx.currentAppRecord)
        { return; }
    markSelectedInstance(instanceId, ctx);
    var instance = getComponentInstance(appRecord, instanceId, ctx);
    if (!instance) {
        sendEmptyComponentData(instanceId, ctx);
    }
    else {
        // Expose instance on window
        if (typeof window !== 'undefined') {
            var win = window;
            win.$vm = instance;
            // $vm0, $vm1, $vm2, ...
            if ($vmQueue[0] !== instance) {
                if ($vmQueue.length >= MAX_$VM) {
                    $vmQueue.pop();
                }
                for (var i = $vmQueue.length; i > 0; i--) {
                    win[("$vm" + i)] = $vmQueue[i] = $vmQueue[i - 1];
                }
                win.$vm0 = $vmQueue[0] = instance;
            }
        }
        if (true) {
            console.log('inspect', instance);
        }
        var parentInstances = await ctx.api.walkComponentParents(instance);
        var payload = {
            instanceId: instanceId,
            data: shared_utils_1.stringify(await ctx.api.inspectComponent(instance, ctx.currentAppRecord.options.app)),
            parentIds: parentInstances.map(function (i) { return i.__VUE_DEVTOOLS_UID__; })
        };
        ctx.bridge.send(shared_utils_1.BridgeEvents.TO_FRONT_COMPONENT_SELECTED_DATA, payload);
    }
}
exports.sendSelectedComponentData = sendSelectedComponentData;
function markSelectedInstance(instanceId, ctx) {
    ctx.currentInspectedComponentId = instanceId;
    ctx.currentAppRecord.lastInspectedComponentId = instanceId;
}
exports.markSelectedInstance = markSelectedInstance;
function sendEmptyComponentData(instanceId, ctx) {
    ctx.bridge.send(shared_utils_1.BridgeEvents.TO_FRONT_COMPONENT_SELECTED_DATA, {
        instanceId: instanceId,
        data: null
    });
}
exports.sendEmptyComponentData = sendEmptyComponentData;
async function editComponentState(instanceId, dotPath, type, state, ctx) {
    if (!instanceId)
        { return; }
    var instance = getComponentInstance(ctx.currentAppRecord, instanceId, ctx);
    if (instance) {
        if ('value' in state && state.value != null) {
            state.value = shared_utils_1.parse(state.value, true);
        }
        await ctx.api.editComponentState(instance, dotPath, type, state, ctx.currentAppRecord.options.app);
        await sendSelectedComponentData(ctx.currentAppRecord, instanceId, ctx);
    }
}
exports.editComponentState = editComponentState;
async function getComponentId(app, uid, ctx) {
    try {
        var appRecord = await app_1.getAppRecord(app, ctx);
        if (!appRecord)
            { return null; }
        return ((appRecord.id) + ":" + (uid === 0 ? 'root' : uid));
    }
    catch (e) {
        if (true) {
            console.error(e);
        }
        return null;
    }
}
exports.getComponentId = getComponentId;
function getComponentInstance(appRecord, instanceId, ctx) {
    if (instanceId === '_root') {
        instanceId = (appRecord.id) + ":root";
    }
    var instance = appRecord.instanceMap.get(instanceId);
    if (!instance && "development" !== 'production') {
        console.warn(("Instance uid=" + instanceId + " not found"));
    }
    return instance;
}
exports.getComponentInstance = getComponentInstance;
//# sourceMappingURL=component.js.map

/***/ }),

/***/ "../app-backend-core/lib/global-hook.js":
/*!**********************************************!*\
  !*** ../app-backend-core/lib/global-hook.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.hook = void 0;
var shared_utils_1 = __webpack_require__(/*! @vue-devtools/shared-utils */ "../shared-utils/lib/index.js");
// hook should have been injected before this executes.
exports.hook = shared_utils_1.target.__VUE_DEVTOOLS_GLOBAL_HOOK__;
//# sourceMappingURL=global-hook.js.map

/***/ }),

/***/ "../app-backend-core/lib/highlighter.js":
/*!**********************************************!*\
  !*** ../app-backend-core/lib/highlighter.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.unHighlight = exports.highlight = void 0;
var shared_utils_1 = __webpack_require__(/*! @vue-devtools/shared-utils */ "../shared-utils/lib/index.js");
var queue_1 = __webpack_require__(/*! ./util/queue */ "../app-backend-core/lib/util/queue.js");
var overlay;
var overlayContent;
var currentInstance;
function createOverlay() {
    if (overlay || !shared_utils_1.isBrowser)
        { return; }
    overlay = document.createElement('div');
    overlay.style.backgroundColor = 'rgba(65, 184, 131, 0.35)';
    overlay.style.position = 'fixed';
    overlay.style.zIndex = '99999999999998';
    overlay.style.pointerEvents = 'none';
    overlay.style.borderRadius = '3px';
    overlayContent = document.createElement('div');
    overlayContent.style.position = 'fixed';
    overlayContent.style.zIndex = '99999999999999';
    overlayContent.style.pointerEvents = 'none';
    overlayContent.style.backgroundColor = 'white';
    overlayContent.style.fontFamily = 'monospace';
    overlayContent.style.fontSize = '11px';
    overlayContent.style.padding = '4px 8px';
    overlayContent.style.borderRadius = '3px';
    overlayContent.style.color = '#333';
    overlayContent.style.textAlign = 'center';
    overlayContent.style.border = 'rgba(65, 184, 131, 0.5) 1px solid';
    overlayContent.style.backgroundClip = 'padding-box';
}
// Use a job queue to preserve highlight/unhighlight calls order
// This prevents "sticky" highlights that are not removed because highlight is async
var jobQueue = new queue_1.JobQueue();
async function highlight(instance, ctx) {
    await jobQueue.queue(async function () {
        if (!instance)
            { return; }
        var bounds = await ctx.api.getComponentBounds(instance);
        if (bounds) {
            createOverlay();
            // Name
            var name = (await ctx.api.getComponentName(instance)) || 'Anonymous';
            var pre = document.createElement('span');
            pre.style.opacity = '0.6';
            pre.innerText = '<';
            var text = document.createElement('span');
            text.style.fontWeight = 'bold';
            text.style.color = '#09ab56';
            text.innerText = name;
            var post = document.createElement('span');
            post.style.opacity = '0.6';
            post.innerText = '>';
            // Size
            var size = document.createElement('span');
            size.style.opacity = '0.5';
            size.style.marginLeft = '6px';
            size.appendChild(document.createTextNode((Math.round(bounds.width * 100) / 100).toString()));
            var multiply = document.createElement('span');
            multiply.style.marginLeft = multiply.style.marginRight = '2px';
            multiply.innerText = '×';
            size.appendChild(multiply);
            size.appendChild(document.createTextNode((Math.round(bounds.height * 100) / 100).toString()));
            currentInstance = instance;
            await showOverlay(bounds, [pre, text, post, size]);
        }
        startUpdateTimer(ctx);
    });
}
exports.highlight = highlight;
async function unHighlight() {
    await jobQueue.queue(async function () {
        var _a, _b;
        (_a = overlay === null || overlay === void 0 ? void 0 : overlay.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(overlay);
        (_b = overlayContent === null || overlayContent === void 0 ? void 0 : overlayContent.parentNode) === null || _b === void 0 ? void 0 : _b.removeChild(overlayContent);
        currentInstance = null;
        stopUpdateTimer();
    });
}
exports.unHighlight = unHighlight;
function showOverlay(bounds, children) {
    if ( children === void 0 ) children = null;

    if (!shared_utils_1.isBrowser || !children.length)
        { return; }
    positionOverlay(bounds);
    document.body.appendChild(overlay);
    overlayContent.innerHTML = '';
    children.forEach(function (child) { return overlayContent.appendChild(child); });
    document.body.appendChild(overlayContent);
    positionOverlayContent(bounds);
}
function positionOverlay(ref) {
    var width = ref.width; if ( width === void 0 ) width = 0;
    var height = ref.height; if ( height === void 0 ) height = 0;
    var top = ref.top; if ( top === void 0 ) top = 0;
    var left = ref.left; if ( left === void 0 ) left = 0;

    overlay.style.width = Math.round(width) + 'px';
    overlay.style.height = Math.round(height) + 'px';
    overlay.style.left = Math.round(left) + 'px';
    overlay.style.top = Math.round(top) + 'px';
}
function positionOverlayContent(ref) {
    var wifth = ref.wifth; if ( wifth === void 0 ) wifth = 0;
    var height = ref.height; if ( height === void 0 ) height = 0;
    var top = ref.top; if ( top === void 0 ) top = 0;
    var left = ref.left; if ( left === void 0 ) left = 0;

    // Content position (prevents overflow)
    var contentWidth = overlayContent.offsetWidth;
    var contentHeight = overlayContent.offsetHeight;
    var contentLeft = left;
    if (contentLeft < 0) {
        contentLeft = 0;
    }
    else if (contentLeft + contentWidth > window.innerWidth) {
        contentLeft = window.innerWidth - contentWidth;
    }
    var contentTop = top - contentHeight - 2;
    if (contentTop < 0) {
        contentTop = top + height + 2;
    }
    if (contentTop < 0) {
        contentTop = 0;
    }
    else if (contentTop + contentHeight > window.innerHeight) {
        contentTop = window.innerHeight - contentHeight;
    }
    overlayContent.style.left = ~~contentLeft + 'px';
    overlayContent.style.top = ~~contentTop + 'px';
}
async function updateOverlay(ctx) {
    if (currentInstance) {
        var bounds = await ctx.api.getComponentBounds(currentInstance);
        if (bounds) {
            var sizeEl = overlayContent.children.item(3);
            var widthEl = sizeEl.childNodes[0];
            widthEl.textContent = (Math.round(bounds.width * 100) / 100).toString();
            var heightEl = sizeEl.childNodes[2];
            heightEl.textContent = (Math.round(bounds.height * 100) / 100).toString();
            positionOverlay(bounds);
            positionOverlayContent(bounds);
        }
    }
}
var updateTimer;
function startUpdateTimer(ctx) {
    stopUpdateTimer();
    updateTimer = setInterval(function () {
        jobQueue.queue(async function () {
            await updateOverlay(ctx);
        });
    }, 1000 / 30); // 30fps
}
function stopUpdateTimer() {
    clearInterval(updateTimer);
}
//# sourceMappingURL=highlighter.js.map

/***/ }),

/***/ "../app-backend-core/lib/index.js":
/*!****************************************!*\
  !*** ../app-backend-core/lib/index.js ***!
  \****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.initBackend = void 0;
var app_backend_api_1 = __webpack_require__(/*! @vue-devtools/app-backend-api */ "../app-backend-api/lib/index.js");
var shared_utils_1 = __webpack_require__(/*! @vue-devtools/shared-utils */ "../shared-utils/lib/index.js");
var global_hook_1 = __webpack_require__(/*! ./global-hook */ "../app-backend-core/lib/global-hook.js");
var subscriptions_1 = __webpack_require__(/*! ./util/subscriptions */ "../app-backend-core/lib/util/subscriptions.js");
var highlighter_1 = __webpack_require__(/*! ./highlighter */ "../app-backend-core/lib/highlighter.js");
var timeline_1 = __webpack_require__(/*! ./timeline */ "../app-backend-core/lib/timeline.js");
var component_pick_1 = __importDefault(__webpack_require__(/*! ./component-pick */ "../app-backend-core/lib/component-pick.js"));
var component_1 = __webpack_require__(/*! ./component */ "../app-backend-core/lib/component.js");
var plugin_1 = __webpack_require__(/*! ./plugin */ "../app-backend-core/lib/plugin.js");
var app_1 = __webpack_require__(/*! ./app */ "../app-backend-core/lib/app.js");
var inspector_1 = __webpack_require__(/*! ./inspector */ "../app-backend-core/lib/inspector.js");
var timeline_screenshot_1 = __webpack_require__(/*! ./timeline-screenshot */ "../app-backend-core/lib/timeline-screenshot.js");
var perf_1 = __webpack_require__(/*! ./perf */ "../app-backend-core/lib/perf.js");
var page_config_1 = __webpack_require__(/*! ./page-config */ "../app-backend-core/lib/page-config.js");
var ctx = (_a = shared_utils_1.target.__vdevtools_ctx) !== null && _a !== void 0 ? _a : null;
var connected = (_b = shared_utils_1.target.__vdevtools_connected) !== null && _b !== void 0 ? _b : false;
async function initBackend(bridge) {
    await shared_utils_1.initSharedData({
        bridge: bridge,
        persist: false
    });
    page_config_1.initOnPageConfig();
    if (!connected) {
        // connected = false
        ctx = shared_utils_1.target.__vdevtools_ctx = app_backend_api_1.createBackendContext({
            bridge: bridge,
            hook: global_hook_1.hook
        });
        if (global_hook_1.hook.Vue) {
            connect();
            app_1._legacy_getAndRegisterApps(global_hook_1.hook.Vue, ctx);
        }
        else {
            global_hook_1.hook.once(shared_utils_1.HookEvents.INIT, function (Vue) {
                app_1._legacy_getAndRegisterApps(Vue, ctx);
            });
        }
        global_hook_1.hook.on(shared_utils_1.HookEvents.APP_ADD, async function (app) {
            await app_1.registerApp(app, ctx);
            // Will init connect
            global_hook_1.hook.emit(shared_utils_1.HookEvents.INIT);
        });
        // Add apps that already sent init
        if (global_hook_1.hook.apps.length) {
            global_hook_1.hook.apps.forEach(function (app) {
                app_1.registerApp(app, ctx);
                connect();
            });
        }
    }
    else {
        ctx.bridge = bridge;
        connectBridge();
    }
}
exports.initBackend = initBackend;
async function connect() {
    if (connected) {
        return;
    }
    connected = shared_utils_1.target.__vdevtools_connected = true;
    await app_1.waitForAppsRegistration();
    connectBridge();
    ctx.currentTab = shared_utils_1.BuiltinTabs.COMPONENTS;
    // Apps
    global_hook_1.hook.on(shared_utils_1.HookEvents.APP_UNMOUNT, function (app) {
        app_1.removeApp(app, ctx);
    });
    // Components
    global_hook_1.hook.on(shared_utils_1.HookEvents.COMPONENT_UPDATED, async function (app, uid, parentUid, component) {
        try {
            var id;
            var appRecord;
            if (app && uid != null) {
                id = await component_1.getComponentId(app, uid, ctx);
                appRecord = await app_1.getAppRecord(app, ctx);
            }
            else {
                id = ctx.currentInspectedComponentId;
                appRecord = ctx.currentAppRecord;
            }
            // Update component inspector
            if (id && subscriptions_1.isSubscribed(shared_utils_1.BridgeSubscriptions.SELECTED_COMPONENT_DATA, function (sub) { return sub.payload.instanceId === id; })) {
                component_1.sendSelectedComponentData(appRecord, id, ctx);
            }
            // Update tree (tags)
            if (subscriptions_1.isSubscribed(shared_utils_1.BridgeSubscriptions.COMPONENT_TREE, function (sub) { return sub.payload.instanceId === id; })) {
                component_1.sendComponentTreeData(appRecord, id, appRecord.componentFilter, 0, ctx);
            }
        }
        catch (e) {
            if (true) {
                console.error(e);
            }
        }
    });
    global_hook_1.hook.on(shared_utils_1.HookEvents.COMPONENT_ADDED, async function (app, uid, parentUid, component) {
        try {
            var id = await component_1.getComponentId(app, uid, ctx);
            var appRecord = await app_1.getAppRecord(app, ctx);
            if (component) {
                if (component.__VUE_DEVTOOLS_UID__ == null) {
                    component.__VUE_DEVTOOLS_UID__ = id;
                }
                if (!appRecord.instanceMap.has(id)) {
                    appRecord.instanceMap.set(id, component);
                }
            }
            var parentId = await component_1.getComponentId(app, parentUid, ctx);
            if (subscriptions_1.isSubscribed(shared_utils_1.BridgeSubscriptions.COMPONENT_TREE, function (sub) { return sub.payload.instanceId === parentId; })) {
                requestAnimationFrame(function () {
                    component_1.sendComponentTreeData(appRecord, parentId, appRecord.componentFilter, null, ctx);
                });
            }
            if (ctx.currentInspectedComponentId === id) {
                component_1.sendSelectedComponentData(appRecord, id, ctx);
            }
        }
        catch (e) {
            if (true) {
                console.error(e);
            }
        }
    });
    global_hook_1.hook.on(shared_utils_1.HookEvents.COMPONENT_REMOVED, async function (app, uid, parentUid, component) {
        try {
            var appRecord = await app_1.getAppRecord(app, ctx);
            var parentId = await component_1.getComponentId(app, parentUid, ctx);
            if (subscriptions_1.isSubscribed(shared_utils_1.BridgeSubscriptions.COMPONENT_TREE, function (sub) { return sub.payload.instanceId === parentId; })) {
                requestAnimationFrame(async function () {
                    try {
                        component_1.sendComponentTreeData(await app_1.getAppRecord(app, ctx), parentId, appRecord.componentFilter, null, ctx);
                    }
                    catch (e) {
                        if (true) {
                            console.error(e);
                        }
                    }
                });
            }
            var id = await component_1.getComponentId(app, uid, ctx);
            if (subscriptions_1.isSubscribed(shared_utils_1.BridgeSubscriptions.SELECTED_COMPONENT_DATA, function (sub) { return sub.payload.instanceId === id; })) {
                component_1.sendEmptyComponentData(id, ctx);
            }
            appRecord.instanceMap.delete(id);
        }
        catch (e) {
            if (true) {
                console.error(e);
            }
        }
    });
    // Component perf
    global_hook_1.hook.on(shared_utils_1.HookEvents.PERFORMANCE_START, function (app, uid, vm, type, time) {
        perf_1.performanceMarkStart(app, uid, vm, type, time, ctx);
    });
    global_hook_1.hook.on(shared_utils_1.HookEvents.PERFORMANCE_END, function (app, uid, vm, type, time) {
        perf_1.performanceMarkEnd(app, uid, vm, type, time, ctx);
    });
    perf_1.handleAddPerformanceTag(ctx);
    // Highlighter
    global_hook_1.hook.on(shared_utils_1.HookEvents.COMPONENT_HIGHLIGHT, function (instanceId) {
        highlighter_1.highlight(ctx.currentAppRecord.instanceMap.get(instanceId), ctx);
    });
    global_hook_1.hook.on(shared_utils_1.HookEvents.COMPONENT_UNHIGHLIGHT, function () {
        highlighter_1.unHighlight();
    });
    // Timeline
    timeline_1.setupTimeline(ctx);
    global_hook_1.hook.on(shared_utils_1.HookEvents.TIMELINE_LAYER_ADDED, function (options, plugin) {
        ctx.timelineLayers.push(Object.assign({}, options,
            {app: plugin.descriptor.app,
            plugin: plugin,
            events: []}));
        ctx.bridge.send(shared_utils_1.BridgeEvents.TO_FRONT_TIMELINE_LAYER_ADD, {});
    });
    global_hook_1.hook.on(shared_utils_1.HookEvents.TIMELINE_EVENT_ADDED, function (options, plugin) {
        timeline_1.addTimelineEvent(options, plugin.descriptor.app, ctx);
    });
    // Custom inspectors
    global_hook_1.hook.on(shared_utils_1.HookEvents.CUSTOM_INSPECTOR_ADD, function (options, plugin) {
        ctx.customInspectors.push(Object.assign({}, options,
            {app: plugin.descriptor.app,
            plugin: plugin,
            treeFilter: '',
            selectedNodeId: null}));
        ctx.bridge.send(shared_utils_1.BridgeEvents.TO_FRONT_CUSTOM_INSPECTOR_ADD, {});
    });
    global_hook_1.hook.on(shared_utils_1.HookEvents.CUSTOM_INSPECTOR_SEND_TREE, function (inspectorId, plugin) {
        var inspector = inspector_1.getInspector(inspectorId, plugin.descriptor.app, ctx);
        if (inspector) {
            inspector_1.sendInspectorTree(inspector, ctx);
        }
        else {
            console.error(("Inspector " + inspectorId + " not found"));
        }
    });
    global_hook_1.hook.on(shared_utils_1.HookEvents.CUSTOM_INSPECTOR_SEND_STATE, function (inspectorId, plugin) {
        var inspector = inspector_1.getInspector(inspectorId, plugin.descriptor.app, ctx);
        if (inspector) {
            inspector_1.sendInspectorState(inspector, ctx);
        }
        else {
            console.error(("Inspector " + inspectorId + " not found"));
        }
    });
    global_hook_1.hook.on(shared_utils_1.HookEvents.CUSTOM_INSPECTOR_SELECT_NODE, async function (inspectorId, nodeId, plugin) {
        var inspector = inspector_1.getInspector(inspectorId, plugin.descriptor.app, ctx);
        if (inspector) {
            await inspector_1.selectInspectorNode(inspector, nodeId, ctx);
        }
        else {
            console.error(("Inspector " + inspectorId + " not found"));
        }
    });
    // Plugins
    plugin_1.addPreviouslyRegisteredPlugins(ctx);
    plugin_1.addQueuedPlugins(ctx);
    global_hook_1.hook.on(shared_utils_1.HookEvents.SETUP_DEVTOOLS_PLUGIN, function (pluginDescriptor, setupFn) {
        plugin_1.addPlugin(pluginDescriptor, setupFn, ctx);
    });
    // Legacy flush
    global_hook_1.hook.off('flush');
    global_hook_1.hook.on('flush', function () {
        var _a;
        if ((_a = ctx.currentAppRecord) === null || _a === void 0 ? void 0 : _a.backend.availableFeatures.includes(app_backend_api_1.BuiltinBackendFeature.FLUSH)) {
            component_1.sendComponentTreeData(ctx.currentAppRecord, '_root', ctx.currentAppRecord.componentFilter, null, ctx);
            if (ctx.currentInspectedComponentId) {
                component_1.sendSelectedComponentData(ctx.currentAppRecord, ctx.currentInspectedComponentId, ctx);
            }
        }
    });
}
function connectBridge() {
    // Subscriptions
    ctx.bridge.on(shared_utils_1.BridgeEvents.TO_BACK_SUBSCRIBE, function (ref) {
        var type = ref.type;
        var payload = ref.payload;

        subscriptions_1.subscribe(type, payload);
    });
    ctx.bridge.on(shared_utils_1.BridgeEvents.TO_BACK_UNSUBSCRIBE, function (ref) {
        var type = ref.type;
        var payload = ref.payload;

        subscriptions_1.unsubscribe(type, payload);
    });
    // Tabs
    ctx.bridge.on(shared_utils_1.BridgeEvents.TO_BACK_TAB_SWITCH, async function (tab) {
        ctx.currentTab = tab;
        await highlighter_1.unHighlight();
    });
    // Apps
    ctx.bridge.on(shared_utils_1.BridgeEvents.TO_BACK_APP_LIST, function () {
        app_1.sendApps(ctx);
    });
    ctx.bridge.on(shared_utils_1.BridgeEvents.TO_BACK_APP_SELECT, async function (id) {
        if (id == null)
            { return; }
        var record = ctx.appRecords.find(function (r) { return r.id === id; });
        if (!record) {
            console.error(("App with id " + id + " not found"));
        }
        else {
            await app_1.selectApp(record, ctx);
        }
    });
    // Components
    ctx.bridge.on(shared_utils_1.BridgeEvents.TO_BACK_COMPONENT_TREE, function (ref) {
        var instanceId = ref.instanceId;
        var filter = ref.filter;

        ctx.currentAppRecord.componentFilter = filter;
        component_1.sendComponentTreeData(ctx.currentAppRecord, instanceId, filter, null, ctx);
    });
    ctx.bridge.on(shared_utils_1.BridgeEvents.TO_BACK_COMPONENT_SELECTED_DATA, function (instanceId) {
        component_1.sendSelectedComponentData(ctx.currentAppRecord, instanceId, ctx);
    });
    ctx.bridge.on(shared_utils_1.BridgeEvents.TO_BACK_COMPONENT_EDIT_STATE, function (ref) {
        var instanceId = ref.instanceId;
        var dotPath = ref.dotPath;
        var type = ref.type;
        var value = ref.value;
        var newKey = ref.newKey;
        var remove = ref.remove;

        component_1.editComponentState(instanceId, dotPath, type, { value: value, newKey: newKey, remove: remove }, ctx);
    });
    ctx.bridge.on(shared_utils_1.BridgeEvents.TO_BACK_COMPONENT_INSPECT_DOM, async function (ref) {
        var instanceId = ref.instanceId;

        var instance = component_1.getComponentInstance(ctx.currentAppRecord, instanceId, ctx);
        if (instance) {
            var ref$1 = await ctx.api.getComponentRootElements(instance);
            var el = ref$1[0];
            if (el) {
                // @ts-ignore
                window.__VUE_DEVTOOLS_INSPECT_TARGET__ = el;
                ctx.bridge.send(shared_utils_1.BridgeEvents.TO_FRONT_COMPONENT_INSPECT_DOM, null);
            }
        }
    });
    ctx.bridge.on(shared_utils_1.BridgeEvents.TO_BACK_COMPONENT_SCROLL_TO, async function (ref) {
        var instanceId = ref.instanceId;

        var instance = component_1.getComponentInstance(ctx.currentAppRecord, instanceId, ctx);
        if (instance) {
            var ref$1 = await ctx.api.getComponentRootElements(instance);
            var el = ref$1[0];
            if (el) {
                if (typeof el.scrollIntoView === 'function') {
                    el.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center',
                        inline: 'center'
                    });
                }
                else {
                    // Handle nodes that don't implement scrollIntoView
                    var bounds = await ctx.api.getComponentBounds(instance);
                    var scrollTarget = document.createElement('div');
                    scrollTarget.style.position = 'absolute';
                    scrollTarget.style.width = (bounds.width) + "px";
                    scrollTarget.style.height = (bounds.height) + "px";
                    scrollTarget.style.top = (bounds.top) + "px";
                    scrollTarget.style.left = (bounds.left) + "px";
                    document.body.appendChild(scrollTarget);
                    scrollTarget.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center',
                        inline: 'center'
                    });
                    setTimeout(function () {
                        document.body.removeChild(scrollTarget);
                    }, 2000);
                }
                highlighter_1.highlight(instance, ctx);
                setTimeout(function () {
                    highlighter_1.unHighlight();
                }, 2000);
            }
        }
    });
    ctx.bridge.on(shared_utils_1.BridgeEvents.TO_BACK_COMPONENT_RENDER_CODE, async function (ref) {
        var instanceId = ref.instanceId;

        var instance = component_1.getComponentInstance(ctx.currentAppRecord, instanceId, ctx);
        if (instance) {
            var ref$1 = await ctx.api.getComponentRenderCode(instance);
            var code = ref$1.code;
            ctx.bridge.send(shared_utils_1.BridgeEvents.TO_FRONT_COMPONENT_RENDER_CODE, {
                instanceId: instanceId,
                code: code
            });
        }
    });
    ctx.bridge.on(shared_utils_1.BridgeEvents.TO_BACK_CUSTOM_STATE_ACTION, async function (ref) {
        var value = ref.value;
        var actionIndex = ref.actionIndex;

        var rawAction = value._custom.actions[actionIndex];
        var action = shared_utils_1.revive(rawAction === null || rawAction === void 0 ? void 0 : rawAction.action);
        if (action) {
            try {
                await action();
            }
            catch (e) {
                console.error(e);
            }
        }
        else {
            console.warn(("Couldn't revive action " + actionIndex + " from"), value);
        }
    });
    // Highlighter
    ctx.bridge.on(shared_utils_1.BridgeEvents.TO_BACK_COMPONENT_MOUSE_OVER, function (instanceId) {
        highlighter_1.highlight(ctx.currentAppRecord.instanceMap.get(instanceId), ctx);
    });
    ctx.bridge.on(shared_utils_1.BridgeEvents.TO_BACK_COMPONENT_MOUSE_OUT, function () {
        highlighter_1.unHighlight();
    });
    // Component picker
    var componentPicker = new component_pick_1.default(ctx);
    ctx.bridge.on(shared_utils_1.BridgeEvents.TO_BACK_COMPONENT_PICK, function () {
        componentPicker.startSelecting();
    });
    ctx.bridge.on(shared_utils_1.BridgeEvents.TO_BACK_COMPONENT_PICK_CANCELED, function () {
        componentPicker.stopSelecting();
    });
    // Timeline
    ctx.bridge.on(shared_utils_1.BridgeEvents.TO_BACK_TIMELINE_LAYER_LIST, function () {
        timeline_1.sendTimelineLayers(ctx);
    });
    ctx.bridge.on(shared_utils_1.BridgeEvents.TO_BACK_TIMELINE_SHOW_SCREENSHOT, function (ref) {
        var screenshot = ref.screenshot;

        timeline_screenshot_1.showScreenshot(screenshot, ctx);
    });
    ctx.bridge.on(shared_utils_1.BridgeEvents.TO_BACK_TIMELINE_CLEAR, async function () {
        await timeline_1.clearTimeline(ctx);
    });
    ctx.bridge.on(shared_utils_1.BridgeEvents.TO_BACK_TIMELINE_EVENT_DATA, async function (ref) {
        var id = ref.id;

        await timeline_1.sendTimelineEventData(id, ctx);
    });
    ctx.bridge.on(shared_utils_1.BridgeEvents.TO_BACK_TIMELINE_LAYER_LOAD_EVENTS, function (ref) {
        var appId = ref.appId;
        var layerId = ref.layerId;

        timeline_1.sendTimelineLayerEvents(appId, layerId, ctx);
    });
    // Custom inspectors
    ctx.bridge.on(shared_utils_1.BridgeEvents.TO_BACK_CUSTOM_INSPECTOR_LIST, function () {
        inspector_1.sendCustomInspectors(ctx);
    });
    ctx.bridge.on(shared_utils_1.BridgeEvents.TO_BACK_CUSTOM_INSPECTOR_TREE, function (ref) {
        var inspectorId = ref.inspectorId;
        var appId = ref.appId;
        var treeFilter = ref.treeFilter;

        var inspector = inspector_1.getInspectorWithAppId(inspectorId, appId, ctx);
        if (inspector) {
            inspector.treeFilter = treeFilter;
            inspector_1.sendInspectorTree(inspector, ctx);
        }
        else {
            console.error(("Inspector " + inspectorId + " not found"));
        }
    });
    ctx.bridge.on(shared_utils_1.BridgeEvents.TO_BACK_CUSTOM_INSPECTOR_STATE, function (ref) {
        var inspectorId = ref.inspectorId;
        var appId = ref.appId;
        var nodeId = ref.nodeId;

        var inspector = inspector_1.getInspectorWithAppId(inspectorId, appId, ctx);
        if (inspector) {
            inspector.selectedNodeId = nodeId;
            inspector_1.sendInspectorState(inspector, ctx);
        }
        else {
            console.error(("Inspector " + inspectorId + " not found"));
        }
    });
    ctx.bridge.on(shared_utils_1.BridgeEvents.TO_BACK_CUSTOM_INSPECTOR_EDIT_STATE, async function (ref) {
        var inspectorId = ref.inspectorId;
        var appId = ref.appId;
        var nodeId = ref.nodeId;
        var path = ref.path;
        var type = ref.type;
        var payload = ref.payload;

        var inspector = inspector_1.getInspectorWithAppId(inspectorId, appId, ctx);
        if (inspector) {
            await inspector_1.editInspectorState(inspector, nodeId, path, type, payload, ctx);
            inspector.selectedNodeId = nodeId;
            await inspector_1.sendInspectorState(inspector, ctx);
        }
        else {
            console.error(("Inspector " + inspectorId + " not found"));
        }
    });
    ctx.bridge.on(shared_utils_1.BridgeEvents.TO_BACK_CUSTOM_INSPECTOR_ACTION, async function (ref) {
        var inspectorId = ref.inspectorId;
        var appId = ref.appId;
        var actionIndex = ref.actionIndex;

        var inspector = inspector_1.getInspectorWithAppId(inspectorId, appId, ctx);
        if (inspector) {
            var action = inspector.actions[actionIndex];
            try {
                await action.action();
            }
            catch (e) {
                console.error(e);
            }
        }
        else {
            console.error(("Inspector " + inspectorId + " not found"));
        }
    });
    // Misc
    ctx.bridge.on(shared_utils_1.BridgeEvents.TO_BACK_LOG, function (payload) {
        var value = payload.value;
        if (payload.serialized) {
            value = shared_utils_1.parse(value, payload.revive);
        }
        else if (payload.revive) {
            value = shared_utils_1.revive(value);
        }
        console[payload.level](value);
    });
    // Plugins
    ctx.bridge.on(shared_utils_1.BridgeEvents.TO_BACK_DEVTOOLS_PLUGIN_LIST, function () {
        plugin_1.sendPluginList(ctx);
    });
}
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "../app-backend-core/lib/inspector.js":
/*!********************************************!*\
  !*** ../app-backend-core/lib/inspector.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.selectInspectorNode = exports.sendCustomInspectors = exports.editInspectorState = exports.sendInspectorState = exports.sendInspectorTree = exports.getInspectorWithAppId = exports.getInspector = void 0;
var shared_utils_1 = __webpack_require__(/*! @vue-devtools/shared-utils */ "../shared-utils/lib/index.js");
var app_1 = __webpack_require__(/*! ./app */ "../app-backend-core/lib/app.js");
function getInspector(inspectorId, app, ctx) {
    return ctx.customInspectors.find(function (i) { return i.id === inspectorId && i.app === app; });
}
exports.getInspector = getInspector;
function getInspectorWithAppId(inspectorId, appId, ctx) {
    return ctx.customInspectors.find(function (i) { return i.id === inspectorId && app_1.getAppRecordId(i.app) === appId; });
}
exports.getInspectorWithAppId = getInspectorWithAppId;
async function sendInspectorTree(inspector, ctx) {
    var rootNodes = await ctx.api.getInspectorTree(inspector.id, inspector.app, inspector.treeFilter);
    ctx.bridge.send(shared_utils_1.BridgeEvents.TO_FRONT_CUSTOM_INSPECTOR_TREE, {
        appId: app_1.getAppRecordId(inspector.app),
        inspectorId: inspector.id,
        rootNodes: rootNodes
    });
}
exports.sendInspectorTree = sendInspectorTree;
async function sendInspectorState(inspector, ctx) {
    var state = inspector.selectedNodeId ? await ctx.api.getInspectorState(inspector.id, inspector.app, inspector.selectedNodeId) : null;
    ctx.bridge.send(shared_utils_1.BridgeEvents.TO_FRONT_CUSTOM_INSPECTOR_STATE, {
        appId: app_1.getAppRecordId(inspector.app),
        inspectorId: inspector.id,
        state: shared_utils_1.stringify(state)
    });
}
exports.sendInspectorState = sendInspectorState;
async function editInspectorState(inspector, nodeId, dotPath, type, state, ctx) {
    await ctx.api.editInspectorState(inspector.id, inspector.app, nodeId, dotPath, type, Object.assign({}, state,
        {value: state.value != null ? shared_utils_1.parse(state.value, true) : state.value}));
}
exports.editInspectorState = editInspectorState;
async function sendCustomInspectors(ctx) {
    ctx.bridge.send(shared_utils_1.BridgeEvents.TO_FRONT_CUSTOM_INSPECTOR_LIST, {
        inspectors: ctx.customInspectors.map(function (i) {
            var _a;
            return ({
                id: i.id,
                appId: app_1.getAppRecordId(i.app),
                pluginId: i.plugin.descriptor.id,
                label: i.label,
                icon: i.icon,
                treeFilterPlaceholder: i.treeFilterPlaceholder,
                stateFilterPlaceholder: i.stateFilterPlaceholder,
                noSelectionText: i.noSelectionText,
                actions: (_a = i.actions) === null || _a === void 0 ? void 0 : _a.map(function (a) { return ({
                    icon: a.icon,
                    tooltip: a.tooltip
                }); })
            });
        })
    });
}
exports.sendCustomInspectors = sendCustomInspectors;
async function selectInspectorNode(inspector, nodeId, ctx) {
    ctx.bridge.send(shared_utils_1.BridgeEvents.TO_FRONT_CUSTOM_INSPECTOR_SELECT_NODE, {
        appId: app_1.getAppRecordId(inspector.app),
        inspectorId: inspector.id,
        nodeId: nodeId
    });
}
exports.selectInspectorNode = selectInspectorNode;
//# sourceMappingURL=inspector.js.map

/***/ }),

/***/ "../app-backend-core/lib/legacy/scan.js":
/*!**********************************************!*\
  !*** ../app-backend-core/lib/legacy/scan.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.scan = void 0;
var shared_utils_1 = __webpack_require__(/*! @vue-devtools/shared-utils */ "../shared-utils/lib/index.js");
var rootInstances = [];
var rootUID = 0;
/**
 * Scan the page for root level Vue instances.
 */
function scan() {
    rootInstances.length = 0;
    var inFragment = false;
    var currentFragment = null;
    // eslint-disable-next-line no-inner-declarations
    function processInstance(instance) {
        if (instance) {
            if (rootInstances.indexOf(instance.$root) === -1) {
                instance = instance.$root;
            }
            if (instance._isFragment) {
                inFragment = true;
                currentFragment = instance;
            }
            // respect Vue.config.devtools option
            var baseVue = instance.constructor;
            while (baseVue.super) {
                baseVue = baseVue.super;
            }
            if (baseVue.config && baseVue.config.devtools) {
                // give a unique id to root instance so we can
                // 'namespace' its children
                if (typeof instance.__VUE_DEVTOOLS_ROOT_UID__ === 'undefined') {
                    instance.__VUE_DEVTOOLS_ROOT_UID__ = ++rootUID;
                }
                rootInstances.push(instance);
            }
            return true;
        }
    }
    if (shared_utils_1.isBrowser) {
        var walkDocument = function (document) {
            walk(document, function (node) {
                if (inFragment) {
                    if (node === currentFragment._fragmentEnd) {
                        inFragment = false;
                        currentFragment = null;
                    }
                    return true;
                }
                var instance = node.__vue__;
                return processInstance(instance);
            });
        };
        walkDocument(document);
        var iframes = document.querySelectorAll('iframe');
        for (var iframe of iframes) {
            try {
                walkDocument(iframe.contentDocument);
            }
            catch (e) {
                // Ignore
            }
        }
    }
    else {
        if (Array.isArray(shared_utils_1.target.__VUE_ROOT_INSTANCES__)) {
            shared_utils_1.target.__VUE_ROOT_INSTANCES__.map(processInstance);
        }
    }
    return rootInstances;
}
exports.scan = scan;
/**
 * DOM walk helper
 *
 * @param {NodeList} nodes
 * @param {Function} fn
 */
function walk(node, fn) {
    if (node.childNodes) {
        for (var i = 0, l = node.childNodes.length; i < l; i++) {
            var child = node.childNodes[i];
            var stop = fn(child);
            if (!stop) {
                walk(child, fn);
            }
        }
    }
    // also walk shadow DOM
    if (node.shadowRoot) {
        walk(node.shadowRoot, fn);
    }
}
//# sourceMappingURL=scan.js.map

/***/ }),

/***/ "../app-backend-core/lib/page-config.js":
/*!**********************************************!*\
  !*** ../app-backend-core/lib/page-config.js ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.initOnPageConfig = void 0;
var shared_utils_1 = __webpack_require__(/*! @vue-devtools/shared-utils */ "../shared-utils/lib/index.js");
var shared_data_1 = __importDefault(__webpack_require__(/*! @vue-devtools/shared-utils/lib/shared-data */ "../shared-utils/lib/shared-data.js"));
function initOnPageConfig() {
    // User project devtools config
    if (Object.hasOwnProperty.call(shared_utils_1.target, 'VUE_DEVTOOLS_CONFIG')) {
        var config = shared_utils_1.target.VUE_DEVTOOLS_CONFIG;
        // Open in editor
        if (Object.hasOwnProperty.call(config, 'openInEditorHost')) {
            shared_data_1.default.openInEditorHost = config.openInEditorHost;
        }
    }
}
exports.initOnPageConfig = initOnPageConfig;
//# sourceMappingURL=page-config.js.map

/***/ }),

/***/ "../app-backend-core/lib/perf.js":
/*!***************************************!*\
  !*** ../app-backend-core/lib/perf.js ***!
  \***************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.handleAddPerformanceTag = exports.performanceMarkEnd = exports.performanceMarkStart = void 0;
var shared_data_1 = __importDefault(__webpack_require__(/*! @vue-devtools/shared-utils/lib/shared-data */ "../shared-utils/lib/shared-data.js"));
var shared_utils_1 = __webpack_require__(/*! @vue-devtools/shared-utils */ "../shared-utils/lib/index.js");
var timeline_1 = __webpack_require__(/*! ./timeline */ "../app-backend-core/lib/timeline.js");
var app_1 = __webpack_require__(/*! ./app */ "../app-backend-core/lib/app.js");
var component_1 = __webpack_require__(/*! ./component */ "../app-backend-core/lib/component.js");
var subscriptions_1 = __webpack_require__(/*! ./util/subscriptions */ "../app-backend-core/lib/util/subscriptions.js");
async function performanceMarkStart(app, uid, instance, type, time, ctx) {
    try {
        if (!shared_data_1.default.performanceMonitoringEnabled)
            { return; }
        var appRecord = await app_1.getAppRecord(app, ctx);
        var componentName = await ctx.api.getComponentName(instance);
        var groupId = ctx.perfUniqueGroupId++;
        var groupKey = uid + "-" + type;
        appRecord.perfGroupIds.set(groupKey, { groupId: groupId, time: time });
        timeline_1.addTimelineEvent({
            layerId: 'performance',
            event: {
                time: time,
                data: {
                    component: componentName,
                    type: type,
                    measure: 'start'
                },
                title: componentName,
                subtitle: type,
                groupId: groupId
            }
        }, app, ctx);
    }
    catch (e) {
        if (true) {
            console.error(e);
        }
    }
}
exports.performanceMarkStart = performanceMarkStart;
async function performanceMarkEnd(app, uid, instance, type, time, ctx) {
    try {
        if (!shared_data_1.default.performanceMonitoringEnabled)
            { return; }
        var appRecord = await app_1.getAppRecord(app, ctx);
        var componentName = await ctx.api.getComponentName(instance);
        var groupKey = uid + "-" + type;
        var ref = appRecord.perfGroupIds.get(groupKey);
        var groupId = ref.groupId;
        var startTime = ref.time;
        var duration = time - startTime;
        timeline_1.addTimelineEvent({
            layerId: 'performance',
            event: {
                time: time,
                data: {
                    component: componentName,
                    type: type,
                    measure: 'end',
                    duration: {
                        _custom: {
                            type: 'Duration',
                            value: duration,
                            display: (duration + " ms")
                        }
                    }
                },
                title: componentName,
                subtitle: type,
                groupId: groupId
            }
        }, app, ctx);
        // Mark on component
        var tooSlow = duration > 10;
        if (tooSlow || instance.__VUE_DEVTOOLS_SLOW__) {
            var change = false;
            if (tooSlow && !instance.__VUE_DEVTOOLS_SLOW__) {
                instance.__VUE_DEVTOOLS_SLOW__ = {
                    duration: null,
                    measures: {}
                };
            }
            var data = instance.__VUE_DEVTOOLS_SLOW__;
            if (tooSlow && (data.duration == null || data.duration < duration)) {
                data.duration = duration;
                change = true;
            }
            if (data.measures[type] == null || data.measures[type] < duration) {
                data.measures[type] = duration;
                change = true;
            }
            if (change) {
                // Update component tree
                var id = await component_1.getComponentId(app, uid, ctx);
                if (subscriptions_1.isSubscribed(shared_utils_1.BridgeSubscriptions.COMPONENT_TREE, function (sub) { return sub.payload.instanceId === id; })) {
                    requestAnimationFrame(function () {
                        component_1.sendComponentTreeData(appRecord, id, ctx.currentAppRecord.componentFilter, null, ctx);
                    });
                }
            }
        }
    }
    catch (e) {
        if (true) {
            console.error(e);
        }
    }
}
exports.performanceMarkEnd = performanceMarkEnd;
function handleAddPerformanceTag(ctx) {
    ctx.api.on.visitComponentTree(function (payload) {
        if (payload.componentInstance.__VUE_DEVTOOLS_SLOW__) {
            var ref = payload.componentInstance.__VUE_DEVTOOLS_SLOW__;
            var duration = ref.duration;
            var measures = ref.measures;
            var tooltip = '<div class="grid grid-cols-2 gap-2 font-mono text-xs">';
            for (var type in measures) {
                var d = measures[type];
                tooltip += "<div>" + type + "</div><div class=\"text-right text-black rounded px-1 " + (d > 30 ? 'bg-red-400' : d > 10 ? 'bg-yellow-400' : 'bg-green-400') + "\">" + d + " ms</div>";
            }
            tooltip += '</div>';
            payload.treeNode.tags.push({
                backgroundColor: duration > 30 ? 0xF87171 : 0xFBBF24,
                textColor: 0x000000,
                label: (duration + " ms"),
                tooltip: tooltip
            });
        }
    });
}
exports.handleAddPerformanceTag = handleAddPerformanceTag;
//# sourceMappingURL=perf.js.map

/***/ }),

/***/ "../app-backend-core/lib/plugin.js":
/*!*****************************************!*\
  !*** ../app-backend-core/lib/plugin.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.serializePlugin = exports.sendPluginList = exports.addPreviouslyRegisteredPlugins = exports.addQueuedPlugins = exports.addPlugin = void 0;
var app_backend_api_1 = __webpack_require__(/*! @vue-devtools/app-backend-api */ "../app-backend-api/lib/index.js");
var shared_utils_1 = __webpack_require__(/*! @vue-devtools/shared-utils */ "../shared-utils/lib/index.js");
var app_1 = __webpack_require__(/*! ./app */ "../app-backend-core/lib/app.js");
function addPlugin(pluginDescriptor, setupFn, ctx) {
    var plugin = {
        descriptor: pluginDescriptor,
        setupFn: setupFn,
        error: null
    };
    ctx.currentPlugin = plugin;
    try {
        var api = new app_backend_api_1.DevtoolsPluginApiInstance(plugin, ctx);
        setupFn(api);
    }
    catch (e) {
        plugin.error = e;
        console.error(e);
    }
    ctx.currentPlugin = null;
    ctx.plugins.push(plugin);
    ctx.bridge.send(shared_utils_1.BridgeEvents.TO_FRONT_DEVTOOLS_PLUGIN_ADD, {
        plugin: serializePlugin(plugin)
    });
    var targetList = shared_utils_1.target.__VUE_DEVTOOLS_REGISTERED_PLUGINS__ = shared_utils_1.target.__VUE_DEVTOOLS_REGISTERED_PLUGINS__ || [];
    targetList.push({
        pluginDescriptor: pluginDescriptor,
        setupFn: setupFn
    });
}
exports.addPlugin = addPlugin;
async function addQueuedPlugins(ctx) {
    if (shared_utils_1.target.__VUE_DEVTOOLS_PLUGINS__ && Array.isArray(shared_utils_1.target.__VUE_DEVTOOLS_PLUGINS__)) {
        for (var plugin of shared_utils_1.target.__VUE_DEVTOOLS_PLUGINS__) {
            addPlugin(plugin.pluginDescriptor, plugin.setupFn, ctx);
        }
        shared_utils_1.target.__VUE_DEVTOOLS_PLUGINS__ = null;
    }
}
exports.addQueuedPlugins = addQueuedPlugins;
async function addPreviouslyRegisteredPlugins(ctx) {
    if (shared_utils_1.target.__VUE_DEVTOOLS_REGISTERED_PLUGINS__ && Array.isArray(shared_utils_1.target.__VUE_DEVTOOLS_REGISTERED_PLUGINS__)) {
        for (var plugin of shared_utils_1.target.__VUE_DEVTOOLS_REGISTERED_PLUGINS__) {
            addPlugin(plugin.pluginDescriptor, plugin.setupFn, ctx);
        }
    }
}
exports.addPreviouslyRegisteredPlugins = addPreviouslyRegisteredPlugins;
function sendPluginList(ctx) {
    ctx.bridge.send(shared_utils_1.BridgeEvents.TO_FRONT_DEVTOOLS_PLUGIN_LIST, {
        plugins: ctx.plugins.map(function (p) { return serializePlugin(p); })
    });
}
exports.sendPluginList = sendPluginList;
function serializePlugin(plugin) {
    return {
        id: plugin.descriptor.id,
        label: plugin.descriptor.label,
        appId: app_1.getAppRecordId(plugin.descriptor.app),
        packageName: plugin.descriptor.packageName,
        homepage: plugin.descriptor.homepage,
        logo: plugin.descriptor.logo,
        componentStateTypes: plugin.descriptor.componentStateTypes
    };
}
exports.serializePlugin = serializePlugin;
//# sourceMappingURL=plugin.js.map

/***/ }),

/***/ "../app-backend-core/lib/timeline-builtins.js":
/*!****************************************************!*\
  !*** ../app-backend-core/lib/timeline-builtins.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.builtinLayers = void 0;
exports.builtinLayers = [
    {
        id: 'mouse',
        label: 'Mouse',
        color: 0xA451AF,
        screenshotOverlayRender: function screenshotOverlayRender(event, ref) {
            var events = ref.events;

            var samePositionEvent = events.find(function (e) { return e !== event && e.renderMeta.textEl && e.data.x === event.data.x && e.data.y === event.data.y; });
            if (samePositionEvent) {
                var text$1 = document.createElement('div');
                text$1.innerText = event.data.type;
                samePositionEvent.renderMeta.textEl.appendChild(text$1);
                return false;
            }
            var div = document.createElement('div');
            div.style.position = 'absolute';
            div.style.left = (event.data.x - 4) + "px";
            div.style.top = (event.data.y - 4) + "px";
            div.style.width = '8px';
            div.style.height = '8px';
            div.style.borderRadius = '100%';
            div.style.backgroundColor = 'rgba(164, 81, 175, 0.5)';
            var text = document.createElement('div');
            text.innerText = event.data.type;
            text.style.color = '#541e5b';
            text.style.fontFamily = 'monospace';
            text.style.fontSize = '9px';
            text.style.position = 'absolute';
            text.style.left = '10px';
            text.style.top = '10px';
            text.style.padding = '1px';
            text.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
            text.style.borderRadius = '3px';
            div.appendChild(text);
            event.renderMeta.textEl = text;
            return div;
        }
    },
    {
        id: 'keyboard',
        label: 'Keyboard',
        color: 0x8151AF
    },
    {
        id: 'component-event',
        label: 'Component events',
        color: 0x41B883,
        screenshotOverlayRender: function (event, ref) {
            var events = ref.events;

            if (!event.meta.bounds || events.some(function (e) { return e !== event && e.layerId === event.layerId && e.renderMeta.drawn && (e.meta.componentId === event.meta.componentId || (e.meta.bounds.left === event.meta.bounds.left &&
                e.meta.bounds.top === event.meta.bounds.top &&
                e.meta.bounds.width === event.meta.bounds.width &&
                e.meta.bounds.height === event.meta.bounds.height)); })) {
                return false;
            }
            var div = document.createElement('div');
            div.style.position = 'absolute';
            div.style.left = (event.meta.bounds.left - 4) + "px";
            div.style.top = (event.meta.bounds.top - 4) + "px";
            div.style.width = (event.meta.bounds.width) + "px";
            div.style.height = (event.meta.bounds.height) + "px";
            div.style.borderRadius = '8px';
            div.style.borderStyle = 'solid';
            div.style.borderWidth = '4px';
            div.style.borderColor = 'rgba(65, 184, 131, 0.5)';
            div.style.textAlign = 'center';
            div.style.display = 'flex';
            div.style.alignItems = 'center';
            div.style.justifyContent = 'center';
            div.style.overflow = 'hidden';
            var text = document.createElement('div');
            text.style.color = '#267753';
            text.style.fontFamily = 'monospace';
            text.style.fontSize = '9px';
            text.style.padding = '1px';
            text.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
            text.style.borderRadius = '3px';
            text.innerText = event.data.event;
            div.appendChild(text);
            event.renderMeta.drawn = true;
            return div;
        }
    },
    {
        id: 'performance',
        label: 'Performance',
        color: 0x41b86a,
        groupsOnly: true,
        skipScreenshots: true,
        ignoreNoDurationGroups: true
    }
];
//# sourceMappingURL=timeline-builtins.js.map

/***/ }),

/***/ "../app-backend-core/lib/timeline-screenshot.js":
/*!******************************************************!*\
  !*** ../app-backend-core/lib/timeline-screenshot.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.showScreenshot = void 0;
var queue_1 = __webpack_require__(/*! ./util/queue */ "../app-backend-core/lib/util/queue.js");
var timeline_builtins_1 = __webpack_require__(/*! ./timeline-builtins */ "../app-backend-core/lib/timeline-builtins.js");
var overlay;
var image;
var container;
var jobQueue = new queue_1.JobQueue();
async function showScreenshot(screenshot, ctx) {
    await jobQueue.queue(async function () {
        if (screenshot) {
            if (!container) {
                createElements();
            }
            image.src = screenshot.image;
            clearContent();
            var events = screenshot.events.map(function (id) { return ctx.timelineEventMap.get(id); }).filter(Boolean).map(function (eventData) { return ({
                layer: timeline_builtins_1.builtinLayers.concat(ctx.timelineLayers).find(function (layer) { return layer.id === eventData.layerId; }),
                event: Object.assign({}, eventData.event,
                    {layerId: eventData.layerId,
                    renderMeta: {}})
            }); });
            var renderContext = {
                screenshot: screenshot,
                events: events.map(function (ref) {
                    var event = ref.event;

                    return event;
            }),
                index: 0
            };
            for (var i = 0; i < events.length; i++) {
                var ref = events[i];
                var layer = ref.layer;
                var event = ref.event;
                if (layer.screenshotOverlayRender) {
                    renderContext.index = i;
                    try {
                        var result = await layer.screenshotOverlayRender(event, renderContext);
                        if (result !== false) {
                            if (typeof result === 'string') {
                                container.innerHTML += result;
                            }
                            else {
                                container.appendChild(result);
                            }
                        }
                    }
                    catch (e) {
                        console.error(e);
                    }
                }
            }
            showElement();
        }
        else {
            hideElement();
        }
    });
}
exports.showScreenshot = showScreenshot;
function createElements() {
    overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.zIndex = '9999999999999';
    overlay.style.pointerEvents = 'none';
    overlay.style.left = '0';
    overlay.style.top = '0';
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
    overlay.style.overflow = 'hidden';
    var imageBox = document.createElement('div');
    imageBox.style.position = 'relative';
    overlay.appendChild(imageBox);
    image = document.createElement('img');
    imageBox.appendChild(image);
    container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '0';
    container.style.top = '0';
    imageBox.appendChild(container);
    var style = document.createElement('style');
    style.innerHTML = '.__vuedevtools_no-scroll { overflow: hidden; }';
    document.head.appendChild(style);
}
function showElement() {
    if (!overlay.parentNode) {
        document.body.appendChild(overlay);
        document.body.classList.add('__vuedevtools_no-scroll');
    }
}
function hideElement() {
    if (overlay && overlay.parentNode) {
        overlay.parentNode.removeChild(overlay);
        document.body.classList.remove('__vuedevtools_no-scroll');
        clearContent();
    }
}
function clearContent() {
    while (container.firstChild) {
        container.removeChild(container.lastChild);
    }
}
//# sourceMappingURL=timeline-screenshot.js.map

/***/ }),

/***/ "../app-backend-core/lib/timeline.js":
/*!*******************************************!*\
  !*** ../app-backend-core/lib/timeline.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.sendTimelineLayerEvents = exports.removeLayersForApp = exports.sendTimelineEventData = exports.clearTimeline = exports.addTimelineEvent = exports.sendTimelineLayers = exports.addBuiltinLayers = exports.setupTimeline = void 0;
var shared_utils_1 = __webpack_require__(/*! @vue-devtools/shared-utils */ "../shared-utils/lib/index.js");
var global_hook_1 = __webpack_require__(/*! ./global-hook */ "../app-backend-core/lib/global-hook.js");
var app_1 = __webpack_require__(/*! ./app */ "../app-backend-core/lib/app.js");
var timeline_builtins_1 = __webpack_require__(/*! ./timeline-builtins */ "../app-backend-core/lib/timeline-builtins.js");
function setupTimeline(ctx) {
    setupBuiltinLayers(ctx);
}
exports.setupTimeline = setupTimeline;
function addBuiltinLayers(app, ctx) {
    for (var layerDef of timeline_builtins_1.builtinLayers) {
        ctx.timelineLayers.push(Object.assign({}, layerDef,
            {app: app,
            plugin: null,
            events: []}));
    }
}
exports.addBuiltinLayers = addBuiltinLayers;
function setupBuiltinLayers(ctx) {
    ['mousedown', 'mouseup', 'click', 'dblclick'].forEach(function (eventType) {
        // @ts-ignore
        window.addEventListener(eventType, function (event) {
            addTimelineEvent({
                layerId: 'mouse',
                event: {
                    time: Date.now(),
                    data: {
                        type: eventType,
                        x: event.clientX,
                        y: event.clientY
                    },
                    title: eventType
                }
            }, null, ctx);
        }, {
            capture: true,
            passive: true
        });
    });
    ['keyup', 'keydown', 'keypress'].forEach(function (eventType) {
        // @ts-ignore
        window.addEventListener(eventType, function (event) {
            addTimelineEvent({
                layerId: 'keyboard',
                event: {
                    time: Date.now(),
                    data: {
                        type: eventType,
                        key: event.key,
                        ctrlKey: event.ctrlKey,
                        shiftKey: event.shiftKey,
                        altKey: event.altKey,
                        metaKey: event.metaKey
                    },
                    title: event.key
                }
            }, null, ctx);
        }, {
            capture: true,
            passive: true
        });
    });
    global_hook_1.hook.on(shared_utils_1.HookEvents.COMPONENT_EMIT, async function (app, instance, event, params) {
        try {
            var appRecord = await app_1.getAppRecord(app, ctx);
            var componentId = (appRecord.id) + ":" + (instance.uid);
            var componentDisplay = (await ctx.api.getComponentName(instance)) || '<i>Unknown Component</i>';
            addTimelineEvent({
                layerId: 'component-event',
                event: {
                    time: Date.now(),
                    data: {
                        component: {
                            _custom: {
                                type: 'component-definition',
                                display: componentDisplay
                            }
                        },
                        event: event,
                        params: params
                    },
                    title: event,
                    subtitle: ("by " + componentDisplay),
                    meta: {
                        componentId: componentId,
                        bounds: await ctx.api.getComponentBounds(instance)
                    }
                }
            }, app, ctx);
        }
        catch (e) {
            if (true) {
                console.error(e);
            }
        }
    });
}
async function sendTimelineLayers(ctx) {
    var _a, _b;
    var layers = [];
    for (var layer of ctx.timelineLayers) {
        try {
            layers.push({
                id: layer.id,
                label: layer.label,
                color: layer.color,
                appId: layer.app ? (_a = (await app_1.getAppRecord(layer.app, ctx))) === null || _a === void 0 ? void 0 : _a.id : null,
                pluginId: (_b = layer.plugin) === null || _b === void 0 ? void 0 : _b.descriptor.id,
                groupsOnly: layer.groupsOnly,
                skipScreenshots: layer.skipScreenshots,
                ignoreNoDurationGroups: layer.ignoreNoDurationGroups
            });
        }
        catch (e) {
            if (true) {
                console.error(e);
            }
        }
    }
    ctx.bridge.send(shared_utils_1.BridgeEvents.TO_FRONT_TIMELINE_LAYER_LIST, {
        layers: layers
    });
}
exports.sendTimelineLayers = sendTimelineLayers;
function addTimelineEvent(options, app, ctx) {
    var appId = app && app_1.getAppRecordId(app);
    var isAllApps = options.all || !app || appId == null;
    var id = ctx.nextTimelineEventId++;
    var eventData = Object.assign({}, {id: id},
        options,
        {all: isAllApps});
    ctx.timelineEventMap.set(eventData.id, eventData);
    ctx.bridge.send(shared_utils_1.BridgeEvents.TO_FRONT_TIMELINE_EVENT, {
        appId: eventData.all ? 'all' : appId,
        layerId: eventData.layerId,
        event: mapTimelineEvent(eventData)
    });
    var layer = ctx.timelineLayers.find(function (l) { return (isAllApps || l.app === app) && l.id === options.layerId; });
    if (layer) {
        layer.events.push(eventData);
    }
}
exports.addTimelineEvent = addTimelineEvent;
function mapTimelineEvent(eventData) {
    return {
        id: eventData.id,
        time: eventData.event.time,
        logType: eventData.event.logType,
        groupId: eventData.event.groupId,
        title: eventData.event.title,
        subtitle: eventData.event.subtitle
    };
}
async function clearTimeline(ctx) {
    ctx.timelineEventMap.clear();
    for (var layer of ctx.timelineLayers) {
        layer.events = [];
    }
    await ctx.api.clearTimeline();
}
exports.clearTimeline = clearTimeline;
async function sendTimelineEventData(id, ctx) {
    var data = null;
    var eventData = ctx.timelineEventMap.get(id);
    if (eventData) {
        data = await ctx.api.inspectTimelineEvent(eventData, ctx.currentAppRecord.options.app);
        data = shared_utils_1.stringify(data);
    }
    else if (true) {
        console.warn(("Event " + id + " not found"), ctx.timelineEventMap.keys());
    }
    ctx.bridge.send(shared_utils_1.BridgeEvents.TO_FRONT_TIMELINE_EVENT_DATA, {
        eventId: id,
        data: data
    });
}
exports.sendTimelineEventData = sendTimelineEventData;
function removeLayersForApp(app, ctx) {
    var layers = ctx.timelineLayers.filter(function (l) { return l.app === app; });
    for (var layer of layers) {
        var index = ctx.timelineLayers.indexOf(layer);
        if (index !== -1)
            { ctx.timelineLayers.splice(index, 1); }
        for (var e of layer.events) {
            ctx.timelineEventMap.delete(e.id);
        }
    }
}
exports.removeLayersForApp = removeLayersForApp;
function sendTimelineLayerEvents(appId, layerId, ctx) {
    var _a;
    var app = (_a = ctx.appRecords.find(function (ar) { return ar.id === appId; })) === null || _a === void 0 ? void 0 : _a.options.app;
    if (!app)
        { return; }
    var layer = ctx.timelineLayers.find(function (l) { return l.app === app && l.id === layerId; });
    if (!layer)
        { return; }
    ctx.bridge.send(shared_utils_1.BridgeEvents.TO_FRONT_TIMELINE_LAYER_LOAD_EVENTS, {
        appId: appId,
        layerId: layerId,
        events: layer.events.map(function (e) { return mapTimelineEvent(e); })
    });
}
exports.sendTimelineLayerEvents = sendTimelineLayerEvents;
//# sourceMappingURL=timeline.js.map

/***/ }),

/***/ "../app-backend-core/lib/toast.js":
/*!****************************************!*\
  !*** ../app-backend-core/lib/toast.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.installToast = void 0;
function installToast() {
    // @TODO
}
exports.installToast = installToast;
//# sourceMappingURL=toast.js.map

/***/ }),

/***/ "../app-backend-core/lib/util/queue.js":
/*!*********************************************!*\
  !*** ../app-backend-core/lib/util/queue.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JobQueue = void 0;
var JobQueue = function JobQueue() {
    this.jobs = [];
};
JobQueue.prototype.queue = function queue (job) {
        var this$1 = this;

    return new Promise(function (resolve) {
        var onDone = function () {
            this$1.currentJob = null;
            var nextJob = this$1.jobs.shift();
            if (nextJob) {
                nextJob();
            }
            resolve();
        };
        var run = function () {
            this$1.currentJob = job;
            return job().then(onDone);
        };
        if (this$1.currentJob) {
            this$1.jobs.push(function () { return run(); });
        }
        else {
            run();
        }
    });
};
exports.JobQueue = JobQueue;
//# sourceMappingURL=queue.js.map

/***/ }),

/***/ "../app-backend-core/lib/util/subscriptions.js":
/*!*****************************************************!*\
  !*** ../app-backend-core/lib/util/subscriptions.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isSubscribed = exports.unsubscribe = exports.subscribe = void 0;
var activeSubs = new Map();
function getSubs(type) {
    var subs = activeSubs.get(type);
    if (!subs) {
        subs = [];
        activeSubs.set(type, subs);
    }
    return subs;
}
function subscribe(type, payload) {
    var rawPayload = JSON.stringify(payload);
    getSubs(type).push({
        payload: payload,
        rawPayload: rawPayload
    });
}
exports.subscribe = subscribe;
function unsubscribe(type, payload) {
    var rawPayload = JSON.stringify(payload);
    var subs = getSubs(type);
    var index = subs.findIndex(function (sub) { return sub.rawPayload === rawPayload; });
    if (index !== -1) {
        subs.splice(index, 1);
    }
}
exports.unsubscribe = unsubscribe;
function isSubscribed(type, predicate) {
    if ( predicate === void 0 ) predicate = function () { return true; };

    return getSubs(type).some(predicate);
}
exports.isSubscribed = isSubscribed;
//# sourceMappingURL=subscriptions.js.map

/***/ }),

/***/ "../app-backend-vue1/lib/index.js":
/*!****************************************!*\
  !*** ../app-backend-vue1/lib/index.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.backend = void 0;
var app_backend_api_1 = __webpack_require__(/*! @vue-devtools/app-backend-api */ "../app-backend-api/lib/index.js");
exports.backend = {
    frameworkVersion: 1,
    availableFeatures: [
        app_backend_api_1.BuiltinBackendFeature.COMPONENTS
    ],
    setup: function setup(api) {
        // @TODO
    }
};
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "../app-backend-vue2/lib/components/data.js":
/*!**************************************************!*\
  !*** ../app-backend-vue2/lib/components/data.js ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.editState = exports.findInstanceOrVnode = exports.getInstanceName = exports.reduceStateList = exports.getCustomInstanceDetails = exports.getInstanceDetails = void 0;
var shared_utils_1 = __webpack_require__(/*! @vue-devtools/shared-utils */ "../shared-utils/lib/index.js");
var shared_data_1 = __importDefault(__webpack_require__(/*! @vue-devtools/shared-utils/lib/shared-data */ "../shared-utils/lib/shared-data.js"));
var tree_1 = __webpack_require__(/*! ./tree */ "../app-backend-vue2/lib/components/tree.js");
/**
 * Get the detailed information of an inspected instance.
 */
function getInstanceDetails(instance) {
    var _a, _b;
    if (instance.__VUE_DEVTOOLS_FUNCTIONAL_LEGACY__) {
        var vnode = findInstanceOrVnode(instance.__VUE_DEVTOOLS_UID__);
        if (!vnode)
            { return null; }
        var fakeInstance = Object.assign({}, {$options: vnode.fnOptions},
            ((_a = vnode.devtoolsMeta) === null || _a === void 0 ? void 0 : _a.renderContext.props));
        if (!fakeInstance.$options.props && ((_b = vnode.devtoolsMeta) === null || _b === void 0 ? void 0 : _b.renderContext.props)) {
            fakeInstance.$options.props = Object.keys(vnode.devtoolsMeta.renderContext.props).reduce(function (obj, key) {
                obj[key] = {};
                return obj;
            }, {});
        }
        var data$1 = {
            id: instance.__VUE_DEVTOOLS_UID__,
            name: shared_utils_1.getComponentName(vnode.fnOptions),
            file: instance.type ? instance.type.__file : vnode.fnOptions.__file || null,
            state: getFunctionalInstanceState(fakeInstance),
            functional: true
        };
        return data$1;
    }
    var data = {
        id: instance.__VUE_DEVTOOLS_UID__,
        name: getInstanceName(instance),
        state: getInstanceState(instance),
        file: null
    };
    var i;
    if ((i = instance.$vnode) && (i = i.componentOptions) && (i = i.Ctor) && (i = i.options)) {
        data.file = i.__file || null;
    }
    return data;
}
exports.getInstanceDetails = getInstanceDetails;
function getInstanceState(instance) {
    return processProps(instance).concat(processState(instance), processRefs(instance), processComputed(instance), processInjected(instance), processRouteContext(instance), processVuexGetters(instance), processFirebaseBindings(instance), processObservables(instance), processAttrs(instance));
}
function getFunctionalInstanceState(instance) {
    return processProps(instance);
}
function getCustomInstanceDetails(instance) {
    var state = getInstanceState(instance);
    return {
        _custom: {
            type: 'component',
            id: instance.__VUE_DEVTOOLS_UID__,
            display: getInstanceName(instance),
            tooltip: 'Component instance',
            value: reduceStateList(state),
            fields: {
                abstract: true
            }
        }
    };
}
exports.getCustomInstanceDetails = getCustomInstanceDetails;
function reduceStateList(list) {
    if (!list.length) {
        return undefined;
    }
    return list.reduce(function (map, item) {
        var key = item.type || 'data';
        var obj = map[key] = map[key] || {};
        obj[item.key] = item.value;
        return map;
    }, {});
}
exports.reduceStateList = reduceStateList;
/**
 * Get the appropriate display name for an instance.
 */
function getInstanceName(instance) {
    var name = shared_utils_1.getComponentName(instance.$options || instance.fnOptions || {});
    if (name)
        { return name; }
    return instance.$root === instance
        ? 'Root'
        : 'Anonymous Component';
}
exports.getInstanceName = getInstanceName;
/**
 * Process the props of an instance.
 * Make sure return a plain object because window.postMessage()
 * will throw an Error if the passed object contains Functions.
 */
function processProps(instance) {
    var props = instance.$options.props;
    var propsData = [];
    for (var key in props) {
        var prop = props[key];
        key = shared_utils_1.camelize(key);
        propsData.push({
            type: 'props',
            key: key,
            value: instance[key],
            meta: prop
                ? {
                    type: prop.type ? getPropType(prop.type) : 'any',
                    required: !!prop.required
                }
                : {
                    type: 'invalid'
                },
            editable: shared_data_1.default.editableProps
        });
    }
    return propsData;
}
function processAttrs(instance) {
    return Object.entries(instance.$attrs || {}).map(function (ref) {
        var key = ref[0];
        var value = ref[1];

        return {
            type: '$attrs',
            key: key,
            value: value
        };
    });
}
var fnTypeRE = /^(?:function|class) (\w+)/;
/**
 * Convert prop type constructor to string.
 */
function getPropType(type) {
    if (Array.isArray(type)) {
        return type.map(function (t) { return getPropType(t); }).join(' or ');
    }
    var match = type.toString().match(fnTypeRE);
    return typeof type === 'function'
        ? (match && match[1]) || 'any'
        : 'any';
}
/**
 * Process state, filtering out props and "clean" the result
 * with a JSON dance. This removes functions which can cause
 * errors during structured clone used by window.postMessage.
 */
function processState(instance) {
    var props = instance.$options.props;
    var getters = instance.$options.vuex &&
        instance.$options.vuex.getters;
    return Object.keys(instance._data)
        .filter(function (key) { return (!(props && key in props) &&
        !(getters && key in getters)); })
        .map(function (key) { return ({
        key: key,
        type: 'data',
        value: instance._data[key],
        editable: true
    }); });
}
/**
 * Process refs
 */
function processRefs(instance) {
    return Object.keys(instance.$refs)
        .filter(function (key) { return instance.$refs[key]; })
        .map(function (key) { return shared_utils_1.getCustomRefDetails(instance, key, instance.$refs[key]); });
}
/**
 * Process the computed properties of an instance.
 */
function processComputed(instance) {
    var computed = [];
    var defs = instance.$options.computed || {};
    // use for...in here because if 'computed' is not defined
    // on component, computed properties will be placed in prototype
    // and Object.keys does not include
    // properties from object's prototype
    for (var key in defs) {
        var def = defs[key];
        var type = typeof def === 'function' && def.vuex
            ? 'vuex bindings'
            : 'computed';
        // use try ... catch here because some computed properties may
        // throw error during its evaluation
        var computedProp = null;
        try {
            computedProp = {
                type: type,
                key: key,
                value: instance[key]
            };
        }
        catch (e) {
            computedProp = {
                type: type,
                key: key,
                value: e
            };
        }
        computed.push(computedProp);
    }
    return computed;
}
/**
 * Process Vuex getters.
 */
function processInjected(instance) {
    var injected = instance.$options.inject;
    if (injected) {
        return Object.keys(injected).map(function (key) {
            return {
                key: key,
                type: 'injected',
                value: instance[key]
            };
        });
    }
    else {
        return [];
    }
}
/**
 * Process possible vue-router $route context
 */
function processRouteContext(instance) {
    try {
        var route = instance.$route;
        if (route) {
            var path = route.path;
            var query = route.query;
            var params = route.params;
            var value = { path: path, query: query, params: params };
            if (route.fullPath)
                { value.fullPath = route.fullPath; }
            if (route.hash)
                { value.hash = route.hash; }
            if (route.name)
                { value.name = route.name; }
            if (route.meta)
                { value.meta = route.meta; }
            return [{
                    key: '$route',
                    type: 'route',
                    value: {
                        _custom: {
                            type: 'router',
                            abstract: true,
                            value: value
                        }
                    }
                }];
        }
    }
    catch (e) {
        // Invalid $router
    }
    return [];
}
/**
 * Process Vuex getters.
 */
function processVuexGetters(instance) {
    var getters = instance.$options.vuex &&
        instance.$options.vuex.getters;
    if (getters) {
        return Object.keys(getters).map(function (key) {
            return {
                type: 'vuex getters',
                key: key,
                value: instance[key]
            };
        });
    }
    else {
        return [];
    }
}
/**
 * Process Firebase bindings.
 */
function processFirebaseBindings(instance) {
    var refs = instance.$firebaseRefs;
    if (refs) {
        return Object.keys(refs).map(function (key) {
            return {
                type: 'firebase bindings',
                key: key,
                value: instance[key]
            };
        });
    }
    else {
        return [];
    }
}
/**
 * Process vue-rx observable bindings.
 */
function processObservables(instance) {
    var obs = instance.$observables;
    if (obs) {
        return Object.keys(obs).map(function (key) {
            return {
                type: 'observables',
                key: key,
                value: instance[key]
            };
        });
    }
    else {
        return [];
    }
}
function findInstanceOrVnode(id) {
    if (/:functional:/.test(id)) {
        var ref = id.split(':functional:');
        var refId = ref[0];
        var map = tree_1.functionalVnodeMap.get(refId);
        return map && map[id];
    }
    return tree_1.instanceMap.get(id);
}
exports.findInstanceOrVnode = findInstanceOrVnode;
function editState(ref) {
    var componentInstance = ref.componentInstance;
    var path = ref.path;
    var state = ref.state;
    var type = ref.type;

    if (!['data', 'props', 'computed', 'setup'].includes(type))
        { return; }
    var data = shared_utils_1.has(componentInstance._props, path, !!state.newKey)
        ? componentInstance._props
        : componentInstance._data;
    shared_utils_1.set(data, path, state.value, function (obj, field, value) {
        if (state.remove || state.newKey)
            { componentInstance.$delete(obj, field); }
        if (!state.remove)
            { componentInstance.$set(obj, state.newKey || field, value); }
    });
}
exports.editState = editState;
//# sourceMappingURL=data.js.map

/***/ }),

/***/ "../app-backend-vue2/lib/components/el.js":
/*!************************************************!*\
  !*** ../app-backend-vue2/lib/components/el.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.findRelatedComponent = exports.getInstanceOrVnodeRect = void 0;
var shared_utils_1 = __webpack_require__(/*! @vue-devtools/shared-utils */ "../shared-utils/lib/index.js");
function createRect() {
    var rect = {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        get width() { return rect.right - rect.left; },
        get height() { return rect.bottom - rect.top; }
    };
    return rect;
}
function mergeRects(a, b) {
    if (!a.top || b.top < a.top) {
        a.top = b.top;
    }
    if (!a.bottom || b.bottom > a.bottom) {
        a.bottom = b.bottom;
    }
    if (!a.left || b.left < a.left) {
        a.left = b.left;
    }
    if (!a.right || b.right > a.right) {
        a.right = b.right;
    }
    return a;
}
/**
 * Get the client rect for an instance.
 */
function getInstanceOrVnodeRect(instance) {
    var el = instance.$el || instance.elm;
    if (!shared_utils_1.isBrowser) {
        // TODO: Find position from instance or a vnode (for functional components).
        return;
    }
    if (!shared_utils_1.inDoc(el)) {
        return;
    }
    if (instance._isFragment) {
        return addIframePosition(getLegacyFragmentRect(instance), getElWindow(instance.$root.$el));
    }
    else if (el.nodeType === 1) {
        return addIframePosition(el.getBoundingClientRect(), getElWindow(el));
    }
}
exports.getInstanceOrVnodeRect = getInstanceOrVnodeRect;
/**
 * Highlight a fragment instance.
 * Loop over its node range and determine its bounding box.
 */
function getLegacyFragmentRect(ref) {
    var _fragmentStart = ref._fragmentStart;
    var _fragmentEnd = ref._fragmentEnd;

    var rect = createRect();
    util().mapNodeRange(_fragmentStart, _fragmentEnd, function (node) {
        var childRect;
        if (node.nodeType === 1 || node.getBoundingClientRect) {
            childRect = node.getBoundingClientRect();
        }
        else if (node.nodeType === 3 && node.data.trim()) {
            childRect = getTextRect(node);
        }
        if (childRect) {
            mergeRects(rect, childRect);
        }
    });
    return rect;
}
var range;
/**
 * Get the bounding rect for a text node using a Range.
 */
function getTextRect(node) {
    if (!shared_utils_1.isBrowser)
        { return; }
    if (!range)
        { range = document.createRange(); }
    range.selectNode(node);
    return range.getBoundingClientRect();
}
/**
 * Get Vue's util
 */
function util() {
    return shared_utils_1.target.__VUE_DEVTOOLS_GLOBAL_HOOK__.Vue.util;
}
function findRelatedComponent(el) {
    while (!el.__vue__ && el.parentElement) {
        el = el.parentElement;
    }
    return el.__vue__;
}
exports.findRelatedComponent = findRelatedComponent;
function getElWindow(el) {
    return el.ownerDocument.defaultView;
}
function addIframePosition(bounds, win) {
    if (win.__VUE_DEVTOOLS_IFRAME__) {
        var rect = mergeRects(createRect(), bounds);
        var iframeBounds = win.__VUE_DEVTOOLS_IFRAME__.getBoundingClientRect();
        rect.top += iframeBounds.top;
        rect.bottom += iframeBounds.top;
        rect.left += iframeBounds.left;
        rect.right += iframeBounds.left;
        if (win.parent) {
            return addIframePosition(rect, win.parent);
        }
        return rect;
    }
    return bounds;
}
//# sourceMappingURL=el.js.map

/***/ }),

/***/ "../app-backend-vue2/lib/components/tree.js":
/*!**************************************************!*\
  !*** ../app-backend-vue2/lib/components/tree.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getComponentParents = exports.walkTree = exports.functionalVnodeMap = exports.instanceMap = void 0;
var shared_utils_1 = __webpack_require__(/*! @vue-devtools/shared-utils */ "../shared-utils/lib/index.js");
var el_1 = __webpack_require__(/*! ./el */ "../app-backend-vue2/lib/components/el.js");
var util_1 = __webpack_require__(/*! ./util */ "../app-backend-vue2/lib/components/util.js");
var appRecord;
var consoleBoundInstances = Array(5);
var filter = '';
var functionalIds = new Map();
// Dedupe instances
// Some instances may be both on a component and on a child abstract/functional component
var captureIds = new Map();
function walkTree(instance, pFilter, ctx) {
    initCtx(ctx);
    filter = pFilter;
    functionalIds.clear();
    captureIds.clear();
    var result = findQualifiedChildren(instance);
    if (Array.isArray(result)) {
        return result;
    }
    return [result];
}
exports.walkTree = walkTree;
function getComponentParents(instance, ctx) {
    initCtx(ctx);
    var captureIds = new Map();
    var captureId = function (vm) {
        var id = util_1.getUniqueId(vm);
        if (captureIds.has(id))
            { return; }
        captureIds.set(id, undefined);
        mark(vm);
    };
    var parents = [];
    captureId(instance);
    var parent = instance;
    while ((parent = parent.$parent)) {
        captureId(parent);
        parents.push(parent);
    }
    return parents;
}
exports.getComponentParents = getComponentParents;
function initCtx(ctx) {
    appRecord = ctx.currentAppRecord;
    if (!appRecord.meta.instanceMap) {
        appRecord.meta.instanceMap = new Map();
    }
    exports.instanceMap = appRecord.meta.instanceMap;
    if (!appRecord.meta.functionalVnodeMap) {
        appRecord.meta.functionalVnodeMap = new Map();
    }
    exports.functionalVnodeMap = appRecord.meta.functionalVnodeMap;
}
/**
 * Iterate through an array of instances and flatten it into
 * an array of qualified instances. This is a depth-first
 * traversal - e.g. if an instance is not matched, we will
 * recursively go deeper until a qualified child is found.
 */
function findQualifiedChildrenFromList(instances) {
    instances = instances
        .filter(function (child) { return !util_1.isBeingDestroyed(child); });
    return !filter
        ? instances.map(capture)
        : Array.prototype.concat.apply([], instances.map(findQualifiedChildren));
}
/**
 * Find qualified children from a single instance.
 * If the instance itself is qualified, just return itself.
 * This is ok because [].concat works in both cases.
 */
function findQualifiedChildren(instance) {
    if (isQualified(instance)) {
        return capture(instance);
    }
    else {
        return findQualifiedChildrenFromList(instance.$children).concat(instance._vnode && instance._vnode.children
            // Find functional components in recursively in non-functional vnodes.
            ? flatten(instance._vnode.children.filter(function (child) { return !child.componentInstance; }).map(captureChild))
                // Filter qualified children.
                .filter(function (instance) { return isQualified(instance); })
            : []);
    }
}
/**
 * Get children from a component instance.
 */
function getInternalInstanceChildren(instance) {
    if (instance.$children) {
        return instance.$children;
    }
    if (Array.isArray(instance.subTree.children)) {
        return instance.subTree.children.filter(function (vnode) { return !!vnode.component; }).map(function (vnode) { return vnode.component; });
    }
    return [];
}
/**
 * Check if an instance is qualified.
 */
function isQualified(instance) {
    var name = shared_utils_1.classify(util_1.getInstanceName(instance)).toLowerCase();
    return name.indexOf(filter) > -1;
}
function flatten(items) {
    return items.reduce(function (acc, item) {
        if (item instanceof Array)
            { acc.push.apply(acc, flatten(item)); }
        else if (item)
            { acc.push(item); }
        return acc;
    }, []);
}
function captureChild(child) {
    if (child.fnContext && !child.componentInstance) {
        return capture(child);
    }
    else if (child.componentInstance) {
        if (!util_1.isBeingDestroyed(child.componentInstance))
            { return capture(child.componentInstance); }
    }
    else if (child.children) {
        return flatten(child.children.map(captureChild));
    }
}
/**
 * Capture the meta information of an instance. (recursive)
 */
function capture(instance, index, list) {
    var _a, _b;
    if (instance.__VUE_DEVTOOLS_FUNCTIONAL_LEGACY__) {
        instance = instance.vnode;
    }
    if (instance.$options && instance.$options.abstract && instance._vnode && instance._vnode.componentInstance) {
        instance = instance._vnode.componentInstance;
    }
    if ((_b = (_a = instance.$options) === null || _a === void 0 ? void 0 : _a.devtools) === null || _b === void 0 ? void 0 : _b.hide)
        { return; }
    // Functional component.
    if (instance.fnContext && !instance.componentInstance) {
        var contextUid = instance.fnContext.__VUE_DEVTOOLS_UID__;
        var id = functionalIds.get(contextUid);
        if (id == null) {
            id = 0;
        }
        else {
            id++;
        }
        functionalIds.set(contextUid, id);
        var functionalId = contextUid + ':functional:' + id;
        markFunctional(functionalId, instance);
        var children$1 = (instance.children
            ? instance.children.map(function (child) { return child.fnContext
                ? captureChild(child)
                : child.componentInstance
                    ? capture(child.componentInstance)
                    : undefined; })
            // router-view has both fnContext and componentInstance on vnode.
            : instance.componentInstance ? [capture(instance.componentInstance)] : []).filter(Boolean);
        return {
            uid: functionalId,
            id: functionalId,
            tags: [
                {
                    label: 'functional',
                    textColor: 0x555555,
                    backgroundColor: 0xeeeeee
                }
            ],
            name: util_1.getInstanceName(instance),
            renderKey: util_1.getRenderKey(instance.key),
            children: children$1,
            hasChildren: !!children$1.length,
            inactive: false,
            isFragment: false // TODO: Check what is it for.
        };
    }
    // instance._uid is not reliable in devtools as there
    // may be 2 roots with same _uid which causes unexpected
    // behaviour
    instance.__VUE_DEVTOOLS_UID__ = util_1.getUniqueId(instance);
    // Dedupe
    if (captureIds.has(instance.__VUE_DEVTOOLS_UID__)) {
        return;
    }
    else {
        captureIds.set(instance.__VUE_DEVTOOLS_UID__, undefined);
    }
    mark(instance);
    var name = util_1.getInstanceName(instance);
    var children = getInternalInstanceChildren(instance)
        .filter(function (child) { return !util_1.isBeingDestroyed(child); })
        .map(capture)
        .filter(Boolean);
    var ret = {
        uid: instance._uid,
        id: instance.__VUE_DEVTOOLS_UID__,
        name: name,
        renderKey: util_1.getRenderKey(instance.$vnode ? instance.$vnode.key : null),
        inactive: !!instance._inactive,
        isFragment: !!instance._isFragment,
        children: children,
        hasChildren: !!children.length,
        tags: [],
        meta: {}
    };
    if (instance._vnode && instance._vnode.children) {
        ret.children = ret.children.concat(flatten(instance._vnode.children.map(captureChild))
            .filter(Boolean));
        ret.hasChildren = !!ret.children.length;
    }
    // record screen position to ensure correct ordering
    if ((!list || list.length > 1) && !instance._inactive) {
        var rect = el_1.getInstanceOrVnodeRect(instance);
        ret.positionTop = rect ? rect.top : Infinity;
    }
    else {
        ret.positionTop = Infinity;
    }
    // check if instance is available in console
    var consoleId = consoleBoundInstances.indexOf(instance.__VUE_DEVTOOLS_UID__);
    ret.consoleId = consoleId > -1 ? '$vm' + consoleId : null;
    // check router view
    var isRouterView2 = instance.$vnode && instance.$vnode.data.routerView;
    if (instance._routerView || isRouterView2) {
        ret.isRouterView = true;
        if (!instance._inactive && instance.$route) {
            var matched = instance.$route.matched;
            var depth = isRouterView2
                ? instance.$vnode.data.routerViewDepth
                : instance._routerView.depth;
            ret.meta.matchedRouteSegment =
                matched &&
                    matched[depth] &&
                    (isRouterView2 ? matched[depth].path : matched[depth].handler.path);
        }
        ret.tags.push({
            label: ("router-view" + (ret.meta.matchedRouteSegment ? (": " + (ret.meta.matchedRouteSegment)) : '')),
            textColor: 0x000000,
            backgroundColor: 0xff8344
        });
    }
    return ret;
}
/**
 * Mark an instance as captured and store it in the instance map.
 *
 * @param {Vue} instance
 */
function mark(instance) {
    var refId = instance.__VUE_DEVTOOLS_UID__;
    if (!exports.instanceMap.has(refId)) {
        exports.instanceMap.set(refId, instance);
        appRecord.instanceMap.set(refId, instance);
        instance.$on('hook:beforeDestroy', function () {
            exports.instanceMap.delete(refId);
        });
    }
}
function markFunctional(id, vnode) {
    var refId = vnode.fnContext.__VUE_DEVTOOLS_UID__;
    if (!exports.functionalVnodeMap.has(refId)) {
        exports.functionalVnodeMap.set(refId, {});
        vnode.fnContext.$on('hook:beforeDestroy', function () {
            exports.functionalVnodeMap.delete(refId);
        });
    }
    exports.functionalVnodeMap.get(refId)[id] = vnode;
    appRecord.instanceMap.set(id, {
        __VUE_DEVTOOLS_UID__: id,
        __VUE_DEVTOOLS_FUNCTIONAL_LEGACY__: true,
        vnode: vnode
    });
}
//# sourceMappingURL=tree.js.map

/***/ }),

/***/ "../app-backend-vue2/lib/components/util.js":
/*!**************************************************!*\
  !*** ../app-backend-vue2/lib/components/util.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getUniqueId = exports.getRenderKey = exports.getInstanceName = exports.isBeingDestroyed = void 0;
var shared_utils_1 = __webpack_require__(/*! @vue-devtools/shared-utils */ "../shared-utils/lib/index.js");
function isBeingDestroyed(instance) {
    return instance._isBeingDestroyed;
}
exports.isBeingDestroyed = isBeingDestroyed;
/**
 * Get the appropriate display name for an instance.
 */
function getInstanceName(instance) {
    var name = shared_utils_1.getComponentName(instance.$options || instance.fnOptions || {});
    if (name)
        { return name; }
    return instance.$root === instance
        ? 'Root'
        : 'Anonymous Component';
}
exports.getInstanceName = getInstanceName;
function getRenderKey(value) {
    if (value == null)
        { return; }
    var type = typeof value;
    if (type === 'number') {
        return value.toString();
    }
    else if (type === 'string') {
        return ("'" + value + "'");
    }
    else if (Array.isArray(value)) {
        return 'Array';
    }
    else {
        return 'Object';
    }
}
exports.getRenderKey = getRenderKey;
/**
 * Returns a devtools unique id for instance.
 */
function getUniqueId(instance) {
    if (instance.__VUE_DEVTOOLS_UID__ != null)
        { return instance.__VUE_DEVTOOLS_UID__; }
    var rootVueId = instance.$root.__VUE_DEVTOOLS_ROOT_UID__;
    return (rootVueId + ":" + (instance._uid));
}
exports.getUniqueId = getUniqueId;
//# sourceMappingURL=util.js.map

/***/ }),

/***/ "../app-backend-vue2/lib/events.js":
/*!*****************************************!*\
  !*** ../app-backend-vue2/lib/events.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.wrapVueForEvents = void 0;
var shared_utils_1 = __webpack_require__(/*! @vue-devtools/shared-utils */ "../shared-utils/lib/index.js");
var internalRE = /^(?:pre-)?hook:/;
function wrap(app, Vue, method, ctx) {
    var original = Vue.prototype[method];
    if (original) {
        Vue.prototype[method] = function () {
            var args = [], len = arguments.length;
            while ( len-- ) args[ len ] = arguments[ len ];

            var res = original.apply(this, args);
            logEvent(this, method, args[0], args.slice(1));
            return res;
        };
    }
    function logEvent(vm, type, eventName, payload) {
        // The string check is important for compat with 1.x where the first
        // argument may be an object instead of a string.
        // this also ensures the event is only logged for direct $emit (source)
        // instead of by $dispatch/$broadcast
        if (typeof eventName === 'string' && !internalRE.test(eventName)) {
            var instance = vm._self || vm;
            ctx.hook.emit(shared_utils_1.HookEvents.COMPONENT_EMIT, app, instance, eventName, payload);
        }
    }
}
function wrapVueForEvents(app, Vue, ctx) {
    ['$emit', '$broadcast', '$dispatch'].forEach(function (method) {
        wrap(app, Vue, method, ctx);
    });
}
exports.wrapVueForEvents = wrapVueForEvents;
//# sourceMappingURL=events.js.map

/***/ }),

/***/ "../app-backend-vue2/lib/index.js":
/*!****************************************!*\
  !*** ../app-backend-vue2/lib/index.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.backend = void 0;
var app_backend_api_1 = __webpack_require__(/*! @vue-devtools/app-backend-api */ "../app-backend-api/lib/index.js");
var shared_utils_1 = __webpack_require__(/*! @vue-devtools/shared-utils */ "../shared-utils/lib/index.js");
var data_1 = __webpack_require__(/*! ./components/data */ "../app-backend-vue2/lib/components/data.js");
var el_1 = __webpack_require__(/*! ./components/el */ "../app-backend-vue2/lib/components/el.js");
var tree_1 = __webpack_require__(/*! ./components/tree */ "../app-backend-vue2/lib/components/tree.js");
var util_1 = __webpack_require__(/*! ./components/util */ "../app-backend-vue2/lib/components/util.js");
var events_1 = __webpack_require__(/*! ./events */ "../app-backend-vue2/lib/events.js");
var plugin_1 = __webpack_require__(/*! ./plugin */ "../app-backend-vue2/lib/plugin.js");
exports.backend = {
    frameworkVersion: 2,
    availableFeatures: [
        app_backend_api_1.BuiltinBackendFeature.COMPONENTS,
        app_backend_api_1.BuiltinBackendFeature.FLUSH
    ],
    setup: function setup(api) {
        api.on.getAppRecordName(function (payload) {
            if (payload.app.name) {
                payload.name = payload.app.name;
            }
        });
        api.on.getAppRootInstance(function (payload) {
            payload.root = payload.app;
        });
        api.on.walkComponentTree(function (payload, ctx) {
            payload.componentTreeData = tree_1.walkTree(payload.componentInstance, payload.filter, ctx);
        });
        api.on.walkComponentParents(function (payload, ctx) {
            payload.parentInstances = tree_1.getComponentParents(payload.componentInstance, ctx);
        });
        api.on.inspectComponent(function (payload) {
            injectToUtils();
            payload.instanceData = data_1.getInstanceDetails(payload.componentInstance);
        });
        api.on.getComponentBounds(function (payload) {
            payload.bounds = el_1.getInstanceOrVnodeRect(payload.componentInstance);
        });
        api.on.getComponentName(function (payload) {
            var instance = payload.componentInstance;
            payload.name = instance.fnContext ? shared_utils_1.getComponentName(instance.fnOptions) : util_1.getInstanceName(instance);
        });
        api.on.getElementComponent(function (payload) {
            payload.componentInstance = el_1.findRelatedComponent(payload.element);
        });
        api.on.editComponentState(function (payload) {
            data_1.editState(payload);
        });
        api.on.getComponentRootElements(function (payload) {
            payload.rootElements = [payload.componentInstance.$el];
        });
        api.on.getComponentDevtoolsOptions(function (payload) {
            payload.options = payload.componentInstance.$options.devtools;
        });
        api.on.getComponentRenderCode(function (payload) {
            payload.code = payload.componentInstance.$options.render.toString();
        });
        api.on.getComponentInstances(function () {
            console.warn('on.getComponentInstances is not implemented for Vue 2');
        });
    },
    setupApp: function setupApp(api, appRecord) {
        injectToUtils();
        var ref = appRecord.options.meta;
        var Vue = ref.Vue;
        var app = appRecord.options.app;
        events_1.wrapVueForEvents(app, Vue, api.ctx);
        plugin_1.setupPlugin(api, app);
    }
};
function injectToUtils() {
    shared_utils_1.backendInjections.getCustomInstanceDetails = data_1.getCustomInstanceDetails;
    shared_utils_1.backendInjections.instanceMap = tree_1.instanceMap;
    shared_utils_1.backendInjections.isVueInstance = function (val) { return val._isVue; };
}
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "../app-backend-vue2/lib/plugin.js":
/*!*****************************************!*\
  !*** ../app-backend-vue2/lib/plugin.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.setupPlugin = void 0;
var devtools_api_1 = __webpack_require__(/*! @vue/devtools-api */ "../api/lib/esm/index.js");
var shared_utils_1 = __webpack_require__(/*! @vue-devtools/shared-utils */ "../shared-utils/lib/index.js");
var actionId = 0;
function setupPlugin(api, app) {
    var ROUTER_INSPECTOR_ID = 'vue2-router-inspector';
    var ROUTER_CHANGES_LAYER_ID = 'vue2-router-changes';
    var VUEX_INSPECTOR_ID = 'vue2-vuex-inspector';
    var VUEX_MUTATIONS_ID = 'vue2-vuex-mutations';
    var VUEX_ACTIONS_ID = 'vue2-vuex-actions';
    devtools_api_1.setupDevtoolsPlugin({
        app: app,
        id: 'org.vuejs.vue2-internal',
        label: 'Vue 2',
        homepage: 'https://vuejs.org/',
        logo: 'https://vuejs.org/images/icons/favicon-96x96.png'
    }, function (api) {
        // Vue Router
        if (app.$router) {
            var router = app.$router;
            // Inspector
            api.addInspector({
                id: ROUTER_INSPECTOR_ID,
                label: 'Routes',
                icon: 'book',
                treeFilterPlaceholder: 'Search routes'
            });
            api.on.getInspectorTree(function (payload) {
                if (payload.app === app && payload.inspectorId === ROUTER_INSPECTOR_ID) {
                    payload.rootNodes = router.options.routes.map(function (route) { return formatRouteNode(router, route, '', payload.filter); }).filter(Boolean);
                }
            });
            api.on.getInspectorState(function (payload) {
                if (payload.app === app && payload.inspectorId === ROUTER_INSPECTOR_ID) {
                    var route = router.matcher.getRoutes().find(function (r) { return getPathId(r) === payload.nodeId; });
                    if (route) {
                        payload.state = {
                            options: formatRouteData(route)
                        };
                    }
                }
            });
            // Timeline
            api.addTimelineLayer({
                id: ROUTER_CHANGES_LAYER_ID,
                label: 'Router Navigations',
                color: 0x40a8c4
            });
            router.afterEach(function (to, from) {
                api.addTimelineEvent({
                    layerId: ROUTER_CHANGES_LAYER_ID,
                    event: {
                        time: Date.now(),
                        title: to.path,
                        data: {
                            from: from,
                            to: to
                        }
                    }
                });
                api.sendInspectorTree(ROUTER_INSPECTOR_ID);
            });
        }
        // Vuex
        if (app.$store) {
            var store = app.$store;
            api.addInspector({
                id: VUEX_INSPECTOR_ID,
                label: 'Vuex',
                icon: 'storage',
                treeFilterPlaceholder: 'Filter stores...'
            });
            api.on.getInspectorTree(function (payload) {
                if (payload.app === app && payload.inspectorId === VUEX_INSPECTOR_ID) {
                    if (payload.filter) {
                        var nodes = [];
                        flattenStoreForInspectorTree(nodes, store._modules.root, payload.filter, '');
                        payload.rootNodes = nodes;
                    }
                    else {
                        payload.rootNodes = [
                            formatStoreForInspectorTree(store._modules.root, '')
                        ];
                    }
                }
            });
            api.on.getInspectorState(function (payload) {
                if (payload.app === app && payload.inspectorId === VUEX_INSPECTOR_ID) {
                    var modulePath = payload.nodeId;
                    var module = getStoreModule(store._modules, modulePath);
                    // Access the getters prop to init getters cache (which is lazy)
                    // eslint-disable-next-line no-unused-expressions
                    module.context.getters;
                    payload.state = formatStoreForInspectorState(module, store._makeLocalGettersCache, modulePath);
                }
            });
            api.addTimelineLayer({
                id: VUEX_MUTATIONS_ID,
                label: 'Vuex Mutations',
                color: LIME_500
            });
            api.addTimelineLayer({
                id: VUEX_ACTIONS_ID,
                label: 'Vuex Actions',
                color: LIME_500
            });
            store.subscribe(function (mutation, state) {
                api.sendInspectorState(VUEX_INSPECTOR_ID);
                var data = {};
                if (mutation.payload) {
                    data.payload = mutation.payload;
                }
                data.state = state;
                api.addTimelineEvent({
                    layerId: VUEX_MUTATIONS_ID,
                    event: {
                        time: Date.now(),
                        title: mutation.type,
                        data: data
                    }
                });
            }, { prepend: true });
            store.subscribeAction({
                before: function (action, state) {
                    var data = {};
                    if (action.payload) {
                        data.payload = action.payload;
                    }
                    action._id = actionId++;
                    action._time = Date.now();
                    data.state = state;
                    api.addTimelineEvent({
                        layerId: VUEX_ACTIONS_ID,
                        event: {
                            time: action._time,
                            title: action.type,
                            groupId: action._id,
                            subtitle: 'start',
                            data: data
                        }
                    });
                },
                after: function (action, state) {
                    var data = {};
                    var duration = Date.now() - action._time;
                    data.duration = {
                        _custom: {
                            type: 'duration',
                            display: (duration + "ms"),
                            tooltip: 'Action duration',
                            value: duration
                        }
                    };
                    if (action.payload) {
                        data.payload = action.payload;
                    }
                    data.state = state;
                    api.addTimelineEvent({
                        layerId: VUEX_ACTIONS_ID,
                        event: {
                            time: Date.now(),
                            title: action.type,
                            groupId: action._id,
                            subtitle: 'end',
                            data: data
                        }
                    });
                }
            }, { prepend: true });
        }
    });
}
exports.setupPlugin = setupPlugin;
/**
 * Extracted from tailwind palette
 */
var BLUE_600 = 0x2563eb;
var LIME_500 = 0x84cc16;
var CYAN_400 = 0x22d3ee;
var ORANGE_400 = 0xfb923c;
var WHITE = 0xffffff;
var DARK = 0x666666;
function formatRouteNode(router, route, parentPath, filter) {
    var _a, _b;
    var node = {
        id: parentPath + route.path,
        label: route.path,
        children: (_a = route.children) === null || _a === void 0 ? void 0 : _a.map(function (child) { return formatRouteNode(router, child, route.path, filter); }).filter(Boolean),
        tags: []
    };
    if (filter && !node.id.includes(filter) && !((_b = node.children) === null || _b === void 0 ? void 0 : _b.length))
        { return null; }
    if (route.name != null) {
        node.tags.push({
            label: String(route.name),
            textColor: 0,
            backgroundColor: CYAN_400
        });
    }
    if (route.alias != null) {
        node.tags.push({
            label: 'alias',
            textColor: 0,
            backgroundColor: ORANGE_400
        });
    }
    var currentPath = router.currentRoute.matched.reduce(function (p, m) { return p + m.path; }, '');
    if (node.id === currentPath) {
        node.tags.push({
            label: 'active',
            textColor: WHITE,
            backgroundColor: BLUE_600
        });
    }
    if (route.redirect) {
        node.tags.push({
            label: 'redirect: ' +
                (typeof route.redirect === 'string' ? route.redirect : 'Object'),
            textColor: WHITE,
            backgroundColor: DARK
        });
    }
    return node;
}
function formatRouteData(route) {
    var data = [];
    data.push({ key: 'path', value: route.path });
    if (route.redirect) {
        data.push({ key: 'redirect', value: route.redirect });
    }
    if (route.alias) {
        data.push({ key: 'alias', value: route.alias });
    }
    if (route.props) {
        data.push({ key: 'props', value: route.props });
    }
    if (route.name && route.name != null) {
        data.push({ key: 'name', value: route.name });
    }
    if (route.component) {
        var component = {};
        // if (route.component.__file) {
        //   component.file = route.component.__file
        // }
        if (route.component.template) {
            component.template = route.component.template;
        }
        if (route.component.props) {
            component.props = route.component.props;
        }
        if (!shared_utils_1.isEmptyObject(component)) {
            data.push({ key: 'component', value: component });
        }
    }
    return data;
}
function getPathId(routeMatcher) {
    var path = routeMatcher.path;
    if (routeMatcher.parent) {
        path = getPathId(routeMatcher.parent) + path;
    }
    return path;
}
var TAG_NAMESPACED = {
    label: 'namespaced',
    textColor: WHITE,
    backgroundColor: DARK
};
function formatStoreForInspectorTree(module, path) {
    return {
        id: path || 'root',
        // all modules end with a `/`, we want the last segment only
        // cart/ -> cart
        // nested/cart/ -> cart
        label: extractNameFromPath(path),
        tags: module.namespaced ? [TAG_NAMESPACED] : [],
        children: Object.keys(module._children).map(function (moduleName) { return formatStoreForInspectorTree(module._children[moduleName], path + moduleName + '/'); })
    };
}
function flattenStoreForInspectorTree(result, module, filter, path) {
    if (path.includes(filter)) {
        result.push({
            id: path || 'root',
            label: path.endsWith('/') ? path.slice(0, path.length - 1) : path || 'Root',
            tags: module.namespaced ? [TAG_NAMESPACED] : []
        });
    }
    Object.keys(module._children).forEach(function (moduleName) {
        flattenStoreForInspectorTree(result, module._children[moduleName], filter, path + moduleName + '/');
    });
}
function extractNameFromPath(path) {
    return path && path !== 'root' ? path.split('/').slice(-2, -1)[0] : 'Root';
}
function formatStoreForInspectorState(module, getters, path) {
    getters = !module.namespaced || path === 'root' ? module.context.getters : getters[path];
    var gettersKeys = Object.keys(getters);
    var storeState = {
        state: Object.keys(module.state).map(function (key) { return ({
            key: key,
            editable: true,
            value: module.state[key]
        }); })
    };
    if (gettersKeys.length) {
        var tree = transformPathsToObjectTree(getters);
        storeState.getters = Object.keys(tree).map(function (key) { return ({
            key: key.endsWith('/') ? extractNameFromPath(key) : key,
            editable: false,
            value: canThrow(function () { return tree[key]; })
        }); });
    }
    return storeState;
}
function transformPathsToObjectTree(getters) {
    var result = {};
    Object.keys(getters).forEach(function (key) {
        var path = key.split('/');
        if (path.length > 1) {
            var target = result;
            var leafKey = path.pop();
            for (var p of path) {
                if (!target[p]) {
                    target[p] = {
                        _custom: {
                            value: {},
                            display: p,
                            tooltip: 'Module',
                            abstract: true
                        }
                    };
                }
                target = target[p]._custom.value;
            }
            target[leafKey] = canThrow(function () { return getters[key]; });
        }
        else {
            result[key] = canThrow(function () { return getters[key]; });
        }
    });
    return result;
}
function getStoreModule(moduleMap, path) {
    var names = path.split('/').filter(function (n) { return n; });
    return names.reduce(function (module, moduleName, i) {
        var child = module[moduleName];
        if (!child) {
            throw new Error(("Missing module \"" + moduleName + "\" for path \"" + path + "\"."));
        }
        return i === names.length - 1 ? child : child._children;
    }, path === 'root' ? moduleMap : moduleMap.root._children);
}
function canThrow(cb) {
    try {
        return cb();
    }
    catch (e) {
        return e;
    }
}
//# sourceMappingURL=plugin.js.map

/***/ }),

/***/ "../app-backend-vue3/lib/components/data.js":
/*!**************************************************!*\
  !*** ../app-backend-vue3/lib/components/data.js ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getCustomInstanceDetails = exports.editState = exports.getInstanceDetails = void 0;
var util_1 = __webpack_require__(/*! ./util */ "../app-backend-vue3/lib/components/util.js");
var shared_utils_1 = __webpack_require__(/*! @vue-devtools/shared-utils */ "../shared-utils/lib/index.js");
var shared_data_1 = __importDefault(__webpack_require__(/*! @vue-devtools/shared-utils/lib/shared-data */ "../shared-utils/lib/shared-data.js"));
var util_2 = __webpack_require__(/*! ../util */ "../app-backend-vue3/lib/util.js");
/**
 * Get the detailed information of an inspected instance.
 */
function getInstanceDetails(instance, ctx) {
    var _a;
    return {
        id: util_1.getUniqueComponentId(instance, ctx),
        name: util_1.getInstanceName(instance),
        file: (_a = instance.type) === null || _a === void 0 ? void 0 : _a.__file,
        state: getInstanceState(instance)
    };
}
exports.getInstanceDetails = getInstanceDetails;
function getInstanceState(instance) {
    var mergedType = resolveMergedOptions(instance);
    return processProps(instance).concat(processState(instance), processSetupState(instance), processComputed(instance, mergedType), processAttrs(instance), processProvide(instance), processInject(instance, mergedType), processRefs(instance));
}
/**
 * Process the props of an instance.
 * Make sure return a plain object because window.postMessage()
 * will throw an Error if the passed object contains Functions.
 *
 * @param {Vue} instance
 * @return {Array}
 */
function processProps(instance) {
    var propsData = [];
    var propDefinitions = instance.type.props;
    var loop = function ( key ) {
        var propDefinition = propDefinitions ? propDefinitions[key] : null;
        key = shared_utils_1.camelize(key);
        propsData.push({
            type: 'props',
            key: key,
            value: util_2.returnError(function () { return instance.props[key]; }),
            meta: propDefinition
                ? Object.assign({}, {type: propDefinition.type ? getPropType(propDefinition.type) : 'any',
                    required: !!propDefinition.required},
                    propDefinition.default != null
                        ? {
                            default: propDefinition.default.toString()
                        }
                        : {})
                : {
                    type: 'invalid'
                },
            editable: shared_data_1.default.editableProps
        });
    };

    for (var key in instance.props) loop( key );
    return propsData;
}
var fnTypeRE = /^(?:function|class) (\w+)/;
/**
 * Convert prop type constructor to string.
 */
function getPropType(type) {
    if (Array.isArray(type)) {
        return type.map(function (t) { return getPropType(t); }).join(' or ');
    }
    var match = type.toString().match(fnTypeRE);
    return typeof type === 'function'
        ? (match && match[1]) || 'any'
        : 'any';
}
/**
 * Process state, filtering out props and "clean" the result
 * with a JSON dance. This removes functions which can cause
 * errors during structured clone used by window.postMessage.
 *
 * @param {Vue} instance
 * @return {Array}
 */
function processState(instance) {
    var type = instance.type;
    var props = type.props;
    var getters = type.vuex &&
        type.vuex.getters;
    var computedDefs = type.computed;
    var data = Object.assign({}, instance.data,
        instance.renderContext);
    return Object.keys(data)
        .filter(function (key) { return (!(props && key in props) &&
        !(getters && key in getters) &&
        !(computedDefs && key in computedDefs)); })
        .map(function (key) { return ({
        key: key,
        type: 'data',
        value: util_2.returnError(function () { return data[key]; }),
        editable: true
    }); });
}
function processSetupState(instance) {
    var raw = instance.devtoolsRawSetupState || {};
    return Object.keys(instance.setupState)
        .map(function (key) {
        var value = util_2.returnError(function () { return instance.setupState[key]; });
        var rawData = raw[key];
        var result;
        if (rawData) {
            var info = getSetupStateInfo(rawData);
            var objectType = info.computed ? 'Computed' : info.ref ? 'Ref' : info.reactive ? 'Reactive' : null;
            var isState = info.ref || info.computed || info.reactive;
            var isOther = typeof value === 'function' || typeof (value === null || value === void 0 ? void 0 : value.render) === 'function';
            result = Object.assign({}, objectType ? { objectType: objectType } : {},
                raw.effect ? { raw: raw.effect.raw.toString() } : {},
                {editable: isState && !info.readonly,
                type: isOther ? 'setup (other)' : 'setup'});
        }
        else {
            result = {
                type: 'setup'
            };
        }
        return Object.assign({}, {key: key,
            value: value},
            result);
    });
}
function isRef(raw) {
    return !!raw.__v_isRef;
}
function isComputed(raw) {
    return isRef(raw) && !!raw.effect;
}
function isReactive(raw) {
    return !!raw.__v_isReactive;
}
function isReadOnly(raw) {
    return !!raw.__v_isReadonly;
}
function getSetupStateInfo(raw) {
    return {
        ref: isRef(raw),
        computed: isComputed(raw),
        reactive: isReactive(raw),
        readonly: isReadOnly(raw)
    };
}
/**
 * Process the computed properties of an instance.
 *
 * @param {Vue} instance
 * @return {Array}
 */
function processComputed(instance, mergedType) {
    var type = mergedType;
    var computed = [];
    var defs = type.computed || {};
    // use for...in here because if 'computed' is not defined
    // on component, computed properties will be placed in prototype
    // and Object.keys does not include
    // properties from object's prototype
    var loop = function ( key ) {
        var def = defs[key];
        var type$1 = typeof def === 'function' && def.vuex
            ? 'vuex bindings'
            : 'computed';
        computed.push({
            type: type$1,
            key: key,
            value: util_2.returnError(function () { return instance.proxy[key]; }),
            editable: typeof def.set === 'function'
        });
    };

    for (var key in defs) loop( key );
    return computed;
}
function processAttrs(instance) {
    return Object.keys(instance.attrs)
        .map(function (key) { return ({
        type: 'attrs',
        key: key,
        value: util_2.returnError(function () { return instance.attrs[key]; })
    }); });
}
function processProvide(instance) {
    return Object.keys(instance.provides)
        .map(function (key) { return ({
        type: 'provided',
        key: key,
        value: util_2.returnError(function () { return instance.provides[key]; })
    }); });
}
function processInject(instance, mergedType) {
    if (!(mergedType === null || mergedType === void 0 ? void 0 : mergedType.inject))
        { return []; }
    var keys = [];
    if (Array.isArray(mergedType.inject)) {
        keys = mergedType.inject.map(function (key) { return ({
            key: key,
            originalKey: key
        }); });
    }
    else {
        keys = Object.keys(mergedType.inject).map(function (key) {
            var value = mergedType.inject[key];
            var originalKey;
            if (typeof value === 'string') {
                originalKey = value;
            }
            else {
                originalKey = value.from;
            }
            return {
                key: key,
                originalKey: originalKey
            };
        });
    }
    return keys.map(function (ref) {
        var key = ref.key;
        var originalKey = ref.originalKey;

        return ({
        type: 'injected',
        key: originalKey && key !== originalKey ? (originalKey + " ➞ " + key) : key,
        value: util_2.returnError(function () { return instance.ctx[key]; })
    });
    });
}
function processRefs(instance) {
    return Object.keys(instance.refs)
        .map(function (key) { return ({
        type: 'refs',
        key: key,
        value: util_2.returnError(function () { return instance.refs[key]; })
    }); });
}
function editState(ref, ctx) {
    var componentInstance = ref.componentInstance;
    var path = ref.path;
    var state = ref.state;
    var type = ref.type;

    if (!['data', 'props', 'computed', 'setup'].includes(type))
        { return; }
    var target;
    var targetPath = path.slice();
    if (Object.keys(componentInstance.props).includes(path[0])) {
        // Props
        target = componentInstance.props;
    }
    else if (componentInstance.devtoolsRawSetupState && Object.keys(componentInstance.devtoolsRawSetupState).includes(path[0])) {
        // Setup
        target = componentInstance.devtoolsRawSetupState;
        var currentValue = shared_utils_1.get(componentInstance.devtoolsRawSetupState, path);
        if (currentValue != null) {
            var info = getSetupStateInfo(currentValue);
            if (info.readonly)
                { return; }
            if (info.ref) {
                targetPath.splice(1, 0, 'value');
            }
        }
    }
    else {
        target = componentInstance.proxy;
    }
    if (target && targetPath) {
        shared_utils_1.set(target, targetPath, 'value' in state ? state.value : undefined, function (obj, field, value) {
            if (state.remove || state.newKey) {
                if (Array.isArray(obj)) {
                    obj.splice(field, 1);
                }
                else {
                    delete obj[field];
                }
            }
            if (!state.remove) {
                obj[state.newKey || field] = value;
            }
        });
    }
}
exports.editState = editState;
function reduceStateList(list) {
    if (!list.length) {
        return undefined;
    }
    return list.reduce(function (map, item) {
        var key = item.type || 'data';
        var obj = map[key] = map[key] || {};
        obj[item.key] = item.value;
        return map;
    }, {});
}
function getCustomInstanceDetails(instance) {
    if (instance._)
        { instance = instance._; }
    var state = getInstanceState(instance);
    return {
        _custom: {
            type: 'component',
            id: instance.__VUE_DEVTOOLS_UID__,
            display: util_1.getInstanceName(instance),
            tooltip: 'Component instance',
            value: reduceStateList(state),
            fields: {
                abstract: true
            }
        }
    };
}
exports.getCustomInstanceDetails = getCustomInstanceDetails;
function resolveMergedOptions(instance) {
    var raw = instance.type;
    var mixins = raw.mixins;
    var extendsOptions = raw.extends;
    var globalMixins = instance.appContext.mixins;
    if (!globalMixins.length && !mixins && !extendsOptions)
        { return raw; }
    var options = {};
    globalMixins.forEach(function (m) { return mergeOptions(options, m, instance); });
    mergeOptions(options, raw, instance);
    return options;
}
function mergeOptions(to, from, instance) {
    if (typeof from === 'function') {
        from = from.options;
    }
    if (!from)
        { return to; }
    var mixins = from.mixins;
    var extendsOptions = from.extends;
    extendsOptions && mergeOptions(to, extendsOptions, instance);
    mixins &&
        mixins.forEach(function (m) { return mergeOptions(to, m, instance); });
    for (var key of ['computed', 'inject']) {
        if (Object.prototype.hasOwnProperty.call(from, key)) {
            if (!to[key]) {
                to[key] = from[key];
            }
            else {
                Object.assign(to[key], from[key]);
            }
        }
    }
    return to;
}
//# sourceMappingURL=data.js.map

/***/ }),

/***/ "../app-backend-vue3/lib/components/el.js":
/*!************************************************!*\
  !*** ../app-backend-vue3/lib/components/el.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getInstanceOrVnodeRect = exports.getRootElementsFromComponentInstance = exports.getComponentInstanceFromElement = void 0;
var shared_utils_1 = __webpack_require__(/*! @vue-devtools/shared-utils */ "../shared-utils/lib/index.js");
var util_1 = __webpack_require__(/*! ./util */ "../app-backend-vue3/lib/components/util.js");
function getComponentInstanceFromElement(element) {
    return element.__vueParentComponent;
}
exports.getComponentInstanceFromElement = getComponentInstanceFromElement;
function getRootElementsFromComponentInstance(instance) {
    if (util_1.isFragment(instance)) {
        return getFragmentRootElements(instance.subTree);
    }
    return [instance.subTree.el];
}
exports.getRootElementsFromComponentInstance = getRootElementsFromComponentInstance;
function getFragmentRootElements(vnode) {
    if (!vnode.children)
        { return []; }
    var list = [];
    for (var i = 0, l = vnode.children.length; i < l; i++) {
        var childVnode = vnode.children[i];
        if (childVnode.component) {
            list.push.apply(list, getRootElementsFromComponentInstance(childVnode.component));
        }
        else if (childVnode.el) {
            list.push(childVnode.el);
        }
    }
    return list;
}
/**
 * Get the client rect for an instance.
 *
 * @param {Vue|Vnode} instance
 * @return {Object}
 */
function getInstanceOrVnodeRect(instance) {
    var el = instance.subTree.el;
    if (!shared_utils_1.isBrowser) {
        // @TODO: Find position from instance or a vnode (for functional components).
        return;
    }
    if (!shared_utils_1.inDoc(el)) {
        return;
    }
    if (util_1.isFragment(instance)) {
        return addIframePosition(getFragmentRect(instance.subTree), getElWindow(el));
    }
    else if (el.nodeType === 1) {
        return addIframePosition(el.getBoundingClientRect(), getElWindow(el));
    }
}
exports.getInstanceOrVnodeRect = getInstanceOrVnodeRect;
function createRect() {
    var rect = {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        get width() { return rect.right - rect.left; },
        get height() { return rect.bottom - rect.top; }
    };
    return rect;
}
function mergeRects(a, b) {
    if (!a.top || b.top < a.top) {
        a.top = b.top;
    }
    if (!a.bottom || b.bottom > a.bottom) {
        a.bottom = b.bottom;
    }
    if (!a.left || b.left < a.left) {
        a.left = b.left;
    }
    if (!a.right || b.right > a.right) {
        a.right = b.right;
    }
    return a;
}
var range;
/**
 * Get the bounding rect for a text node using a Range.
 *
 * @param {Text} node
 * @return {Rect}
 */
function getTextRect(node) {
    if (!shared_utils_1.isBrowser)
        { return; }
    if (!range)
        { range = document.createRange(); }
    range.selectNode(node);
    return range.getBoundingClientRect();
}
function getFragmentRect(vnode) {
    var rect = createRect();
    if (!vnode.children)
        { return rect; }
    for (var i = 0, l = vnode.children.length; i < l; i++) {
        var childVnode = vnode.children[i];
        var childRect = (void 0);
        if (childVnode.component) {
            childRect = getInstanceOrVnodeRect(childVnode.component);
        }
        else if (childVnode.el) {
            var el = childVnode.el;
            if (el.nodeType === 1 || el.getBoundingClientRect) {
                childRect = el.getBoundingClientRect();
            }
            else if (el.nodeType === 3 && el.data.trim()) {
                childRect = getTextRect(el);
            }
        }
        if (childRect) {
            mergeRects(rect, childRect);
        }
    }
    return rect;
}
function getElWindow(el) {
    return el.ownerDocument.defaultView;
}
function addIframePosition(bounds, win) {
    if (win.__VUE_DEVTOOLS_IFRAME__) {
        var rect = mergeRects(createRect(), bounds);
        var iframeBounds = win.__VUE_DEVTOOLS_IFRAME__.getBoundingClientRect();
        rect.top += iframeBounds.top;
        rect.bottom += iframeBounds.top;
        rect.left += iframeBounds.left;
        rect.right += iframeBounds.left;
        if (win.parent) {
            return addIframePosition(rect, win.parent);
        }
        return rect;
    }
    return bounds;
}
//# sourceMappingURL=el.js.map

/***/ }),

/***/ "../app-backend-vue3/lib/components/filter.js":
/*!****************************************************!*\
  !*** ../app-backend-vue3/lib/components/filter.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ComponentFilter = void 0;
var shared_utils_1 = __webpack_require__(/*! @vue-devtools/shared-utils */ "../shared-utils/lib/index.js");
var util_1 = __webpack_require__(/*! ./util */ "../app-backend-vue3/lib/components/util.js");
var ComponentFilter = function ComponentFilter(filter) {
    this.filter = filter || '';
};
/**
 * Check if an instance is qualified.
 *
 * @param {Vue|Vnode} instance
 * @return {Boolean}
 */
ComponentFilter.prototype.isQualified = function isQualified (instance) {
    var name = shared_utils_1.classify(util_1.getInstanceName(instance)).toLowerCase();
    return name.indexOf(this.filter) > -1;
};
exports.ComponentFilter = ComponentFilter;
//# sourceMappingURL=filter.js.map

/***/ }),

/***/ "../app-backend-vue3/lib/components/tree.js":
/*!**************************************************!*\
  !*** ../app-backend-vue3/lib/components/tree.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ComponentWalker = void 0;
var util_1 = __webpack_require__(/*! ./util */ "../app-backend-vue3/lib/components/util.js");
var filter_1 = __webpack_require__(/*! ./filter */ "../app-backend-vue3/lib/components/filter.js");
var el_1 = __webpack_require__(/*! ./el */ "../app-backend-vue3/lib/components/el.js");
var ComponentWalker = function ComponentWalker(maxDepth, filter, ctx) {
    this.ctx = ctx;
    this.maxDepth = maxDepth;
    this.componentFilter = new filter_1.ComponentFilter(filter);
};
ComponentWalker.prototype.getComponentTree = function getComponentTree (instance) {
    this.captureIds = new Map();
    return this.findQualifiedChildren(instance, 0);
};
ComponentWalker.prototype.getComponentParents = function getComponentParents (instance) {
    this.captureIds = new Map();
    var parents = [];
    this.captureId(instance);
    var parent = instance;
    while ((parent = parent.parent)) {
        this.captureId(parent);
        parents.push(parent);
    }
    return parents;
};
/**
 * Find qualified children from a single instance.
 * If the instance itself is qualified, just return itself.
 * This is ok because [].concat works in both cases.
 *
 * @param {Vue|Vnode} instance
 * @return {Vue|Array}
 */
ComponentWalker.prototype.findQualifiedChildren = async function findQualifiedChildren (instance, depth) {
    var _a;
    if (this.componentFilter.isQualified(instance) && !((_a = instance.type.devtools) === null || _a === void 0 ? void 0 : _a.hide)) {
        return [await this.capture(instance, null, depth)];
    }
    else if (instance.subTree) {
        // TODO functional components
        return this.findQualifiedChildrenFromList(this.getInternalInstanceChildren(instance.subTree), depth);
    }
    else {
        return [];
    }
};
/**
 * Iterate through an array of instances and flatten it into
 * an array of qualified instances. This is a depth-first
 * traversal - e.g. if an instance is not matched, we will
 * recursively go deeper until a qualified child is found.
 *
 * @param {Array} instances
 * @return {Array}
 */
ComponentWalker.prototype.findQualifiedChildrenFromList = async function findQualifiedChildrenFromList (instances, depth) {
        var this$1 = this;

    instances = instances
        .filter(function (child) { var _a; return !util_1.isBeingDestroyed(child) && !((_a = child.type.devtools) === null || _a === void 0 ? void 0 : _a.hide); });
    if (!this.componentFilter.filter) {
        return Promise.all(instances.map(function (child, index, list) { return this$1.capture(child, list, depth); }));
    }
    else {
        return Array.prototype.concat.apply([], await Promise.all(instances.map(function (i) { return this$1.findQualifiedChildren(i, depth); })));
    }
};
/**
 * Get children from a component instance.
 */
ComponentWalker.prototype.getInternalInstanceChildren = function getInternalInstanceChildren (subTree) {
        var this$1 = this;

    var list = [];
    if (subTree.component) {
        list.push(subTree.component);
    }
    if (subTree.suspense) {
        list.push.apply(list, this.getInternalInstanceChildren(subTree.suspense.activeBranch));
    }
    if (Array.isArray(subTree.children)) {
        subTree.children.forEach(function (childSubTree) {
            if (childSubTree.component) {
                list.push(childSubTree.component);
            }
            else {
                list.push.apply(list, this$1.getInternalInstanceChildren(childSubTree));
            }
        });
    }
    return list.filter(function (child) { var _a; return !util_1.isBeingDestroyed(child) && !((_a = child.type.devtools) === null || _a === void 0 ? void 0 : _a.hide); });
};
ComponentWalker.prototype.captureId = function captureId (instance) {
    // instance.uid is not reliable in devtools as there
    // may be 2 roots with same uid which causes unexpected
    // behaviour
    var id = instance.__VUE_DEVTOOLS_UID__ != null ? instance.__VUE_DEVTOOLS_UID__ : util_1.getUniqueComponentId(instance, this.ctx);
    instance.__VUE_DEVTOOLS_UID__ = id;
    // Dedupe
    if (this.captureIds.has(id)) {
        return;
    }
    else {
        this.captureIds.set(id, undefined);
    }
    this.mark(instance);
    return id;
};
/**
 * Capture the meta information of an instance. (recursive)
 *
 * @param {Vue} instance
 * @return {Object}
 */
ComponentWalker.prototype.capture = async function capture (instance, list, depth) {
        var this$1 = this;

    var id = this.captureId(instance);
    var name = util_1.getInstanceName(instance);
    var children = this.getInternalInstanceChildren(instance.subTree)
        .filter(function (child) { return !util_1.isBeingDestroyed(child); });
    var treeNode = {
        uid: instance.uid,
        id: id,
        name: name,
        renderKey: util_1.getRenderKey(instance.vnode ? instance.vnode.key : null),
        inactive: !!instance.isDeactivated,
        hasChildren: !!children.length,
        children: [],
        isFragment: util_1.isFragment(instance),
        tags: []
    };
    // capture children
    if (depth < this.maxDepth) {
        treeNode.children = await Promise.all(children
            .map(function (child, index, list) { return this$1.capture(child, list, depth + 1); })
            .filter(Boolean));
    }
    // keep-alive
    if (instance.type.__isKeepAlive && instance.__v_cache) {
        var cachedComponents = Array.from(instance.__v_cache.values()).map(function (vnode) { return vnode.component; }).filter(Boolean);
        for (var child of cachedComponents) {
            if (!children.includes(child)) {
                var node = await this.capture(child, null, depth + 1);
                if (node) {
                    node.inactive = true;
                    treeNode.children.push(node);
                }
            }
        }
    }
    // record screen position to ensure correct ordering
    if ((!list || list.length > 1) && !instance._inactive) {
        var rect = el_1.getInstanceOrVnodeRect(instance);
        treeNode.positionTop = rect ? rect.top : Infinity;
    }
    if (instance.suspense) {
        treeNode.tags.push({
            label: 'suspense',
            backgroundColor: 0x7d7dd7,
            textColor: 0xffffff
        });
    }
    return this.ctx.api.visitComponentTree(instance, treeNode, this.componentFilter.filter, this.ctx.currentAppRecord.options.app);
};
/**
 * Mark an instance as captured and store it in the instance map.
 *
 * @param {Vue} instance
 */
ComponentWalker.prototype.mark = function mark (instance) {
    var instanceMap = this.ctx.currentAppRecord.instanceMap;
    if (!instanceMap.has(instance.__VUE_DEVTOOLS_UID__)) {
        instanceMap.set(instance.__VUE_DEVTOOLS_UID__, instance);
    }
};
exports.ComponentWalker = ComponentWalker;
//# sourceMappingURL=tree.js.map

/***/ }),

/***/ "../app-backend-vue3/lib/components/util.js":
/*!**************************************************!*\
  !*** ../app-backend-vue3/lib/components/util.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getComponentInstances = exports.getRenderKey = exports.getUniqueComponentId = exports.getInstanceName = exports.isFragment = exports.getAppRecord = exports.isBeingDestroyed = void 0;
var shared_utils_1 = __webpack_require__(/*! @vue-devtools/shared-utils */ "../shared-utils/lib/index.js");
var util_1 = __webpack_require__(/*! ../util */ "../app-backend-vue3/lib/util.js");
function isBeingDestroyed(instance) {
    return instance._isBeingDestroyed || instance.isUnmounted;
}
exports.isBeingDestroyed = isBeingDestroyed;
function getAppRecord(instance) {
    if (instance.root) {
        return instance.appContext.app.__VUE_DEVTOOLS_APP_RECORD__;
    }
}
exports.getAppRecord = getAppRecord;
function isFragment(instance) {
    var appRecord = getAppRecord(instance);
    if (appRecord) {
        return appRecord.options.types.Fragment === instance.subTree.type;
    }
}
exports.isFragment = isFragment;
/**
 * Get the appropriate display name for an instance.
 *
 * @param {Vue} instance
 * @return {String}
 */
function getInstanceName(instance) {
    var _a, _b, _c;
    var name = getComponentTypeName(instance.type || {});
    if (name)
        { return name; }
    if (instance.root === instance)
        { return 'Root'; }
    for (var key in (_b = (_a = instance.parent) === null || _a === void 0 ? void 0 : _a.type) === null || _b === void 0 ? void 0 : _b.components) {
        if (instance.parent.type.components[key] === instance.type)
            { return saveComponentName(instance, key); }
    }
    for (var key$1 in (_c = instance.appContext) === null || _c === void 0 ? void 0 : _c.components) {
        if (instance.appContext.components[key$1] === instance.type)
            { return saveComponentName(instance, key$1); }
    }
    return 'Anonymous Component';
}
exports.getInstanceName = getInstanceName;
function saveComponentName(instance, key) {
    instance.type.__vdevtools_guessedName = key;
    return key;
}
function getComponentTypeName(options) {
    var name = options.name || options._componentTag || options.__vdevtools_guessedName;
    if (name) {
        return name;
    }
    var file = options.__file; // injected by vue-loader
    if (file) {
        return shared_utils_1.classify(util_1.basename(file, '.vue'));
    }
}
/**
 * Returns a devtools unique id for instance.
 * @param {Vue} instance
 */
function getUniqueComponentId(instance, ctx) {
    var instanceId = instance === ctx.currentAppRecord.rootInstance ? 'root' : instance.uid;
    return ((ctx.currentAppRecord.id) + ":" + instanceId);
}
exports.getUniqueComponentId = getUniqueComponentId;
function getRenderKey(value) {
    if (value == null)
        { return; }
    var type = typeof value;
    if (type === 'number') {
        return value;
    }
    else if (type === 'string') {
        return ("'" + value + "'");
    }
    else if (Array.isArray(value)) {
        return 'Array';
    }
    else {
        return 'Object';
    }
}
exports.getRenderKey = getRenderKey;
function getComponentInstances(app) {
    var appRecord = app.__VUE_DEVTOOLS_APP_RECORD__;
    var appId = appRecord.id.toString();
    return [].concat( appRecord.instanceMap )
        .filter(function (ref) {
            var key = ref[0];

            return key.split(':')[0] === appId;
    })
        .map(function (ref) {
            var instance = ref[1];

            return instance;
    }); // eslint-disable-line comma-spacing
}
exports.getComponentInstances = getComponentInstances;
//# sourceMappingURL=util.js.map

/***/ }),

/***/ "../app-backend-vue3/lib/index.js":
/*!****************************************!*\
  !*** ../app-backend-vue3/lib/index.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.backend = void 0;
var app_backend_api_1 = __webpack_require__(/*! @vue-devtools/app-backend-api */ "../app-backend-api/lib/index.js");
var tree_1 = __webpack_require__(/*! ./components/tree */ "../app-backend-vue3/lib/components/tree.js");
var data_1 = __webpack_require__(/*! ./components/data */ "../app-backend-vue3/lib/components/data.js");
var util_1 = __webpack_require__(/*! ./components/util */ "../app-backend-vue3/lib/components/util.js");
var el_1 = __webpack_require__(/*! ./components/el */ "../app-backend-vue3/lib/components/el.js");
var shared_utils_1 = __webpack_require__(/*! @vue-devtools/shared-utils */ "../shared-utils/lib/index.js");
exports.backend = {
    frameworkVersion: 3,
    availableFeatures: [
        app_backend_api_1.BuiltinBackendFeature.COMPONENTS
    ],
    setup: function setup(api) {
        api.on.getAppRecordName(function (payload) {
            if (payload.app._component) {
                payload.name = payload.app._component.name;
            }
        });
        api.on.getAppRootInstance(function (payload) {
            var _a, _b, _c, _d;
            if (payload.app._instance) {
                payload.root = payload.app._instance;
            }
            else if ((_b = (_a = payload.app._container) === null || _a === void 0 ? void 0 : _a._vnode) === null || _b === void 0 ? void 0 : _b.component) {
                payload.root = (_d = (_c = payload.app._container) === null || _c === void 0 ? void 0 : _c._vnode) === null || _d === void 0 ? void 0 : _d.component;
            }
        });
        api.on.walkComponentTree(async function (payload, ctx) {
            var walker = new tree_1.ComponentWalker(payload.maxDepth, payload.filter, ctx);
            payload.componentTreeData = await walker.getComponentTree(payload.componentInstance);
        });
        api.on.walkComponentParents(function (payload, ctx) {
            var walker = new tree_1.ComponentWalker(0, null, ctx);
            payload.parentInstances = walker.getComponentParents(payload.componentInstance);
        });
        api.on.inspectComponent(function (payload, ctx) {
            shared_utils_1.backendInjections.getCustomInstanceDetails = data_1.getCustomInstanceDetails;
            shared_utils_1.backendInjections.instanceMap = ctx.currentAppRecord.instanceMap;
            shared_utils_1.backendInjections.isVueInstance = function (val) { return val._ && Object.keys(val._).includes('vnode'); };
            payload.instanceData = data_1.getInstanceDetails(payload.componentInstance, ctx);
        });
        api.on.getComponentName(function (payload) {
            payload.name = util_1.getInstanceName(payload.componentInstance);
        });
        api.on.getComponentBounds(function (payload) {
            payload.bounds = el_1.getInstanceOrVnodeRect(payload.componentInstance);
        });
        api.on.getElementComponent(function (payload) {
            payload.componentInstance = el_1.getComponentInstanceFromElement(payload.element);
        });
        api.on.getComponentInstances(function (payload) {
            payload.componentInstances = util_1.getComponentInstances(payload.app);
        });
        api.on.getComponentRootElements(function (payload) {
            payload.rootElements = el_1.getRootElementsFromComponentInstance(payload.componentInstance);
        });
        api.on.editComponentState(function (payload, ctx) {
            data_1.editState(payload, ctx);
        });
        api.on.getComponentDevtoolsOptions(function (payload) {
            payload.options = payload.componentInstance.type.devtools;
        });
        api.on.getComponentRenderCode(function (payload) {
            payload.code = payload.componentInstance.render.toString();
        });
        api.on.transformCall(function (payload) {
            if (payload.callName === shared_utils_1.HookEvents.COMPONENT_UPDATED) {
                var component = payload.inArgs[0];
                payload.outArgs = [
                    component.appContext.app,
                    component.uid,
                    component.parent ? component.parent.uid : undefined,
                    component
                ];
            }
        });
        // @TODO
    }
};
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "../app-backend-vue3/lib/util.js":
/*!***************************************!*\
  !*** ../app-backend-vue3/lib/util.js ***!
  \***************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.returnError = exports.basename = exports.flatten = void 0;
var path_1 = __importDefault(__webpack_require__(/*! path */ "../../node_modules/path-browserify/index.js"));
function flatten(items) {
    return items.reduce(function (acc, item) {
        if (item instanceof Array)
            { acc.push.apply(acc, flatten(item)); }
        else if (item)
            { acc.push(item); }
        return acc;
    }, []);
}
exports.flatten = flatten;
// Use a custom basename functions instead of the shimed version
// because it doesn't work on Windows
function basename(filename, ext) {
    return path_1.default.basename(filename.replace(/^[a-zA-Z]:/, '').replace(/\\/g, '/'), ext);
}
exports.basename = basename;
function returnError(cb) {
    try {
        return cb();
    }
    catch (e) {
        return e;
    }
}
exports.returnError = returnError;
//# sourceMappingURL=util.js.map

/***/ }),

/***/ "../shared-utils/lib/backend.js":
/*!**************************************!*\
  !*** ../shared-utils/lib/backend.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getCatchedGetters = exports.getCustomStoreDetails = exports.getCustomRouterDetails = exports.isVueInstance = exports.getCustomInstanceDetails = exports.getInstanceMap = exports.backendInjections = void 0;
exports.backendInjections = {
    instanceMap: new Map(),
    isVueInstance: (function () { return false; }),
    getCustomInstanceDetails: (function () { return ({}); })
};
function getInstanceMap() {
    return exports.backendInjections.instanceMap;
}
exports.getInstanceMap = getInstanceMap;
function getCustomInstanceDetails(instance) {
    return exports.backendInjections.getCustomInstanceDetails(instance);
}
exports.getCustomInstanceDetails = getCustomInstanceDetails;
function isVueInstance(value) {
    return exports.backendInjections.isVueInstance(value);
}
exports.isVueInstance = isVueInstance;
// @TODO refactor
function getCustomRouterDetails(router) {
    return {
        _custom: {
            type: 'router',
            display: 'VueRouter',
            value: {
                options: router.options,
                currentRoute: router.currentRoute
            },
            fields: {
                abstract: true
            }
        }
    };
}
exports.getCustomRouterDetails = getCustomRouterDetails;
// @TODO refactor
function getCustomStoreDetails(store) {
    return {
        _custom: {
            type: 'store',
            display: 'Store',
            value: {
                state: store.state,
                getters: getCatchedGetters(store)
            },
            fields: {
                abstract: true
            }
        }
    };
}
exports.getCustomStoreDetails = getCustomStoreDetails;
// @TODO refactor
function getCatchedGetters(store) {
    var getters = {};
    var origGetters = store.getters || {};
    var keys = Object.keys(origGetters);
    var loop = function ( i ) {
        var key = keys[i];
        Object.defineProperty(getters, key, {
            enumerable: true,
            get: function () {
                try {
                    return origGetters[key];
                }
                catch (e) {
                    return e;
                }
            }
        });
    };

    for (var i = 0; i < keys.length; i++) loop( i );
    return getters;
}
exports.getCatchedGetters = getCatchedGetters;
//# sourceMappingURL=backend.js.map

/***/ }),

/***/ "../shared-utils/lib/bridge.js":
/*!*************************************!*\
  !*** ../shared-utils/lib/bridge.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Bridge = void 0;
var events_1 = __webpack_require__(/*! events */ "../../node_modules/events/events.js");
var BATCH_DURATION = 100;
var Bridge = /*@__PURE__*/(function (superclass) {
    function Bridge(wall) {
        var this$1 = this;

        superclass.call(this);
        this.setMaxListeners(Infinity);
        this.wall = wall;
        wall.listen(function (messages) {
            if (Array.isArray(messages)) {
                messages.forEach(function (message) { return this$1._emit(message); });
            }
            else {
                this$1._emit(messages);
            }
        });
        this._batchingQueue = [];
        this._sendingQueue = [];
        this._receivingQueue = [];
        this._sending = false;
        this._time = null;
    }

    if ( superclass ) Bridge.__proto__ = superclass;
    Bridge.prototype = Object.create( superclass && superclass.prototype );
    Bridge.prototype.constructor = Bridge;
    Bridge.prototype.send = function send (event, payload) {
        var this$1 = this;

        if (Array.isArray(payload)) {
            var lastIndex = payload.length - 1;
            payload.forEach(function (chunk, index) {
                this$1._send({
                    event: event,
                    _chunk: chunk,
                    last: index === lastIndex
                });
            });
            this._flush();
        }
        else if (this._time === null) {
            this._send([{ event: event, payload: payload }]);
            this._time = Date.now();
        }
        else {
            this._batchingQueue.push({
                event: event,
                payload: payload
            });
            var now = Date.now();
            if (now - this._time > BATCH_DURATION) {
                this._flush();
            }
            else {
                this._timer = setTimeout(function () { return this$1._flush(); }, BATCH_DURATION);
            }
        }
    };
    /**
     * Log a message to the devtools background page.
     */
    Bridge.prototype.log = function log (message) {
        this.send('log', message);
    };
    Bridge.prototype._flush = function _flush () {
        if (this._batchingQueue.length)
            { this._send(this._batchingQueue); }
        clearTimeout(this._timer);
        this._batchingQueue = [];
        this._time = null;
    };
    // @TODO types
    Bridge.prototype._emit = function _emit (message) {
        if (typeof message === 'string') {
            this.emit(message);
        }
        else if (message._chunk) {
            this._receivingQueue.push(message._chunk);
            if (message.last) {
                this.emit(message.event, this._receivingQueue);
                this._receivingQueue = [];
            }
        }
        else if (message.event) {
            this.emit(message.event, message.payload);
        }
    };
    // @TODO types
    Bridge.prototype._send = function _send (messages) {
        this._sendingQueue.push(messages);
        this._nextSend();
    };
    Bridge.prototype._nextSend = function _nextSend () {
        var this$1 = this;

        if (!this._sendingQueue.length || this._sending)
            { return; }
        this._sending = true;
        var messages = this._sendingQueue.shift();
        try {
            this.wall.send(messages);
        }
        catch (err) {
            if (err.message === 'Message length exceeded maximum allowed length.') {
                this._sendingQueue.splice(0, 0, messages.map(function (message) { return [message]; }));
            }
        }
        this._sending = false;
        requestAnimationFrame(function () { return this$1._nextSend(); });
    };

    return Bridge;
}(events_1.EventEmitter));
exports.Bridge = Bridge;
//# sourceMappingURL=bridge.js.map

/***/ }),

/***/ "../shared-utils/lib/consts.js":
/*!*************************************!*\
  !*** ../shared-utils/lib/consts.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HookEvents = exports.BridgeSubscriptions = exports.BridgeEvents = exports.BuiltinTabs = void 0;
var BuiltinTabs;
(function (BuiltinTabs) {
    BuiltinTabs["COMPONENTS"] = "components";
    BuiltinTabs["TIMELINE"] = "timeline";
    BuiltinTabs["PLUGINS"] = "plugins";
    BuiltinTabs["SETTINGS"] = "settings";
})(BuiltinTabs = exports.BuiltinTabs || (exports.BuiltinTabs = {}));
var BridgeEvents;
(function (BridgeEvents) {
    // Misc
    BridgeEvents["TO_BACK_SUBSCRIBE"] = "b:subscribe";
    BridgeEvents["TO_BACK_UNSUBSCRIBE"] = "b:unsubscribe";
    /** Backend is ready */
    BridgeEvents["TO_FRONT_READY"] = "f:ready";
    /** Displays the "detected Vue" console log */
    BridgeEvents["TO_BACK_LOG_DETECTED_VUE"] = "b:log-detected-vue";
    /** Force refresh */
    BridgeEvents["TO_BACK_REFRESH"] = "b:refresh";
    /** Tab was switched */
    BridgeEvents["TO_BACK_TAB_SWITCH"] = "b:tab:switch";
    BridgeEvents["TO_BACK_LOG"] = "b:log";
    // Apps
    /** App was registered */
    BridgeEvents["TO_FRONT_APP_ADD"] = "f:app:add";
    /** Get app list */
    BridgeEvents["TO_BACK_APP_LIST"] = "b:app:list";
    BridgeEvents["TO_FRONT_APP_LIST"] = "f:app:list";
    BridgeEvents["TO_FRONT_APP_REMOVE"] = "f:app:remove";
    BridgeEvents["TO_BACK_APP_SELECT"] = "b:app:select";
    BridgeEvents["TO_FRONT_APP_SELECTED"] = "f:app:selected";
    // Components
    BridgeEvents["TO_BACK_COMPONENT_TREE"] = "b:component:tree";
    BridgeEvents["TO_FRONT_COMPONENT_TREE"] = "f:component:tree";
    BridgeEvents["TO_BACK_COMPONENT_SELECTED_DATA"] = "b:component:selected-data";
    BridgeEvents["TO_FRONT_COMPONENT_SELECTED_DATA"] = "f:component:selected-data";
    BridgeEvents["TO_BACK_COMPONENT_EXPAND"] = "b:component:expand";
    BridgeEvents["TO_FRONT_COMPONENT_EXPAND"] = "f:component:expand";
    BridgeEvents["TO_BACK_COMPONENT_SCROLL_TO"] = "b:component:scroll-to";
    BridgeEvents["TO_BACK_COMPONENT_FILTER"] = "b:component:filter";
    BridgeEvents["TO_BACK_COMPONENT_MOUSE_OVER"] = "b:component:mouse-over";
    BridgeEvents["TO_BACK_COMPONENT_MOUSE_OUT"] = "b:component:mouse-out";
    BridgeEvents["TO_BACK_COMPONENT_CONTEXT_MENU_TARGET"] = "b:component:context-menu-target";
    BridgeEvents["TO_BACK_COMPONENT_EDIT_STATE"] = "b:component:edit-state";
    BridgeEvents["TO_BACK_COMPONENT_PICK"] = "b:component:pick";
    BridgeEvents["TO_FRONT_COMPONENT_PICK"] = "f:component:pick";
    BridgeEvents["TO_BACK_COMPONENT_PICK_CANCELED"] = "b:component:pick-canceled";
    BridgeEvents["TO_FRONT_COMPONENT_PICK_CANCELED"] = "f:component:pick-canceled";
    BridgeEvents["TO_BACK_COMPONENT_INSPECT_DOM"] = "b:component:inspect-dom";
    BridgeEvents["TO_FRONT_COMPONENT_INSPECT_DOM"] = "f:component:inspect-dom";
    BridgeEvents["TO_BACK_COMPONENT_RENDER_CODE"] = "b:component:render-code";
    BridgeEvents["TO_FRONT_COMPONENT_RENDER_CODE"] = "f:component:render-code";
    // Timeline
    BridgeEvents["TO_FRONT_TIMELINE_EVENT"] = "f:timeline:event";
    BridgeEvents["TO_BACK_TIMELINE_LAYER_LIST"] = "b:timeline:layer-list";
    BridgeEvents["TO_FRONT_TIMELINE_LAYER_LIST"] = "f:timeline:layer-list";
    BridgeEvents["TO_FRONT_TIMELINE_LAYER_ADD"] = "f:timeline:layer-add";
    BridgeEvents["TO_BACK_TIMELINE_SHOW_SCREENSHOT"] = "b:timeline:show-screenshot";
    BridgeEvents["TO_BACK_TIMELINE_CLEAR"] = "b:timeline:clear";
    BridgeEvents["TO_BACK_TIMELINE_EVENT_DATA"] = "b:timeline:event-data";
    BridgeEvents["TO_FRONT_TIMELINE_EVENT_DATA"] = "f:timeline:event-data";
    BridgeEvents["TO_BACK_TIMELINE_LAYER_LOAD_EVENTS"] = "b:timeline:layer-load-events";
    BridgeEvents["TO_FRONT_TIMELINE_LAYER_LOAD_EVENTS"] = "f:timeline:layer-load-events";
    // Plugins
    BridgeEvents["TO_BACK_DEVTOOLS_PLUGIN_LIST"] = "b:devtools-plugin:list";
    BridgeEvents["TO_FRONT_DEVTOOLS_PLUGIN_LIST"] = "f:devtools-plugin:list";
    BridgeEvents["TO_FRONT_DEVTOOLS_PLUGIN_ADD"] = "f:devtools-plugin:add";
    // Custom inspectors
    BridgeEvents["TO_BACK_CUSTOM_INSPECTOR_LIST"] = "b:custom-inspector:list";
    BridgeEvents["TO_FRONT_CUSTOM_INSPECTOR_LIST"] = "f:custom-inspector:list";
    BridgeEvents["TO_FRONT_CUSTOM_INSPECTOR_ADD"] = "f:custom-inspector:add";
    BridgeEvents["TO_BACK_CUSTOM_INSPECTOR_TREE"] = "b:custom-inspector:tree";
    BridgeEvents["TO_FRONT_CUSTOM_INSPECTOR_TREE"] = "f:custom-inspector:tree";
    BridgeEvents["TO_BACK_CUSTOM_INSPECTOR_STATE"] = "b:custom-inspector:state";
    BridgeEvents["TO_FRONT_CUSTOM_INSPECTOR_STATE"] = "f:custom-inspector:state";
    BridgeEvents["TO_BACK_CUSTOM_INSPECTOR_EDIT_STATE"] = "b:custom-inspector:edit-state";
    BridgeEvents["TO_BACK_CUSTOM_INSPECTOR_ACTION"] = "b:custom-inspector:action";
    BridgeEvents["TO_FRONT_CUSTOM_INSPECTOR_SELECT_NODE"] = "f:custom-inspector:select-node";
    // Custom state
    BridgeEvents["TO_BACK_CUSTOM_STATE_ACTION"] = "b:custom-state:action";
})(BridgeEvents = exports.BridgeEvents || (exports.BridgeEvents = {}));
var BridgeSubscriptions;
(function (BridgeSubscriptions) {
    BridgeSubscriptions["SELECTED_COMPONENT_DATA"] = "component:selected-data";
    BridgeSubscriptions["COMPONENT_TREE"] = "component:tree";
})(BridgeSubscriptions = exports.BridgeSubscriptions || (exports.BridgeSubscriptions = {}));
var HookEvents;
(function (HookEvents) {
    HookEvents["INIT"] = "init";
    HookEvents["APP_INIT"] = "app:init";
    HookEvents["APP_ADD"] = "app:add";
    HookEvents["APP_UNMOUNT"] = "app:unmount";
    HookEvents["COMPONENT_UPDATED"] = "component:updated";
    HookEvents["COMPONENT_ADDED"] = "component:added";
    HookEvents["COMPONENT_REMOVED"] = "component:removed";
    HookEvents["COMPONENT_EMIT"] = "component:emit";
    HookEvents["COMPONENT_HIGHLIGHT"] = "component:highlight";
    HookEvents["COMPONENT_UNHIGHLIGHT"] = "component:unhighlight";
    HookEvents["SETUP_DEVTOOLS_PLUGIN"] = "devtools-plugin:setup";
    HookEvents["TIMELINE_LAYER_ADDED"] = "timeline:layer-added";
    HookEvents["TIMELINE_EVENT_ADDED"] = "timeline:event-added";
    HookEvents["CUSTOM_INSPECTOR_ADD"] = "custom-inspector:add";
    HookEvents["CUSTOM_INSPECTOR_SEND_TREE"] = "custom-inspector:send-tree";
    HookEvents["CUSTOM_INSPECTOR_SEND_STATE"] = "custom-inspector:send-state";
    HookEvents["CUSTOM_INSPECTOR_SELECT_NODE"] = "custom-inspector:select-node";
    HookEvents["PERFORMANCE_START"] = "perf:start";
    HookEvents["PERFORMANCE_END"] = "perf:end";
    /**
     * @deprecated
     */
    HookEvents["FLUSH"] = "flush";
})(HookEvents = exports.HookEvents || (exports.HookEvents = {}));
//# sourceMappingURL=consts.js.map

/***/ }),

/***/ "../shared-utils/lib/env.js":
/*!**********************************!*\
  !*** ../shared-utils/lib/env.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.initEnv = exports.keys = exports.isLinux = exports.isMac = exports.isWindows = exports.isFirefox = exports.isChrome = exports.target = exports.isBrowser = void 0;
exports.isBrowser = typeof navigator !== 'undefined';
exports.target = exports.isBrowser
    ? window
    : typeof __webpack_require__.g !== 'undefined'
        ? __webpack_require__.g
        : {};
exports.isChrome = typeof exports.target.chrome !== 'undefined' && !!exports.target.chrome.devtools;
exports.isFirefox = exports.isBrowser && navigator.userAgent.indexOf('Firefox') > -1;
exports.isWindows = exports.isBrowser && navigator.platform.indexOf('Win') === 0;
exports.isMac = exports.isBrowser && navigator.platform === 'MacIntel';
exports.isLinux = exports.isBrowser && navigator.platform.indexOf('Linux') === 0;
exports.keys = {
    ctrl: exports.isMac ? '&#8984;' : 'Ctrl',
    shift: 'Shift',
    alt: exports.isMac ? '&#8997;' : 'Alt',
    del: 'Del',
    enter: 'Enter',
    esc: 'Esc'
};
function initEnv(Vue) {
    if (Vue.prototype.hasOwnProperty('$isChrome'))
        { return; }
    Object.defineProperties(Vue.prototype, {
        $isChrome: { get: function () { return exports.isChrome; } },
        $isFirefox: { get: function () { return exports.isFirefox; } },
        $isWindows: { get: function () { return exports.isWindows; } },
        $isMac: { get: function () { return exports.isMac; } },
        $isLinux: { get: function () { return exports.isLinux; } },
        $keys: { get: function () { return exports.keys; } }
    });
    if (exports.isWindows)
        { document.body.classList.add('platform-windows'); }
    if (exports.isMac)
        { document.body.classList.add('platform-mac'); }
    if (exports.isLinux)
        { document.body.classList.add('platform-linux'); }
}
exports.initEnv = initEnv;
//# sourceMappingURL=env.js.map

/***/ }),

/***/ "../shared-utils/lib/index.js":
/*!************************************!*\
  !*** ../shared-utils/lib/index.js ***!
  \************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) { k2 = k; }
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) { k2 = k; }
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) { if (p !== "default" && !exports.hasOwnProperty(p)) { __createBinding(exports, m, p); } }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(/*! ./backend */ "../shared-utils/lib/backend.js"), exports);
__exportStar(__webpack_require__(/*! ./bridge */ "../shared-utils/lib/bridge.js"), exports);
__exportStar(__webpack_require__(/*! ./consts */ "../shared-utils/lib/consts.js"), exports);
__exportStar(__webpack_require__(/*! ./env */ "../shared-utils/lib/env.js"), exports);
__exportStar(__webpack_require__(/*! ./plugin-permissions */ "../shared-utils/lib/plugin-permissions.js"), exports);
__exportStar(__webpack_require__(/*! ./shared-data */ "../shared-utils/lib/shared-data.js"), exports);
__exportStar(__webpack_require__(/*! ./shell */ "../shared-utils/lib/shell.js"), exports);
__exportStar(__webpack_require__(/*! ./storage */ "../shared-utils/lib/storage.js"), exports);
__exportStar(__webpack_require__(/*! ./transfer */ "../shared-utils/lib/transfer.js"), exports);
__exportStar(__webpack_require__(/*! ./util */ "../shared-utils/lib/util.js"), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "../shared-utils/lib/plugin-permissions.js":
/*!*************************************************!*\
  !*** ../shared-utils/lib/plugin-permissions.js ***!
  \*************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.setPluginPermission = exports.hasPluginPermission = exports.PluginPermission = void 0;
var shared_data_1 = __importDefault(__webpack_require__(/*! ./shared-data */ "../shared-utils/lib/shared-data.js"));
var PluginPermission;
(function (PluginPermission) {
    PluginPermission["ENABLED"] = "enabled";
    PluginPermission["COMPONENTS"] = "components";
    PluginPermission["CUSTOM_INSPECTOR"] = "custom-inspector";
    PluginPermission["TIMELINE"] = "timeline";
})(PluginPermission = exports.PluginPermission || (exports.PluginPermission = {}));
function hasPluginPermission(pluginId, permission) {
    var result = shared_data_1.default.pluginPermissions[(pluginId + ":" + permission)];
    if (result == null)
        { return true; }
    return !!result;
}
exports.hasPluginPermission = hasPluginPermission;
function setPluginPermission(pluginId, permission, active) {
    var obj;

    shared_data_1.default.pluginPermissions = Object.assign({}, shared_data_1.default.pluginPermissions,
        ( obj = {}, obj[(pluginId + ":" + permission)] = active, obj ));
}
exports.setPluginPermission = setPluginPermission;
//# sourceMappingURL=plugin-permissions.js.map

/***/ }),

/***/ "../shared-utils/lib/shared-data.js":
/*!******************************************!*\
  !*** ../shared-utils/lib/shared-data.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.watchSharedData = exports.destroySharedData = exports.onSharedDataInit = exports.initSharedData = void 0;
var storage_1 = __webpack_require__(/*! ./storage */ "../shared-utils/lib/storage.js");
var env_1 = __webpack_require__(/*! ./env */ "../shared-utils/lib/env.js");
// Initial state
var internalSharedData = {
    openInEditorHost: '/',
    componentNameStyle: 'class',
    theme: 'auto',
    displayDensity: 'low',
    timeFormat: 'default',
    recordVuex: true,
    cacheVuexSnapshotsEvery: 50,
    cacheVuexSnapshotsLimit: 10,
    snapshotLoading: false,
    performanceMonitoringEnabled: true,
    editableProps: false,
    logDetected: true,
    vuexNewBackend: false,
    vuexAutoload: false,
    vuexGroupGettersByModule: true,
    showMenuScrollTip: true,
    timelineTimeGrid: true,
    timelineScreenshots: true,
    menuStepScrolling: env_1.isMac,
    pluginPermissions: {}
};
var persisted = [
    'componentNameStyle',
    'theme',
    'displayDensity',
    'recordVuex',
    'editableProps',
    'logDetected',
    'vuexNewBackend',
    'vuexAutoload',
    'vuexGroupGettersByModule',
    'timeFormat',
    'showMenuScrollTip',
    'timelineTimeGrid',
    'timelineScreenshots',
    'menuStepScrolling',
    'pluginPermissions',
    'performanceMonitoringEnabled'
];
var storageVersion = '6.0.0-alpha.1';
// ---- INTERNALS ---- //
var bridge;
// List of fields to persist to storage (disabled if 'false')
// This should be unique to each shared data client to prevent conflicts
var persist = false;
var data;
var initRetryInterval;
var initRetryCount = 0;
var initCbs = [];
function initSharedData(params) {
    return new Promise(function (resolve) {
        // Mandatory params
        bridge = params.bridge;
        persist = !!params.persist;
        if (persist) {
            if (true)
                { console.log('[shared data] Master init in progress...'); }
            // Load persisted fields
            persisted.forEach(function (key) {
                var value = storage_1.getStorage(("vue-devtools-" + storageVersion + ":shared-data:" + key));
                if (value !== null) {
                    internalSharedData[key] = value;
                }
            });
            bridge.on('shared-data:load', function () {
                // Send all fields
                Object.keys(internalSharedData).forEach(function (key) {
                    sendValue(key, internalSharedData[key]);
                });
                bridge.send('shared-data:load-complete');
            });
            bridge.on('shared-data:init-complete', function () {
                if (true)
                    { console.log('[shared data] Master init complete'); }
                clearInterval(initRetryInterval);
                resolve();
            });
            bridge.send('shared-data:master-init-waiting');
            // In case backend init is executed after frontend
            bridge.on('shared-data:slave-init-waiting', function () {
                bridge.send('shared-data:master-init-waiting');
            });
            initRetryCount = 0;
            initRetryInterval = setInterval(function () {
                if (true)
                    { console.log('[shared data] Master init retrying...'); }
                bridge.send('shared-data:master-init-waiting');
                initRetryCount++;
                if (initRetryCount > 30) {
                    clearInterval(initRetryInterval);
                    console.error('[shared data] Master init failed');
                }
            }, 2000);
        }
        else {
            if (true)
                { console.log('[shared data] Slave init in progress...'); }
            bridge.on('shared-data:master-init-waiting', function () {
                if (true)
                    { console.log('[shared data] Slave loading data...'); }
                // Load all persisted shared data
                bridge.send('shared-data:load');
                bridge.once('shared-data:load-complete', function () {
                    if (true)
                        { console.log('[shared data] Slave init complete'); }
                    bridge.send('shared-data:init-complete');
                    resolve();
                });
            });
            bridge.send('shared-data:slave-init-waiting');
        }
        data = Object.assign({}, internalSharedData);
        if (params.Vue) {
            data = params.Vue.observable(data);
        }
        // Update value from other shared data clients
        bridge.on('shared-data:set', function (ref) {
            var key = ref.key;
            var value = ref.value;

            setValue(key, value);
        });
        initCbs.forEach(function (cb) { return cb(); });
    });
}
exports.initSharedData = initSharedData;
function onSharedDataInit(cb) {
    initCbs.push(cb);
    return function () {
        var index = initCbs.indexOf(cb);
        if (index !== -1)
            { initCbs.splice(index, 1); }
    };
}
exports.onSharedDataInit = onSharedDataInit;
function destroySharedData() {
    bridge.removeAllListeners('shared-data:set');
    watchers = {};
}
exports.destroySharedData = destroySharedData;
var watchers = {};
function setValue(key, value) {
    // Storage
    if (persist && persisted.includes(key)) {
        storage_1.setStorage(("vue-devtools-" + storageVersion + ":shared-data:" + key), value);
    }
    var oldValue = data[key];
    data[key] = value;
    var handlers = watchers[key];
    if (handlers) {
        handlers.forEach(function (h) { return h(value, oldValue); });
    }
    // Validate Proxy set trap
    return true;
}
function sendValue(key, value) {
    bridge && bridge.send('shared-data:set', {
        key: key,
        value: value
    });
}
function watchSharedData(prop, handler) {
    var list = watchers[prop] || (watchers[prop] = []);
    list.push(handler);
    return function () {
        var index = list.indexOf(handler);
        if (index !== -1)
            { list.splice(index, 1); }
    };
}
exports.watchSharedData = watchSharedData;
var proxy = {};
Object.keys(internalSharedData).forEach(function (key) {
    Object.defineProperty(proxy, key, {
        configurable: false,
        get: function () { return data[key]; },
        set: function (value) {
            sendValue(key, value);
            setValue(key, value);
        }
    });
});
exports.default = proxy;
//# sourceMappingURL=shared-data.js.map

/***/ }),

/***/ "../shared-utils/lib/shell.js":
/*!************************************!*\
  !*** ../shared-utils/lib/shell.js ***!
  \************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
//# sourceMappingURL=shell.js.map

/***/ }),

/***/ "../shared-utils/lib/storage.js":
/*!**************************************!*\
  !*** ../shared-utils/lib/storage.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.clearStorage = exports.removeStorage = exports.setStorage = exports.getStorage = exports.initStorage = void 0;
var env_1 = __webpack_require__(/*! ./env */ "../shared-utils/lib/env.js");
// If we can, we use the browser extension API to store data
// it's async though, so we synchronize changes from an intermediate
// storageData object
var useStorage = typeof env_1.target.chrome !== 'undefined' && typeof env_1.target.chrome.storage !== 'undefined';
var storageData = null;
function initStorage() {
    return new Promise(function (resolve) {
        if (useStorage) {
            env_1.target.chrome.storage.local.get(null, function (result) {
                storageData = result;
                resolve();
            });
        }
        else {
            storageData = {};
            resolve();
        }
    });
}
exports.initStorage = initStorage;
function getStorage(key, defaultValue) {
    if ( defaultValue === void 0 ) defaultValue = null;

    checkStorage();
    if (useStorage) {
        return getDefaultValue(storageData[key], defaultValue);
    }
    else {
        try {
            return getDefaultValue(JSON.parse(localStorage.getItem(key)), defaultValue);
        }
        catch (e) { }
    }
}
exports.getStorage = getStorage;
function setStorage(key, val) {
    var obj;

    checkStorage();
    if (useStorage) {
        storageData[key] = val;
        env_1.target.chrome.storage.local.set(( obj = {}, obj[key] = val, obj ));
    }
    else {
        try {
            localStorage.setItem(key, JSON.stringify(val));
        }
        catch (e) { }
    }
}
exports.setStorage = setStorage;
function removeStorage(key) {
    checkStorage();
    if (useStorage) {
        delete storageData[key];
        env_1.target.chrome.storage.local.remove([key]);
    }
    else {
        try {
            localStorage.removeItem(key);
        }
        catch (e) { }
    }
}
exports.removeStorage = removeStorage;
function clearStorage() {
    checkStorage();
    if (useStorage) {
        storageData = {};
        env_1.target.chrome.storage.local.clear();
    }
    else {
        try {
            localStorage.clear();
        }
        catch (e) { }
    }
}
exports.clearStorage = clearStorage;
function checkStorage() {
    if (!storageData) {
        throw new Error('Storage wasn\'t initialized with \'init()\'');
    }
}
function getDefaultValue(value, defaultValue) {
    if (value == null) {
        return defaultValue;
    }
    return value;
}
//# sourceMappingURL=storage.js.map

/***/ }),

/***/ "../shared-utils/lib/transfer.js":
/*!***************************************!*\
  !*** ../shared-utils/lib/transfer.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.stringifyStrictCircularAutoChunks = exports.parseCircularAutoChunks = exports.stringifyCircularAutoChunks = void 0;
var MAX_SERIALIZED_SIZE = 512 * 1024; // 1MB
function encode(data, replacer, list, seen) {
    var stored, key, value, i, l;
    var seenIndex = seen.get(data);
    if (seenIndex != null) {
        return seenIndex;
    }
    var index = list.length;
    var proto = Object.prototype.toString.call(data);
    if (proto === '[object Object]') {
        stored = {};
        seen.set(data, index);
        list.push(stored);
        var keys = Object.keys(data);
        for (i = 0, l = keys.length; i < l; i++) {
            key = keys[i];
            value = data[key];
            if (replacer)
                { value = replacer.call(data, key, value); }
            stored[key] = encode(value, replacer, list, seen);
        }
    }
    else if (proto === '[object Array]') {
        stored = [];
        seen.set(data, index);
        list.push(stored);
        for (i = 0, l = data.length; i < l; i++) {
            value = data[i];
            if (replacer)
                { value = replacer.call(data, i, value); }
            stored[i] = encode(value, replacer, list, seen);
        }
    }
    else {
        list.push(data);
    }
    return index;
}
function decode(list, reviver) {
    var i = list.length;
    var j, k, data, key, value, proto;
    while (i--) {
        data = list[i];
        proto = Object.prototype.toString.call(data);
        if (proto === '[object Object]') {
            var keys = Object.keys(data);
            for (j = 0, k = keys.length; j < k; j++) {
                key = keys[j];
                value = list[data[key]];
                if (reviver)
                    { value = reviver.call(data, key, value); }
                data[key] = value;
            }
        }
        else if (proto === '[object Array]') {
            for (j = 0, k = data.length; j < k; j++) {
                value = list[data[j]];
                if (reviver)
                    { value = reviver.call(data, j, value); }
                data[j] = value;
            }
        }
    }
}
function stringifyCircularAutoChunks(data, replacer, space) {
    if ( replacer === void 0 ) replacer = null;
    if ( space === void 0 ) space = null;

    var result;
    try {
        result = arguments.length === 1
            ? JSON.stringify(data)
            // @ts-ignore
            : JSON.stringify(data, replacer, space);
    }
    catch (e) {
        result = stringifyStrictCircularAutoChunks(data, replacer, space);
    }
    if (result.length > MAX_SERIALIZED_SIZE) {
        var chunkCount = Math.ceil(result.length / MAX_SERIALIZED_SIZE);
        var chunks = [];
        for (var i = 0; i < chunkCount; i++) {
            chunks.push(result.slice(i * MAX_SERIALIZED_SIZE, (i + 1) * MAX_SERIALIZED_SIZE));
        }
        return chunks;
    }
    return result;
}
exports.stringifyCircularAutoChunks = stringifyCircularAutoChunks;
function parseCircularAutoChunks(data, reviver) {
    if ( reviver === void 0 ) reviver = null;

    if (Array.isArray(data)) {
        data = data.join('');
    }
    var hasCircular = /^\s/.test(data);
    if (!hasCircular) {
        return arguments.length === 1
            ? JSON.parse(data)
            // @ts-ignore
            : JSON.parse(data, reviver);
    }
    else {
        var list = JSON.parse(data);
        decode(list, reviver);
        return list[0];
    }
}
exports.parseCircularAutoChunks = parseCircularAutoChunks;
function stringifyStrictCircularAutoChunks(data, replacer, space) {
    if ( replacer === void 0 ) replacer = null;
    if ( space === void 0 ) space = null;

    var list = [];
    encode(data, replacer, list, new Map());
    return space
        ? ' ' + JSON.stringify(list, null, space)
        : ' ' + JSON.stringify(list);
}
exports.stringifyStrictCircularAutoChunks = stringifyStrictCircularAutoChunks;
//# sourceMappingURL=transfer.js.map

/***/ }),

/***/ "../shared-utils/lib/util.js":
/*!***********************************!*\
  !*** ../shared-utils/lib/util.js ***!
  \***********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isEmptyObject = exports.copyToClipboard = exports.escape = exports.openInEditor = exports.focusInput = exports.has = exports.get = exports.set = exports.sortByKey = exports.searchDeepInObject = exports.isPlainObject = exports.revive = exports.parse = exports.getCustomRefDetails = exports.getCustomHTMLElementDetails = exports.getCustomFunctionDetails = exports.getCustomComponentDefinitionDetails = exports.getComponentName = exports.reviveSet = exports.getCustomSetDetails = exports.reviveMap = exports.getCustomMapDetails = exports.stringify = exports.specialTokenToString = exports.MAX_ARRAY_SIZE = exports.MAX_STRING_SIZE = exports.SPECIAL_TOKENS = exports.NAN = exports.NEGATIVE_INFINITY = exports.INFINITY = exports.UNDEFINED = exports.inDoc = exports.getComponentDisplayName = exports.kebabize = exports.camelize = exports.classify = void 0;
var path_1 = __importDefault(__webpack_require__(/*! path */ "../../node_modules/path-browserify/index.js"));
var transfer_1 = __webpack_require__(/*! ./transfer */ "../shared-utils/lib/transfer.js");
var backend_1 = __webpack_require__(/*! ./backend */ "../shared-utils/lib/backend.js");
var shared_data_1 = __importDefault(__webpack_require__(/*! ./shared-data */ "../shared-utils/lib/shared-data.js"));
var env_1 = __webpack_require__(/*! ./env */ "../shared-utils/lib/env.js");
function cached(fn) {
    var cache = Object.create(null);
    return function cachedFn(str) {
        var hit = cache[str];
        return hit || (cache[str] = fn(str));
    };
}
var classifyRE = /(?:^|[-_/])(\w)/g;
exports.classify = cached(function (str) {
    return str && str.replace(classifyRE, toUpper);
});
var camelizeRE = /-(\w)/g;
exports.camelize = cached(function (str) {
    return str.replace(camelizeRE, toUpper);
});
var kebabizeRE = /([a-z0-9])([A-Z])/g;
exports.kebabize = cached(function (str) {
    return str && str
        .replace(kebabizeRE, function (_, lowerCaseCharacter, upperCaseLetter) {
        return (lowerCaseCharacter + "-" + upperCaseLetter);
    })
        .toLowerCase();
});
function toUpper(_, c) {
    return c ? c.toUpperCase() : '';
}
function getComponentDisplayName(originalName, style) {
    if ( style === void 0 ) style = 'class';

    switch (style) {
        case 'class':
            return exports.classify(originalName);
        case 'kebab':
            return exports.kebabize(originalName);
        case 'original':
        default:
            return originalName;
    }
}
exports.getComponentDisplayName = getComponentDisplayName;
function inDoc(node) {
    if (!node)
        { return false; }
    var doc = node.ownerDocument.documentElement;
    var parent = node.parentNode;
    return doc === node ||
        doc === parent ||
        !!(parent && parent.nodeType === 1 && (doc.contains(parent)));
}
exports.inDoc = inDoc;
/**
 * Stringify/parse data using CircularJSON.
 */
exports.UNDEFINED = '__vue_devtool_undefined__';
exports.INFINITY = '__vue_devtool_infinity__';
exports.NEGATIVE_INFINITY = '__vue_devtool_negative_infinity__';
exports.NAN = '__vue_devtool_nan__';
exports.SPECIAL_TOKENS = {
    true: true,
    false: false,
    undefined: exports.UNDEFINED,
    null: null,
    '-Infinity': exports.NEGATIVE_INFINITY,
    Infinity: exports.INFINITY,
    NaN: exports.NAN
};
exports.MAX_STRING_SIZE = 10000;
exports.MAX_ARRAY_SIZE = 5000;
function specialTokenToString(value) {
    if (value === null) {
        return 'null';
    }
    else if (value === exports.UNDEFINED) {
        return 'undefined';
    }
    else if (value === exports.NAN) {
        return 'NaN';
    }
    else if (value === exports.INFINITY) {
        return 'Infinity';
    }
    else if (value === exports.NEGATIVE_INFINITY) {
        return '-Infinity';
    }
    return false;
}
exports.specialTokenToString = specialTokenToString;
/**
 * Needed to prevent stack overflow
 * while replacing complex objects
 * like components because we create
 * new objects with the CustomValue API
 * (.i.e `{ _custom: { ... } }`)
 */
var EncodeCache = function EncodeCache() {
      this.map = new Map();
  };
  /**
   * Returns a result unique to each input data
   * @param {*} data Input data
   * @param {*} factory Function used to create the unique result
   */
  EncodeCache.prototype.cache = function cache (data, factory) {
      var cached = this.map.get(data);
      if (cached) {
          return cached;
      }
      else {
          var result = factory(data);
          this.map.set(data, result);
          return result;
      }
  };
  EncodeCache.prototype.clear = function clear () {
      this.map.clear();
  };
var encodeCache = new EncodeCache();
var ReviveCache = function ReviveCache(maxSize) {
      this.maxSize = maxSize;
      this.map = new Map();
      this.index = 0;
      this.size = 0;
  };
  ReviveCache.prototype.cache = function cache (value) {
      var currentIndex = this.index;
      this.map.set(currentIndex, value);
      this.size++;
      if (this.size > this.maxSize) {
          this.map.delete(currentIndex - this.size);
          this.size--;
      }
      this.index++;
      return currentIndex;
  };
  ReviveCache.prototype.read = function read (id) {
      return this.map.get(id);
  };
var reviveCache = new ReviveCache(1000);
function stringify(data) {
    // Create a fresh cache for each serialization
    encodeCache.clear();
    return transfer_1.stringifyCircularAutoChunks(data, replacer);
}
exports.stringify = stringify;
function replacer(key) {
    // @ts-ignore
    var val = this[key];
    var type = typeof val;
    if (Array.isArray(val)) {
        var l = val.length;
        if (l > exports.MAX_ARRAY_SIZE) {
            return {
                _isArray: true,
                length: l,
                items: val.slice(0, exports.MAX_ARRAY_SIZE)
            };
        }
        return val;
    }
    else if (typeof val === 'string') {
        if (val.length > exports.MAX_STRING_SIZE) {
            return val.substr(0, exports.MAX_STRING_SIZE) + "... (" + ((val.length)) + " total length)";
        }
        else {
            return val;
        }
    }
    else if (type === 'undefined') {
        return exports.UNDEFINED;
    }
    else if (val === Infinity) {
        return exports.INFINITY;
    }
    else if (val === -Infinity) {
        return exports.NEGATIVE_INFINITY;
    }
    else if (type === 'function') {
        return getCustomFunctionDetails(val);
    }
    else if (type === 'symbol') {
        return ("[native Symbol " + (Symbol.prototype.toString.call(val)) + "]");
    }
    else if (val !== null && type === 'object') {
        var proto = Object.prototype.toString.call(val);
        if (proto === '[object Map]') {
            return encodeCache.cache(val, function () { return getCustomMapDetails(val); });
        }
        else if (proto === '[object Set]') {
            return encodeCache.cache(val, function () { return getCustomSetDetails(val); });
        }
        else if (proto === '[object RegExp]') {
            // special handling of native type
            return ("[native RegExp " + (RegExp.prototype.toString.call(val)) + "]");
        }
        else if (proto === '[object Date]') {
            return ("[native Date " + (Date.prototype.toString.call(val)) + "]");
        }
        else if (proto === '[object Error]') {
            return ("[native Error " + (val.message) + "<>" + (val.stack) + "]");
        }
        else if (val.state && val._vm) {
            return encodeCache.cache(val, function () { return backend_1.getCustomStoreDetails(val); });
        }
        else if (val.constructor && val.constructor.name === 'VueRouter') {
            return encodeCache.cache(val, function () { return backend_1.getCustomRouterDetails(val); });
        }
        else if (backend_1.isVueInstance(val)) {
            return encodeCache.cache(val, function () { return backend_1.getCustomInstanceDetails(val); });
        }
        else if (typeof val.render === 'function') {
            return encodeCache.cache(val, function () { return getCustomComponentDefinitionDetails(val); });
        }
        else if (val.constructor && val.constructor.name === 'VNode') {
            return ("[native VNode <" + (val.tag) + ">]");
        }
        else if (val instanceof HTMLElement) {
            return encodeCache.cache(val, function () { return getCustomHTMLElementDetails(val); });
        }
    }
    else if (Number.isNaN(val)) {
        return exports.NAN;
    }
    return sanitize(val);
}
function getCustomMapDetails(val) {
    var list = [];
    val.forEach(function (value, key) { return list.push({
        key: key,
        value: value
    }); });
    return {
        _custom: {
            type: 'map',
            display: 'Map',
            value: list,
            readOnly: true,
            fields: {
                abstract: true
            }
        }
    };
}
exports.getCustomMapDetails = getCustomMapDetails;
function reviveMap(val) {
    var result = new Map();
    var list = val._custom.value;
    for (var i = 0; i < list.length; i++) {
        var ref = list[i];
        var key = ref.key;
        var value = ref.value;
        result.set(key, revive(value));
    }
    return result;
}
exports.reviveMap = reviveMap;
function getCustomSetDetails(val) {
    var list = Array.from(val);
    return {
        _custom: {
            type: 'set',
            display: ("Set[" + (list.length) + "]"),
            value: list,
            readOnly: true
        }
    };
}
exports.getCustomSetDetails = getCustomSetDetails;
function reviveSet(val) {
    var result = new Set();
    var list = val._custom.value;
    for (var i = 0; i < list.length; i++) {
        var value = list[i];
        result.add(revive(value));
    }
    return result;
}
exports.reviveSet = reviveSet;
// Use a custom basename functions instead of the shimed version
// because it doesn't work on Windows
function basename(filename, ext) {
    return path_1.default.basename(filename.replace(/^[a-zA-Z]:/, '').replace(/\\/g, '/'), ext);
}
function getComponentName(options) {
    var name = options.displayName || options.name || options._componentTag;
    if (name) {
        return name;
    }
    var file = options.__file; // injected by vue-loader
    if (file) {
        return exports.classify(basename(file, '.vue'));
    }
}
exports.getComponentName = getComponentName;
function getCustomComponentDefinitionDetails(def) {
    var display = getComponentName(def);
    if (display) {
        if (def.name && def.__file) {
            display += " <span>(" + (def.__file) + ")</span>";
        }
    }
    else {
        display = '<i>Unknown Component</i>';
    }
    return {
        _custom: Object.assign({}, {type: 'component-definition',
            display: display,
            tooltip: 'Component definition'},
            def.__file
                ? {
                    file: def.__file
                }
                : {})
    };
}
exports.getCustomComponentDefinitionDetails = getCustomComponentDefinitionDetails;
// eslint-disable-next-line @typescript-eslint/ban-types
function getCustomFunctionDetails(func) {
    var string = '';
    var matches = null;
    try {
        string = Function.prototype.toString.call(func);
        matches = String.prototype.match.call(string, /\([\s\S]*?\)/);
    }
    catch (e) {
        // Func is probably a Proxy, which can break Function.prototype.toString()
    }
    // Trim any excess whitespace from the argument string
    var match = matches && matches[0];
    var args = typeof match === 'string'
        ? ("(" + (match.substr(1, match.length - 2).split(',').map(function (a) { return a.trim(); }).join(', ')) + ")")
        : '(?)';
    var name = typeof func.name === 'string' ? func.name : '';
    return {
        _custom: {
            type: 'function',
            display: ("<span>f</span> " + (escape(name)) + args),
            _reviveId: reviveCache.cache(func)
        }
    };
}
exports.getCustomFunctionDetails = getCustomFunctionDetails;
function getCustomHTMLElementDetails(value) {
    return {
        _custom: {
            type: 'HTMLElement',
            display: ("<span class=\"opacity-30\">&lt;</span><span class=\"text-blue-500\">" + (value.tagName.toLowerCase()) + "</span><span class=\"opacity-30\">&gt;</span>"),
            value: namedNodeMapToObject(value.attributes),
            actions: [
                {
                    icon: 'input',
                    tooltip: 'Log element to console',
                    action: function () {
                        console.log(value);
                    }
                }
            ]
        }
    };
}
exports.getCustomHTMLElementDetails = getCustomHTMLElementDetails;
function namedNodeMapToObject(map) {
    var result = {};
    var l = map.length;
    for (var i = 0; i < l; i++) {
        var node = map.item(i);
        result[node.name] = node.value;
    }
    return result;
}
function getCustomRefDetails(instance, key, ref) {
    var value;
    if (Array.isArray(ref)) {
        value = ref.map(function (r) { return getCustomRefDetails(instance, key, r); }).map(function (data) { return data.value; });
    }
    else {
        var name;
        if (ref._isVue) {
            name = getComponentName(ref.$options);
        }
        else {
            name = ref.tagName.toLowerCase();
        }
        value = {
            _custom: {
                display: "&lt;" + name +
                    (ref.id ? (" <span class=\"attr-title\">id</span>=\"" + (ref.id) + "\"") : '') +
                    (ref.className ? (" <span class=\"attr-title\">class</span>=\"" + (ref.className) + "\"") : '') + '&gt;',
                uid: instance.__VUE_DEVTOOLS_UID__,
                type: 'reference'
            }
        };
    }
    return {
        type: '$refs',
        key: key,
        value: value,
        editable: false
    };
}
exports.getCustomRefDetails = getCustomRefDetails;
function parse(data, revive) {
    if ( revive === void 0 ) revive = false;

    return revive
        ? transfer_1.parseCircularAutoChunks(data, reviver)
        : transfer_1.parseCircularAutoChunks(data);
}
exports.parse = parse;
var specialTypeRE = /^\[native (\w+) (.*?)(<>((.|\s)*))?\]$/;
var symbolRE = /^\[native Symbol Symbol\((.*)\)\]$/;
function reviver(key, val) {
    return revive(val);
}
function revive(val) {
    if (val === exports.UNDEFINED) {
        return undefined;
    }
    else if (val === exports.INFINITY) {
        return Infinity;
    }
    else if (val === exports.NEGATIVE_INFINITY) {
        return -Infinity;
    }
    else if (val === exports.NAN) {
        return NaN;
    }
    else if (val && val._custom) {
        var custom = val._custom;
        if (custom.type === 'component') {
            return backend_1.getInstanceMap().get(custom.id);
        }
        else if (custom.type === 'map') {
            return reviveMap(val);
        }
        else if (custom.type === 'set') {
            return reviveSet(val);
        }
        else if (custom._reviveId) {
            return reviveCache.read(custom._reviveId);
        }
        else {
            return revive(custom.value);
        }
    }
    else if (symbolRE.test(val)) {
        var ref = symbolRE.exec(val);
        var string = ref[1];
        return Symbol.for(string);
    }
    else if (specialTypeRE.test(val)) {
        var ref$1 = specialTypeRE.exec(val);
        var type = ref$1[1];
        var string$1 = ref$1[2];
        var details = ref$1[4];
        var result = new window[type](string$1);
        if (type === 'Error' && details) {
            result.stack = details;
        }
        return result;
    }
    else {
        return val;
    }
}
exports.revive = revive;
/**
 * Sanitize data to be posted to the other side.
 * Since the message posted is sent with structured clone,
 * we need to filter out any types that might cause an error.
 *
 * @param {*} data
 * @return {*}
 */
function sanitize(data) {
    if (!isPrimitive(data) &&
        !Array.isArray(data) &&
        !isPlainObject(data)) {
        // handle types that will probably cause issues in
        // the structured clone
        return Object.prototype.toString.call(data);
    }
    else {
        return data;
    }
}
function isPlainObject(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]';
}
exports.isPlainObject = isPlainObject;
function isPrimitive(data) {
    if (data == null) {
        return true;
    }
    var type = typeof data;
    return (type === 'string' ||
        type === 'number' ||
        type === 'boolean');
}
/**
 * Searches a key or value in the object, with a maximum deepness
 * @param {*} obj Search target
 * @param {string} searchTerm Search string
 * @returns {boolean} Search match
 */
function searchDeepInObject(obj, searchTerm) {
    var seen = new Map();
    var result = internalSearchObject(obj, searchTerm.toLowerCase(), seen, 0);
    seen.clear();
    return result;
}
exports.searchDeepInObject = searchDeepInObject;
var SEARCH_MAX_DEPTH = 10;
/**
 * Executes a search on each field of the provided object
 * @param {*} obj Search target
 * @param {string} searchTerm Search string
 * @param {Map<any,boolean>} seen Map containing the search result to prevent stack overflow by walking on the same object multiple times
 * @param {number} depth Deep search depth level, which is capped to prevent performance issues
 * @returns {boolean} Search match
 */
function internalSearchObject(obj, searchTerm, seen, depth) {
    if (depth > SEARCH_MAX_DEPTH) {
        return false;
    }
    var match = false;
    var keys = Object.keys(obj);
    var key, value;
    for (var i = 0; i < keys.length; i++) {
        key = keys[i];
        value = obj[key];
        match = internalSearchCheck(searchTerm, key, value, seen, depth + 1);
        if (match) {
            break;
        }
    }
    return match;
}
/**
 * Executes a search on each value of the provided array
 * @param {*} array Search target
 * @param {string} searchTerm Search string
 * @param {Map<any,boolean>} seen Map containing the search result to prevent stack overflow by walking on the same object multiple times
 * @param {number} depth Deep search depth level, which is capped to prevent performance issues
 * @returns {boolean} Search match
 */
function internalSearchArray(array, searchTerm, seen, depth) {
    if (depth > SEARCH_MAX_DEPTH) {
        return false;
    }
    var match = false;
    var value;
    for (var i = 0; i < array.length; i++) {
        value = array[i];
        match = internalSearchCheck(searchTerm, null, value, seen, depth + 1);
        if (match) {
            break;
        }
    }
    return match;
}
/**
 * Checks if the provided field matches the search terms
 * @param {string} searchTerm Search string
 * @param {string} key Field key (null if from array)
 * @param {*} value Field value
 * @param {Map<any,boolean>} seen Map containing the search result to prevent stack overflow by walking on the same object multiple times
 * @param {number} depth Deep search depth level, which is capped to prevent performance issues
 * @returns {boolean} Search match
 */
function internalSearchCheck(searchTerm, key, value, seen, depth) {
    var match = false;
    var result;
    if (key === '_custom') {
        key = value.display;
        value = value.value;
    }
    (result = specialTokenToString(value)) && (value = result);
    if (key && compare(key, searchTerm)) {
        match = true;
        seen.set(value, true);
    }
    else if (seen.has(value)) {
        match = seen.get(value);
    }
    else if (Array.isArray(value)) {
        seen.set(value, null);
        match = internalSearchArray(value, searchTerm, seen, depth);
        seen.set(value, match);
    }
    else if (isPlainObject(value)) {
        seen.set(value, null);
        match = internalSearchObject(value, searchTerm, seen, depth);
        seen.set(value, match);
    }
    else if (compare(value, searchTerm)) {
        match = true;
        seen.set(value, true);
    }
    return match;
}
/**
 * Compares two values
 * @param {*} value Mixed type value that will be cast to string
 * @param {string} searchTerm Search string
 * @returns {boolean} Search match
 */
function compare(value, searchTerm) {
    return ('' + value).toLowerCase().indexOf(searchTerm) !== -1;
}
function sortByKey(state) {
    return state && state.slice().sort(function (a, b) {
        if (a.key < b.key)
            { return -1; }
        if (a.key > b.key)
            { return 1; }
        return 0;
    });
}
exports.sortByKey = sortByKey;
function set(object, path, value, cb) {
    if ( cb === void 0 ) cb = null;

    var sections = Array.isArray(path) ? path : path.split('.');
    while (sections.length > 1) {
        object = object[sections.shift()];
    }
    var field = sections[0];
    if (cb) {
        cb(object, field, value);
    }
    else {
        object[field] = value;
    }
}
exports.set = set;
function get(object, path) {
    var sections = Array.isArray(path) ? path : path.split('.');
    for (var i = 0; i < sections.length; i++) {
        object = object[sections[i]];
        if (!object) {
            return undefined;
        }
    }
    return object;
}
exports.get = get;
function has(object, path, parent) {
    if ( parent === void 0 ) parent = false;

    if (typeof object === 'undefined') {
        return false;
    }
    var sections = Array.isArray(path) ? path.slice() : path.split('.');
    var size = !parent ? 1 : 2;
    while (object && sections.length > size) {
        object = object[sections.shift()];
    }
    return object != null && Object.prototype.hasOwnProperty.call(object, sections[0]);
}
exports.has = has;
function focusInput(el) {
    el.focus();
    el.setSelectionRange(0, el.value.length);
}
exports.focusInput = focusInput;
function openInEditor(file) {
    // Console display
    var fileName = file.replace(/\\/g, '\\\\');
    var src = "fetch('" + (shared_data_1.default.openInEditorHost) + "__open-in-editor?file=" + (encodeURI(file)) + "').then(response => {\n    if (response.ok) {\n      console.log('File " + fileName + " opened in editor')\n    } else {\n      const msg = 'Opening component " + fileName + " failed'\n      const target = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : {}\n      if (target.__VUE_DEVTOOLS_TOAST__) {\n        target.__VUE_DEVTOOLS_TOAST__(msg, 'error')\n      } else {\n        console.log('%c' + msg, 'color:red')\n      }\n      console.log('Check the setup of your project, see https://github.com/vuejs/vue-devtools/blob/master/docs/open-in-editor.md')\n    }\n  })";
    if (env_1.isChrome) {
        env_1.target.chrome.devtools.inspectedWindow.eval(src);
    }
    else {
        // eslint-disable-next-line no-eval
        eval(src);
    }
}
exports.openInEditor = openInEditor;
var ESC = {
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    '&': '&amp;'
};
function escape(s) {
    return s.replace(/[<>"&]/g, escapeChar);
}
exports.escape = escape;
function escapeChar(a) {
    return ESC[a] || a;
}
function copyToClipboard(state) {
    if (typeof document === 'undefined')
        { return; }
    var dummyTextArea = document.createElement('textarea');
    dummyTextArea.textContent = stringify(state);
    document.body.appendChild(dummyTextArea);
    dummyTextArea.select();
    document.execCommand('copy');
    document.body.removeChild(dummyTextArea);
}
exports.copyToClipboard = copyToClipboard;
function isEmptyObject(obj) {
    return obj === exports.UNDEFINED || !obj || Object.keys(obj).length === 0;
}
exports.isEmptyObject = isEmptyObject;
//# sourceMappingURL=util.js.map

/***/ }),

/***/ "../../node_modules/component-bind/index.js":
/*!**************************************************!*\
  !*** ../../node_modules/component-bind/index.js ***!
  \**************************************************/
/***/ ((module) => {

/**
 * Slice reference.
 */

var slice = [].slice;

/**
 * Bind `obj` to `fn`.
 *
 * @param {Object} obj
 * @param {Function|String} fn or string
 * @return {Function}
 * @api public
 */

module.exports = function(obj, fn){
  if ('string' == typeof fn) fn = obj[fn];
  if ('function' != typeof fn) throw new Error('bind() requires a function');
  var args = slice.call(arguments, 2);
  return function(){
    return fn.apply(obj, args.concat(slice.call(arguments)));
  }
};


/***/ }),

/***/ "../../node_modules/component-emitter/index.js":
/*!*****************************************************!*\
  !*** ../../node_modules/component-emitter/index.js ***!
  \*****************************************************/
/***/ ((module) => {


/**
 * Expose `Emitter`.
 */

if (true) {
  module.exports = Emitter;
}

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks['$' + event] = this._callbacks['$' + event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  function on() {
    this.off(event, on);
    fn.apply(this, arguments);
  }

  on.fn = fn;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks['$' + event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks['$' + event];
    return this;
  }

  // remove specific handler
  var cb;
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }

  // Remove event specific arrays for event types that no
  // one is subscribed for to avoid memory leak.
  if (callbacks.length === 0) {
    delete this._callbacks['$' + event];
  }

  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};

  var args = new Array(arguments.length - 1)
    , callbacks = this._callbacks['$' + event];

  for (var i = 1; i < arguments.length; i++) {
    args[i - 1] = arguments[i];
  }

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks['$' + event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};


/***/ }),

/***/ "../../node_modules/component-inherit/index.js":
/*!*****************************************************!*\
  !*** ../../node_modules/component-inherit/index.js ***!
  \*****************************************************/
/***/ ((module) => {


module.exports = function(a, b){
  var fn = function(){};
  fn.prototype = b.prototype;
  a.prototype = new fn;
  a.prototype.constructor = a;
};

/***/ }),

/***/ "../../node_modules/engine.io-client/lib/globalThis.browser.js":
/*!*********************************************************************!*\
  !*** ../../node_modules/engine.io-client/lib/globalThis.browser.js ***!
  \*********************************************************************/
/***/ ((module) => {

module.exports = (function () {
  if (typeof self !== 'undefined') {
    return self;
  } else if (typeof window !== 'undefined') {
    return window;
  } else {
    return Function('return this')(); // eslint-disable-line no-new-func
  }
})();


/***/ }),

/***/ "../../node_modules/engine.io-client/lib/index.js":
/*!********************************************************!*\
  !*** ../../node_modules/engine.io-client/lib/index.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


module.exports = __webpack_require__(/*! ./socket */ "../../node_modules/engine.io-client/lib/socket.js");

/**
 * Exports parser
 *
 * @api public
 *
 */
module.exports.parser = __webpack_require__(/*! engine.io-parser */ "../../node_modules/engine.io-parser/lib/browser.js");


/***/ }),

/***/ "../../node_modules/engine.io-client/lib/socket.js":
/*!*********************************************************!*\
  !*** ../../node_modules/engine.io-client/lib/socket.js ***!
  \*********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * Module dependencies.
 */

var transports = __webpack_require__(/*! ./transports/index */ "../../node_modules/engine.io-client/lib/transports/index.js");
var Emitter = __webpack_require__(/*! component-emitter */ "../../node_modules/component-emitter/index.js");
var debug = __webpack_require__(/*! debug */ "../../node_modules/engine.io-client/node_modules/debug/src/browser.js")('engine.io-client:socket');
var index = __webpack_require__(/*! indexof */ "../../node_modules/indexof/index.js");
var parser = __webpack_require__(/*! engine.io-parser */ "../../node_modules/engine.io-parser/lib/browser.js");
var parseuri = __webpack_require__(/*! parseuri */ "../../node_modules/parseuri/index.js");
var parseqs = __webpack_require__(/*! parseqs */ "../../node_modules/parseqs/index.js");

/**
 * Module exports.
 */

module.exports = Socket;

/**
 * Socket constructor.
 *
 * @param {String|Object} uri or options
 * @param {Object} options
 * @api public
 */

function Socket (uri, opts) {
  if (!(this instanceof Socket)) return new Socket(uri, opts);

  opts = opts || {};

  if (uri && 'object' === typeof uri) {
    opts = uri;
    uri = null;
  }

  if (uri) {
    uri = parseuri(uri);
    opts.hostname = uri.host;
    opts.secure = uri.protocol === 'https' || uri.protocol === 'wss';
    opts.port = uri.port;
    if (uri.query) opts.query = uri.query;
  } else if (opts.host) {
    opts.hostname = parseuri(opts.host).host;
  }

  this.secure = null != opts.secure ? opts.secure
    : (typeof location !== 'undefined' && 'https:' === location.protocol);

  if (opts.hostname && !opts.port) {
    // if no port is specified manually, use the protocol default
    opts.port = this.secure ? '443' : '80';
  }

  this.agent = opts.agent || false;
  this.hostname = opts.hostname ||
    (typeof location !== 'undefined' ? location.hostname : 'localhost');
  this.port = opts.port || (typeof location !== 'undefined' && location.port
      ? location.port
      : (this.secure ? 443 : 80));
  this.query = opts.query || {};
  if ('string' === typeof this.query) this.query = parseqs.decode(this.query);
  this.upgrade = false !== opts.upgrade;
  this.path = (opts.path || '/engine.io').replace(/\/$/, '') + '/';
  this.forceJSONP = !!opts.forceJSONP;
  this.jsonp = false !== opts.jsonp;
  this.forceBase64 = !!opts.forceBase64;
  this.enablesXDR = !!opts.enablesXDR;
  this.withCredentials = false !== opts.withCredentials;
  this.timestampParam = opts.timestampParam || 't';
  this.timestampRequests = opts.timestampRequests;
  this.transports = opts.transports || ['polling', 'websocket'];
  this.transportOptions = opts.transportOptions || {};
  this.readyState = '';
  this.writeBuffer = [];
  this.prevBufferLen = 0;
  this.policyPort = opts.policyPort || 843;
  this.rememberUpgrade = opts.rememberUpgrade || false;
  this.binaryType = null;
  this.onlyBinaryUpgrades = opts.onlyBinaryUpgrades;
  this.perMessageDeflate = false !== opts.perMessageDeflate ? (opts.perMessageDeflate || {}) : false;

  if (true === this.perMessageDeflate) this.perMessageDeflate = {};
  if (this.perMessageDeflate && null == this.perMessageDeflate.threshold) {
    this.perMessageDeflate.threshold = 1024;
  }

  // SSL options for Node.js client
  this.pfx = opts.pfx || undefined;
  this.key = opts.key || undefined;
  this.passphrase = opts.passphrase || undefined;
  this.cert = opts.cert || undefined;
  this.ca = opts.ca || undefined;
  this.ciphers = opts.ciphers || undefined;
  this.rejectUnauthorized = opts.rejectUnauthorized === undefined ? true : opts.rejectUnauthorized;
  this.forceNode = !!opts.forceNode;

  // detect ReactNative environment
  this.isReactNative = (typeof navigator !== 'undefined' && typeof navigator.product === 'string' && navigator.product.toLowerCase() === 'reactnative');

  // other options for Node.js or ReactNative client
  if (typeof self === 'undefined' || this.isReactNative) {
    if (opts.extraHeaders && Object.keys(opts.extraHeaders).length > 0) {
      this.extraHeaders = opts.extraHeaders;
    }

    if (opts.localAddress) {
      this.localAddress = opts.localAddress;
    }
  }

  // set on handshake
  this.id = null;
  this.upgrades = null;
  this.pingInterval = null;
  this.pingTimeout = null;

  // set on heartbeat
  this.pingIntervalTimer = null;
  this.pingTimeoutTimer = null;

  this.open();
}

Socket.priorWebsocketSuccess = false;

/**
 * Mix in `Emitter`.
 */

Emitter(Socket.prototype);

/**
 * Protocol version.
 *
 * @api public
 */

Socket.protocol = parser.protocol; // this is an int

/**
 * Expose deps for legacy compatibility
 * and standalone browser access.
 */

Socket.Socket = Socket;
Socket.Transport = __webpack_require__(/*! ./transport */ "../../node_modules/engine.io-client/lib/transport.js");
Socket.transports = __webpack_require__(/*! ./transports/index */ "../../node_modules/engine.io-client/lib/transports/index.js");
Socket.parser = __webpack_require__(/*! engine.io-parser */ "../../node_modules/engine.io-parser/lib/browser.js");

/**
 * Creates transport of the given type.
 *
 * @param {String} transport name
 * @return {Transport}
 * @api private
 */

Socket.prototype.createTransport = function (name) {
  debug('creating transport "%s"', name);
  var query = clone(this.query);

  // append engine.io protocol identifier
  query.EIO = parser.protocol;

  // transport name
  query.transport = name;

  // per-transport options
  var options = this.transportOptions[name] || {};

  // session id if we already have one
  if (this.id) query.sid = this.id;

  var transport = new transports[name]({
    query: query,
    socket: this,
    agent: options.agent || this.agent,
    hostname: options.hostname || this.hostname,
    port: options.port || this.port,
    secure: options.secure || this.secure,
    path: options.path || this.path,
    forceJSONP: options.forceJSONP || this.forceJSONP,
    jsonp: options.jsonp || this.jsonp,
    forceBase64: options.forceBase64 || this.forceBase64,
    enablesXDR: options.enablesXDR || this.enablesXDR,
    withCredentials: options.withCredentials || this.withCredentials,
    timestampRequests: options.timestampRequests || this.timestampRequests,
    timestampParam: options.timestampParam || this.timestampParam,
    policyPort: options.policyPort || this.policyPort,
    pfx: options.pfx || this.pfx,
    key: options.key || this.key,
    passphrase: options.passphrase || this.passphrase,
    cert: options.cert || this.cert,
    ca: options.ca || this.ca,
    ciphers: options.ciphers || this.ciphers,
    rejectUnauthorized: options.rejectUnauthorized || this.rejectUnauthorized,
    perMessageDeflate: options.perMessageDeflate || this.perMessageDeflate,
    extraHeaders: options.extraHeaders || this.extraHeaders,
    forceNode: options.forceNode || this.forceNode,
    localAddress: options.localAddress || this.localAddress,
    requestTimeout: options.requestTimeout || this.requestTimeout,
    protocols: options.protocols || void (0),
    isReactNative: this.isReactNative
  });

  return transport;
};

function clone (obj) {
  var o = {};
  for (var i in obj) {
    if (obj.hasOwnProperty(i)) {
      o[i] = obj[i];
    }
  }
  return o;
}

/**
 * Initializes transport to use and starts probe.
 *
 * @api private
 */
Socket.prototype.open = function () {
  var transport;
  if (this.rememberUpgrade && Socket.priorWebsocketSuccess && this.transports.indexOf('websocket') !== -1) {
    transport = 'websocket';
  } else if (0 === this.transports.length) {
    // Emit error on next tick so it can be listened to
    var self = this;
    setTimeout(function () {
      self.emit('error', 'No transports available');
    }, 0);
    return;
  } else {
    transport = this.transports[0];
  }
  this.readyState = 'opening';

  // Retry with the next transport if the transport is disabled (jsonp: false)
  try {
    transport = this.createTransport(transport);
  } catch (e) {
    this.transports.shift();
    this.open();
    return;
  }

  transport.open();
  this.setTransport(transport);
};

/**
 * Sets the current transport. Disables the existing one (if any).
 *
 * @api private
 */

Socket.prototype.setTransport = function (transport) {
  debug('setting transport %s', transport.name);
  var self = this;

  if (this.transport) {
    debug('clearing existing transport %s', this.transport.name);
    this.transport.removeAllListeners();
  }

  // set up transport
  this.transport = transport;

  // set up transport listeners
  transport
  .on('drain', function () {
    self.onDrain();
  })
  .on('packet', function (packet) {
    self.onPacket(packet);
  })
  .on('error', function (e) {
    self.onError(e);
  })
  .on('close', function () {
    self.onClose('transport close');
  });
};

/**
 * Probes a transport.
 *
 * @param {String} transport name
 * @api private
 */

Socket.prototype.probe = function (name) {
  debug('probing transport "%s"', name);
  var transport = this.createTransport(name, { probe: 1 });
  var failed = false;
  var self = this;

  Socket.priorWebsocketSuccess = false;

  function onTransportOpen () {
    if (self.onlyBinaryUpgrades) {
      var upgradeLosesBinary = !this.supportsBinary && self.transport.supportsBinary;
      failed = failed || upgradeLosesBinary;
    }
    if (failed) return;

    debug('probe transport "%s" opened', name);
    transport.send([{ type: 'ping', data: 'probe' }]);
    transport.once('packet', function (msg) {
      if (failed) return;
      if ('pong' === msg.type && 'probe' === msg.data) {
        debug('probe transport "%s" pong', name);
        self.upgrading = true;
        self.emit('upgrading', transport);
        if (!transport) return;
        Socket.priorWebsocketSuccess = 'websocket' === transport.name;

        debug('pausing current transport "%s"', self.transport.name);
        self.transport.pause(function () {
          if (failed) return;
          if ('closed' === self.readyState) return;
          debug('changing transport and sending upgrade packet');

          cleanup();

          self.setTransport(transport);
          transport.send([{ type: 'upgrade' }]);
          self.emit('upgrade', transport);
          transport = null;
          self.upgrading = false;
          self.flush();
        });
      } else {
        debug('probe transport "%s" failed', name);
        var err = new Error('probe error');
        err.transport = transport.name;
        self.emit('upgradeError', err);
      }
    });
  }

  function freezeTransport () {
    if (failed) return;

    // Any callback called by transport should be ignored since now
    failed = true;

    cleanup();

    transport.close();
    transport = null;
  }

  // Handle any error that happens while probing
  function onerror (err) {
    var error = new Error('probe error: ' + err);
    error.transport = transport.name;

    freezeTransport();

    debug('probe transport "%s" failed because of error: %s', name, err);

    self.emit('upgradeError', error);
  }

  function onTransportClose () {
    onerror('transport closed');
  }

  // When the socket is closed while we're probing
  function onclose () {
    onerror('socket closed');
  }

  // When the socket is upgraded while we're probing
  function onupgrade (to) {
    if (transport && to.name !== transport.name) {
      debug('"%s" works - aborting "%s"', to.name, transport.name);
      freezeTransport();
    }
  }

  // Remove all listeners on the transport and on self
  function cleanup () {
    transport.removeListener('open', onTransportOpen);
    transport.removeListener('error', onerror);
    transport.removeListener('close', onTransportClose);
    self.removeListener('close', onclose);
    self.removeListener('upgrading', onupgrade);
  }

  transport.once('open', onTransportOpen);
  transport.once('error', onerror);
  transport.once('close', onTransportClose);

  this.once('close', onclose);
  this.once('upgrading', onupgrade);

  transport.open();
};

/**
 * Called when connection is deemed open.
 *
 * @api public
 */

Socket.prototype.onOpen = function () {
  debug('socket open');
  this.readyState = 'open';
  Socket.priorWebsocketSuccess = 'websocket' === this.transport.name;
  this.emit('open');
  this.flush();

  // we check for `readyState` in case an `open`
  // listener already closed the socket
  if ('open' === this.readyState && this.upgrade && this.transport.pause) {
    debug('starting upgrade probes');
    for (var i = 0, l = this.upgrades.length; i < l; i++) {
      this.probe(this.upgrades[i]);
    }
  }
};

/**
 * Handles a packet.
 *
 * @api private
 */

Socket.prototype.onPacket = function (packet) {
  if ('opening' === this.readyState || 'open' === this.readyState ||
      'closing' === this.readyState) {
    debug('socket receive: type "%s", data "%s"', packet.type, packet.data);

    this.emit('packet', packet);

    // Socket is live - any packet counts
    this.emit('heartbeat');

    switch (packet.type) {
      case 'open':
        this.onHandshake(JSON.parse(packet.data));
        break;

      case 'pong':
        this.setPing();
        this.emit('pong');
        break;

      case 'error':
        var err = new Error('server error');
        err.code = packet.data;
        this.onError(err);
        break;

      case 'message':
        this.emit('data', packet.data);
        this.emit('message', packet.data);
        break;
    }
  } else {
    debug('packet received with socket readyState "%s"', this.readyState);
  }
};

/**
 * Called upon handshake completion.
 *
 * @param {Object} handshake obj
 * @api private
 */

Socket.prototype.onHandshake = function (data) {
  this.emit('handshake', data);
  this.id = data.sid;
  this.transport.query.sid = data.sid;
  this.upgrades = this.filterUpgrades(data.upgrades);
  this.pingInterval = data.pingInterval;
  this.pingTimeout = data.pingTimeout;
  this.onOpen();
  // In case open handler closes socket
  if ('closed' === this.readyState) return;
  this.setPing();

  // Prolong liveness of socket on heartbeat
  this.removeListener('heartbeat', this.onHeartbeat);
  this.on('heartbeat', this.onHeartbeat);
};

/**
 * Resets ping timeout.
 *
 * @api private
 */

Socket.prototype.onHeartbeat = function (timeout) {
  clearTimeout(this.pingTimeoutTimer);
  var self = this;
  self.pingTimeoutTimer = setTimeout(function () {
    if ('closed' === self.readyState) return;
    self.onClose('ping timeout');
  }, timeout || (self.pingInterval + self.pingTimeout));
};

/**
 * Pings server every `this.pingInterval` and expects response
 * within `this.pingTimeout` or closes connection.
 *
 * @api private
 */

Socket.prototype.setPing = function () {
  var self = this;
  clearTimeout(self.pingIntervalTimer);
  self.pingIntervalTimer = setTimeout(function () {
    debug('writing ping packet - expecting pong within %sms', self.pingTimeout);
    self.ping();
    self.onHeartbeat(self.pingTimeout);
  }, self.pingInterval);
};

/**
* Sends a ping packet.
*
* @api private
*/

Socket.prototype.ping = function () {
  var self = this;
  this.sendPacket('ping', function () {
    self.emit('ping');
  });
};

/**
 * Called on `drain` event
 *
 * @api private
 */

Socket.prototype.onDrain = function () {
  this.writeBuffer.splice(0, this.prevBufferLen);

  // setting prevBufferLen = 0 is very important
  // for example, when upgrading, upgrade packet is sent over,
  // and a nonzero prevBufferLen could cause problems on `drain`
  this.prevBufferLen = 0;

  if (0 === this.writeBuffer.length) {
    this.emit('drain');
  } else {
    this.flush();
  }
};

/**
 * Flush write buffers.
 *
 * @api private
 */

Socket.prototype.flush = function () {
  if ('closed' !== this.readyState && this.transport.writable &&
    !this.upgrading && this.writeBuffer.length) {
    debug('flushing %d packets in socket', this.writeBuffer.length);
    this.transport.send(this.writeBuffer);
    // keep track of current length of writeBuffer
    // splice writeBuffer and callbackBuffer on `drain`
    this.prevBufferLen = this.writeBuffer.length;
    this.emit('flush');
  }
};

/**
 * Sends a message.
 *
 * @param {String} message.
 * @param {Function} callback function.
 * @param {Object} options.
 * @return {Socket} for chaining.
 * @api public
 */

Socket.prototype.write =
Socket.prototype.send = function (msg, options, fn) {
  this.sendPacket('message', msg, options, fn);
  return this;
};

/**
 * Sends a packet.
 *
 * @param {String} packet type.
 * @param {String} data.
 * @param {Object} options.
 * @param {Function} callback function.
 * @api private
 */

Socket.prototype.sendPacket = function (type, data, options, fn) {
  if ('function' === typeof data) {
    fn = data;
    data = undefined;
  }

  if ('function' === typeof options) {
    fn = options;
    options = null;
  }

  if ('closing' === this.readyState || 'closed' === this.readyState) {
    return;
  }

  options = options || {};
  options.compress = false !== options.compress;

  var packet = {
    type: type,
    data: data,
    options: options
  };
  this.emit('packetCreate', packet);
  this.writeBuffer.push(packet);
  if (fn) this.once('flush', fn);
  this.flush();
};

/**
 * Closes the connection.
 *
 * @api private
 */

Socket.prototype.close = function () {
  if ('opening' === this.readyState || 'open' === this.readyState) {
    this.readyState = 'closing';

    var self = this;

    if (this.writeBuffer.length) {
      this.once('drain', function () {
        if (this.upgrading) {
          waitForUpgrade();
        } else {
          close();
        }
      });
    } else if (this.upgrading) {
      waitForUpgrade();
    } else {
      close();
    }
  }

  function close () {
    self.onClose('forced close');
    debug('socket closing - telling transport to close');
    self.transport.close();
  }

  function cleanupAndClose () {
    self.removeListener('upgrade', cleanupAndClose);
    self.removeListener('upgradeError', cleanupAndClose);
    close();
  }

  function waitForUpgrade () {
    // wait for upgrade to finish since we can't send packets while pausing a transport
    self.once('upgrade', cleanupAndClose);
    self.once('upgradeError', cleanupAndClose);
  }

  return this;
};

/**
 * Called upon transport error
 *
 * @api private
 */

Socket.prototype.onError = function (err) {
  debug('socket error %j', err);
  Socket.priorWebsocketSuccess = false;
  this.emit('error', err);
  this.onClose('transport error', err);
};

/**
 * Called upon transport close.
 *
 * @api private
 */

Socket.prototype.onClose = function (reason, desc) {
  if ('opening' === this.readyState || 'open' === this.readyState || 'closing' === this.readyState) {
    debug('socket close with reason: "%s"', reason);
    var self = this;

    // clear timers
    clearTimeout(this.pingIntervalTimer);
    clearTimeout(this.pingTimeoutTimer);

    // stop event from firing again for transport
    this.transport.removeAllListeners('close');

    // ensure transport won't stay open
    this.transport.close();

    // ignore further transport communication
    this.transport.removeAllListeners();

    // set ready state
    this.readyState = 'closed';

    // clear session id
    this.id = null;

    // emit close event
    this.emit('close', reason, desc);

    // clean buffers after, so users can still
    // grab the buffers on `close` event
    self.writeBuffer = [];
    self.prevBufferLen = 0;
  }
};

/**
 * Filters upgrades, returning only those matching client transports.
 *
 * @param {Array} server upgrades
 * @api private
 *
 */

Socket.prototype.filterUpgrades = function (upgrades) {
  var filteredUpgrades = [];
  for (var i = 0, j = upgrades.length; i < j; i++) {
    if (~index(this.transports, upgrades[i])) filteredUpgrades.push(upgrades[i]);
  }
  return filteredUpgrades;
};


/***/ }),

/***/ "../../node_modules/engine.io-client/lib/transport.js":
/*!************************************************************!*\
  !*** ../../node_modules/engine.io-client/lib/transport.js ***!
  \************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * Module dependencies.
 */

var parser = __webpack_require__(/*! engine.io-parser */ "../../node_modules/engine.io-parser/lib/browser.js");
var Emitter = __webpack_require__(/*! component-emitter */ "../../node_modules/component-emitter/index.js");

/**
 * Module exports.
 */

module.exports = Transport;

/**
 * Transport abstract constructor.
 *
 * @param {Object} options.
 * @api private
 */

function Transport (opts) {
  this.path = opts.path;
  this.hostname = opts.hostname;
  this.port = opts.port;
  this.secure = opts.secure;
  this.query = opts.query;
  this.timestampParam = opts.timestampParam;
  this.timestampRequests = opts.timestampRequests;
  this.readyState = '';
  this.agent = opts.agent || false;
  this.socket = opts.socket;
  this.enablesXDR = opts.enablesXDR;
  this.withCredentials = opts.withCredentials;

  // SSL options for Node.js client
  this.pfx = opts.pfx;
  this.key = opts.key;
  this.passphrase = opts.passphrase;
  this.cert = opts.cert;
  this.ca = opts.ca;
  this.ciphers = opts.ciphers;
  this.rejectUnauthorized = opts.rejectUnauthorized;
  this.forceNode = opts.forceNode;

  // results of ReactNative environment detection
  this.isReactNative = opts.isReactNative;

  // other options for Node.js client
  this.extraHeaders = opts.extraHeaders;
  this.localAddress = opts.localAddress;
}

/**
 * Mix in `Emitter`.
 */

Emitter(Transport.prototype);

/**
 * Emits an error.
 *
 * @param {String} str
 * @return {Transport} for chaining
 * @api public
 */

Transport.prototype.onError = function (msg, desc) {
  var err = new Error(msg);
  err.type = 'TransportError';
  err.description = desc;
  this.emit('error', err);
  return this;
};

/**
 * Opens the transport.
 *
 * @api public
 */

Transport.prototype.open = function () {
  if ('closed' === this.readyState || '' === this.readyState) {
    this.readyState = 'opening';
    this.doOpen();
  }

  return this;
};

/**
 * Closes the transport.
 *
 * @api private
 */

Transport.prototype.close = function () {
  if ('opening' === this.readyState || 'open' === this.readyState) {
    this.doClose();
    this.onClose();
  }

  return this;
};

/**
 * Sends multiple packets.
 *
 * @param {Array} packets
 * @api private
 */

Transport.prototype.send = function (packets) {
  if ('open' === this.readyState) {
    this.write(packets);
  } else {
    throw new Error('Transport not open');
  }
};

/**
 * Called upon open
 *
 * @api private
 */

Transport.prototype.onOpen = function () {
  this.readyState = 'open';
  this.writable = true;
  this.emit('open');
};

/**
 * Called with data.
 *
 * @param {String} data
 * @api private
 */

Transport.prototype.onData = function (data) {
  var packet = parser.decodePacket(data, this.socket.binaryType);
  this.onPacket(packet);
};

/**
 * Called with a decoded packet.
 */

Transport.prototype.onPacket = function (packet) {
  this.emit('packet', packet);
};

/**
 * Called upon close.
 *
 * @api private
 */

Transport.prototype.onClose = function () {
  this.readyState = 'closed';
  this.emit('close');
};


/***/ }),

/***/ "../../node_modules/engine.io-client/lib/transports/index.js":
/*!*******************************************************************!*\
  !*** ../../node_modules/engine.io-client/lib/transports/index.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

/**
 * Module dependencies
 */

var XMLHttpRequest = __webpack_require__(/*! xmlhttprequest-ssl */ "../../node_modules/engine.io-client/lib/xmlhttprequest.js");
var XHR = __webpack_require__(/*! ./polling-xhr */ "../../node_modules/engine.io-client/lib/transports/polling-xhr.js");
var JSONP = __webpack_require__(/*! ./polling-jsonp */ "../../node_modules/engine.io-client/lib/transports/polling-jsonp.js");
var websocket = __webpack_require__(/*! ./websocket */ "../../node_modules/engine.io-client/lib/transports/websocket.js");

/**
 * Export transports.
 */

exports.polling = polling;
exports.websocket = websocket;

/**
 * Polling transport polymorphic constructor.
 * Decides on xhr vs jsonp based on feature detection.
 *
 * @api private
 */

function polling (opts) {
  var xhr;
  var xd = false;
  var xs = false;
  var jsonp = false !== opts.jsonp;

  if (typeof location !== 'undefined') {
    var isSSL = 'https:' === location.protocol;
    var port = location.port;

    // some user agents have empty `location.port`
    if (!port) {
      port = isSSL ? 443 : 80;
    }

    xd = opts.hostname !== location.hostname || port !== opts.port;
    xs = opts.secure !== isSSL;
  }

  opts.xdomain = xd;
  opts.xscheme = xs;
  xhr = new XMLHttpRequest(opts);

  if ('open' in xhr && !opts.forceJSONP) {
    return new XHR(opts);
  } else {
    if (!jsonp) throw new Error('JSONP disabled');
    return new JSONP(opts);
  }
}


/***/ }),

/***/ "../../node_modules/engine.io-client/lib/transports/polling-jsonp.js":
/*!***************************************************************************!*\
  !*** ../../node_modules/engine.io-client/lib/transports/polling-jsonp.js ***!
  \***************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * Module requirements.
 */

var Polling = __webpack_require__(/*! ./polling */ "../../node_modules/engine.io-client/lib/transports/polling.js");
var inherit = __webpack_require__(/*! component-inherit */ "../../node_modules/component-inherit/index.js");
var globalThis = __webpack_require__(/*! ../globalThis */ "../../node_modules/engine.io-client/lib/globalThis.browser.js");

/**
 * Module exports.
 */

module.exports = JSONPPolling;

/**
 * Cached regular expressions.
 */

var rNewline = /\n/g;
var rEscapedNewline = /\\n/g;

/**
 * Global JSONP callbacks.
 */

var callbacks;

/**
 * Noop.
 */

function empty () { }

/**
 * JSONP Polling constructor.
 *
 * @param {Object} opts.
 * @api public
 */

function JSONPPolling (opts) {
  Polling.call(this, opts);

  this.query = this.query || {};

  // define global callbacks array if not present
  // we do this here (lazily) to avoid unneeded global pollution
  if (!callbacks) {
    // we need to consider multiple engines in the same page
    callbacks = globalThis.___eio = (globalThis.___eio || []);
  }

  // callback identifier
  this.index = callbacks.length;

  // add callback to jsonp global
  var self = this;
  callbacks.push(function (msg) {
    self.onData(msg);
  });

  // append to query string
  this.query.j = this.index;

  // prevent spurious errors from being emitted when the window is unloaded
  if (typeof addEventListener === 'function') {
    addEventListener('beforeunload', function () {
      if (self.script) self.script.onerror = empty;
    }, false);
  }
}

/**
 * Inherits from Polling.
 */

inherit(JSONPPolling, Polling);

/*
 * JSONP only supports binary as base64 encoded strings
 */

JSONPPolling.prototype.supportsBinary = false;

/**
 * Closes the socket.
 *
 * @api private
 */

JSONPPolling.prototype.doClose = function () {
  if (this.script) {
    this.script.parentNode.removeChild(this.script);
    this.script = null;
  }

  if (this.form) {
    this.form.parentNode.removeChild(this.form);
    this.form = null;
    this.iframe = null;
  }

  Polling.prototype.doClose.call(this);
};

/**
 * Starts a poll cycle.
 *
 * @api private
 */

JSONPPolling.prototype.doPoll = function () {
  var self = this;
  var script = document.createElement('script');

  if (this.script) {
    this.script.parentNode.removeChild(this.script);
    this.script = null;
  }

  script.async = true;
  script.src = this.uri();
  script.onerror = function (e) {
    self.onError('jsonp poll error', e);
  };

  var insertAt = document.getElementsByTagName('script')[0];
  if (insertAt) {
    insertAt.parentNode.insertBefore(script, insertAt);
  } else {
    (document.head || document.body).appendChild(script);
  }
  this.script = script;

  var isUAgecko = 'undefined' !== typeof navigator && /gecko/i.test(navigator.userAgent);

  if (isUAgecko) {
    setTimeout(function () {
      var iframe = document.createElement('iframe');
      document.body.appendChild(iframe);
      document.body.removeChild(iframe);
    }, 100);
  }
};

/**
 * Writes with a hidden iframe.
 *
 * @param {String} data to send
 * @param {Function} called upon flush.
 * @api private
 */

JSONPPolling.prototype.doWrite = function (data, fn) {
  var self = this;

  if (!this.form) {
    var form = document.createElement('form');
    var area = document.createElement('textarea');
    var id = this.iframeId = 'eio_iframe_' + this.index;
    var iframe;

    form.className = 'socketio';
    form.style.position = 'absolute';
    form.style.top = '-1000px';
    form.style.left = '-1000px';
    form.target = id;
    form.method = 'POST';
    form.setAttribute('accept-charset', 'utf-8');
    area.name = 'd';
    form.appendChild(area);
    document.body.appendChild(form);

    this.form = form;
    this.area = area;
  }

  this.form.action = this.uri();

  function complete () {
    initIframe();
    fn();
  }

  function initIframe () {
    if (self.iframe) {
      try {
        self.form.removeChild(self.iframe);
      } catch (e) {
        self.onError('jsonp polling iframe removal error', e);
      }
    }

    try {
      // ie6 dynamic iframes with target="" support (thanks Chris Lambacher)
      var html = '<iframe src="javascript:0" name="' + self.iframeId + '">';
      iframe = document.createElement(html);
    } catch (e) {
      iframe = document.createElement('iframe');
      iframe.name = self.iframeId;
      iframe.src = 'javascript:0';
    }

    iframe.id = self.iframeId;

    self.form.appendChild(iframe);
    self.iframe = iframe;
  }

  initIframe();

  // escape \n to prevent it from being converted into \r\n by some UAs
  // double escaping is required for escaped new lines because unescaping of new lines can be done safely on server-side
  data = data.replace(rEscapedNewline, '\\\n');
  this.area.value = data.replace(rNewline, '\\n');

  try {
    this.form.submit();
  } catch (e) {}

  if (this.iframe.attachEvent) {
    this.iframe.onreadystatechange = function () {
      if (self.iframe.readyState === 'complete') {
        complete();
      }
    };
  } else {
    this.iframe.onload = complete;
  }
};


/***/ }),

/***/ "../../node_modules/engine.io-client/lib/transports/polling-xhr.js":
/*!*************************************************************************!*\
  !*** ../../node_modules/engine.io-client/lib/transports/polling-xhr.js ***!
  \*************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* global attachEvent */

/**
 * Module requirements.
 */

var XMLHttpRequest = __webpack_require__(/*! xmlhttprequest-ssl */ "../../node_modules/engine.io-client/lib/xmlhttprequest.js");
var Polling = __webpack_require__(/*! ./polling */ "../../node_modules/engine.io-client/lib/transports/polling.js");
var Emitter = __webpack_require__(/*! component-emitter */ "../../node_modules/component-emitter/index.js");
var inherit = __webpack_require__(/*! component-inherit */ "../../node_modules/component-inherit/index.js");
var debug = __webpack_require__(/*! debug */ "../../node_modules/engine.io-client/node_modules/debug/src/browser.js")('engine.io-client:polling-xhr');
var globalThis = __webpack_require__(/*! ../globalThis */ "../../node_modules/engine.io-client/lib/globalThis.browser.js");

/**
 * Module exports.
 */

module.exports = XHR;
module.exports.Request = Request;

/**
 * Empty function
 */

function empty () {}

/**
 * XHR Polling constructor.
 *
 * @param {Object} opts
 * @api public
 */

function XHR (opts) {
  Polling.call(this, opts);
  this.requestTimeout = opts.requestTimeout;
  this.extraHeaders = opts.extraHeaders;

  if (typeof location !== 'undefined') {
    var isSSL = 'https:' === location.protocol;
    var port = location.port;

    // some user agents have empty `location.port`
    if (!port) {
      port = isSSL ? 443 : 80;
    }

    this.xd = (typeof location !== 'undefined' && opts.hostname !== location.hostname) ||
      port !== opts.port;
    this.xs = opts.secure !== isSSL;
  }
}

/**
 * Inherits from Polling.
 */

inherit(XHR, Polling);

/**
 * XHR supports binary
 */

XHR.prototype.supportsBinary = true;

/**
 * Creates a request.
 *
 * @param {String} method
 * @api private
 */

XHR.prototype.request = function (opts) {
  opts = opts || {};
  opts.uri = this.uri();
  opts.xd = this.xd;
  opts.xs = this.xs;
  opts.agent = this.agent || false;
  opts.supportsBinary = this.supportsBinary;
  opts.enablesXDR = this.enablesXDR;
  opts.withCredentials = this.withCredentials;

  // SSL options for Node.js client
  opts.pfx = this.pfx;
  opts.key = this.key;
  opts.passphrase = this.passphrase;
  opts.cert = this.cert;
  opts.ca = this.ca;
  opts.ciphers = this.ciphers;
  opts.rejectUnauthorized = this.rejectUnauthorized;
  opts.requestTimeout = this.requestTimeout;

  // other options for Node.js client
  opts.extraHeaders = this.extraHeaders;

  return new Request(opts);
};

/**
 * Sends data.
 *
 * @param {String} data to send.
 * @param {Function} called upon flush.
 * @api private
 */

XHR.prototype.doWrite = function (data, fn) {
  var isBinary = typeof data !== 'string' && data !== undefined;
  var req = this.request({ method: 'POST', data: data, isBinary: isBinary });
  var self = this;
  req.on('success', fn);
  req.on('error', function (err) {
    self.onError('xhr post error', err);
  });
  this.sendXhr = req;
};

/**
 * Starts a poll cycle.
 *
 * @api private
 */

XHR.prototype.doPoll = function () {
  debug('xhr poll');
  var req = this.request();
  var self = this;
  req.on('data', function (data) {
    self.onData(data);
  });
  req.on('error', function (err) {
    self.onError('xhr poll error', err);
  });
  this.pollXhr = req;
};

/**
 * Request constructor
 *
 * @param {Object} options
 * @api public
 */

function Request (opts) {
  this.method = opts.method || 'GET';
  this.uri = opts.uri;
  this.xd = !!opts.xd;
  this.xs = !!opts.xs;
  this.async = false !== opts.async;
  this.data = undefined !== opts.data ? opts.data : null;
  this.agent = opts.agent;
  this.isBinary = opts.isBinary;
  this.supportsBinary = opts.supportsBinary;
  this.enablesXDR = opts.enablesXDR;
  this.withCredentials = opts.withCredentials;
  this.requestTimeout = opts.requestTimeout;

  // SSL options for Node.js client
  this.pfx = opts.pfx;
  this.key = opts.key;
  this.passphrase = opts.passphrase;
  this.cert = opts.cert;
  this.ca = opts.ca;
  this.ciphers = opts.ciphers;
  this.rejectUnauthorized = opts.rejectUnauthorized;

  // other options for Node.js client
  this.extraHeaders = opts.extraHeaders;

  this.create();
}

/**
 * Mix in `Emitter`.
 */

Emitter(Request.prototype);

/**
 * Creates the XHR object and sends the request.
 *
 * @api private
 */

Request.prototype.create = function () {
  var opts = { agent: this.agent, xdomain: this.xd, xscheme: this.xs, enablesXDR: this.enablesXDR };

  // SSL options for Node.js client
  opts.pfx = this.pfx;
  opts.key = this.key;
  opts.passphrase = this.passphrase;
  opts.cert = this.cert;
  opts.ca = this.ca;
  opts.ciphers = this.ciphers;
  opts.rejectUnauthorized = this.rejectUnauthorized;

  var xhr = this.xhr = new XMLHttpRequest(opts);
  var self = this;

  try {
    debug('xhr open %s: %s', this.method, this.uri);
    xhr.open(this.method, this.uri, this.async);
    try {
      if (this.extraHeaders) {
        xhr.setDisableHeaderCheck && xhr.setDisableHeaderCheck(true);
        for (var i in this.extraHeaders) {
          if (this.extraHeaders.hasOwnProperty(i)) {
            xhr.setRequestHeader(i, this.extraHeaders[i]);
          }
        }
      }
    } catch (e) {}

    if ('POST' === this.method) {
      try {
        if (this.isBinary) {
          xhr.setRequestHeader('Content-type', 'application/octet-stream');
        } else {
          xhr.setRequestHeader('Content-type', 'text/plain;charset=UTF-8');
        }
      } catch (e) {}
    }

    try {
      xhr.setRequestHeader('Accept', '*/*');
    } catch (e) {}

    // ie6 check
    if ('withCredentials' in xhr) {
      xhr.withCredentials = this.withCredentials;
    }

    if (this.requestTimeout) {
      xhr.timeout = this.requestTimeout;
    }

    if (this.hasXDR()) {
      xhr.onload = function () {
        self.onLoad();
      };
      xhr.onerror = function () {
        self.onError(xhr.responseText);
      };
    } else {
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 2) {
          try {
            var contentType = xhr.getResponseHeader('Content-Type');
            if (self.supportsBinary && contentType === 'application/octet-stream' || contentType === 'application/octet-stream; charset=UTF-8') {
              xhr.responseType = 'arraybuffer';
            }
          } catch (e) {}
        }
        if (4 !== xhr.readyState) return;
        if (200 === xhr.status || 1223 === xhr.status) {
          self.onLoad();
        } else {
          // make sure the `error` event handler that's user-set
          // does not throw in the same tick and gets caught here
          setTimeout(function () {
            self.onError(typeof xhr.status === 'number' ? xhr.status : 0);
          }, 0);
        }
      };
    }

    debug('xhr data %s', this.data);
    xhr.send(this.data);
  } catch (e) {
    // Need to defer since .create() is called directly fhrom the constructor
    // and thus the 'error' event can only be only bound *after* this exception
    // occurs.  Therefore, also, we cannot throw here at all.
    setTimeout(function () {
      self.onError(e);
    }, 0);
    return;
  }

  if (typeof document !== 'undefined') {
    this.index = Request.requestsCount++;
    Request.requests[this.index] = this;
  }
};

/**
 * Called upon successful response.
 *
 * @api private
 */

Request.prototype.onSuccess = function () {
  this.emit('success');
  this.cleanup();
};

/**
 * Called if we have data.
 *
 * @api private
 */

Request.prototype.onData = function (data) {
  this.emit('data', data);
  this.onSuccess();
};

/**
 * Called upon error.
 *
 * @api private
 */

Request.prototype.onError = function (err) {
  this.emit('error', err);
  this.cleanup(true);
};

/**
 * Cleans up house.
 *
 * @api private
 */

Request.prototype.cleanup = function (fromError) {
  if ('undefined' === typeof this.xhr || null === this.xhr) {
    return;
  }
  // xmlhttprequest
  if (this.hasXDR()) {
    this.xhr.onload = this.xhr.onerror = empty;
  } else {
    this.xhr.onreadystatechange = empty;
  }

  if (fromError) {
    try {
      this.xhr.abort();
    } catch (e) {}
  }

  if (typeof document !== 'undefined') {
    delete Request.requests[this.index];
  }

  this.xhr = null;
};

/**
 * Called upon load.
 *
 * @api private
 */

Request.prototype.onLoad = function () {
  var data;
  try {
    var contentType;
    try {
      contentType = this.xhr.getResponseHeader('Content-Type');
    } catch (e) {}
    if (contentType === 'application/octet-stream' || contentType === 'application/octet-stream; charset=UTF-8') {
      data = this.xhr.response || this.xhr.responseText;
    } else {
      data = this.xhr.responseText;
    }
  } catch (e) {
    this.onError(e);
  }
  if (null != data) {
    this.onData(data);
  }
};

/**
 * Check if it has XDomainRequest.
 *
 * @api private
 */

Request.prototype.hasXDR = function () {
  return typeof XDomainRequest !== 'undefined' && !this.xs && this.enablesXDR;
};

/**
 * Aborts the request.
 *
 * @api public
 */

Request.prototype.abort = function () {
  this.cleanup();
};

/**
 * Aborts pending requests when unloading the window. This is needed to prevent
 * memory leaks (e.g. when using IE) and to ensure that no spurious error is
 * emitted.
 */

Request.requestsCount = 0;
Request.requests = {};

if (typeof document !== 'undefined') {
  if (typeof attachEvent === 'function') {
    attachEvent('onunload', unloadHandler);
  } else if (typeof addEventListener === 'function') {
    var terminationEvent = 'onpagehide' in globalThis ? 'pagehide' : 'unload';
    addEventListener(terminationEvent, unloadHandler, false);
  }
}

function unloadHandler () {
  for (var i in Request.requests) {
    if (Request.requests.hasOwnProperty(i)) {
      Request.requests[i].abort();
    }
  }
}


/***/ }),

/***/ "../../node_modules/engine.io-client/lib/transports/polling.js":
/*!*********************************************************************!*\
  !*** ../../node_modules/engine.io-client/lib/transports/polling.js ***!
  \*********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * Module dependencies.
 */

var Transport = __webpack_require__(/*! ../transport */ "../../node_modules/engine.io-client/lib/transport.js");
var parseqs = __webpack_require__(/*! parseqs */ "../../node_modules/parseqs/index.js");
var parser = __webpack_require__(/*! engine.io-parser */ "../../node_modules/engine.io-parser/lib/browser.js");
var inherit = __webpack_require__(/*! component-inherit */ "../../node_modules/component-inherit/index.js");
var yeast = __webpack_require__(/*! yeast */ "../../node_modules/yeast/index.js");
var debug = __webpack_require__(/*! debug */ "../../node_modules/engine.io-client/node_modules/debug/src/browser.js")('engine.io-client:polling');

/**
 * Module exports.
 */

module.exports = Polling;

/**
 * Is XHR2 supported?
 */

var hasXHR2 = (function () {
  var XMLHttpRequest = __webpack_require__(/*! xmlhttprequest-ssl */ "../../node_modules/engine.io-client/lib/xmlhttprequest.js");
  var xhr = new XMLHttpRequest({ xdomain: false });
  return null != xhr.responseType;
})();

/**
 * Polling interface.
 *
 * @param {Object} opts
 * @api private
 */

function Polling (opts) {
  var forceBase64 = (opts && opts.forceBase64);
  if (!hasXHR2 || forceBase64) {
    this.supportsBinary = false;
  }
  Transport.call(this, opts);
}

/**
 * Inherits from Transport.
 */

inherit(Polling, Transport);

/**
 * Transport name.
 */

Polling.prototype.name = 'polling';

/**
 * Opens the socket (triggers polling). We write a PING message to determine
 * when the transport is open.
 *
 * @api private
 */

Polling.prototype.doOpen = function () {
  this.poll();
};

/**
 * Pauses polling.
 *
 * @param {Function} callback upon buffers are flushed and transport is paused
 * @api private
 */

Polling.prototype.pause = function (onPause) {
  var self = this;

  this.readyState = 'pausing';

  function pause () {
    debug('paused');
    self.readyState = 'paused';
    onPause();
  }

  if (this.polling || !this.writable) {
    var total = 0;

    if (this.polling) {
      debug('we are currently polling - waiting to pause');
      total++;
      this.once('pollComplete', function () {
        debug('pre-pause polling complete');
        --total || pause();
      });
    }

    if (!this.writable) {
      debug('we are currently writing - waiting to pause');
      total++;
      this.once('drain', function () {
        debug('pre-pause writing complete');
        --total || pause();
      });
    }
  } else {
    pause();
  }
};

/**
 * Starts polling cycle.
 *
 * @api public
 */

Polling.prototype.poll = function () {
  debug('polling');
  this.polling = true;
  this.doPoll();
  this.emit('poll');
};

/**
 * Overloads onData to detect payloads.
 *
 * @api private
 */

Polling.prototype.onData = function (data) {
  var self = this;
  debug('polling got data %s', data);
  var callback = function (packet, index, total) {
    // if its the first message we consider the transport open
    if ('opening' === self.readyState && packet.type === 'open') {
      self.onOpen();
    }

    // if its a close packet, we close the ongoing requests
    if ('close' === packet.type) {
      self.onClose();
      return false;
    }

    // otherwise bypass onData and handle the message
    self.onPacket(packet);
  };

  // decode payload
  parser.decodePayload(data, this.socket.binaryType, callback);

  // if an event did not trigger closing
  if ('closed' !== this.readyState) {
    // if we got data we're not polling
    this.polling = false;
    this.emit('pollComplete');

    if ('open' === this.readyState) {
      this.poll();
    } else {
      debug('ignoring poll - transport state "%s"', this.readyState);
    }
  }
};

/**
 * For polling, send a close packet.
 *
 * @api private
 */

Polling.prototype.doClose = function () {
  var self = this;

  function close () {
    debug('writing close packet');
    self.write([{ type: 'close' }]);
  }

  if ('open' === this.readyState) {
    debug('transport open - closing');
    close();
  } else {
    // in case we're trying to close while
    // handshaking is in progress (GH-164)
    debug('transport not open - deferring close');
    this.once('open', close);
  }
};

/**
 * Writes a packets payload.
 *
 * @param {Array} data packets
 * @param {Function} drain callback
 * @api private
 */

Polling.prototype.write = function (packets) {
  var self = this;
  this.writable = false;
  var callbackfn = function () {
    self.writable = true;
    self.emit('drain');
  };

  parser.encodePayload(packets, this.supportsBinary, function (data) {
    self.doWrite(data, callbackfn);
  });
};

/**
 * Generates uri for connection.
 *
 * @api private
 */

Polling.prototype.uri = function () {
  var query = this.query || {};
  var schema = this.secure ? 'https' : 'http';
  var port = '';

  // cache busting is forced
  if (false !== this.timestampRequests) {
    query[this.timestampParam] = yeast();
  }

  if (!this.supportsBinary && !query.sid) {
    query.b64 = 1;
  }

  query = parseqs.encode(query);

  // avoid port if default for schema
  if (this.port && (('https' === schema && Number(this.port) !== 443) ||
     ('http' === schema && Number(this.port) !== 80))) {
    port = ':' + this.port;
  }

  // prepend ? to query
  if (query.length) {
    query = '?' + query;
  }

  var ipv6 = this.hostname.indexOf(':') !== -1;
  return schema + '://' + (ipv6 ? '[' + this.hostname + ']' : this.hostname) + port + this.path + query;
};


/***/ }),

/***/ "../../node_modules/engine.io-client/lib/transports/websocket.js":
/*!***********************************************************************!*\
  !*** ../../node_modules/engine.io-client/lib/transports/websocket.js ***!
  \***********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * Module dependencies.
 */

var Transport = __webpack_require__(/*! ../transport */ "../../node_modules/engine.io-client/lib/transport.js");
var parser = __webpack_require__(/*! engine.io-parser */ "../../node_modules/engine.io-parser/lib/browser.js");
var parseqs = __webpack_require__(/*! parseqs */ "../../node_modules/parseqs/index.js");
var inherit = __webpack_require__(/*! component-inherit */ "../../node_modules/component-inherit/index.js");
var yeast = __webpack_require__(/*! yeast */ "../../node_modules/yeast/index.js");
var debug = __webpack_require__(/*! debug */ "../../node_modules/engine.io-client/node_modules/debug/src/browser.js")('engine.io-client:websocket');

var BrowserWebSocket, NodeWebSocket;

if (typeof WebSocket !== 'undefined') {
  BrowserWebSocket = WebSocket;
} else if (typeof self !== 'undefined') {
  BrowserWebSocket = self.WebSocket || self.MozWebSocket;
}

if (typeof window === 'undefined') {
  try {
    NodeWebSocket = __webpack_require__(/*! ws */ "?fb7c");
  } catch (e) { }
}

/**
 * Get either the `WebSocket` or `MozWebSocket` globals
 * in the browser or try to resolve WebSocket-compatible
 * interface exposed by `ws` for Node-like environment.
 */

var WebSocketImpl = BrowserWebSocket || NodeWebSocket;

/**
 * Module exports.
 */

module.exports = WS;

/**
 * WebSocket transport constructor.
 *
 * @api {Object} connection options
 * @api public
 */

function WS (opts) {
  var forceBase64 = (opts && opts.forceBase64);
  if (forceBase64) {
    this.supportsBinary = false;
  }
  this.perMessageDeflate = opts.perMessageDeflate;
  this.usingBrowserWebSocket = BrowserWebSocket && !opts.forceNode;
  this.protocols = opts.protocols;
  if (!this.usingBrowserWebSocket) {
    WebSocketImpl = NodeWebSocket;
  }
  Transport.call(this, opts);
}

/**
 * Inherits from Transport.
 */

inherit(WS, Transport);

/**
 * Transport name.
 *
 * @api public
 */

WS.prototype.name = 'websocket';

/*
 * WebSockets support binary
 */

WS.prototype.supportsBinary = true;

/**
 * Opens socket.
 *
 * @api private
 */

WS.prototype.doOpen = function () {
  if (!this.check()) {
    // let probe timeout
    return;
  }

  var uri = this.uri();
  var protocols = this.protocols;

  var opts = {};

  if (!this.isReactNative) {
    opts.agent = this.agent;
    opts.perMessageDeflate = this.perMessageDeflate;

    // SSL options for Node.js client
    opts.pfx = this.pfx;
    opts.key = this.key;
    opts.passphrase = this.passphrase;
    opts.cert = this.cert;
    opts.ca = this.ca;
    opts.ciphers = this.ciphers;
    opts.rejectUnauthorized = this.rejectUnauthorized;
  }

  if (this.extraHeaders) {
    opts.headers = this.extraHeaders;
  }
  if (this.localAddress) {
    opts.localAddress = this.localAddress;
  }

  try {
    this.ws =
      this.usingBrowserWebSocket && !this.isReactNative
        ? protocols
          ? new WebSocketImpl(uri, protocols)
          : new WebSocketImpl(uri)
        : new WebSocketImpl(uri, protocols, opts);
  } catch (err) {
    return this.emit('error', err);
  }

  if (this.ws.binaryType === undefined) {
    this.supportsBinary = false;
  }

  if (this.ws.supports && this.ws.supports.binary) {
    this.supportsBinary = true;
    this.ws.binaryType = 'nodebuffer';
  } else {
    this.ws.binaryType = 'arraybuffer';
  }

  this.addEventListeners();
};

/**
 * Adds event listeners to the socket
 *
 * @api private
 */

WS.prototype.addEventListeners = function () {
  var self = this;

  this.ws.onopen = function () {
    self.onOpen();
  };
  this.ws.onclose = function () {
    self.onClose();
  };
  this.ws.onmessage = function (ev) {
    self.onData(ev.data);
  };
  this.ws.onerror = function (e) {
    self.onError('websocket error', e);
  };
};

/**
 * Writes data to socket.
 *
 * @param {Array} array of packets.
 * @api private
 */

WS.prototype.write = function (packets) {
  var self = this;
  this.writable = false;

  // encodePacket efficient as it uses WS framing
  // no need for encodePayload
  var total = packets.length;
  for (var i = 0, l = total; i < l; i++) {
    (function (packet) {
      parser.encodePacket(packet, self.supportsBinary, function (data) {
        if (!self.usingBrowserWebSocket) {
          // always create a new object (GH-437)
          var opts = {};
          if (packet.options) {
            opts.compress = packet.options.compress;
          }

          if (self.perMessageDeflate) {
            var len = 'string' === typeof data ? Buffer.byteLength(data) : data.length;
            if (len < self.perMessageDeflate.threshold) {
              opts.compress = false;
            }
          }
        }

        // Sometimes the websocket has already been closed but the browser didn't
        // have a chance of informing us about it yet, in that case send will
        // throw an error
        try {
          if (self.usingBrowserWebSocket) {
            // TypeError is thrown when passing the second argument on Safari
            self.ws.send(data);
          } else {
            self.ws.send(data, opts);
          }
        } catch (e) {
          debug('websocket closed before onclose event');
        }

        --total || done();
      });
    })(packets[i]);
  }

  function done () {
    self.emit('flush');

    // fake drain
    // defer to next tick to allow Socket to clear writeBuffer
    setTimeout(function () {
      self.writable = true;
      self.emit('drain');
    }, 0);
  }
};

/**
 * Called upon close
 *
 * @api private
 */

WS.prototype.onClose = function () {
  Transport.prototype.onClose.call(this);
};

/**
 * Closes socket.
 *
 * @api private
 */

WS.prototype.doClose = function () {
  if (typeof this.ws !== 'undefined') {
    this.ws.close();
  }
};

/**
 * Generates uri for connection.
 *
 * @api private
 */

WS.prototype.uri = function () {
  var query = this.query || {};
  var schema = this.secure ? 'wss' : 'ws';
  var port = '';

  // avoid port if default for schema
  if (this.port && (('wss' === schema && Number(this.port) !== 443) ||
    ('ws' === schema && Number(this.port) !== 80))) {
    port = ':' + this.port;
  }

  // append timestamp to URI
  if (this.timestampRequests) {
    query[this.timestampParam] = yeast();
  }

  // communicate binary support capabilities
  if (!this.supportsBinary) {
    query.b64 = 1;
  }

  query = parseqs.encode(query);

  // prepend ? to query
  if (query.length) {
    query = '?' + query;
  }

  var ipv6 = this.hostname.indexOf(':') !== -1;
  return schema + '://' + (ipv6 ? '[' + this.hostname + ']' : this.hostname) + port + this.path + query;
};

/**
 * Feature detection for WebSocket.
 *
 * @return {Boolean} whether this transport is available.
 * @api public
 */

WS.prototype.check = function () {
  return !!WebSocketImpl && !('__initialize' in WebSocketImpl && this.name === WS.prototype.name);
};


/***/ }),

/***/ "../../node_modules/engine.io-client/lib/xmlhttprequest.js":
/*!*****************************************************************!*\
  !*** ../../node_modules/engine.io-client/lib/xmlhttprequest.js ***!
  \*****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// browser shim for xmlhttprequest module

var hasCORS = __webpack_require__(/*! has-cors */ "../../node_modules/has-cors/index.js");
var globalThis = __webpack_require__(/*! ./globalThis */ "../../node_modules/engine.io-client/lib/globalThis.browser.js");

module.exports = function (opts) {
  var xdomain = opts.xdomain;

  // scheme must be same when usign XDomainRequest
  // http://blogs.msdn.com/b/ieinternals/archive/2010/05/13/xdomainrequest-restrictions-limitations-and-workarounds.aspx
  var xscheme = opts.xscheme;

  // XDomainRequest has a flow of not sending cookie, therefore it should be disabled as a default.
  // https://github.com/Automattic/engine.io-client/pull/217
  var enablesXDR = opts.enablesXDR;

  // XMLHttpRequest can be disabled on IE
  try {
    if ('undefined' !== typeof XMLHttpRequest && (!xdomain || hasCORS)) {
      return new XMLHttpRequest();
    }
  } catch (e) { }

  // Use XDomainRequest for IE8 if enablesXDR is true
  // because loading bar keeps flashing when using jsonp-polling
  // https://github.com/yujiosaka/socke.io-ie8-loading-example
  try {
    if ('undefined' !== typeof XDomainRequest && !xscheme && enablesXDR) {
      return new XDomainRequest();
    }
  } catch (e) { }

  if (!xdomain) {
    try {
      return new globalThis[['Active'].concat('Object').join('X')]('Microsoft.XMLHTTP');
    } catch (e) { }
  }
};


/***/ }),

/***/ "../../node_modules/engine.io-client/node_modules/debug/src/browser.js":
/*!*****************************************************************************!*\
  !*** ../../node_modules/engine.io-client/node_modules/debug/src/browser.js ***!
  \*****************************************************************************/
/***/ ((module, exports, __webpack_require__) => {

/**
 * This is the web browser implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = __webpack_require__(/*! ./debug */ "../../node_modules/engine.io-client/node_modules/debug/src/debug.js");
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = 'undefined' != typeof chrome
               && 'undefined' != typeof chrome.storage
                  ? chrome.storage.local
                  : localstorage();

/**
 * Colors.
 */

exports.colors = [
  '#0000CC', '#0000FF', '#0033CC', '#0033FF', '#0066CC', '#0066FF', '#0099CC',
  '#0099FF', '#00CC00', '#00CC33', '#00CC66', '#00CC99', '#00CCCC', '#00CCFF',
  '#3300CC', '#3300FF', '#3333CC', '#3333FF', '#3366CC', '#3366FF', '#3399CC',
  '#3399FF', '#33CC00', '#33CC33', '#33CC66', '#33CC99', '#33CCCC', '#33CCFF',
  '#6600CC', '#6600FF', '#6633CC', '#6633FF', '#66CC00', '#66CC33', '#9900CC',
  '#9900FF', '#9933CC', '#9933FF', '#99CC00', '#99CC33', '#CC0000', '#CC0033',
  '#CC0066', '#CC0099', '#CC00CC', '#CC00FF', '#CC3300', '#CC3333', '#CC3366',
  '#CC3399', '#CC33CC', '#CC33FF', '#CC6600', '#CC6633', '#CC9900', '#CC9933',
  '#CCCC00', '#CCCC33', '#FF0000', '#FF0033', '#FF0066', '#FF0099', '#FF00CC',
  '#FF00FF', '#FF3300', '#FF3333', '#FF3366', '#FF3399', '#FF33CC', '#FF33FF',
  '#FF6600', '#FF6633', '#FF9900', '#FF9933', '#FFCC00', '#FFCC33'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

function useColors() {
  // NB: In an Electron preload script, document will be defined but not fully
  // initialized. Since we know we're in Chrome, we'll just detect this case
  // explicitly
  if (typeof window !== 'undefined' && window.process && window.process.type === 'renderer') {
    return true;
  }

  // Internet Explorer and Edge do not support colors.
  if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
    return false;
  }

  // is webkit? http://stackoverflow.com/a/16459606/376773
  // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
  return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
    // is firebug? http://stackoverflow.com/a/398120/376773
    (typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
    // is firefox >= v31?
    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
    (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
    // double check webkit in userAgent just in case we are in a worker
    (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
}

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

exports.formatters.j = function(v) {
  try {
    return JSON.stringify(v);
  } catch (err) {
    return '[UnexpectedJSONParseError]: ' + err.message;
  }
};


/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs(args) {
  var useColors = this.useColors;

  args[0] = (useColors ? '%c' : '')
    + this.namespace
    + (useColors ? ' %c' : ' ')
    + args[0]
    + (useColors ? '%c ' : ' ')
    + '+' + exports.humanize(this.diff);

  if (!useColors) return;

  var c = 'color: ' + this.color;
  args.splice(1, 0, c, 'color: inherit')

  // the final "%c" is somewhat tricky, because there could be other
  // arguments passed either before or after the %c, so we need to
  // figure out the correct index to insert the CSS into
  var index = 0;
  var lastC = 0;
  args[0].replace(/%[a-zA-Z%]/g, function(match) {
    if ('%%' === match) return;
    index++;
    if ('%c' === match) {
      // we only are interested in the *last* %c
      // (the user may have provided their own)
      lastC = index;
    }
  });

  args.splice(lastC, 0, c);
}

/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */

function log() {
  // this hackery is required for IE8/9, where
  // the `console.log` function doesn't have 'apply'
  return 'object' === typeof console
    && console.log
    && Function.prototype.apply.call(console.log, console, arguments);
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */

function save(namespaces) {
  try {
    if (null == namespaces) {
      exports.storage.removeItem('debug');
    } else {
      exports.storage.debug = namespaces;
    }
  } catch(e) {}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
  var r;
  try {
    r = exports.storage.debug;
  } catch(e) {}

  // If debug isn't set in LS, and we're in Electron, try to load $DEBUG
  if (!r && typeof process !== 'undefined' && 'env' in process) {
    r = process.env.DEBUG;
  }

  return r;
}

/**
 * Enable namespaces listed in `localStorage.debug` initially.
 */

exports.enable(load());

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage() {
  try {
    return window.localStorage;
  } catch (e) {}
}


/***/ }),

/***/ "../../node_modules/engine.io-client/node_modules/debug/src/debug.js":
/*!***************************************************************************!*\
  !*** ../../node_modules/engine.io-client/node_modules/debug/src/debug.js ***!
  \***************************************************************************/
/***/ ((module, exports, __webpack_require__) => {


/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = createDebug.debug = createDebug['default'] = createDebug;
exports.coerce = coerce;
exports.disable = disable;
exports.enable = enable;
exports.enabled = enabled;
exports.humanize = __webpack_require__(/*! ms */ "../../node_modules/engine.io-client/node_modules/ms/index.js");

/**
 * Active `debug` instances.
 */
exports.instances = [];

/**
 * The currently active debug mode names, and names to skip.
 */

exports.names = [];
exports.skips = [];

/**
 * Map of special "%n" handling functions, for the debug "format" argument.
 *
 * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
 */

exports.formatters = {};

/**
 * Select a color.
 * @param {String} namespace
 * @return {Number}
 * @api private
 */

function selectColor(namespace) {
  var hash = 0, i;

  for (i in namespace) {
    hash  = ((hash << 5) - hash) + namespace.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }

  return exports.colors[Math.abs(hash) % exports.colors.length];
}

/**
 * Create a debugger with the given `namespace`.
 *
 * @param {String} namespace
 * @return {Function}
 * @api public
 */

function createDebug(namespace) {

  var prevTime;

  function debug() {
    // disabled?
    if (!debug.enabled) return;

    var self = debug;

    // set `diff` timestamp
    var curr = +new Date();
    var ms = curr - (prevTime || curr);
    self.diff = ms;
    self.prev = prevTime;
    self.curr = curr;
    prevTime = curr;

    // turn the `arguments` into a proper Array
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }

    args[0] = exports.coerce(args[0]);

    if ('string' !== typeof args[0]) {
      // anything else let's inspect with %O
      args.unshift('%O');
    }

    // apply any `formatters` transformations
    var index = 0;
    args[0] = args[0].replace(/%([a-zA-Z%])/g, function(match, format) {
      // if we encounter an escaped % then don't increase the array index
      if (match === '%%') return match;
      index++;
      var formatter = exports.formatters[format];
      if ('function' === typeof formatter) {
        var val = args[index];
        match = formatter.call(self, val);

        // now we need to remove `args[index]` since it's inlined in the `format`
        args.splice(index, 1);
        index--;
      }
      return match;
    });

    // apply env-specific formatting (colors, etc.)
    exports.formatArgs.call(self, args);

    var logFn = debug.log || exports.log || console.log.bind(console);
    logFn.apply(self, args);
  }

  debug.namespace = namespace;
  debug.enabled = exports.enabled(namespace);
  debug.useColors = exports.useColors();
  debug.color = selectColor(namespace);
  debug.destroy = destroy;

  // env-specific initialization logic for debug instances
  if ('function' === typeof exports.init) {
    exports.init(debug);
  }

  exports.instances.push(debug);

  return debug;
}

function destroy () {
  var index = exports.instances.indexOf(this);
  if (index !== -1) {
    exports.instances.splice(index, 1);
    return true;
  } else {
    return false;
  }
}

/**
 * Enables a debug mode by namespaces. This can include modes
 * separated by a colon and wildcards.
 *
 * @param {String} namespaces
 * @api public
 */

function enable(namespaces) {
  exports.save(namespaces);

  exports.names = [];
  exports.skips = [];

  var i;
  var split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
  var len = split.length;

  for (i = 0; i < len; i++) {
    if (!split[i]) continue; // ignore empty strings
    namespaces = split[i].replace(/\*/g, '.*?');
    if (namespaces[0] === '-') {
      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
    } else {
      exports.names.push(new RegExp('^' + namespaces + '$'));
    }
  }

  for (i = 0; i < exports.instances.length; i++) {
    var instance = exports.instances[i];
    instance.enabled = exports.enabled(instance.namespace);
  }
}

/**
 * Disable debug output.
 *
 * @api public
 */

function disable() {
  exports.enable('');
}

/**
 * Returns true if the given mode name is enabled, false otherwise.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

function enabled(name) {
  if (name[name.length - 1] === '*') {
    return true;
  }
  var i, len;
  for (i = 0, len = exports.skips.length; i < len; i++) {
    if (exports.skips[i].test(name)) {
      return false;
    }
  }
  for (i = 0, len = exports.names.length; i < len; i++) {
    if (exports.names[i].test(name)) {
      return true;
    }
  }
  return false;
}

/**
 * Coerce `val`.
 *
 * @param {Mixed} val
 * @return {Mixed}
 * @api private
 */

function coerce(val) {
  if (val instanceof Error) return val.stack || val.message;
  return val;
}


/***/ }),

/***/ "../../node_modules/engine.io-client/node_modules/ms/index.js":
/*!********************************************************************!*\
  !*** ../../node_modules/engine.io-client/node_modules/ms/index.js ***!
  \********************************************************************/
/***/ ((module) => {

/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

module.exports = function(val, options) {
  options = options || {};
  var type = typeof val;
  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isNaN(val) === false) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error(
    'val is not a non-empty string or a valid number. val=' +
      JSON.stringify(val)
  );
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(
    str
  );
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  if (ms >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (ms >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (ms >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (ms >= s) {
    return Math.round(ms / s) + 's';
  }
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  return plural(ms, d, 'day') ||
    plural(ms, h, 'hour') ||
    plural(ms, m, 'minute') ||
    plural(ms, s, 'second') ||
    ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, n, name) {
  if (ms < n) {
    return;
  }
  if (ms < n * 1.5) {
    return Math.floor(ms / n) + ' ' + name;
  }
  return Math.ceil(ms / n) + ' ' + name + 's';
}


/***/ }),

/***/ "../../node_modules/engine.io-parser/lib/browser.js":
/*!**********************************************************!*\
  !*** ../../node_modules/engine.io-parser/lib/browser.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

/**
 * Module dependencies.
 */

var keys = __webpack_require__(/*! ./keys */ "../../node_modules/engine.io-parser/lib/keys.js");
var hasBinary = __webpack_require__(/*! has-binary2 */ "../../node_modules/has-binary2/index.js");
var sliceBuffer = __webpack_require__(/*! arraybuffer.slice */ "../../node_modules/arraybuffer.slice/index.js");
var after = __webpack_require__(/*! after */ "../../node_modules/after/index.js");
var utf8 = __webpack_require__(/*! ./utf8 */ "../../node_modules/engine.io-parser/lib/utf8.js");

var base64encoder;
if (typeof ArrayBuffer !== 'undefined') {
  base64encoder = __webpack_require__(/*! base64-arraybuffer */ "../../node_modules/base64-arraybuffer/lib/base64-arraybuffer.js");
}

/**
 * Check if we are running an android browser. That requires us to use
 * ArrayBuffer with polling transports...
 *
 * http://ghinda.net/jpeg-blob-ajax-android/
 */

var isAndroid = typeof navigator !== 'undefined' && /Android/i.test(navigator.userAgent);

/**
 * Check if we are running in PhantomJS.
 * Uploading a Blob with PhantomJS does not work correctly, as reported here:
 * https://github.com/ariya/phantomjs/issues/11395
 * @type boolean
 */
var isPhantomJS = typeof navigator !== 'undefined' && /PhantomJS/i.test(navigator.userAgent);

/**
 * When true, avoids using Blobs to encode payloads.
 * @type boolean
 */
var dontSendBlobs = isAndroid || isPhantomJS;

/**
 * Current protocol version.
 */

exports.protocol = 3;

/**
 * Packet types.
 */

var packets = exports.packets = {
    open:     0    // non-ws
  , close:    1    // non-ws
  , ping:     2
  , pong:     3
  , message:  4
  , upgrade:  5
  , noop:     6
};

var packetslist = keys(packets);

/**
 * Premade error packet.
 */

var err = { type: 'error', data: 'parser error' };

/**
 * Create a blob api even for blob builder when vendor prefixes exist
 */

var Blob = __webpack_require__(/*! blob */ "../../node_modules/blob/index.js");

/**
 * Encodes a packet.
 *
 *     <packet type id> [ <data> ]
 *
 * Example:
 *
 *     5hello world
 *     3
 *     4
 *
 * Binary is encoded in an identical principle
 *
 * @api private
 */

exports.encodePacket = function (packet, supportsBinary, utf8encode, callback) {
  if (typeof supportsBinary === 'function') {
    callback = supportsBinary;
    supportsBinary = false;
  }

  if (typeof utf8encode === 'function') {
    callback = utf8encode;
    utf8encode = null;
  }

  var data = (packet.data === undefined)
    ? undefined
    : packet.data.buffer || packet.data;

  if (typeof ArrayBuffer !== 'undefined' && data instanceof ArrayBuffer) {
    return encodeArrayBuffer(packet, supportsBinary, callback);
  } else if (typeof Blob !== 'undefined' && data instanceof Blob) {
    return encodeBlob(packet, supportsBinary, callback);
  }

  // might be an object with { base64: true, data: dataAsBase64String }
  if (data && data.base64) {
    return encodeBase64Object(packet, callback);
  }

  // Sending data as a utf-8 string
  var encoded = packets[packet.type];

  // data fragment is optional
  if (undefined !== packet.data) {
    encoded += utf8encode ? utf8.encode(String(packet.data), { strict: false }) : String(packet.data);
  }

  return callback('' + encoded);

};

function encodeBase64Object(packet, callback) {
  // packet data is an object { base64: true, data: dataAsBase64String }
  var message = 'b' + exports.packets[packet.type] + packet.data.data;
  return callback(message);
}

/**
 * Encode packet helpers for binary types
 */

function encodeArrayBuffer(packet, supportsBinary, callback) {
  if (!supportsBinary) {
    return exports.encodeBase64Packet(packet, callback);
  }

  var data = packet.data;
  var contentArray = new Uint8Array(data);
  var resultBuffer = new Uint8Array(1 + data.byteLength);

  resultBuffer[0] = packets[packet.type];
  for (var i = 0; i < contentArray.length; i++) {
    resultBuffer[i+1] = contentArray[i];
  }

  return callback(resultBuffer.buffer);
}

function encodeBlobAsArrayBuffer(packet, supportsBinary, callback) {
  if (!supportsBinary) {
    return exports.encodeBase64Packet(packet, callback);
  }

  var fr = new FileReader();
  fr.onload = function() {
    exports.encodePacket({ type: packet.type, data: fr.result }, supportsBinary, true, callback);
  };
  return fr.readAsArrayBuffer(packet.data);
}

function encodeBlob(packet, supportsBinary, callback) {
  if (!supportsBinary) {
    return exports.encodeBase64Packet(packet, callback);
  }

  if (dontSendBlobs) {
    return encodeBlobAsArrayBuffer(packet, supportsBinary, callback);
  }

  var length = new Uint8Array(1);
  length[0] = packets[packet.type];
  var blob = new Blob([length.buffer, packet.data]);

  return callback(blob);
}

/**
 * Encodes a packet with binary data in a base64 string
 *
 * @param {Object} packet, has `type` and `data`
 * @return {String} base64 encoded message
 */

exports.encodeBase64Packet = function(packet, callback) {
  var message = 'b' + exports.packets[packet.type];
  if (typeof Blob !== 'undefined' && packet.data instanceof Blob) {
    var fr = new FileReader();
    fr.onload = function() {
      var b64 = fr.result.split(',')[1];
      callback(message + b64);
    };
    return fr.readAsDataURL(packet.data);
  }

  var b64data;
  try {
    b64data = String.fromCharCode.apply(null, new Uint8Array(packet.data));
  } catch (e) {
    // iPhone Safari doesn't let you apply with typed arrays
    var typed = new Uint8Array(packet.data);
    var basic = new Array(typed.length);
    for (var i = 0; i < typed.length; i++) {
      basic[i] = typed[i];
    }
    b64data = String.fromCharCode.apply(null, basic);
  }
  message += btoa(b64data);
  return callback(message);
};

/**
 * Decodes a packet. Changes format to Blob if requested.
 *
 * @return {Object} with `type` and `data` (if any)
 * @api private
 */

exports.decodePacket = function (data, binaryType, utf8decode) {
  if (data === undefined) {
    return err;
  }
  // String data
  if (typeof data === 'string') {
    if (data.charAt(0) === 'b') {
      return exports.decodeBase64Packet(data.substr(1), binaryType);
    }

    if (utf8decode) {
      data = tryDecode(data);
      if (data === false) {
        return err;
      }
    }
    var type = data.charAt(0);

    if (Number(type) != type || !packetslist[type]) {
      return err;
    }

    if (data.length > 1) {
      return { type: packetslist[type], data: data.substring(1) };
    } else {
      return { type: packetslist[type] };
    }
  }

  var asArray = new Uint8Array(data);
  var type = asArray[0];
  var rest = sliceBuffer(data, 1);
  if (Blob && binaryType === 'blob') {
    rest = new Blob([rest]);
  }
  return { type: packetslist[type], data: rest };
};

function tryDecode(data) {
  try {
    data = utf8.decode(data, { strict: false });
  } catch (e) {
    return false;
  }
  return data;
}

/**
 * Decodes a packet encoded in a base64 string
 *
 * @param {String} base64 encoded message
 * @return {Object} with `type` and `data` (if any)
 */

exports.decodeBase64Packet = function(msg, binaryType) {
  var type = packetslist[msg.charAt(0)];
  if (!base64encoder) {
    return { type: type, data: { base64: true, data: msg.substr(1) } };
  }

  var data = base64encoder.decode(msg.substr(1));

  if (binaryType === 'blob' && Blob) {
    data = new Blob([data]);
  }

  return { type: type, data: data };
};

/**
 * Encodes multiple messages (payload).
 *
 *     <length>:data
 *
 * Example:
 *
 *     11:hello world2:hi
 *
 * If any contents are binary, they will be encoded as base64 strings. Base64
 * encoded strings are marked with a b before the length specifier
 *
 * @param {Array} packets
 * @api private
 */

exports.encodePayload = function (packets, supportsBinary, callback) {
  if (typeof supportsBinary === 'function') {
    callback = supportsBinary;
    supportsBinary = null;
  }

  var isBinary = hasBinary(packets);

  if (supportsBinary && isBinary) {
    if (Blob && !dontSendBlobs) {
      return exports.encodePayloadAsBlob(packets, callback);
    }

    return exports.encodePayloadAsArrayBuffer(packets, callback);
  }

  if (!packets.length) {
    return callback('0:');
  }

  function setLengthHeader(message) {
    return message.length + ':' + message;
  }

  function encodeOne(packet, doneCallback) {
    exports.encodePacket(packet, !isBinary ? false : supportsBinary, false, function(message) {
      doneCallback(null, setLengthHeader(message));
    });
  }

  map(packets, encodeOne, function(err, results) {
    return callback(results.join(''));
  });
};

/**
 * Async array map using after
 */

function map(ary, each, done) {
  var result = new Array(ary.length);
  var next = after(ary.length, done);

  var eachWithIndex = function(i, el, cb) {
    each(el, function(error, msg) {
      result[i] = msg;
      cb(error, result);
    });
  };

  for (var i = 0; i < ary.length; i++) {
    eachWithIndex(i, ary[i], next);
  }
}

/*
 * Decodes data when a payload is maybe expected. Possible binary contents are
 * decoded from their base64 representation
 *
 * @param {String} data, callback method
 * @api public
 */

exports.decodePayload = function (data, binaryType, callback) {
  if (typeof data !== 'string') {
    return exports.decodePayloadAsBinary(data, binaryType, callback);
  }

  if (typeof binaryType === 'function') {
    callback = binaryType;
    binaryType = null;
  }

  var packet;
  if (data === '') {
    // parser error - ignoring payload
    return callback(err, 0, 1);
  }

  var length = '', n, msg;

  for (var i = 0, l = data.length; i < l; i++) {
    var chr = data.charAt(i);

    if (chr !== ':') {
      length += chr;
      continue;
    }

    if (length === '' || (length != (n = Number(length)))) {
      // parser error - ignoring payload
      return callback(err, 0, 1);
    }

    msg = data.substr(i + 1, n);

    if (length != msg.length) {
      // parser error - ignoring payload
      return callback(err, 0, 1);
    }

    if (msg.length) {
      packet = exports.decodePacket(msg, binaryType, false);

      if (err.type === packet.type && err.data === packet.data) {
        // parser error in individual packet - ignoring payload
        return callback(err, 0, 1);
      }

      var ret = callback(packet, i + n, l);
      if (false === ret) return;
    }

    // advance cursor
    i += n;
    length = '';
  }

  if (length !== '') {
    // parser error - ignoring payload
    return callback(err, 0, 1);
  }

};

/**
 * Encodes multiple messages (payload) as binary.
 *
 * <1 = binary, 0 = string><number from 0-9><number from 0-9>[...]<number
 * 255><data>
 *
 * Example:
 * 1 3 255 1 2 3, if the binary contents are interpreted as 8 bit integers
 *
 * @param {Array} packets
 * @return {ArrayBuffer} encoded payload
 * @api private
 */

exports.encodePayloadAsArrayBuffer = function(packets, callback) {
  if (!packets.length) {
    return callback(new ArrayBuffer(0));
  }

  function encodeOne(packet, doneCallback) {
    exports.encodePacket(packet, true, true, function(data) {
      return doneCallback(null, data);
    });
  }

  map(packets, encodeOne, function(err, encodedPackets) {
    var totalLength = encodedPackets.reduce(function(acc, p) {
      var len;
      if (typeof p === 'string'){
        len = p.length;
      } else {
        len = p.byteLength;
      }
      return acc + len.toString().length + len + 2; // string/binary identifier + separator = 2
    }, 0);

    var resultArray = new Uint8Array(totalLength);

    var bufferIndex = 0;
    encodedPackets.forEach(function(p) {
      var isString = typeof p === 'string';
      var ab = p;
      if (isString) {
        var view = new Uint8Array(p.length);
        for (var i = 0; i < p.length; i++) {
          view[i] = p.charCodeAt(i);
        }
        ab = view.buffer;
      }

      if (isString) { // not true binary
        resultArray[bufferIndex++] = 0;
      } else { // true binary
        resultArray[bufferIndex++] = 1;
      }

      var lenStr = ab.byteLength.toString();
      for (var i = 0; i < lenStr.length; i++) {
        resultArray[bufferIndex++] = parseInt(lenStr[i]);
      }
      resultArray[bufferIndex++] = 255;

      var view = new Uint8Array(ab);
      for (var i = 0; i < view.length; i++) {
        resultArray[bufferIndex++] = view[i];
      }
    });

    return callback(resultArray.buffer);
  });
};

/**
 * Encode as Blob
 */

exports.encodePayloadAsBlob = function(packets, callback) {
  function encodeOne(packet, doneCallback) {
    exports.encodePacket(packet, true, true, function(encoded) {
      var binaryIdentifier = new Uint8Array(1);
      binaryIdentifier[0] = 1;
      if (typeof encoded === 'string') {
        var view = new Uint8Array(encoded.length);
        for (var i = 0; i < encoded.length; i++) {
          view[i] = encoded.charCodeAt(i);
        }
        encoded = view.buffer;
        binaryIdentifier[0] = 0;
      }

      var len = (encoded instanceof ArrayBuffer)
        ? encoded.byteLength
        : encoded.size;

      var lenStr = len.toString();
      var lengthAry = new Uint8Array(lenStr.length + 1);
      for (var i = 0; i < lenStr.length; i++) {
        lengthAry[i] = parseInt(lenStr[i]);
      }
      lengthAry[lenStr.length] = 255;

      if (Blob) {
        var blob = new Blob([binaryIdentifier.buffer, lengthAry.buffer, encoded]);
        doneCallback(null, blob);
      }
    });
  }

  map(packets, encodeOne, function(err, results) {
    return callback(new Blob(results));
  });
};

/*
 * Decodes data when a payload is maybe expected. Strings are decoded by
 * interpreting each byte as a key code for entries marked to start with 0. See
 * description of encodePayloadAsBinary
 *
 * @param {ArrayBuffer} data, callback method
 * @api public
 */

exports.decodePayloadAsBinary = function (data, binaryType, callback) {
  if (typeof binaryType === 'function') {
    callback = binaryType;
    binaryType = null;
  }

  var bufferTail = data;
  var buffers = [];

  while (bufferTail.byteLength > 0) {
    var tailArray = new Uint8Array(bufferTail);
    var isString = tailArray[0] === 0;
    var msgLength = '';

    for (var i = 1; ; i++) {
      if (tailArray[i] === 255) break;

      // 310 = char length of Number.MAX_VALUE
      if (msgLength.length > 310) {
        return callback(err, 0, 1);
      }

      msgLength += tailArray[i];
    }

    bufferTail = sliceBuffer(bufferTail, 2 + msgLength.length);
    msgLength = parseInt(msgLength);

    var msg = sliceBuffer(bufferTail, 0, msgLength);
    if (isString) {
      try {
        msg = String.fromCharCode.apply(null, new Uint8Array(msg));
      } catch (e) {
        // iPhone Safari doesn't let you apply to typed arrays
        var typed = new Uint8Array(msg);
        msg = '';
        for (var i = 0; i < typed.length; i++) {
          msg += String.fromCharCode(typed[i]);
        }
      }
    }

    buffers.push(msg);
    bufferTail = sliceBuffer(bufferTail, msgLength);
  }

  var total = buffers.length;
  buffers.forEach(function(buffer, i) {
    callback(exports.decodePacket(buffer, binaryType, true), i, total);
  });
};


/***/ }),

/***/ "../../node_modules/engine.io-parser/lib/keys.js":
/*!*******************************************************!*\
  !*** ../../node_modules/engine.io-parser/lib/keys.js ***!
  \*******************************************************/
/***/ ((module) => {


/**
 * Gets the keys for an object.
 *
 * @return {Array} keys
 * @api private
 */

module.exports = Object.keys || function keys (obj){
  var arr = [];
  var has = Object.prototype.hasOwnProperty;

  for (var i in obj) {
    if (has.call(obj, i)) {
      arr.push(i);
    }
  }
  return arr;
};


/***/ }),

/***/ "../../node_modules/engine.io-parser/lib/utf8.js":
/*!*******************************************************!*\
  !*** ../../node_modules/engine.io-parser/lib/utf8.js ***!
  \*******************************************************/
/***/ ((module) => {

/*! https://mths.be/utf8js v2.1.2 by @mathias */

var stringFromCharCode = String.fromCharCode;

// Taken from https://mths.be/punycode
function ucs2decode(string) {
	var output = [];
	var counter = 0;
	var length = string.length;
	var value;
	var extra;
	while (counter < length) {
		value = string.charCodeAt(counter++);
		if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
			// high surrogate, and there is a next character
			extra = string.charCodeAt(counter++);
			if ((extra & 0xFC00) == 0xDC00) { // low surrogate
				output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
			} else {
				// unmatched surrogate; only append this code unit, in case the next
				// code unit is the high surrogate of a surrogate pair
				output.push(value);
				counter--;
			}
		} else {
			output.push(value);
		}
	}
	return output;
}

// Taken from https://mths.be/punycode
function ucs2encode(array) {
	var length = array.length;
	var index = -1;
	var value;
	var output = '';
	while (++index < length) {
		value = array[index];
		if (value > 0xFFFF) {
			value -= 0x10000;
			output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
			value = 0xDC00 | value & 0x3FF;
		}
		output += stringFromCharCode(value);
	}
	return output;
}

function checkScalarValue(codePoint, strict) {
	if (codePoint >= 0xD800 && codePoint <= 0xDFFF) {
		if (strict) {
			throw Error(
				'Lone surrogate U+' + codePoint.toString(16).toUpperCase() +
				' is not a scalar value'
			);
		}
		return false;
	}
	return true;
}
/*--------------------------------------------------------------------------*/

function createByte(codePoint, shift) {
	return stringFromCharCode(((codePoint >> shift) & 0x3F) | 0x80);
}

function encodeCodePoint(codePoint, strict) {
	if ((codePoint & 0xFFFFFF80) == 0) { // 1-byte sequence
		return stringFromCharCode(codePoint);
	}
	var symbol = '';
	if ((codePoint & 0xFFFFF800) == 0) { // 2-byte sequence
		symbol = stringFromCharCode(((codePoint >> 6) & 0x1F) | 0xC0);
	}
	else if ((codePoint & 0xFFFF0000) == 0) { // 3-byte sequence
		if (!checkScalarValue(codePoint, strict)) {
			codePoint = 0xFFFD;
		}
		symbol = stringFromCharCode(((codePoint >> 12) & 0x0F) | 0xE0);
		symbol += createByte(codePoint, 6);
	}
	else if ((codePoint & 0xFFE00000) == 0) { // 4-byte sequence
		symbol = stringFromCharCode(((codePoint >> 18) & 0x07) | 0xF0);
		symbol += createByte(codePoint, 12);
		symbol += createByte(codePoint, 6);
	}
	symbol += stringFromCharCode((codePoint & 0x3F) | 0x80);
	return symbol;
}

function utf8encode(string, opts) {
	opts = opts || {};
	var strict = false !== opts.strict;

	var codePoints = ucs2decode(string);
	var length = codePoints.length;
	var index = -1;
	var codePoint;
	var byteString = '';
	while (++index < length) {
		codePoint = codePoints[index];
		byteString += encodeCodePoint(codePoint, strict);
	}
	return byteString;
}

/*--------------------------------------------------------------------------*/

function readContinuationByte() {
	if (byteIndex >= byteCount) {
		throw Error('Invalid byte index');
	}

	var continuationByte = byteArray[byteIndex] & 0xFF;
	byteIndex++;

	if ((continuationByte & 0xC0) == 0x80) {
		return continuationByte & 0x3F;
	}

	// If we end up here, it’s not a continuation byte
	throw Error('Invalid continuation byte');
}

function decodeSymbol(strict) {
	var byte1;
	var byte2;
	var byte3;
	var byte4;
	var codePoint;

	if (byteIndex > byteCount) {
		throw Error('Invalid byte index');
	}

	if (byteIndex == byteCount) {
		return false;
	}

	// Read first byte
	byte1 = byteArray[byteIndex] & 0xFF;
	byteIndex++;

	// 1-byte sequence (no continuation bytes)
	if ((byte1 & 0x80) == 0) {
		return byte1;
	}

	// 2-byte sequence
	if ((byte1 & 0xE0) == 0xC0) {
		byte2 = readContinuationByte();
		codePoint = ((byte1 & 0x1F) << 6) | byte2;
		if (codePoint >= 0x80) {
			return codePoint;
		} else {
			throw Error('Invalid continuation byte');
		}
	}

	// 3-byte sequence (may include unpaired surrogates)
	if ((byte1 & 0xF0) == 0xE0) {
		byte2 = readContinuationByte();
		byte3 = readContinuationByte();
		codePoint = ((byte1 & 0x0F) << 12) | (byte2 << 6) | byte3;
		if (codePoint >= 0x0800) {
			return checkScalarValue(codePoint, strict) ? codePoint : 0xFFFD;
		} else {
			throw Error('Invalid continuation byte');
		}
	}

	// 4-byte sequence
	if ((byte1 & 0xF8) == 0xF0) {
		byte2 = readContinuationByte();
		byte3 = readContinuationByte();
		byte4 = readContinuationByte();
		codePoint = ((byte1 & 0x07) << 0x12) | (byte2 << 0x0C) |
			(byte3 << 0x06) | byte4;
		if (codePoint >= 0x010000 && codePoint <= 0x10FFFF) {
			return codePoint;
		}
	}

	throw Error('Invalid UTF-8 detected');
}

var byteArray;
var byteCount;
var byteIndex;
function utf8decode(byteString, opts) {
	opts = opts || {};
	var strict = false !== opts.strict;

	byteArray = ucs2decode(byteString);
	byteCount = byteArray.length;
	byteIndex = 0;
	var codePoints = [];
	var tmp;
	while ((tmp = decodeSymbol(strict)) !== false) {
		codePoints.push(tmp);
	}
	return ucs2encode(codePoints);
}

module.exports = {
	version: '2.1.2',
	encode: utf8encode,
	decode: utf8decode
};


/***/ }),

/***/ "../../node_modules/events/events.js":
/*!*******************************************!*\
  !*** ../../node_modules/events/events.js ***!
  \*******************************************/
/***/ ((module) => {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var R = typeof Reflect === 'object' ? Reflect : null
var ReflectApply = R && typeof R.apply === 'function'
  ? R.apply
  : function ReflectApply(target, receiver, args) {
    return Function.prototype.apply.call(target, receiver, args);
  }

var ReflectOwnKeys
if (R && typeof R.ownKeys === 'function') {
  ReflectOwnKeys = R.ownKeys
} else if (Object.getOwnPropertySymbols) {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target)
      .concat(Object.getOwnPropertySymbols(target));
  };
} else {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target);
  };
}

function ProcessEmitWarning(warning) {
  if (console && console.warn) console.warn(warning);
}

var NumberIsNaN = Number.isNaN || function NumberIsNaN(value) {
  return value !== value;
}

function EventEmitter() {
  EventEmitter.init.call(this);
}
module.exports = EventEmitter;
module.exports.once = once;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._eventsCount = 0;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
var defaultMaxListeners = 10;

function checkListener(listener) {
  if (typeof listener !== 'function') {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
  }
}

Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
  enumerable: true,
  get: function() {
    return defaultMaxListeners;
  },
  set: function(arg) {
    if (typeof arg !== 'number' || arg < 0 || NumberIsNaN(arg)) {
      throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + '.');
    }
    defaultMaxListeners = arg;
  }
});

EventEmitter.init = function() {

  if (this._events === undefined ||
      this._events === Object.getPrototypeOf(this)._events) {
    this._events = Object.create(null);
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
};

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || NumberIsNaN(n)) {
    throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + '.');
  }
  this._maxListeners = n;
  return this;
};

function _getMaxListeners(that) {
  if (that._maxListeners === undefined)
    return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return _getMaxListeners(this);
};

EventEmitter.prototype.emit = function emit(type) {
  var args = [];
  for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
  var doError = (type === 'error');

  var events = this._events;
  if (events !== undefined)
    doError = (doError && events.error === undefined);
  else if (!doError)
    return false;

  // If there is no 'error' event listener then throw.
  if (doError) {
    var er;
    if (args.length > 0)
      er = args[0];
    if (er instanceof Error) {
      // Note: The comments on the `throw` lines are intentional, they show
      // up in Node's output if this results in an unhandled exception.
      throw er; // Unhandled 'error' event
    }
    // At least give some kind of context to the user
    var err = new Error('Unhandled error.' + (er ? ' (' + er.message + ')' : ''));
    err.context = er;
    throw err; // Unhandled 'error' event
  }

  var handler = events[type];

  if (handler === undefined)
    return false;

  if (typeof handler === 'function') {
    ReflectApply(handler, this, args);
  } else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      ReflectApply(listeners[i], this, args);
  }

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;

  checkListener(listener);

  events = target._events;
  if (events === undefined) {
    events = target._events = Object.create(null);
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener !== undefined) {
      target.emit('newListener', type,
                  listener.listener ? listener.listener : listener);

      // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object
      events = target._events;
    }
    existing = events[type];
  }

  if (existing === undefined) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] =
        prepend ? [listener, existing] : [existing, listener];
      // If we've already got an array, just append.
    } else if (prepend) {
      existing.unshift(listener);
    } else {
      existing.push(listener);
    }

    // Check for listener leak
    m = _getMaxListeners(target);
    if (m > 0 && existing.length > m && !existing.warned) {
      existing.warned = true;
      // No error code for this since it is a Warning
      // eslint-disable-next-line no-restricted-syntax
      var w = new Error('Possible EventEmitter memory leak detected. ' +
                          existing.length + ' ' + String(type) + ' listeners ' +
                          'added. Use emitter.setMaxListeners() to ' +
                          'increase limit');
      w.name = 'MaxListenersExceededWarning';
      w.emitter = target;
      w.type = type;
      w.count = existing.length;
      ProcessEmitWarning(w);
    }
  }

  return target;
}

EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener =
    function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    };

function onceWrapper() {
  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    if (arguments.length === 0)
      return this.listener.call(this.target);
    return this.listener.apply(this.target, arguments);
  }
}

function _onceWrap(target, type, listener) {
  var state = { fired: false, wrapFn: undefined, target: target, type: type, listener: listener };
  var wrapped = onceWrapper.bind(state);
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}

EventEmitter.prototype.once = function once(type, listener) {
  checkListener(listener);
  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener =
    function prependOnceListener(type, listener) {
      checkListener(listener);
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    };

// Emits a 'removeListener' event if and only if the listener was removed.
EventEmitter.prototype.removeListener =
    function removeListener(type, listener) {
      var list, events, position, i, originalListener;

      checkListener(listener);

      events = this._events;
      if (events === undefined)
        return this;

      list = events[type];
      if (list === undefined)
        return this;

      if (list === listener || list.listener === listener) {
        if (--this._eventsCount === 0)
          this._events = Object.create(null);
        else {
          delete events[type];
          if (events.removeListener)
            this.emit('removeListener', type, list.listener || listener);
        }
      } else if (typeof list !== 'function') {
        position = -1;

        for (i = list.length - 1; i >= 0; i--) {
          if (list[i] === listener || list[i].listener === listener) {
            originalListener = list[i].listener;
            position = i;
            break;
          }
        }

        if (position < 0)
          return this;

        if (position === 0)
          list.shift();
        else {
          spliceOne(list, position);
        }

        if (list.length === 1)
          events[type] = list[0];

        if (events.removeListener !== undefined)
          this.emit('removeListener', type, originalListener || listener);
      }

      return this;
    };

EventEmitter.prototype.off = EventEmitter.prototype.removeListener;

EventEmitter.prototype.removeAllListeners =
    function removeAllListeners(type) {
      var listeners, events, i;

      events = this._events;
      if (events === undefined)
        return this;

      // not listening for removeListener, no need to emit
      if (events.removeListener === undefined) {
        if (arguments.length === 0) {
          this._events = Object.create(null);
          this._eventsCount = 0;
        } else if (events[type] !== undefined) {
          if (--this._eventsCount === 0)
            this._events = Object.create(null);
          else
            delete events[type];
        }
        return this;
      }

      // emit removeListener for all listeners on all events
      if (arguments.length === 0) {
        var keys = Object.keys(events);
        var key;
        for (i = 0; i < keys.length; ++i) {
          key = keys[i];
          if (key === 'removeListener') continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners('removeListener');
        this._events = Object.create(null);
        this._eventsCount = 0;
        return this;
      }

      listeners = events[type];

      if (typeof listeners === 'function') {
        this.removeListener(type, listeners);
      } else if (listeners !== undefined) {
        // LIFO order
        for (i = listeners.length - 1; i >= 0; i--) {
          this.removeListener(type, listeners[i]);
        }
      }

      return this;
    };

function _listeners(target, type, unwrap) {
  var events = target._events;

  if (events === undefined)
    return [];

  var evlistener = events[type];
  if (evlistener === undefined)
    return [];

  if (typeof evlistener === 'function')
    return unwrap ? [evlistener.listener || evlistener] : [evlistener];

  return unwrap ?
    unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
}

EventEmitter.prototype.listeners = function listeners(type) {
  return _listeners(this, type, true);
};

EventEmitter.prototype.rawListeners = function rawListeners(type) {
  return _listeners(this, type, false);
};

EventEmitter.listenerCount = function(emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter.prototype.listenerCount = listenerCount;
function listenerCount(type) {
  var events = this._events;

  if (events !== undefined) {
    var evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener !== undefined) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
};

function arrayClone(arr, n) {
  var copy = new Array(n);
  for (var i = 0; i < n; ++i)
    copy[i] = arr[i];
  return copy;
}

function spliceOne(list, index) {
  for (; index + 1 < list.length; index++)
    list[index] = list[index + 1];
  list.pop();
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);
  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }
  return ret;
}

function once(emitter, name) {
  return new Promise(function (resolve, reject) {
    function errorListener(err) {
      emitter.removeListener(name, resolver);
      reject(err);
    }

    function resolver() {
      if (typeof emitter.removeListener === 'function') {
        emitter.removeListener('error', errorListener);
      }
      resolve([].slice.call(arguments));
    };

    eventTargetAgnosticAddListener(emitter, name, resolver, { once: true });
    if (name !== 'error') {
      addErrorHandlerIfEventEmitter(emitter, errorListener, { once: true });
    }
  });
}

function addErrorHandlerIfEventEmitter(emitter, handler, flags) {
  if (typeof emitter.on === 'function') {
    eventTargetAgnosticAddListener(emitter, 'error', handler, flags);
  }
}

function eventTargetAgnosticAddListener(emitter, name, listener, flags) {
  if (typeof emitter.on === 'function') {
    if (flags.once) {
      emitter.once(name, listener);
    } else {
      emitter.on(name, listener);
    }
  } else if (typeof emitter.addEventListener === 'function') {
    // EventTarget does not have `error` event semantics like Node
    // EventEmitters, we do not listen for `error` events here.
    emitter.addEventListener(name, function wrapListener(arg) {
      // IE does not have builtin `{ once: true }` support so we
      // have to do it manually.
      if (flags.once) {
        emitter.removeEventListener(name, wrapListener);
      }
      listener(arg);
    });
  } else {
    throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof emitter);
  }
}


/***/ }),

/***/ "../../node_modules/has-binary2/index.js":
/*!***********************************************!*\
  !*** ../../node_modules/has-binary2/index.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* global Blob File */

/*
 * Module requirements.
 */

var isArray = __webpack_require__(/*! isarray */ "../../node_modules/isarray/index.js");

var toString = Object.prototype.toString;
var withNativeBlob = typeof Blob === 'function' ||
                        typeof Blob !== 'undefined' && toString.call(Blob) === '[object BlobConstructor]';
var withNativeFile = typeof File === 'function' ||
                        typeof File !== 'undefined' && toString.call(File) === '[object FileConstructor]';

/**
 * Module exports.
 */

module.exports = hasBinary;

/**
 * Checks for binary data.
 *
 * Supports Buffer, ArrayBuffer, Blob and File.
 *
 * @param {Object} anything
 * @api public
 */

function hasBinary (obj) {
  if (!obj || typeof obj !== 'object') {
    return false;
  }

  if (isArray(obj)) {
    for (var i = 0, l = obj.length; i < l; i++) {
      if (hasBinary(obj[i])) {
        return true;
      }
    }
    return false;
  }

  if ((typeof Buffer === 'function' && Buffer.isBuffer && Buffer.isBuffer(obj)) ||
    (typeof ArrayBuffer === 'function' && obj instanceof ArrayBuffer) ||
    (withNativeBlob && obj instanceof Blob) ||
    (withNativeFile && obj instanceof File)
  ) {
    return true;
  }

  // see: https://github.com/Automattic/has-binary/pull/4
  if (obj.toJSON && typeof obj.toJSON === 'function' && arguments.length === 1) {
    return hasBinary(obj.toJSON(), true);
  }

  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key) && hasBinary(obj[key])) {
      return true;
    }
  }

  return false;
}


/***/ }),

/***/ "../../node_modules/has-cors/index.js":
/*!********************************************!*\
  !*** ../../node_modules/has-cors/index.js ***!
  \********************************************/
/***/ ((module) => {


/**
 * Module exports.
 *
 * Logic borrowed from Modernizr:
 *
 *   - https://github.com/Modernizr/Modernizr/blob/master/feature-detects/cors.js
 */

try {
  module.exports = typeof XMLHttpRequest !== 'undefined' &&
    'withCredentials' in new XMLHttpRequest();
} catch (err) {
  // if XMLHttp support is disabled in IE then it will throw
  // when trying to create
  module.exports = false;
}


/***/ }),

/***/ "../../node_modules/indexof/index.js":
/*!*******************************************!*\
  !*** ../../node_modules/indexof/index.js ***!
  \*******************************************/
/***/ ((module) => {


var indexOf = [].indexOf;

module.exports = function(arr, obj){
  if (indexOf) return arr.indexOf(obj);
  for (var i = 0; i < arr.length; ++i) {
    if (arr[i] === obj) return i;
  }
  return -1;
};

/***/ }),

/***/ "../../node_modules/isarray/index.js":
/*!*******************************************!*\
  !*** ../../node_modules/isarray/index.js ***!
  \*******************************************/
/***/ ((module) => {

var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};


/***/ }),

/***/ "../../node_modules/parseqs/index.js":
/*!*******************************************!*\
  !*** ../../node_modules/parseqs/index.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, exports) => {

/**
 * Compiles a querystring
 * Returns string representation of the object
 *
 * @param {Object}
 * @api private
 */

exports.encode = function (obj) {
  var str = '';

  for (var i in obj) {
    if (obj.hasOwnProperty(i)) {
      if (str.length) str += '&';
      str += encodeURIComponent(i) + '=' + encodeURIComponent(obj[i]);
    }
  }

  return str;
};

/**
 * Parses a simple querystring into an object
 *
 * @param {String} qs
 * @api private
 */

exports.decode = function(qs){
  var qry = {};
  var pairs = qs.split('&');
  for (var i = 0, l = pairs.length; i < l; i++) {
    var pair = pairs[i].split('=');
    qry[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
  }
  return qry;
};


/***/ }),

/***/ "../../node_modules/parseuri/index.js":
/*!********************************************!*\
  !*** ../../node_modules/parseuri/index.js ***!
  \********************************************/
/***/ ((module) => {

/**
 * Parses an URI
 *
 * @author Steven Levithan <stevenlevithan.com> (MIT license)
 * @api private
 */

var re = /^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;

var parts = [
    'source', 'protocol', 'authority', 'userInfo', 'user', 'password', 'host', 'port', 'relative', 'path', 'directory', 'file', 'query', 'anchor'
];

module.exports = function parseuri(str) {
    var src = str,
        b = str.indexOf('['),
        e = str.indexOf(']');

    if (b != -1 && e != -1) {
        str = str.substring(0, b) + str.substring(b, e).replace(/:/g, ';') + str.substring(e, str.length);
    }

    var m = re.exec(str || ''),
        uri = {},
        i = 14;

    while (i--) {
        uri[parts[i]] = m[i] || '';
    }

    if (b != -1 && e != -1) {
        uri.source = src;
        uri.host = uri.host.substring(1, uri.host.length - 1).replace(/;/g, ':');
        uri.authority = uri.authority.replace('[', '').replace(']', '').replace(/;/g, ':');
        uri.ipv6uri = true;
    }

    uri.pathNames = pathNames(uri, uri['path']);
    uri.queryKey = queryKey(uri, uri['query']);

    return uri;
};

function pathNames(obj, path) {
    var regx = /\/{2,9}/g,
        names = path.replace(regx, "/").split("/");

    if (path.substr(0, 1) == '/' || path.length === 0) {
        names.splice(0, 1);
    }
    if (path.substr(path.length - 1, 1) == '/') {
        names.splice(names.length - 1, 1);
    }

    return names;
}

function queryKey(uri, query) {
    var data = {};

    query.replace(/(?:^|&)([^&=]*)=?([^&]*)/g, function ($0, $1, $2) {
        if ($1) {
            data[$1] = $2;
        }
    });

    return data;
}


/***/ }),

/***/ "../../node_modules/path-browserify/index.js":
/*!***************************************************!*\
  !*** ../../node_modules/path-browserify/index.js ***!
  \***************************************************/
/***/ ((module) => {

"use strict";
// 'path' module extracted from Node.js v8.11.1 (only the posix part)
// transplited with Babel

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



function assertPath(path) {
  if (typeof path !== 'string') {
    throw new TypeError('Path must be a string. Received ' + JSON.stringify(path));
  }
}

// Resolves . and .. elements in a path with directory names
function normalizeStringPosix(path, allowAboveRoot) {
  var res = '';
  var lastSegmentLength = 0;
  var lastSlash = -1;
  var dots = 0;
  var code;
  for (var i = 0; i <= path.length; ++i) {
    if (i < path.length)
      code = path.charCodeAt(i);
    else if (code === 47 /*/*/)
      break;
    else
      code = 47 /*/*/;
    if (code === 47 /*/*/) {
      if (lastSlash === i - 1 || dots === 1) {
        // NOOP
      } else if (lastSlash !== i - 1 && dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== 46 /*.*/ || res.charCodeAt(res.length - 2) !== 46 /*.*/) {
          if (res.length > 2) {
            var lastSlashIndex = res.lastIndexOf('/');
            if (lastSlashIndex !== res.length - 1) {
              if (lastSlashIndex === -1) {
                res = '';
                lastSegmentLength = 0;
              } else {
                res = res.slice(0, lastSlashIndex);
                lastSegmentLength = res.length - 1 - res.lastIndexOf('/');
              }
              lastSlash = i;
              dots = 0;
              continue;
            }
          } else if (res.length === 2 || res.length === 1) {
            res = '';
            lastSegmentLength = 0;
            lastSlash = i;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          if (res.length > 0)
            res += '/..';
          else
            res = '..';
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0)
          res += '/' + path.slice(lastSlash + 1, i);
        else
          res = path.slice(lastSlash + 1, i);
        lastSegmentLength = i - lastSlash - 1;
      }
      lastSlash = i;
      dots = 0;
    } else if (code === 46 /*.*/ && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}

function _format(sep, pathObject) {
  var dir = pathObject.dir || pathObject.root;
  var base = pathObject.base || (pathObject.name || '') + (pathObject.ext || '');
  if (!dir) {
    return base;
  }
  if (dir === pathObject.root) {
    return dir + base;
  }
  return dir + sep + base;
}

var posix = {
  // path.resolve([from ...], to)
  resolve: function resolve() {
    var resolvedPath = '';
    var resolvedAbsolute = false;
    var cwd;

    for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
      var path;
      if (i >= 0)
        path = arguments[i];
      else {
        if (cwd === undefined)
          cwd = process.cwd();
        path = cwd;
      }

      assertPath(path);

      // Skip empty entries
      if (path.length === 0) {
        continue;
      }

      resolvedPath = path + '/' + resolvedPath;
      resolvedAbsolute = path.charCodeAt(0) === 47 /*/*/;
    }

    // At this point the path should be resolved to a full absolute path, but
    // handle relative paths to be safe (might happen when process.cwd() fails)

    // Normalize the path
    resolvedPath = normalizeStringPosix(resolvedPath, !resolvedAbsolute);

    if (resolvedAbsolute) {
      if (resolvedPath.length > 0)
        return '/' + resolvedPath;
      else
        return '/';
    } else if (resolvedPath.length > 0) {
      return resolvedPath;
    } else {
      return '.';
    }
  },

  normalize: function normalize(path) {
    assertPath(path);

    if (path.length === 0) return '.';

    var isAbsolute = path.charCodeAt(0) === 47 /*/*/;
    var trailingSeparator = path.charCodeAt(path.length - 1) === 47 /*/*/;

    // Normalize the path
    path = normalizeStringPosix(path, !isAbsolute);

    if (path.length === 0 && !isAbsolute) path = '.';
    if (path.length > 0 && trailingSeparator) path += '/';

    if (isAbsolute) return '/' + path;
    return path;
  },

  isAbsolute: function isAbsolute(path) {
    assertPath(path);
    return path.length > 0 && path.charCodeAt(0) === 47 /*/*/;
  },

  join: function join() {
    if (arguments.length === 0)
      return '.';
    var joined;
    for (var i = 0; i < arguments.length; ++i) {
      var arg = arguments[i];
      assertPath(arg);
      if (arg.length > 0) {
        if (joined === undefined)
          joined = arg;
        else
          joined += '/' + arg;
      }
    }
    if (joined === undefined)
      return '.';
    return posix.normalize(joined);
  },

  relative: function relative(from, to) {
    assertPath(from);
    assertPath(to);

    if (from === to) return '';

    from = posix.resolve(from);
    to = posix.resolve(to);

    if (from === to) return '';

    // Trim any leading backslashes
    var fromStart = 1;
    for (; fromStart < from.length; ++fromStart) {
      if (from.charCodeAt(fromStart) !== 47 /*/*/)
        break;
    }
    var fromEnd = from.length;
    var fromLen = fromEnd - fromStart;

    // Trim any leading backslashes
    var toStart = 1;
    for (; toStart < to.length; ++toStart) {
      if (to.charCodeAt(toStart) !== 47 /*/*/)
        break;
    }
    var toEnd = to.length;
    var toLen = toEnd - toStart;

    // Compare paths to find the longest common path from root
    var length = fromLen < toLen ? fromLen : toLen;
    var lastCommonSep = -1;
    var i = 0;
    for (; i <= length; ++i) {
      if (i === length) {
        if (toLen > length) {
          if (to.charCodeAt(toStart + i) === 47 /*/*/) {
            // We get here if `from` is the exact base path for `to`.
            // For example: from='/foo/bar'; to='/foo/bar/baz'
            return to.slice(toStart + i + 1);
          } else if (i === 0) {
            // We get here if `from` is the root
            // For example: from='/'; to='/foo'
            return to.slice(toStart + i);
          }
        } else if (fromLen > length) {
          if (from.charCodeAt(fromStart + i) === 47 /*/*/) {
            // We get here if `to` is the exact base path for `from`.
            // For example: from='/foo/bar/baz'; to='/foo/bar'
            lastCommonSep = i;
          } else if (i === 0) {
            // We get here if `to` is the root.
            // For example: from='/foo'; to='/'
            lastCommonSep = 0;
          }
        }
        break;
      }
      var fromCode = from.charCodeAt(fromStart + i);
      var toCode = to.charCodeAt(toStart + i);
      if (fromCode !== toCode)
        break;
      else if (fromCode === 47 /*/*/)
        lastCommonSep = i;
    }

    var out = '';
    // Generate the relative path based on the path difference between `to`
    // and `from`
    for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
      if (i === fromEnd || from.charCodeAt(i) === 47 /*/*/) {
        if (out.length === 0)
          out += '..';
        else
          out += '/..';
      }
    }

    // Lastly, append the rest of the destination (`to`) path that comes after
    // the common path parts
    if (out.length > 0)
      return out + to.slice(toStart + lastCommonSep);
    else {
      toStart += lastCommonSep;
      if (to.charCodeAt(toStart) === 47 /*/*/)
        ++toStart;
      return to.slice(toStart);
    }
  },

  _makeLong: function _makeLong(path) {
    return path;
  },

  dirname: function dirname(path) {
    assertPath(path);
    if (path.length === 0) return '.';
    var code = path.charCodeAt(0);
    var hasRoot = code === 47 /*/*/;
    var end = -1;
    var matchedSlash = true;
    for (var i = path.length - 1; i >= 1; --i) {
      code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          if (!matchedSlash) {
            end = i;
            break;
          }
        } else {
        // We saw the first non-path separator
        matchedSlash = false;
      }
    }

    if (end === -1) return hasRoot ? '/' : '.';
    if (hasRoot && end === 1) return '//';
    return path.slice(0, end);
  },

  basename: function basename(path, ext) {
    if (ext !== undefined && typeof ext !== 'string') throw new TypeError('"ext" argument must be a string');
    assertPath(path);

    var start = 0;
    var end = -1;
    var matchedSlash = true;
    var i;

    if (ext !== undefined && ext.length > 0 && ext.length <= path.length) {
      if (ext.length === path.length && ext === path) return '';
      var extIdx = ext.length - 1;
      var firstNonSlashEnd = -1;
      for (i = path.length - 1; i >= 0; --i) {
        var code = path.charCodeAt(i);
        if (code === 47 /*/*/) {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now
            if (!matchedSlash) {
              start = i + 1;
              break;
            }
          } else {
          if (firstNonSlashEnd === -1) {
            // We saw the first non-path separator, remember this index in case
            // we need it if the extension ends up not matching
            matchedSlash = false;
            firstNonSlashEnd = i + 1;
          }
          if (extIdx >= 0) {
            // Try to match the explicit extension
            if (code === ext.charCodeAt(extIdx)) {
              if (--extIdx === -1) {
                // We matched the extension, so mark this as the end of our path
                // component
                end = i;
              }
            } else {
              // Extension does not match, so our result is the entire path
              // component
              extIdx = -1;
              end = firstNonSlashEnd;
            }
          }
        }
      }

      if (start === end) end = firstNonSlashEnd;else if (end === -1) end = path.length;
      return path.slice(start, end);
    } else {
      for (i = path.length - 1; i >= 0; --i) {
        if (path.charCodeAt(i) === 47 /*/*/) {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now
            if (!matchedSlash) {
              start = i + 1;
              break;
            }
          } else if (end === -1) {
          // We saw the first non-path separator, mark this as the end of our
          // path component
          matchedSlash = false;
          end = i + 1;
        }
      }

      if (end === -1) return '';
      return path.slice(start, end);
    }
  },

  extname: function extname(path) {
    assertPath(path);
    var startDot = -1;
    var startPart = 0;
    var end = -1;
    var matchedSlash = true;
    // Track the state of characters (if any) we see before our first dot and
    // after any path separator we find
    var preDotState = 0;
    for (var i = path.length - 1; i >= 0; --i) {
      var code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
      if (end === -1) {
        // We saw the first non-path separator, mark this as the end of our
        // extension
        matchedSlash = false;
        end = i + 1;
      }
      if (code === 46 /*.*/) {
          // If this is our first dot, mark it as the start of our extension
          if (startDot === -1)
            startDot = i;
          else if (preDotState !== 1)
            preDotState = 1;
      } else if (startDot !== -1) {
        // We saw a non-dot and non-path separator before our dot, so we should
        // have a good chance at having a non-empty extension
        preDotState = -1;
      }
    }

    if (startDot === -1 || end === -1 ||
        // We saw a non-dot character immediately before the dot
        preDotState === 0 ||
        // The (right-most) trimmed path component is exactly '..'
        preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
      return '';
    }
    return path.slice(startDot, end);
  },

  format: function format(pathObject) {
    if (pathObject === null || typeof pathObject !== 'object') {
      throw new TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof pathObject);
    }
    return _format('/', pathObject);
  },

  parse: function parse(path) {
    assertPath(path);

    var ret = { root: '', dir: '', base: '', ext: '', name: '' };
    if (path.length === 0) return ret;
    var code = path.charCodeAt(0);
    var isAbsolute = code === 47 /*/*/;
    var start;
    if (isAbsolute) {
      ret.root = '/';
      start = 1;
    } else {
      start = 0;
    }
    var startDot = -1;
    var startPart = 0;
    var end = -1;
    var matchedSlash = true;
    var i = path.length - 1;

    // Track the state of characters (if any) we see before our first dot and
    // after any path separator we find
    var preDotState = 0;

    // Get non-dir info
    for (; i >= start; --i) {
      code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
      if (end === -1) {
        // We saw the first non-path separator, mark this as the end of our
        // extension
        matchedSlash = false;
        end = i + 1;
      }
      if (code === 46 /*.*/) {
          // If this is our first dot, mark it as the start of our extension
          if (startDot === -1) startDot = i;else if (preDotState !== 1) preDotState = 1;
        } else if (startDot !== -1) {
        // We saw a non-dot and non-path separator before our dot, so we should
        // have a good chance at having a non-empty extension
        preDotState = -1;
      }
    }

    if (startDot === -1 || end === -1 ||
    // We saw a non-dot character immediately before the dot
    preDotState === 0 ||
    // The (right-most) trimmed path component is exactly '..'
    preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
      if (end !== -1) {
        if (startPart === 0 && isAbsolute) ret.base = ret.name = path.slice(1, end);else ret.base = ret.name = path.slice(startPart, end);
      }
    } else {
      if (startPart === 0 && isAbsolute) {
        ret.name = path.slice(1, startDot);
        ret.base = path.slice(1, end);
      } else {
        ret.name = path.slice(startPart, startDot);
        ret.base = path.slice(startPart, end);
      }
      ret.ext = path.slice(startDot, end);
    }

    if (startPart > 0) ret.dir = path.slice(0, startPart - 1);else if (isAbsolute) ret.dir = '/';

    return ret;
  },

  sep: '/',
  delimiter: ':',
  win32: null,
  posix: null
};

posix.posix = posix;

module.exports = posix;


/***/ }),

/***/ "../../node_modules/socket.io-client/lib/index.js":
/*!********************************************************!*\
  !*** ../../node_modules/socket.io-client/lib/index.js ***!
  \********************************************************/
/***/ ((module, exports, __webpack_require__) => {


/**
 * Module dependencies.
 */

var url = __webpack_require__(/*! ./url */ "../../node_modules/socket.io-client/lib/url.js");
var parser = __webpack_require__(/*! socket.io-parser */ "../../node_modules/socket.io-client/node_modules/socket.io-parser/index.js");
var Manager = __webpack_require__(/*! ./manager */ "../../node_modules/socket.io-client/lib/manager.js");
var debug = __webpack_require__(/*! debug */ "../../node_modules/socket.io-client/node_modules/debug/src/browser.js")('socket.io-client');

/**
 * Module exports.
 */

module.exports = exports = lookup;

/**
 * Managers cache.
 */

var cache = exports.managers = {};

/**
 * Looks up an existing `Manager` for multiplexing.
 * If the user summons:
 *
 *   `io('http://localhost/a');`
 *   `io('http://localhost/b');`
 *
 * We reuse the existing instance based on same scheme/port/host,
 * and we initialize sockets for each namespace.
 *
 * @api public
 */

function lookup (uri, opts) {
  if (typeof uri === 'object') {
    opts = uri;
    uri = undefined;
  }

  opts = opts || {};

  var parsed = url(uri);
  var source = parsed.source;
  var id = parsed.id;
  var path = parsed.path;
  var sameNamespace = cache[id] && path in cache[id].nsps;
  var newConnection = opts.forceNew || opts['force new connection'] ||
                      false === opts.multiplex || sameNamespace;

  var io;

  if (newConnection) {
    debug('ignoring socket cache for %s', source);
    io = Manager(source, opts);
  } else {
    if (!cache[id]) {
      debug('new io instance for %s', source);
      cache[id] = Manager(source, opts);
    }
    io = cache[id];
  }
  if (parsed.query && !opts.query) {
    opts.query = parsed.query;
  }
  return io.socket(parsed.path, opts);
}

/**
 * Protocol version.
 *
 * @api public
 */

exports.protocol = parser.protocol;

/**
 * `connect`.
 *
 * @param {String} uri
 * @api public
 */

exports.connect = lookup;

/**
 * Expose constructors for standalone build.
 *
 * @api public
 */

exports.Manager = __webpack_require__(/*! ./manager */ "../../node_modules/socket.io-client/lib/manager.js");
exports.Socket = __webpack_require__(/*! ./socket */ "../../node_modules/socket.io-client/lib/socket.js");


/***/ }),

/***/ "../../node_modules/socket.io-client/lib/manager.js":
/*!**********************************************************!*\
  !*** ../../node_modules/socket.io-client/lib/manager.js ***!
  \**********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


/**
 * Module dependencies.
 */

var eio = __webpack_require__(/*! engine.io-client */ "../../node_modules/engine.io-client/lib/index.js");
var Socket = __webpack_require__(/*! ./socket */ "../../node_modules/socket.io-client/lib/socket.js");
var Emitter = __webpack_require__(/*! component-emitter */ "../../node_modules/component-emitter/index.js");
var parser = __webpack_require__(/*! socket.io-parser */ "../../node_modules/socket.io-client/node_modules/socket.io-parser/index.js");
var on = __webpack_require__(/*! ./on */ "../../node_modules/socket.io-client/lib/on.js");
var bind = __webpack_require__(/*! component-bind */ "../../node_modules/component-bind/index.js");
var debug = __webpack_require__(/*! debug */ "../../node_modules/socket.io-client/node_modules/debug/src/browser.js")('socket.io-client:manager');
var indexOf = __webpack_require__(/*! indexof */ "../../node_modules/indexof/index.js");
var Backoff = __webpack_require__(/*! backo2 */ "../../node_modules/backo2/index.js");

/**
 * IE6+ hasOwnProperty
 */

var has = Object.prototype.hasOwnProperty;

/**
 * Module exports
 */

module.exports = Manager;

/**
 * `Manager` constructor.
 *
 * @param {String} engine instance or engine uri/opts
 * @param {Object} options
 * @api public
 */

function Manager (uri, opts) {
  if (!(this instanceof Manager)) return new Manager(uri, opts);
  if (uri && ('object' === typeof uri)) {
    opts = uri;
    uri = undefined;
  }
  opts = opts || {};

  opts.path = opts.path || '/socket.io';
  this.nsps = {};
  this.subs = [];
  this.opts = opts;
  this.reconnection(opts.reconnection !== false);
  this.reconnectionAttempts(opts.reconnectionAttempts || Infinity);
  this.reconnectionDelay(opts.reconnectionDelay || 1000);
  this.reconnectionDelayMax(opts.reconnectionDelayMax || 5000);
  this.randomizationFactor(opts.randomizationFactor || 0.5);
  this.backoff = new Backoff({
    min: this.reconnectionDelay(),
    max: this.reconnectionDelayMax(),
    jitter: this.randomizationFactor()
  });
  this.timeout(null == opts.timeout ? 20000 : opts.timeout);
  this.readyState = 'closed';
  this.uri = uri;
  this.connecting = [];
  this.lastPing = null;
  this.encoding = false;
  this.packetBuffer = [];
  var _parser = opts.parser || parser;
  this.encoder = new _parser.Encoder();
  this.decoder = new _parser.Decoder();
  this.autoConnect = opts.autoConnect !== false;
  if (this.autoConnect) this.open();
}

/**
 * Propagate given event to sockets and emit on `this`
 *
 * @api private
 */

Manager.prototype.emitAll = function () {
  this.emit.apply(this, arguments);
  for (var nsp in this.nsps) {
    if (has.call(this.nsps, nsp)) {
      this.nsps[nsp].emit.apply(this.nsps[nsp], arguments);
    }
  }
};

/**
 * Update `socket.id` of all sockets
 *
 * @api private
 */

Manager.prototype.updateSocketIds = function () {
  for (var nsp in this.nsps) {
    if (has.call(this.nsps, nsp)) {
      this.nsps[nsp].id = this.generateId(nsp);
    }
  }
};

/**
 * generate `socket.id` for the given `nsp`
 *
 * @param {String} nsp
 * @return {String}
 * @api private
 */

Manager.prototype.generateId = function (nsp) {
  return (nsp === '/' ? '' : (nsp + '#')) + this.engine.id;
};

/**
 * Mix in `Emitter`.
 */

Emitter(Manager.prototype);

/**
 * Sets the `reconnection` config.
 *
 * @param {Boolean} true/false if it should automatically reconnect
 * @return {Manager} self or value
 * @api public
 */

Manager.prototype.reconnection = function (v) {
  if (!arguments.length) return this._reconnection;
  this._reconnection = !!v;
  return this;
};

/**
 * Sets the reconnection attempts config.
 *
 * @param {Number} max reconnection attempts before giving up
 * @return {Manager} self or value
 * @api public
 */

Manager.prototype.reconnectionAttempts = function (v) {
  if (!arguments.length) return this._reconnectionAttempts;
  this._reconnectionAttempts = v;
  return this;
};

/**
 * Sets the delay between reconnections.
 *
 * @param {Number} delay
 * @return {Manager} self or value
 * @api public
 */

Manager.prototype.reconnectionDelay = function (v) {
  if (!arguments.length) return this._reconnectionDelay;
  this._reconnectionDelay = v;
  this.backoff && this.backoff.setMin(v);
  return this;
};

Manager.prototype.randomizationFactor = function (v) {
  if (!arguments.length) return this._randomizationFactor;
  this._randomizationFactor = v;
  this.backoff && this.backoff.setJitter(v);
  return this;
};

/**
 * Sets the maximum delay between reconnections.
 *
 * @param {Number} delay
 * @return {Manager} self or value
 * @api public
 */

Manager.prototype.reconnectionDelayMax = function (v) {
  if (!arguments.length) return this._reconnectionDelayMax;
  this._reconnectionDelayMax = v;
  this.backoff && this.backoff.setMax(v);
  return this;
};

/**
 * Sets the connection timeout. `false` to disable
 *
 * @return {Manager} self or value
 * @api public
 */

Manager.prototype.timeout = function (v) {
  if (!arguments.length) return this._timeout;
  this._timeout = v;
  return this;
};

/**
 * Starts trying to reconnect if reconnection is enabled and we have not
 * started reconnecting yet
 *
 * @api private
 */

Manager.prototype.maybeReconnectOnOpen = function () {
  // Only try to reconnect if it's the first time we're connecting
  if (!this.reconnecting && this._reconnection && this.backoff.attempts === 0) {
    // keeps reconnection from firing twice for the same reconnection loop
    this.reconnect();
  }
};

/**
 * Sets the current transport `socket`.
 *
 * @param {Function} optional, callback
 * @return {Manager} self
 * @api public
 */

Manager.prototype.open =
Manager.prototype.connect = function (fn, opts) {
  debug('readyState %s', this.readyState);
  if (~this.readyState.indexOf('open')) return this;

  debug('opening %s', this.uri);
  this.engine = eio(this.uri, this.opts);
  var socket = this.engine;
  var self = this;
  this.readyState = 'opening';
  this.skipReconnect = false;

  // emit `open`
  var openSub = on(socket, 'open', function () {
    self.onopen();
    fn && fn();
  });

  // emit `connect_error`
  var errorSub = on(socket, 'error', function (data) {
    debug('connect_error');
    self.cleanup();
    self.readyState = 'closed';
    self.emitAll('connect_error', data);
    if (fn) {
      var err = new Error('Connection error');
      err.data = data;
      fn(err);
    } else {
      // Only do this if there is no fn to handle the error
      self.maybeReconnectOnOpen();
    }
  });

  // emit `connect_timeout`
  if (false !== this._timeout) {
    var timeout = this._timeout;
    debug('connect attempt will timeout after %d', timeout);

    if (timeout === 0) {
      openSub.destroy(); // prevents a race condition with the 'open' event
    }

    // set timer
    var timer = setTimeout(function () {
      debug('connect attempt timed out after %d', timeout);
      openSub.destroy();
      socket.close();
      socket.emit('error', 'timeout');
      self.emitAll('connect_timeout', timeout);
    }, timeout);

    this.subs.push({
      destroy: function () {
        clearTimeout(timer);
      }
    });
  }

  this.subs.push(openSub);
  this.subs.push(errorSub);

  return this;
};

/**
 * Called upon transport open.
 *
 * @api private
 */

Manager.prototype.onopen = function () {
  debug('open');

  // clear old subs
  this.cleanup();

  // mark as open
  this.readyState = 'open';
  this.emit('open');

  // add new subs
  var socket = this.engine;
  this.subs.push(on(socket, 'data', bind(this, 'ondata')));
  this.subs.push(on(socket, 'ping', bind(this, 'onping')));
  this.subs.push(on(socket, 'pong', bind(this, 'onpong')));
  this.subs.push(on(socket, 'error', bind(this, 'onerror')));
  this.subs.push(on(socket, 'close', bind(this, 'onclose')));
  this.subs.push(on(this.decoder, 'decoded', bind(this, 'ondecoded')));
};

/**
 * Called upon a ping.
 *
 * @api private
 */

Manager.prototype.onping = function () {
  this.lastPing = new Date();
  this.emitAll('ping');
};

/**
 * Called upon a packet.
 *
 * @api private
 */

Manager.prototype.onpong = function () {
  this.emitAll('pong', new Date() - this.lastPing);
};

/**
 * Called with data.
 *
 * @api private
 */

Manager.prototype.ondata = function (data) {
  this.decoder.add(data);
};

/**
 * Called when parser fully decodes a packet.
 *
 * @api private
 */

Manager.prototype.ondecoded = function (packet) {
  this.emit('packet', packet);
};

/**
 * Called upon socket error.
 *
 * @api private
 */

Manager.prototype.onerror = function (err) {
  debug('error', err);
  this.emitAll('error', err);
};

/**
 * Creates a new socket for the given `nsp`.
 *
 * @return {Socket}
 * @api public
 */

Manager.prototype.socket = function (nsp, opts) {
  var socket = this.nsps[nsp];
  if (!socket) {
    socket = new Socket(this, nsp, opts);
    this.nsps[nsp] = socket;
    var self = this;
    socket.on('connecting', onConnecting);
    socket.on('connect', function () {
      socket.id = self.generateId(nsp);
    });

    if (this.autoConnect) {
      // manually call here since connecting event is fired before listening
      onConnecting();
    }
  }

  function onConnecting () {
    if (!~indexOf(self.connecting, socket)) {
      self.connecting.push(socket);
    }
  }

  return socket;
};

/**
 * Called upon a socket close.
 *
 * @param {Socket} socket
 */

Manager.prototype.destroy = function (socket) {
  var index = indexOf(this.connecting, socket);
  if (~index) this.connecting.splice(index, 1);
  if (this.connecting.length) return;

  this.close();
};

/**
 * Writes a packet.
 *
 * @param {Object} packet
 * @api private
 */

Manager.prototype.packet = function (packet) {
  debug('writing packet %j', packet);
  var self = this;
  if (packet.query && packet.type === 0) packet.nsp += '?' + packet.query;

  if (!self.encoding) {
    // encode, then write to engine with result
    self.encoding = true;
    this.encoder.encode(packet, function (encodedPackets) {
      for (var i = 0; i < encodedPackets.length; i++) {
        self.engine.write(encodedPackets[i], packet.options);
      }
      self.encoding = false;
      self.processPacketQueue();
    });
  } else { // add packet to the queue
    self.packetBuffer.push(packet);
  }
};

/**
 * If packet buffer is non-empty, begins encoding the
 * next packet in line.
 *
 * @api private
 */

Manager.prototype.processPacketQueue = function () {
  if (this.packetBuffer.length > 0 && !this.encoding) {
    var pack = this.packetBuffer.shift();
    this.packet(pack);
  }
};

/**
 * Clean up transport subscriptions and packet buffer.
 *
 * @api private
 */

Manager.prototype.cleanup = function () {
  debug('cleanup');

  var subsLength = this.subs.length;
  for (var i = 0; i < subsLength; i++) {
    var sub = this.subs.shift();
    sub.destroy();
  }

  this.packetBuffer = [];
  this.encoding = false;
  this.lastPing = null;

  this.decoder.destroy();
};

/**
 * Close the current socket.
 *
 * @api private
 */

Manager.prototype.close =
Manager.prototype.disconnect = function () {
  debug('disconnect');
  this.skipReconnect = true;
  this.reconnecting = false;
  if ('opening' === this.readyState) {
    // `onclose` will not fire because
    // an open event never happened
    this.cleanup();
  }
  this.backoff.reset();
  this.readyState = 'closed';
  if (this.engine) this.engine.close();
};

/**
 * Called upon engine close.
 *
 * @api private
 */

Manager.prototype.onclose = function (reason) {
  debug('onclose');

  this.cleanup();
  this.backoff.reset();
  this.readyState = 'closed';
  this.emit('close', reason);

  if (this._reconnection && !this.skipReconnect) {
    this.reconnect();
  }
};

/**
 * Attempt a reconnection.
 *
 * @api private
 */

Manager.prototype.reconnect = function () {
  if (this.reconnecting || this.skipReconnect) return this;

  var self = this;

  if (this.backoff.attempts >= this._reconnectionAttempts) {
    debug('reconnect failed');
    this.backoff.reset();
    this.emitAll('reconnect_failed');
    this.reconnecting = false;
  } else {
    var delay = this.backoff.duration();
    debug('will wait %dms before reconnect attempt', delay);

    this.reconnecting = true;
    var timer = setTimeout(function () {
      if (self.skipReconnect) return;

      debug('attempting reconnect');
      self.emitAll('reconnect_attempt', self.backoff.attempts);
      self.emitAll('reconnecting', self.backoff.attempts);

      // check again for the case socket closed in above events
      if (self.skipReconnect) return;

      self.open(function (err) {
        if (err) {
          debug('reconnect attempt error');
          self.reconnecting = false;
          self.reconnect();
          self.emitAll('reconnect_error', err.data);
        } else {
          debug('reconnect success');
          self.onreconnect();
        }
      });
    }, delay);

    this.subs.push({
      destroy: function () {
        clearTimeout(timer);
      }
    });
  }
};

/**
 * Called upon successful reconnect.
 *
 * @api private
 */

Manager.prototype.onreconnect = function () {
  var attempt = this.backoff.attempts;
  this.reconnecting = false;
  this.backoff.reset();
  this.updateSocketIds();
  this.emitAll('reconnect', attempt);
};


/***/ }),

/***/ "../../node_modules/socket.io-client/lib/on.js":
/*!*****************************************************!*\
  !*** ../../node_modules/socket.io-client/lib/on.js ***!
  \*****************************************************/
/***/ ((module) => {


/**
 * Module exports.
 */

module.exports = on;

/**
 * Helper for subscriptions.
 *
 * @param {Object|EventEmitter} obj with `Emitter` mixin or `EventEmitter`
 * @param {String} event name
 * @param {Function} callback
 * @api public
 */

function on (obj, ev, fn) {
  obj.on(ev, fn);
  return {
    destroy: function () {
      obj.removeListener(ev, fn);
    }
  };
}


/***/ }),

/***/ "../../node_modules/socket.io-client/lib/socket.js":
/*!*********************************************************!*\
  !*** ../../node_modules/socket.io-client/lib/socket.js ***!
  \*********************************************************/
/***/ ((module, exports, __webpack_require__) => {


/**
 * Module dependencies.
 */

var parser = __webpack_require__(/*! socket.io-parser */ "../../node_modules/socket.io-client/node_modules/socket.io-parser/index.js");
var Emitter = __webpack_require__(/*! component-emitter */ "../../node_modules/component-emitter/index.js");
var toArray = __webpack_require__(/*! to-array */ "../../node_modules/to-array/index.js");
var on = __webpack_require__(/*! ./on */ "../../node_modules/socket.io-client/lib/on.js");
var bind = __webpack_require__(/*! component-bind */ "../../node_modules/component-bind/index.js");
var debug = __webpack_require__(/*! debug */ "../../node_modules/socket.io-client/node_modules/debug/src/browser.js")('socket.io-client:socket');
var parseqs = __webpack_require__(/*! parseqs */ "../../node_modules/parseqs/index.js");
var hasBin = __webpack_require__(/*! has-binary2 */ "../../node_modules/has-binary2/index.js");

/**
 * Module exports.
 */

module.exports = exports = Socket;

/**
 * Internal events (blacklisted).
 * These events can't be emitted by the user.
 *
 * @api private
 */

var events = {
  connect: 1,
  connect_error: 1,
  connect_timeout: 1,
  connecting: 1,
  disconnect: 1,
  error: 1,
  reconnect: 1,
  reconnect_attempt: 1,
  reconnect_failed: 1,
  reconnect_error: 1,
  reconnecting: 1,
  ping: 1,
  pong: 1
};

/**
 * Shortcut to `Emitter#emit`.
 */

var emit = Emitter.prototype.emit;

/**
 * `Socket` constructor.
 *
 * @api public
 */

function Socket (io, nsp, opts) {
  this.io = io;
  this.nsp = nsp;
  this.json = this; // compat
  this.ids = 0;
  this.acks = {};
  this.receiveBuffer = [];
  this.sendBuffer = [];
  this.connected = false;
  this.disconnected = true;
  this.flags = {};
  if (opts && opts.query) {
    this.query = opts.query;
  }
  if (this.io.autoConnect) this.open();
}

/**
 * Mix in `Emitter`.
 */

Emitter(Socket.prototype);

/**
 * Subscribe to open, close and packet events
 *
 * @api private
 */

Socket.prototype.subEvents = function () {
  if (this.subs) return;

  var io = this.io;
  this.subs = [
    on(io, 'open', bind(this, 'onopen')),
    on(io, 'packet', bind(this, 'onpacket')),
    on(io, 'close', bind(this, 'onclose'))
  ];
};

/**
 * "Opens" the socket.
 *
 * @api public
 */

Socket.prototype.open =
Socket.prototype.connect = function () {
  if (this.connected) return this;

  this.subEvents();
  if (!this.io.reconnecting) this.io.open(); // ensure open
  if ('open' === this.io.readyState) this.onopen();
  this.emit('connecting');
  return this;
};

/**
 * Sends a `message` event.
 *
 * @return {Socket} self
 * @api public
 */

Socket.prototype.send = function () {
  var args = toArray(arguments);
  args.unshift('message');
  this.emit.apply(this, args);
  return this;
};

/**
 * Override `emit`.
 * If the event is in `events`, it's emitted normally.
 *
 * @param {String} event name
 * @return {Socket} self
 * @api public
 */

Socket.prototype.emit = function (ev) {
  if (events.hasOwnProperty(ev)) {
    emit.apply(this, arguments);
    return this;
  }

  var args = toArray(arguments);
  var packet = {
    type: (this.flags.binary !== undefined ? this.flags.binary : hasBin(args)) ? parser.BINARY_EVENT : parser.EVENT,
    data: args
  };

  packet.options = {};
  packet.options.compress = !this.flags || false !== this.flags.compress;

  // event ack callback
  if ('function' === typeof args[args.length - 1]) {
    debug('emitting packet with ack id %d', this.ids);
    this.acks[this.ids] = args.pop();
    packet.id = this.ids++;
  }

  if (this.connected) {
    this.packet(packet);
  } else {
    this.sendBuffer.push(packet);
  }

  this.flags = {};

  return this;
};

/**
 * Sends a packet.
 *
 * @param {Object} packet
 * @api private
 */

Socket.prototype.packet = function (packet) {
  packet.nsp = this.nsp;
  this.io.packet(packet);
};

/**
 * Called upon engine `open`.
 *
 * @api private
 */

Socket.prototype.onopen = function () {
  debug('transport is open - connecting');

  // write connect packet if necessary
  if ('/' !== this.nsp) {
    if (this.query) {
      var query = typeof this.query === 'object' ? parseqs.encode(this.query) : this.query;
      debug('sending connect packet with query %s', query);
      this.packet({type: parser.CONNECT, query: query});
    } else {
      this.packet({type: parser.CONNECT});
    }
  }
};

/**
 * Called upon engine `close`.
 *
 * @param {String} reason
 * @api private
 */

Socket.prototype.onclose = function (reason) {
  debug('close (%s)', reason);
  this.connected = false;
  this.disconnected = true;
  delete this.id;
  this.emit('disconnect', reason);
};

/**
 * Called with socket packet.
 *
 * @param {Object} packet
 * @api private
 */

Socket.prototype.onpacket = function (packet) {
  var sameNamespace = packet.nsp === this.nsp;
  var rootNamespaceError = packet.type === parser.ERROR && packet.nsp === '/';

  if (!sameNamespace && !rootNamespaceError) return;

  switch (packet.type) {
    case parser.CONNECT:
      this.onconnect();
      break;

    case parser.EVENT:
      this.onevent(packet);
      break;

    case parser.BINARY_EVENT:
      this.onevent(packet);
      break;

    case parser.ACK:
      this.onack(packet);
      break;

    case parser.BINARY_ACK:
      this.onack(packet);
      break;

    case parser.DISCONNECT:
      this.ondisconnect();
      break;

    case parser.ERROR:
      this.emit('error', packet.data);
      break;
  }
};

/**
 * Called upon a server event.
 *
 * @param {Object} packet
 * @api private
 */

Socket.prototype.onevent = function (packet) {
  var args = packet.data || [];
  debug('emitting event %j', args);

  if (null != packet.id) {
    debug('attaching ack callback to event');
    args.push(this.ack(packet.id));
  }

  if (this.connected) {
    emit.apply(this, args);
  } else {
    this.receiveBuffer.push(args);
  }
};

/**
 * Produces an ack callback to emit with an event.
 *
 * @api private
 */

Socket.prototype.ack = function (id) {
  var self = this;
  var sent = false;
  return function () {
    // prevent double callbacks
    if (sent) return;
    sent = true;
    var args = toArray(arguments);
    debug('sending ack %j', args);

    self.packet({
      type: hasBin(args) ? parser.BINARY_ACK : parser.ACK,
      id: id,
      data: args
    });
  };
};

/**
 * Called upon a server acknowlegement.
 *
 * @param {Object} packet
 * @api private
 */

Socket.prototype.onack = function (packet) {
  var ack = this.acks[packet.id];
  if ('function' === typeof ack) {
    debug('calling ack %s with %j', packet.id, packet.data);
    ack.apply(this, packet.data);
    delete this.acks[packet.id];
  } else {
    debug('bad ack %s', packet.id);
  }
};

/**
 * Called upon server connect.
 *
 * @api private
 */

Socket.prototype.onconnect = function () {
  this.connected = true;
  this.disconnected = false;
  this.emit('connect');
  this.emitBuffered();
};

/**
 * Emit buffered events (received and emitted).
 *
 * @api private
 */

Socket.prototype.emitBuffered = function () {
  var i;
  for (i = 0; i < this.receiveBuffer.length; i++) {
    emit.apply(this, this.receiveBuffer[i]);
  }
  this.receiveBuffer = [];

  for (i = 0; i < this.sendBuffer.length; i++) {
    this.packet(this.sendBuffer[i]);
  }
  this.sendBuffer = [];
};

/**
 * Called upon server disconnect.
 *
 * @api private
 */

Socket.prototype.ondisconnect = function () {
  debug('server disconnect (%s)', this.nsp);
  this.destroy();
  this.onclose('io server disconnect');
};

/**
 * Called upon forced client/server side disconnections,
 * this method ensures the manager stops tracking us and
 * that reconnections don't get triggered for this.
 *
 * @api private.
 */

Socket.prototype.destroy = function () {
  if (this.subs) {
    // clean subscriptions to avoid reconnections
    for (var i = 0; i < this.subs.length; i++) {
      this.subs[i].destroy();
    }
    this.subs = null;
  }

  this.io.destroy(this);
};

/**
 * Disconnects the socket manually.
 *
 * @return {Socket} self
 * @api public
 */

Socket.prototype.close =
Socket.prototype.disconnect = function () {
  if (this.connected) {
    debug('performing disconnect (%s)', this.nsp);
    this.packet({ type: parser.DISCONNECT });
  }

  // remove socket from pool
  this.destroy();

  if (this.connected) {
    // fire events
    this.onclose('io client disconnect');
  }
  return this;
};

/**
 * Sets the compress flag.
 *
 * @param {Boolean} if `true`, compresses the sending data
 * @return {Socket} self
 * @api public
 */

Socket.prototype.compress = function (compress) {
  this.flags.compress = compress;
  return this;
};

/**
 * Sets the binary flag
 *
 * @param {Boolean} whether the emitted data contains binary
 * @return {Socket} self
 * @api public
 */

Socket.prototype.binary = function (binary) {
  this.flags.binary = binary;
  return this;
};


/***/ }),

/***/ "../../node_modules/socket.io-client/lib/url.js":
/*!******************************************************!*\
  !*** ../../node_modules/socket.io-client/lib/url.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


/**
 * Module dependencies.
 */

var parseuri = __webpack_require__(/*! parseuri */ "../../node_modules/parseuri/index.js");
var debug = __webpack_require__(/*! debug */ "../../node_modules/socket.io-client/node_modules/debug/src/browser.js")('socket.io-client:url');

/**
 * Module exports.
 */

module.exports = url;

/**
 * URL parser.
 *
 * @param {String} url
 * @param {Object} An object meant to mimic window.location.
 *                 Defaults to window.location.
 * @api public
 */

function url (uri, loc) {
  var obj = uri;

  // default to window.location
  loc = loc || (typeof location !== 'undefined' && location);
  if (null == uri) uri = loc.protocol + '//' + loc.host;

  // relative path support
  if ('string' === typeof uri) {
    if ('/' === uri.charAt(0)) {
      if ('/' === uri.charAt(1)) {
        uri = loc.protocol + uri;
      } else {
        uri = loc.host + uri;
      }
    }

    if (!/^(https?|wss?):\/\//.test(uri)) {
      debug('protocol-less url %s', uri);
      if ('undefined' !== typeof loc) {
        uri = loc.protocol + '//' + uri;
      } else {
        uri = 'https://' + uri;
      }
    }

    // parse
    debug('parse %s', uri);
    obj = parseuri(uri);
  }

  // make sure we treat `localhost:80` and `localhost` equally
  if (!obj.port) {
    if (/^(http|ws)$/.test(obj.protocol)) {
      obj.port = '80';
    } else if (/^(http|ws)s$/.test(obj.protocol)) {
      obj.port = '443';
    }
  }

  obj.path = obj.path || '/';

  var ipv6 = obj.host.indexOf(':') !== -1;
  var host = ipv6 ? '[' + obj.host + ']' : obj.host;

  // define unique id
  obj.id = obj.protocol + '://' + host + ':' + obj.port;
  // define href
  obj.href = obj.protocol + '://' + host + (loc && loc.port === obj.port ? '' : (':' + obj.port));

  return obj;
}


/***/ }),

/***/ "../../node_modules/socket.io-client/node_modules/debug/src/browser.js":
/*!*****************************************************************************!*\
  !*** ../../node_modules/socket.io-client/node_modules/debug/src/browser.js ***!
  \*****************************************************************************/
/***/ ((module, exports, __webpack_require__) => {

/**
 * This is the web browser implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = __webpack_require__(/*! ./debug */ "../../node_modules/socket.io-client/node_modules/debug/src/debug.js");
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = 'undefined' != typeof chrome
               && 'undefined' != typeof chrome.storage
                  ? chrome.storage.local
                  : localstorage();

/**
 * Colors.
 */

exports.colors = [
  '#0000CC', '#0000FF', '#0033CC', '#0033FF', '#0066CC', '#0066FF', '#0099CC',
  '#0099FF', '#00CC00', '#00CC33', '#00CC66', '#00CC99', '#00CCCC', '#00CCFF',
  '#3300CC', '#3300FF', '#3333CC', '#3333FF', '#3366CC', '#3366FF', '#3399CC',
  '#3399FF', '#33CC00', '#33CC33', '#33CC66', '#33CC99', '#33CCCC', '#33CCFF',
  '#6600CC', '#6600FF', '#6633CC', '#6633FF', '#66CC00', '#66CC33', '#9900CC',
  '#9900FF', '#9933CC', '#9933FF', '#99CC00', '#99CC33', '#CC0000', '#CC0033',
  '#CC0066', '#CC0099', '#CC00CC', '#CC00FF', '#CC3300', '#CC3333', '#CC3366',
  '#CC3399', '#CC33CC', '#CC33FF', '#CC6600', '#CC6633', '#CC9900', '#CC9933',
  '#CCCC00', '#CCCC33', '#FF0000', '#FF0033', '#FF0066', '#FF0099', '#FF00CC',
  '#FF00FF', '#FF3300', '#FF3333', '#FF3366', '#FF3399', '#FF33CC', '#FF33FF',
  '#FF6600', '#FF6633', '#FF9900', '#FF9933', '#FFCC00', '#FFCC33'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

function useColors() {
  // NB: In an Electron preload script, document will be defined but not fully
  // initialized. Since we know we're in Chrome, we'll just detect this case
  // explicitly
  if (typeof window !== 'undefined' && window.process && window.process.type === 'renderer') {
    return true;
  }

  // Internet Explorer and Edge do not support colors.
  if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
    return false;
  }

  // is webkit? http://stackoverflow.com/a/16459606/376773
  // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
  return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
    // is firebug? http://stackoverflow.com/a/398120/376773
    (typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
    // is firefox >= v31?
    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
    (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
    // double check webkit in userAgent just in case we are in a worker
    (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
}

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

exports.formatters.j = function(v) {
  try {
    return JSON.stringify(v);
  } catch (err) {
    return '[UnexpectedJSONParseError]: ' + err.message;
  }
};


/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs(args) {
  var useColors = this.useColors;

  args[0] = (useColors ? '%c' : '')
    + this.namespace
    + (useColors ? ' %c' : ' ')
    + args[0]
    + (useColors ? '%c ' : ' ')
    + '+' + exports.humanize(this.diff);

  if (!useColors) return;

  var c = 'color: ' + this.color;
  args.splice(1, 0, c, 'color: inherit')

  // the final "%c" is somewhat tricky, because there could be other
  // arguments passed either before or after the %c, so we need to
  // figure out the correct index to insert the CSS into
  var index = 0;
  var lastC = 0;
  args[0].replace(/%[a-zA-Z%]/g, function(match) {
    if ('%%' === match) return;
    index++;
    if ('%c' === match) {
      // we only are interested in the *last* %c
      // (the user may have provided their own)
      lastC = index;
    }
  });

  args.splice(lastC, 0, c);
}

/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */

function log() {
  // this hackery is required for IE8/9, where
  // the `console.log` function doesn't have 'apply'
  return 'object' === typeof console
    && console.log
    && Function.prototype.apply.call(console.log, console, arguments);
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */

function save(namespaces) {
  try {
    if (null == namespaces) {
      exports.storage.removeItem('debug');
    } else {
      exports.storage.debug = namespaces;
    }
  } catch(e) {}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
  var r;
  try {
    r = exports.storage.debug;
  } catch(e) {}

  // If debug isn't set in LS, and we're in Electron, try to load $DEBUG
  if (!r && typeof process !== 'undefined' && 'env' in process) {
    r = process.env.DEBUG;
  }

  return r;
}

/**
 * Enable namespaces listed in `localStorage.debug` initially.
 */

exports.enable(load());

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage() {
  try {
    return window.localStorage;
  } catch (e) {}
}


/***/ }),

/***/ "../../node_modules/socket.io-client/node_modules/debug/src/debug.js":
/*!***************************************************************************!*\
  !*** ../../node_modules/socket.io-client/node_modules/debug/src/debug.js ***!
  \***************************************************************************/
/***/ ((module, exports, __webpack_require__) => {


/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = createDebug.debug = createDebug['default'] = createDebug;
exports.coerce = coerce;
exports.disable = disable;
exports.enable = enable;
exports.enabled = enabled;
exports.humanize = __webpack_require__(/*! ms */ "../../node_modules/socket.io-client/node_modules/ms/index.js");

/**
 * Active `debug` instances.
 */
exports.instances = [];

/**
 * The currently active debug mode names, and names to skip.
 */

exports.names = [];
exports.skips = [];

/**
 * Map of special "%n" handling functions, for the debug "format" argument.
 *
 * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
 */

exports.formatters = {};

/**
 * Select a color.
 * @param {String} namespace
 * @return {Number}
 * @api private
 */

function selectColor(namespace) {
  var hash = 0, i;

  for (i in namespace) {
    hash  = ((hash << 5) - hash) + namespace.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }

  return exports.colors[Math.abs(hash) % exports.colors.length];
}

/**
 * Create a debugger with the given `namespace`.
 *
 * @param {String} namespace
 * @return {Function}
 * @api public
 */

function createDebug(namespace) {

  var prevTime;

  function debug() {
    // disabled?
    if (!debug.enabled) return;

    var self = debug;

    // set `diff` timestamp
    var curr = +new Date();
    var ms = curr - (prevTime || curr);
    self.diff = ms;
    self.prev = prevTime;
    self.curr = curr;
    prevTime = curr;

    // turn the `arguments` into a proper Array
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }

    args[0] = exports.coerce(args[0]);

    if ('string' !== typeof args[0]) {
      // anything else let's inspect with %O
      args.unshift('%O');
    }

    // apply any `formatters` transformations
    var index = 0;
    args[0] = args[0].replace(/%([a-zA-Z%])/g, function(match, format) {
      // if we encounter an escaped % then don't increase the array index
      if (match === '%%') return match;
      index++;
      var formatter = exports.formatters[format];
      if ('function' === typeof formatter) {
        var val = args[index];
        match = formatter.call(self, val);

        // now we need to remove `args[index]` since it's inlined in the `format`
        args.splice(index, 1);
        index--;
      }
      return match;
    });

    // apply env-specific formatting (colors, etc.)
    exports.formatArgs.call(self, args);

    var logFn = debug.log || exports.log || console.log.bind(console);
    logFn.apply(self, args);
  }

  debug.namespace = namespace;
  debug.enabled = exports.enabled(namespace);
  debug.useColors = exports.useColors();
  debug.color = selectColor(namespace);
  debug.destroy = destroy;

  // env-specific initialization logic for debug instances
  if ('function' === typeof exports.init) {
    exports.init(debug);
  }

  exports.instances.push(debug);

  return debug;
}

function destroy () {
  var index = exports.instances.indexOf(this);
  if (index !== -1) {
    exports.instances.splice(index, 1);
    return true;
  } else {
    return false;
  }
}

/**
 * Enables a debug mode by namespaces. This can include modes
 * separated by a colon and wildcards.
 *
 * @param {String} namespaces
 * @api public
 */

function enable(namespaces) {
  exports.save(namespaces);

  exports.names = [];
  exports.skips = [];

  var i;
  var split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
  var len = split.length;

  for (i = 0; i < len; i++) {
    if (!split[i]) continue; // ignore empty strings
    namespaces = split[i].replace(/\*/g, '.*?');
    if (namespaces[0] === '-') {
      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
    } else {
      exports.names.push(new RegExp('^' + namespaces + '$'));
    }
  }

  for (i = 0; i < exports.instances.length; i++) {
    var instance = exports.instances[i];
    instance.enabled = exports.enabled(instance.namespace);
  }
}

/**
 * Disable debug output.
 *
 * @api public
 */

function disable() {
  exports.enable('');
}

/**
 * Returns true if the given mode name is enabled, false otherwise.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

function enabled(name) {
  if (name[name.length - 1] === '*') {
    return true;
  }
  var i, len;
  for (i = 0, len = exports.skips.length; i < len; i++) {
    if (exports.skips[i].test(name)) {
      return false;
    }
  }
  for (i = 0, len = exports.names.length; i < len; i++) {
    if (exports.names[i].test(name)) {
      return true;
    }
  }
  return false;
}

/**
 * Coerce `val`.
 *
 * @param {Mixed} val
 * @return {Mixed}
 * @api private
 */

function coerce(val) {
  if (val instanceof Error) return val.stack || val.message;
  return val;
}


/***/ }),

/***/ "../../node_modules/socket.io-client/node_modules/ms/index.js":
/*!********************************************************************!*\
  !*** ../../node_modules/socket.io-client/node_modules/ms/index.js ***!
  \********************************************************************/
/***/ ((module) => {

/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

module.exports = function(val, options) {
  options = options || {};
  var type = typeof val;
  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isNaN(val) === false) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error(
    'val is not a non-empty string or a valid number. val=' +
      JSON.stringify(val)
  );
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(
    str
  );
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  if (ms >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (ms >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (ms >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (ms >= s) {
    return Math.round(ms / s) + 's';
  }
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  return plural(ms, d, 'day') ||
    plural(ms, h, 'hour') ||
    plural(ms, m, 'minute') ||
    plural(ms, s, 'second') ||
    ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, n, name) {
  if (ms < n) {
    return;
  }
  if (ms < n * 1.5) {
    return Math.floor(ms / n) + ' ' + name;
  }
  return Math.ceil(ms / n) + ' ' + name + 's';
}


/***/ }),

/***/ "../../node_modules/socket.io-client/node_modules/socket.io-parser/binary.js":
/*!***********************************************************************************!*\
  !*** ../../node_modules/socket.io-client/node_modules/socket.io-parser/binary.js ***!
  \***********************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

/*global Blob,File*/

/**
 * Module requirements
 */

var isArray = __webpack_require__(/*! isarray */ "../../node_modules/isarray/index.js");
var isBuf = __webpack_require__(/*! ./is-buffer */ "../../node_modules/socket.io-client/node_modules/socket.io-parser/is-buffer.js");
var toString = Object.prototype.toString;
var withNativeBlob = typeof Blob === 'function' || (typeof Blob !== 'undefined' && toString.call(Blob) === '[object BlobConstructor]');
var withNativeFile = typeof File === 'function' || (typeof File !== 'undefined' && toString.call(File) === '[object FileConstructor]');

/**
 * Replaces every Buffer | ArrayBuffer in packet with a numbered placeholder.
 * Anything with blobs or files should be fed through removeBlobs before coming
 * here.
 *
 * @param {Object} packet - socket.io event packet
 * @return {Object} with deconstructed packet and list of buffers
 * @api public
 */

exports.deconstructPacket = function(packet) {
  var buffers = [];
  var packetData = packet.data;
  var pack = packet;
  pack.data = _deconstructPacket(packetData, buffers);
  pack.attachments = buffers.length; // number of binary 'attachments'
  return {packet: pack, buffers: buffers};
};

function _deconstructPacket(data, buffers) {
  if (!data) return data;

  if (isBuf(data)) {
    var placeholder = { _placeholder: true, num: buffers.length };
    buffers.push(data);
    return placeholder;
  } else if (isArray(data)) {
    var newData = new Array(data.length);
    for (var i = 0; i < data.length; i++) {
      newData[i] = _deconstructPacket(data[i], buffers);
    }
    return newData;
  } else if (typeof data === 'object' && !(data instanceof Date)) {
    var newData = {};
    for (var key in data) {
      newData[key] = _deconstructPacket(data[key], buffers);
    }
    return newData;
  }
  return data;
}

/**
 * Reconstructs a binary packet from its placeholder packet and buffers
 *
 * @param {Object} packet - event packet with placeholders
 * @param {Array} buffers - binary buffers to put in placeholder positions
 * @return {Object} reconstructed packet
 * @api public
 */

exports.reconstructPacket = function(packet, buffers) {
  packet.data = _reconstructPacket(packet.data, buffers);
  packet.attachments = undefined; // no longer useful
  return packet;
};

function _reconstructPacket(data, buffers) {
  if (!data) return data;

  if (data && data._placeholder) {
    return buffers[data.num]; // appropriate buffer (should be natural order anyway)
  } else if (isArray(data)) {
    for (var i = 0; i < data.length; i++) {
      data[i] = _reconstructPacket(data[i], buffers);
    }
  } else if (typeof data === 'object') {
    for (var key in data) {
      data[key] = _reconstructPacket(data[key], buffers);
    }
  }

  return data;
}

/**
 * Asynchronously removes Blobs or Files from data via
 * FileReader's readAsArrayBuffer method. Used before encoding
 * data as msgpack. Calls callback with the blobless data.
 *
 * @param {Object} data
 * @param {Function} callback
 * @api private
 */

exports.removeBlobs = function(data, callback) {
  function _removeBlobs(obj, curKey, containingObject) {
    if (!obj) return obj;

    // convert any blob
    if ((withNativeBlob && obj instanceof Blob) ||
        (withNativeFile && obj instanceof File)) {
      pendingBlobs++;

      // async filereader
      var fileReader = new FileReader();
      fileReader.onload = function() { // this.result == arraybuffer
        if (containingObject) {
          containingObject[curKey] = this.result;
        }
        else {
          bloblessData = this.result;
        }

        // if nothing pending its callback time
        if(! --pendingBlobs) {
          callback(bloblessData);
        }
      };

      fileReader.readAsArrayBuffer(obj); // blob -> arraybuffer
    } else if (isArray(obj)) { // handle array
      for (var i = 0; i < obj.length; i++) {
        _removeBlobs(obj[i], i, obj);
      }
    } else if (typeof obj === 'object' && !isBuf(obj)) { // and object
      for (var key in obj) {
        _removeBlobs(obj[key], key, obj);
      }
    }
  }

  var pendingBlobs = 0;
  var bloblessData = data;
  _removeBlobs(bloblessData);
  if (!pendingBlobs) {
    callback(bloblessData);
  }
};


/***/ }),

/***/ "../../node_modules/socket.io-client/node_modules/socket.io-parser/index.js":
/*!**********************************************************************************!*\
  !*** ../../node_modules/socket.io-client/node_modules/socket.io-parser/index.js ***!
  \**********************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


/**
 * Module dependencies.
 */

var debug = __webpack_require__(/*! debug */ "../../node_modules/socket.io-client/node_modules/debug/src/browser.js")('socket.io-parser');
var Emitter = __webpack_require__(/*! component-emitter */ "../../node_modules/component-emitter/index.js");
var binary = __webpack_require__(/*! ./binary */ "../../node_modules/socket.io-client/node_modules/socket.io-parser/binary.js");
var isArray = __webpack_require__(/*! isarray */ "../../node_modules/isarray/index.js");
var isBuf = __webpack_require__(/*! ./is-buffer */ "../../node_modules/socket.io-client/node_modules/socket.io-parser/is-buffer.js");

/**
 * Protocol version.
 *
 * @api public
 */

exports.protocol = 4;

/**
 * Packet types.
 *
 * @api public
 */

exports.types = [
  'CONNECT',
  'DISCONNECT',
  'EVENT',
  'ACK',
  'ERROR',
  'BINARY_EVENT',
  'BINARY_ACK'
];

/**
 * Packet type `connect`.
 *
 * @api public
 */

exports.CONNECT = 0;

/**
 * Packet type `disconnect`.
 *
 * @api public
 */

exports.DISCONNECT = 1;

/**
 * Packet type `event`.
 *
 * @api public
 */

exports.EVENT = 2;

/**
 * Packet type `ack`.
 *
 * @api public
 */

exports.ACK = 3;

/**
 * Packet type `error`.
 *
 * @api public
 */

exports.ERROR = 4;

/**
 * Packet type 'binary event'
 *
 * @api public
 */

exports.BINARY_EVENT = 5;

/**
 * Packet type `binary ack`. For acks with binary arguments.
 *
 * @api public
 */

exports.BINARY_ACK = 6;

/**
 * Encoder constructor.
 *
 * @api public
 */

exports.Encoder = Encoder;

/**
 * Decoder constructor.
 *
 * @api public
 */

exports.Decoder = Decoder;

/**
 * A socket.io Encoder instance
 *
 * @api public
 */

function Encoder() {}

var ERROR_PACKET = exports.ERROR + '"encode error"';

/**
 * Encode a packet as a single string if non-binary, or as a
 * buffer sequence, depending on packet type.
 *
 * @param {Object} obj - packet object
 * @param {Function} callback - function to handle encodings (likely engine.write)
 * @return Calls callback with Array of encodings
 * @api public
 */

Encoder.prototype.encode = function(obj, callback){
  debug('encoding packet %j', obj);

  if (exports.BINARY_EVENT === obj.type || exports.BINARY_ACK === obj.type) {
    encodeAsBinary(obj, callback);
  } else {
    var encoding = encodeAsString(obj);
    callback([encoding]);
  }
};

/**
 * Encode packet as string.
 *
 * @param {Object} packet
 * @return {String} encoded
 * @api private
 */

function encodeAsString(obj) {

  // first is type
  var str = '' + obj.type;

  // attachments if we have them
  if (exports.BINARY_EVENT === obj.type || exports.BINARY_ACK === obj.type) {
    str += obj.attachments + '-';
  }

  // if we have a namespace other than `/`
  // we append it followed by a comma `,`
  if (obj.nsp && '/' !== obj.nsp) {
    str += obj.nsp + ',';
  }

  // immediately followed by the id
  if (null != obj.id) {
    str += obj.id;
  }

  // json data
  if (null != obj.data) {
    var payload = tryStringify(obj.data);
    if (payload !== false) {
      str += payload;
    } else {
      return ERROR_PACKET;
    }
  }

  debug('encoded %j as %s', obj, str);
  return str;
}

function tryStringify(str) {
  try {
    return JSON.stringify(str);
  } catch(e){
    return false;
  }
}

/**
 * Encode packet as 'buffer sequence' by removing blobs, and
 * deconstructing packet into object with placeholders and
 * a list of buffers.
 *
 * @param {Object} packet
 * @return {Buffer} encoded
 * @api private
 */

function encodeAsBinary(obj, callback) {

  function writeEncoding(bloblessData) {
    var deconstruction = binary.deconstructPacket(bloblessData);
    var pack = encodeAsString(deconstruction.packet);
    var buffers = deconstruction.buffers;

    buffers.unshift(pack); // add packet info to beginning of data list
    callback(buffers); // write all the buffers
  }

  binary.removeBlobs(obj, writeEncoding);
}

/**
 * A socket.io Decoder instance
 *
 * @return {Object} decoder
 * @api public
 */

function Decoder() {
  this.reconstructor = null;
}

/**
 * Mix in `Emitter` with Decoder.
 */

Emitter(Decoder.prototype);

/**
 * Decodes an encoded packet string into packet JSON.
 *
 * @param {String} obj - encoded packet
 * @return {Object} packet
 * @api public
 */

Decoder.prototype.add = function(obj) {
  var packet;
  if (typeof obj === 'string') {
    packet = decodeString(obj);
    if (exports.BINARY_EVENT === packet.type || exports.BINARY_ACK === packet.type) { // binary packet's json
      this.reconstructor = new BinaryReconstructor(packet);

      // no attachments, labeled binary but no binary data to follow
      if (this.reconstructor.reconPack.attachments === 0) {
        this.emit('decoded', packet);
      }
    } else { // non-binary full packet
      this.emit('decoded', packet);
    }
  } else if (isBuf(obj) || obj.base64) { // raw binary data
    if (!this.reconstructor) {
      throw new Error('got binary data when not reconstructing a packet');
    } else {
      packet = this.reconstructor.takeBinaryData(obj);
      if (packet) { // received final buffer
        this.reconstructor = null;
        this.emit('decoded', packet);
      }
    }
  } else {
    throw new Error('Unknown type: ' + obj);
  }
};

/**
 * Decode a packet String (JSON data)
 *
 * @param {String} str
 * @return {Object} packet
 * @api private
 */

function decodeString(str) {
  var i = 0;
  // look up type
  var p = {
    type: Number(str.charAt(0))
  };

  if (null == exports.types[p.type]) {
    return error('unknown packet type ' + p.type);
  }

  // look up attachments if type binary
  if (exports.BINARY_EVENT === p.type || exports.BINARY_ACK === p.type) {
    var start = i + 1;
    while (str.charAt(++i) !== '-' && i != str.length) {}
    var buf = str.substring(start, i);
    if (buf != Number(buf) || str.charAt(i) !== '-') {
      throw new Error('Illegal attachments');
    }
    p.attachments = Number(buf);
  }

  // look up namespace (if any)
  if ('/' === str.charAt(i + 1)) {
    var start = i + 1;
    while (++i) {
      var c = str.charAt(i);
      if (',' === c) break;
      if (i === str.length) break;
    }
    p.nsp = str.substring(start, i);
  } else {
    p.nsp = '/';
  }

  // look up id
  var next = str.charAt(i + 1);
  if ('' !== next && Number(next) == next) {
    var start = i + 1;
    while (++i) {
      var c = str.charAt(i);
      if (null == c || Number(c) != c) {
        --i;
        break;
      }
      if (i === str.length) break;
    }
    p.id = Number(str.substring(start, i + 1));
  }

  // look up json data
  if (str.charAt(++i)) {
    var payload = tryParse(str.substr(i));
    var isPayloadValid = payload !== false && (p.type === exports.ERROR || isArray(payload));
    if (isPayloadValid) {
      p.data = payload;
    } else {
      return error('invalid payload');
    }
  }

  debug('decoded %s as %j', str, p);
  return p;
}

function tryParse(str) {
  try {
    return JSON.parse(str);
  } catch(e){
    return false;
  }
}

/**
 * Deallocates a parser's resources
 *
 * @api public
 */

Decoder.prototype.destroy = function() {
  if (this.reconstructor) {
    this.reconstructor.finishedReconstruction();
  }
};

/**
 * A manager of a binary event's 'buffer sequence'. Should
 * be constructed whenever a packet of type BINARY_EVENT is
 * decoded.
 *
 * @param {Object} packet
 * @return {BinaryReconstructor} initialized reconstructor
 * @api private
 */

function BinaryReconstructor(packet) {
  this.reconPack = packet;
  this.buffers = [];
}

/**
 * Method to be called when binary data received from connection
 * after a BINARY_EVENT packet.
 *
 * @param {Buffer | ArrayBuffer} binData - the raw binary data received
 * @return {null | Object} returns null if more binary data is expected or
 *   a reconstructed packet object if all buffers have been received.
 * @api private
 */

BinaryReconstructor.prototype.takeBinaryData = function(binData) {
  this.buffers.push(binData);
  if (this.buffers.length === this.reconPack.attachments) { // done with buffer list
    var packet = binary.reconstructPacket(this.reconPack, this.buffers);
    this.finishedReconstruction();
    return packet;
  }
  return null;
};

/**
 * Cleans up binary packet reconstruction variables.
 *
 * @api private
 */

BinaryReconstructor.prototype.finishedReconstruction = function() {
  this.reconPack = null;
  this.buffers = [];
};

function error(msg) {
  return {
    type: exports.ERROR,
    data: 'parser error: ' + msg
  };
}


/***/ }),

/***/ "../../node_modules/socket.io-client/node_modules/socket.io-parser/is-buffer.js":
/*!**************************************************************************************!*\
  !*** ../../node_modules/socket.io-client/node_modules/socket.io-parser/is-buffer.js ***!
  \**************************************************************************************/
/***/ ((module) => {


module.exports = isBuf;

var withNativeBuffer = typeof Buffer === 'function' && typeof Buffer.isBuffer === 'function';
var withNativeArrayBuffer = typeof ArrayBuffer === 'function';

var isView = function (obj) {
  return typeof ArrayBuffer.isView === 'function' ? ArrayBuffer.isView(obj) : (obj.buffer instanceof ArrayBuffer);
};

/**
 * Returns true if obj is a buffer or an arraybuffer.
 *
 * @api private
 */

function isBuf(obj) {
  return (withNativeBuffer && Buffer.isBuffer(obj)) ||
          (withNativeArrayBuffer && (obj instanceof ArrayBuffer || isView(obj)));
}


/***/ }),

/***/ "../../node_modules/to-array/index.js":
/*!********************************************!*\
  !*** ../../node_modules/to-array/index.js ***!
  \********************************************/
/***/ ((module) => {

module.exports = toArray

function toArray(list, index) {
    var array = []

    index = index || 0

    for (var i = index || 0; i < list.length; i++) {
        array[i - index] = list[i]
    }

    return array
}


/***/ }),

/***/ "../../node_modules/yeast/index.js":
/*!*****************************************!*\
  !*** ../../node_modules/yeast/index.js ***!
  \*****************************************/
/***/ ((module) => {

"use strict";


var alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_'.split('')
  , length = 64
  , map = {}
  , seed = 0
  , i = 0
  , prev;

/**
 * Return a string representing the specified number.
 *
 * @param {Number} num The number to convert.
 * @returns {String} The string representation of the number.
 * @api public
 */
function encode(num) {
  var encoded = '';

  do {
    encoded = alphabet[num % length] + encoded;
    num = Math.floor(num / length);
  } while (num > 0);

  return encoded;
}

/**
 * Return the integer value specified by the given string.
 *
 * @param {String} str The string to convert.
 * @returns {Number} The integer value represented by the string.
 * @api public
 */
function decode(str) {
  var decoded = 0;

  for (i = 0; i < str.length; i++) {
    decoded = decoded * length + map[str.charAt(i)];
  }

  return decoded;
}

/**
 * Yeast: A tiny growing id generator.
 *
 * @returns {String} A unique id.
 * @api public
 */
function yeast() {
  var now = encode(+new Date());

  if (now !== prev) return seed = 0, prev = now;
  return now +'.'+ encode(seed++);
}

//
// Map each character to its index.
//
for (; i < length; i++) map[alphabet[i]] = i;

//
// Expose the `yeast`, `encode` and `decode` functions.
//
yeast.encode = encode;
yeast.decode = decode;
module.exports = yeast;


/***/ }),

/***/ "?fb7c":
/*!********************!*\
  !*** ws (ignored) ***!
  \********************/
/***/ (() => {

/* (ignored) */

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!************************!*\
  !*** ./src/backend.js ***!
  \************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var socket_io_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! socket.io-client */ "../../node_modules/socket.io-client/lib/index.js");
/* harmony import */ var socket_io_client__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(socket_io_client__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _back__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @back */ "../app-backend-core/lib/index.js");
/* harmony import */ var _back__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_back__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _utils_bridge__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @utils/bridge */ "../shared-utils/lib/bridge.js");
/* harmony import */ var _back_toast__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @back/toast */ "../app-backend-core/lib/toast.js");
/* harmony import */ var _utils_env__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @utils/env */ "../shared-utils/lib/env.js");






var host = _utils_env__WEBPACK_IMPORTED_MODULE_3__.target.__VUE_DEVTOOLS_HOST__ || 'http://localhost'
var port = _utils_env__WEBPACK_IMPORTED_MODULE_3__.target.__VUE_DEVTOOLS_PORT__ !== undefined ? _utils_env__WEBPACK_IMPORTED_MODULE_3__.target.__VUE_DEVTOOLS_PORT__ : 8098
var fullHost = port ? host + ':' + port : host
var createSocket = _utils_env__WEBPACK_IMPORTED_MODULE_3__.target.__VUE_DEVTOOLS_SOCKET__ || (socket_io_client__WEBPACK_IMPORTED_MODULE_0___default())
var socket = createSocket(fullHost)

var connectedMessage = function () {
  if (_utils_env__WEBPACK_IMPORTED_MODULE_3__.target.__VUE_DEVTOOLS_TOAST__) {
    _utils_env__WEBPACK_IMPORTED_MODULE_3__.target.__VUE_DEVTOOLS_TOAST__('Remote Devtools Connected', 'normal')
  }
}

var disconnectedMessage = function () {
  if (_utils_env__WEBPACK_IMPORTED_MODULE_3__.target.__VUE_DEVTOOLS_TOAST__) {
    _utils_env__WEBPACK_IMPORTED_MODULE_3__.target.__VUE_DEVTOOLS_TOAST__('Remote Devtools Disconnected', 'error')
  }
}

socket.on('connect', function () {
  connectedMessage()
  ;(0,_back__WEBPACK_IMPORTED_MODULE_1__.initBackend)(bridge)
  socket.emit('vue-devtools-init')
})

// Global disconnect handler. Fires in two cases:
// - after calling above socket.disconnect()
// - once devtools is closed (that's why we need socket.disconnect() here too, to prevent further polling)
socket.on('disconnect', function (reason) {
  socket.disconnect()
  disconnectedMessage()
})

// Disconnect socket once other client is connected
socket.on('vue-devtools-disconnect-backend', function () {
  socket.disconnect()
})

var bridge = new _utils_bridge__WEBPACK_IMPORTED_MODULE_4__.Bridge({
  listen: function listen (fn) {
    socket.on('vue-message', function (data) { return fn(data); })
  },
  send: function send (data) {
    socket.emit('vue-message', data)
  }
})

bridge.on('shutdown', function () {
  socket.disconnect()
  disconnectedMessage()
})

;(0,_back_toast__WEBPACK_IMPORTED_MODULE_2__.installToast)(_utils_env__WEBPACK_IMPORTED_MODULE_3__.target)

})();

/******/ })()
;