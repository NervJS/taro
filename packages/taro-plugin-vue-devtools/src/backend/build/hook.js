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
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "../app-backend-core/lib/hook.js":
/*!***************************************!*\
  !*** ../app-backend-core/lib/hook.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


// this script is injected into every page.
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.installHook = void 0;
/**
 * Install the hook on window, which is an event emitter.
 * Note because Chrome content scripts cannot directly modify the window object,
 * we are evaling this function by inserting a script tag. That's why we have
 * to inline the whole event emitter implementation here.
 *
 * @param {Window|global} target
 */
function installHook(target, isIframe) {
    if ( isIframe === void 0 ) isIframe = false;

    var listeners = {};
    var iframeChecks = 0;
    function injectToIframes() {
        var iframes = [];
        var loop = function () {
            try {
                if (iframe.__vdevtools__injected)
                    { return; }
                iframe.__vdevtools__injected = true;
                var inject = function () {
                    try {
                        iframe.contentWindow.__VUE_DEVTOOLS_IFRAME__ = iframe;
                        var script = iframe.contentDocument.createElement('script');
                        script.textContent = ';(' + installHook.toString() + ')(window, true)';
                        iframe.contentDocument.documentElement.appendChild(script);
                        script.parentNode.removeChild(script);
                    }
                    catch (e) {
                        // Ignore
                    }
                };
                inject();
                iframe.addEventListener('load', function () { return inject(); });
            }
            catch (e) {
                // Ignore
            }
        };

        for (var iframe of iframes) loop();
    }
    injectToIframes();
    var iframeTimer = setInterval(function () {
        injectToIframes();
        iframeChecks++;
        if (iframeChecks >= 5) {
            clearInterval(iframeTimer);
        }
    }, 1000);
    if (Object.prototype.hasOwnProperty.call(target, '__VUE_DEVTOOLS_GLOBAL_HOOK__'))
        { return; }
    var hook;
    if (isIframe) {
        var sendToParent = function (cb) {
            try {
                var hook = window.parent.__VUE_DEVTOOLS_GLOBAL_HOOK__;
                if (hook) {
                    cb(hook);
                }
                else {
                    console.warn('[Vue Devtools] No hook in parent window');
                }
            }
            catch (e) {
                console.warn('[Vue Devtools] Failed to send message to parend window', e);
            }
        };
        hook = {
            // eslint-disable-next-line accessor-pairs
            set Vue(value) {
                sendToParent(function (hook) { hook.Vue = value; });
            },
            on: function on(event, fn) {
                sendToParent(function (hook) { return hook.on(event, fn); });
            },
            once: function once(event, fn) {
                sendToParent(function (hook) { return hook.once(event, fn); });
            },
            off: function off(event, fn) {
                sendToParent(function (hook) { return hook.off(event, fn); });
            },
            emit: function emit(event) {
                var args = [], len = arguments.length - 1;
                while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

                sendToParent(function (hook) { return hook.emit.apply(hook, [ event ].concat( args )); });
            }
        };
    }
    else {
        hook = {
            Vue: null,
            _buffer: [],
            store: null,
            initialState: null,
            storeModules: null,
            flushStoreModules: null,
            apps: [],
            _replayBuffer: function _replayBuffer(event) {
                var buffer = this._buffer;
                this._buffer = [];
                for (var i = 0, l = buffer.length; i < l; i++) {
                    var allArgs = buffer[i];
                    allArgs[0] === event
                        // eslint-disable-next-line prefer-spread
                        ? this.emit.apply(this, allArgs)
                        : this._buffer.push(allArgs);
                }
            },
            on: function on(event, fn) {
                var $event = '$' + event;
                if (listeners[$event]) {
                    listeners[$event].push(fn);
                }
                else {
                    listeners[$event] = [fn];
                    this._replayBuffer(event);
                }
            },
            once: function once(event, fn) {
                var this$1 = this;

                var on = function () {
                    var args = [], len = arguments.length;
                    while ( len-- ) args[ len ] = arguments[ len ];

                    this$1.off(event, on);
                    fn.apply(this$1, args);
                };
                this.on(event, on);
            },
            off: function off(event, fn) {
                event = '$' + event;
                if (!arguments.length) {
                    listeners = {};
                }
                else {
                    var cbs = listeners[event];
                    if (cbs) {
                        if (!fn) {
                            listeners[event] = null;
                        }
                        else {
                            for (var i = 0, l = cbs.length; i < l; i++) {
                                var cb = cbs[i];
                                if (cb === fn || cb.fn === fn) {
                                    cbs.splice(i, 1);
                                    break;
                                }
                            }
                        }
                    }
                }
            },
            emit: function emit(event) {
                var args = [], len = arguments.length - 1;
                while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

                var $event = '$' + event;
                var cbs = listeners[$event];
                if (cbs) {
                    cbs = cbs.slice();
                    for (var i = 0, l = cbs.length; i < l; i++) {
                        cbs[i].apply(this, args);
                    }
                }
                else {
                    this._buffer.push([event ].concat( args));
                }
            }
        };
        hook.once('init', function (Vue) {
            hook.Vue = Vue;
            if (Vue) {
                Vue.prototype.$inspect = function () {
                    var fn = target.__VUE_DEVTOOLS_INSPECT__;
                    fn && fn(this);
                };
            }
        });
        hook.on('app:init', function (app, version, types) {
            var appRecord = {
                app: app,
                version: version,
                types: types
            };
            hook.apps.push(appRecord);
            hook.emit('app:add', appRecord);
        });
        hook.once('vuex:init', function (store) {
            hook.store = store;
            hook.initialState = clone(store.state);
            var origReplaceState = store.replaceState.bind(store);
            store.replaceState = function (state) {
                hook.initialState = clone(state);
                origReplaceState(state);
            };
            // Dynamic modules
            var origRegister, origUnregister;
            if (store.registerModule) {
                hook.storeModules = [];
                origRegister = store.registerModule.bind(store);
                store.registerModule = function (path, module, options) {
                    if (typeof path === 'string')
                        { path = [path]; }
                    hook.storeModules.push({ path: path, module: module, options: options });
                    origRegister(path, module, options);
                    if (true)
                        { console.log('early register module', path, module, options); }
                };
                origUnregister = store.unregisterModule.bind(store);
                store.unregisterModule = function (path) {
                    if (typeof path === 'string')
                        { path = [path]; }
                    var key = path.join('/');
                    var index = hook.storeModules.findIndex(function (m) { return m.path.join('/') === key; });
                    if (index !== -1)
                        { hook.storeModules.splice(index, 1); }
                    origUnregister(path);
                    if (true)
                        { console.log('early unregister module', path); }
                };
            }
            hook.flushStoreModules = function () {
                store.replaceState = origReplaceState;
                if (store.registerModule) {
                    store.registerModule = origRegister;
                    store.unregisterModule = origUnregister;
                }
                return hook.storeModules || [];
            };
        });
    }
    Object.defineProperty(target, '__VUE_DEVTOOLS_GLOBAL_HOOK__', {
        get: function get() {
            return hook;
        }
    });
    // Clone deep utility for cloning initial state of the store
    // Forked from https://github.com/planttheidea/fast-copy
    // Last update: 2019-10-30
    // ⚠️ Don't forget to update `./hook.js`
    // utils
    var ref = Function.prototype;
    var toStringFunction = ref.toString;
    var create = Object.create;
    var defineProperty = Object.defineProperty;
    var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
    var getOwnPropertyNames = Object.getOwnPropertyNames;
    var getOwnPropertySymbols = Object.getOwnPropertySymbols;
    var getPrototypeOf = Object.getPrototypeOf;
    var ref$1 = Object.prototype;
    var hasOwnProperty = ref$1.hasOwnProperty;
    var propertyIsEnumerable = ref$1.propertyIsEnumerable;
    /**
     * @enum
     *
     * @const {Object} SUPPORTS
     *
     * @property {boolean} SYMBOL_PROPERTIES are symbol properties supported
     * @property {boolean} WEAKSET is WeakSet supported
     */
    var SUPPORTS = {
        SYMBOL_PROPERTIES: typeof getOwnPropertySymbols === 'function',
        WEAKSET: typeof WeakSet === 'function'
    };
    /**
     * @function createCache
     *
     * @description
     * get a new cache object to prevent circular references
     *
     * @returns the new cache object
     */
    var createCache = function () {
        if (SUPPORTS.WEAKSET) {
            return new WeakSet();
        }
        var object = create({
            add: function (value) { return object._values.push(value); },
            has: function (value) { return !!~object._values.indexOf(value); }
        });
        object._values = [];
        return object;
    };
    /**
     * @function getCleanClone
     *
     * @description
     * get an empty version of the object with the same prototype it has
     *
     * @param object the object to build a clean clone from
     * @param realm the realm the object resides in
     * @returns the empty cloned object
     */
    var getCleanClone = function (object, realm) {
        if (!object.constructor) {
            return create(null);
        }
        // eslint-disable-next-line no-proto
        var prototype = object.__proto__ || getPrototypeOf(object);
        if (object.constructor === realm.Object) {
            return prototype === realm.Object.prototype ? {} : create(prototype);
        }
        if (~toStringFunction.call(object.constructor).indexOf('[native code]')) {
            try {
                return new object.constructor();
            }
            catch (e) {
                // Error
            }
        }
        return create(prototype);
    };
    /**
     * @function getObjectCloneLoose
     *
     * @description
     * get a copy of the object based on loose rules, meaning all enumerable keys
     * and symbols are copied, but property descriptors are not considered
     *
     * @param object the object to clone
     * @param realm the realm the object resides in
     * @param handleCopy the function that handles copying the object
     * @returns the copied object
     */
    var getObjectCloneLoose = function (object, realm, handleCopy, cache) {
        var clone = getCleanClone(object, realm);
        for (var key in object) {
            if (hasOwnProperty.call(object, key)) {
                clone[key] = handleCopy(object[key], cache);
            }
        }
        if (SUPPORTS.SYMBOL_PROPERTIES) {
            var symbols = getOwnPropertySymbols(object);
            if (symbols.length) {
                for (var index = 0, symbol = (void 0); index < symbols.length; index++) {
                    symbol = symbols[index];
                    if (propertyIsEnumerable.call(object, symbol)) {
                        clone[symbol] = handleCopy(object[symbol], cache);
                    }
                }
            }
        }
        return clone;
    };
    /**
     * @function getObjectCloneStrict
     *
     * @description
     * get a copy of the object based on strict rules, meaning all keys and symbols
     * are copied based on the original property descriptors
     *
     * @param object the object to clone
     * @param realm the realm the object resides in
     * @param handleCopy the function that handles copying the object
     * @returns the copied object
     */
    var getObjectCloneStrict = function (object, realm, handleCopy, cache) {
        var clone = getCleanClone(object, realm);
        var properties = SUPPORTS.SYMBOL_PROPERTIES
            ? [].concat(getOwnPropertyNames(object), getOwnPropertySymbols(object))
            : getOwnPropertyNames(object);
        if (properties.length) {
            for (var index = 0, property = (void 0), descriptor = (void 0); index < properties.length; index++) {
                property = properties[index];
                if (property !== 'callee' && property !== 'caller') {
                    descriptor = getOwnPropertyDescriptor(object, property);
                    descriptor.value = handleCopy(object[property], cache);
                    defineProperty(clone, property, descriptor);
                }
            }
        }
        return clone;
    };
    /**
     * @function getRegExpFlags
     *
     * @description
     * get the flags to apply to the copied regexp
     *
     * @param regExp the regexp to get the flags of
     * @returns the flags for the regexp
     */
    var getRegExpFlags = function (regExp) {
        var flags = '';
        if (regExp.global) {
            flags += 'g';
        }
        if (regExp.ignoreCase) {
            flags += 'i';
        }
        if (regExp.multiline) {
            flags += 'm';
        }
        if (regExp.unicode) {
            flags += 'u';
        }
        if (regExp.sticky) {
            flags += 'y';
        }
        return flags;
    };
    var isArray = Array.isArray;
    var GLOBAL_THIS = (function () {
        if (typeof self !== 'undefined') {
            return self;
        }
        if (typeof window !== 'undefined') {
            return window;
        }
        if (typeof __webpack_require__.g !== 'undefined') {
            return __webpack_require__.g;
        }
        if (console && console.error) {
            console.error('Unable to locate global object, returning "this".');
        }
    })();
    /**
     * @function clone
     *
     * @description
     * copy an object deeply as much as possible
     *
     * If `strict` is applied, then all properties (including non-enumerable ones)
     * are copied with their original property descriptors on both objects and arrays.
     *
     * The object is compared to the global constructors in the `realm` provided,
     * and the native constructor is always used to ensure that extensions of native
     * objects (allows in ES2015+) are maintained.
     *
     * @param object the object to copy
     * @param [options] the options for copying with
     * @param [options.isStrict] should the copy be strict
     * @param [options.realm] the realm (this) object the object is copied from
     * @returns the copied object
     */
    function clone(object, options) {
        if ( options === void 0 ) options = null;

        // manually coalesced instead of default parameters for performance
        var isStrict = !!(options && options.isStrict);
        var realm = (options && options.realm) || GLOBAL_THIS;
        var getObjectClone = isStrict
            ? getObjectCloneStrict
            : getObjectCloneLoose;
        /**
         * @function handleCopy
         *
         * @description
         * copy the object recursively based on its type
         *
         * @param object the object to copy
         * @returns the copied object
         */
        var handleCopy = function (object, cache) {
            if (!object || typeof object !== 'object' || cache.has(object)) {
                return object;
            }
            // DOM objects
            if (object instanceof HTMLElement) {
                return object.cloneNode(false);
            }
            var Constructor = object.constructor;
            // plain objects
            if (Constructor === realm.Object) {
                cache.add(object);
                return getObjectClone(object, realm, handleCopy, cache);
            }
            var clone;
            // arrays
            if (isArray(object)) {
                cache.add(object);
                // if strict, include non-standard properties
                if (isStrict) {
                    return getObjectCloneStrict(object, realm, handleCopy, cache);
                }
                clone = new Constructor();
                for (var index = 0; index < object.length; index++) {
                    clone[index] = handleCopy(object[index], cache);
                }
                return clone;
            }
            // dates
            if (object instanceof realm.Date) {
                return new Constructor(object.getTime());
            }
            // regexps
            if (object instanceof realm.RegExp) {
                clone = new Constructor(object.source, object.flags || getRegExpFlags(object));
                clone.lastIndex = object.lastIndex;
                return clone;
            }
            // maps
            if (realm.Map && object instanceof realm.Map) {
                cache.add(object);
                clone = new Constructor();
                object.forEach(function (value, key) {
                    clone.set(key, handleCopy(value, cache));
                });
                return clone;
            }
            // sets
            if (realm.Set && object instanceof realm.Set) {
                cache.add(object);
                clone = new Constructor();
                object.forEach(function (value) {
                    clone.add(handleCopy(value, cache));
                });
                return clone;
            }
            // buffers (node-only)
            if (realm.Buffer && realm.Buffer.isBuffer(object)) {
                clone = realm.Buffer.allocUnsafe
                    ? realm.Buffer.allocUnsafe(object.length)
                    : new Constructor(object.length);
                object.copy(clone);
                return clone;
            }
            // arraybuffers / dataviews
            if (realm.ArrayBuffer) {
                // dataviews
                if (realm.ArrayBuffer.isView(object)) {
                    return new Constructor(object.buffer.slice(0));
                }
                // arraybuffers
                if (object instanceof realm.ArrayBuffer) {
                    return object.slice(0);
                }
            }
            // if the object cannot / should not be cloned, don't
            if (
            // promise-like
            (hasOwnProperty.call(object, 'then') && typeof object.then === 'function') ||
                // errors
                object instanceof Error ||
                // weakmaps
                (realm.WeakMap && object instanceof realm.WeakMap) ||
                // weaksets
                (realm.WeakSet && object instanceof realm.WeakSet)) {
                return object;
            }
            cache.add(object);
            // assume anything left is a custom constructor
            return getObjectClone(object, realm, handleCopy, cache);
        };
        return handleCopy(object, createCache());
    }
}
exports.installHook = installHook;
//# sourceMappingURL=hook.js.map

/***/ }),

/***/ "../shared-utils/lib/env.js":
/*!**********************************!*\
  !*** ../shared-utils/lib/env.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


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
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/************************************************************************/
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
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*********************!*\
  !*** ./src/hook.js ***!
  \*********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _back_hook__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @back/hook */ "../app-backend-core/lib/hook.js");
/* harmony import */ var _utils_env__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @utils/env */ "../shared-utils/lib/env.js");



(0,_back_hook__WEBPACK_IMPORTED_MODULE_0__.installHook)(_utils_env__WEBPACK_IMPORTED_MODULE_1__.target)

})();

/******/ })()
;
