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
// Same Node config-load hazard as env.ts: these identifiers throw when absent.
// Keep the platform check inline (like env.ts) so webpack can statically prune the
// `web` branch in mini builds. If the branch survives, ProvidePlugin rewrites the bare
// `requestAnimationFrame` identifier to an import of `@tarojs/runtime`, whose entry
// re-exports `raf` from this module — a self-referential cycle that hits TDZ
// ("Cannot access 'c' before initialization") when the runtime boots.
const _fallbackRaf = function (callback) {
  const _now = now()
  const nextTime = Math.max(lastTime + 16, _now) // First time will execute it immediately but barely noticeable and performance is gained.
  return setTimeout(function () { callback(lastTime = nextTime) }, nextTime - _now)
}

const _fallbackCaf = function (seed) {
  // fix https://github.com/NervJS/taro/issues/7749
  clearTimeout(seed)
}

// NOTE: keep `process.env.TARO_PLATFORM === 'web'` as the outermost, statically
// evaluable condition (same shape as env.ts). In mini builds webpack prunes the
// whole `web` branch, so the bare `requestAnimationFrame` / `cancelAnimationFrame`
// identifiers — including inside the typeof checks below — are never walked by
// ProvidePlugin. If they are, ProvidePlugin rewrites them to imports of
// `@tarojs/runtime`, whose entry re-exports `raf` from this very module — a
// self-referential cycle that triggers TDZ ("Cannot access 'c' before initialization").
// Both-exist semantics: use native raf/caf only when the pair is available,
// otherwise fall back to timers so caf(raf(cb)) stays consistent.
const _raf = process.env.TARO_PLATFORM === 'web'
  ? (
    typeof requestAnimationFrame !== 'undefined' &&
      typeof cancelAnimationFrame !== 'undefined'
      ? requestAnimationFrame
      : _fallbackRaf
  )
  : _fallbackRaf

const _caf = process.env.TARO_PLATFORM === 'web'
  ? (
    typeof requestAnimationFrame !== 'undefined' &&
      typeof cancelAnimationFrame !== 'undefined'
      ? cancelAnimationFrame
      : _fallbackCaf
  )
  : _fallbackCaf

export {
  _caf as caf,
  _raf as raf
}
