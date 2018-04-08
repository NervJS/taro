const global = typeof window !== 'undefined' && window.Math === Math 
? window : typeof self !== 'undefined' && self.Math === Math ? self : this

global.Promise = require('promise-polyfill')
global.regeneratorRuntime = require('regenerator-runtime/runtime')
