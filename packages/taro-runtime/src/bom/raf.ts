/**
 *
 * Based on performance-now from Braveg1rl.
 *
 * Copyright (c) 2013 Braveg1rl
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
// https://github.com/myrne/performance-now
export let now

(function () {
  let loadTime
  if ((typeof performance !== 'undefined' && performance !== null) && performance.now) {
    now = function () {
      return performance.now()
    }
  } else if (Date.now) {
    now = function () {
      return Date.now() - loadTime
    }
    loadTime = Date.now()
  } else {
    now = function () {
      return new Date().getTime() - loadTime
    }
    loadTime = new Date().getTime()
  }
})()

let lastTime = 0

// requestAnimationFrame polyfill by Erik Möller.
// Fixes from Paul Irish, Tino Zijdel, Andrew Mao, Klemen Slavic, Darius Bacon and Joan Alba Maldonado.
// Adapted from https://gist.github.com/paulirish/1579671 which derived from
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
// Added high resolution timing. This window.performance.now() polyfill can be used: https://gist.github.com/jalbam/cc805ac3cfe14004ecdf323159ecf40e
// MIT license
// Gist: https://gist.github.com/jalbam/5fe05443270fa6d8136238ec72accbc0
let raf = typeof requestAnimationFrame !== 'undefined' && requestAnimationFrame !== null ? requestAnimationFrame : function (callback) {
  const _now = now()
  const nextTime = Math.max(lastTime + 16, _now) // First time will execute it immediately but barely noticeable and performance is gained.
  return setTimeout(function () { callback(lastTime = nextTime) }, nextTime - _now)
}

let caf = typeof cancelAnimationFrame !== 'undefined' && cancelAnimationFrame !== null ? cancelAnimationFrame : clearTimeout

if (typeof global !== 'undefined') {
  raf = raf.bind(global)
  caf = caf.bind(global)
}

export {
  raf,
  caf
}
