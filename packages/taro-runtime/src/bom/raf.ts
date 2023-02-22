/* 
 *  Copyright (c) 2013 Braveg1rl
 *  
 *  Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *  
 *  The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *  
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *  
 */

// https://github.com/myrne/performance-now
export let now: () => number

(function () {
  let loadTime
  if ((typeof performance !== 'undefined' && performance !== null) && performance.now) {
    now = () => performance.now()
  } else if (Date.now) {
    loadTime = Date.now()
    now = () => Date.now() - loadTime
  } else {
    loadTime = new Date().getTime()
    now = () => new Date().getTime() - loadTime
  }
})()

let lastTime = 0

// https://gist.github.com/paulirish/1579671
// https://gist.github.com/jalbam/5fe05443270fa6d8136238ec72accbc0
const _raf = typeof requestAnimationFrame !== 'undefined' && requestAnimationFrame !== null ? requestAnimationFrame : function (callback) {
  const _now = now()
  const nextTime = Math.max(lastTime + 16, _now) // First time will execute it immediately but barely noticeable and performance is gained.
  return setTimeout(function () { callback(lastTime = nextTime) }, nextTime - _now)
}

const _caf = typeof cancelAnimationFrame !== 'undefined' && cancelAnimationFrame !== null
  ? cancelAnimationFrame
  : function (seed) {
    // fix https://github.com/NervJS/taro/issues/7749
    clearTimeout(seed)
  }

export {
  _caf as caf,
  _raf as raf
}
