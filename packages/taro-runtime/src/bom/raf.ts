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
const _raf = process.env.TARO_PLATFORM === 'web' ? requestAnimationFrame : function (callback) {
  const _now = now()
  const nextTime = Math.max(lastTime + 16, _now) // First time will execute it immediately but barely noticeable and performance is gained.
  return setTimeout(function () { callback(lastTime = nextTime) }, nextTime - _now)
}

const _caf = process.env.TARO_PLATFORM === 'web'
  ? cancelAnimationFrame
  : function (seed) {
    // fix https://github.com/NervJS/taro/issues/7749
    clearTimeout(seed)
  }

export {
  _caf as caf,
  _raf as raf
}
