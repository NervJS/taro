import routerStore from './routerStore'
import resolvePathname from './resolvePathname'
import EventEmitter from './eventEmitter'
import {
  pushHash,
  replaceHash,
  getCurrentHash,
  normalizeUrl,
  createLocation
} from './utils'

let ignoredUrl = null
const stack = []
let currentStackIdx = null
const history = window.history
const eventEmitter = new EventEmitter()

const listen = (fn) => {
  eventEmitter.on('change', fn)
}
const unlisten = (fn) => {
  eventEmitter.off('change', fn)
}
const emit = (location, type, opts) => {
  eventEmitter.emit('change', location, type, opts)
}

/**
 * 返回currentStackIdx对应的location对象
 *
 * @returns {location} location对象
 */
const now = () => {
  return stack[currentStackIdx]
}
const nowIdx = () => {
  return currentStackIdx
}

/**
 * 返回当前的history栈长度
 *
 * @returns {number} history.stack的长度
 */
const len = () => {
  return stack.length
}

/**
 * 在history.stack中push新的location
 *
 * @param {object} param0 push的对象
 */
const push = ({ url }) => {
  const nextUrl = normalizeUrl(url)
  const currentUrl = normalizeUrl(getCurrentHash())
  let currentRouterIdx = routerStore.get('current')

  if (nextUrl === currentUrl) return
  currentRouterIdx += 1
  const location = createLocation(nextUrl, currentRouterIdx)

  routerStore.set({ current: currentRouterIdx })
  stack.splice(++currentStackIdx, 1000, location)
  emit(location, 'PUSH', { url })
  ignoredUrl = nextUrl
  pushHash(nextUrl)
}

/**
 * 在history.stack中replace新的location
 *
 * @param {object} param0 replace的对象
 */
const replace = ({ url }) => {
  const nextUrl = normalizeUrl(url)
  const currentUrl = normalizeUrl(getCurrentHash())
  let currentRouterIdx = routerStore.get('current')

  if (nextUrl === currentUrl) {
    const location = createLocation(nextUrl, currentRouterIdx)

    stack.splice(currentStackIdx, 0, location)
    emit(location, 'REPLACE', { url })
    ignoredUrl = nextUrl
    replaceHash(nextUrl)
  }
}

/**
 * 从history.stack中回退
 *
 * @param {object} param0 回退的配置项
 */
const goBack = ({ delta = 1, url, routerIdx }) => {
  if (typeof delta !== 'number' || delta < 1) return console.warn('goBack delta out of range')

  if (currentStackIdx >= delta) {
    currentStackIdx -= delta
    const location = now()
    const url = location.url
    routerStore.set({ current: location.routerIdx })

    emit(location, 'BACK', { delta })
    replaceHash(location.fullUrl)
    ignoredUrl = normalizeUrl(url)
  } else if (url && typeof routerIdx === 'number') {
    const location = createLocation(normalizeUrl(url), routerIdx)
    const paddingArr = new Array(Math.max(delta - currentStackIdx - 1, 0))
    Array.prototype.splice.apply(stack, [0, 10000, location, ...paddingArr])
    currentStackIdx = 0
    emit(location, 'BACK', { delta, url, routerIdx })
    replaceHash(location.fullUrl)
  } else {
    return console.warn('goBack delta out of range')
  }
}

/**
 * 从history.stack中前进
 *
 * @param {object} param0 回退的配置项
 */
const goForward = ({ delta, url, routerIdx }) => {
  if (typeof delta !== 'number' || delta < 1) return console.warn('goForward delta out of range')
  const stackLen = len()

  if (stackLen > currentStackIdx + delta) {
    currentStackIdx += delta
    const location = now()
    const url = location.url
    routerStore.set({ current: location.routerIdx })

    emit(location, 'FORWARD', { delta })
    replaceHash(location.fullUrl)
    ignoredUrl = normalizeUrl(url)
  } else if (url && typeof routerIdx === 'number') {
    const location = createLocation(normalizeUrl(url), routerIdx)
    const paddingArr = new Array(Math.max(currentStackIdx + delta - stackLen, 0))
    Array.prototype.splice.apply(stack, [currentStackIdx + 1, 10000, ...paddingArr, location])
    currentStackIdx = len() - 1
    emit(location, 'FORWARD', { delta, url, routerIdx })
    replaceHash(location.fullUrl)
  } else {
    return console.warn('goForward delta out of range')
  }
}

const onHashchange = (e) => {
  const currentRouterIdx = routerStore.get('current')
  history.replaceState(currentRouterIdx, null, '')
}

const onPopstate = (e) => {
  const nextUrl = normalizeUrl(getCurrentHash())
  const currentRouterIdx = routerStore.get('current')

  if (nextUrl === ignoredUrl) return
  if (!e || typeof e.state !== 'number') return

  if (ignoredUrl === nextUrl) {
    ignoredUrl = null
    return
  }
  if (typeof e.state !== 'number') return

  if (e.state <= currentRouterIdx) {
    navigateBack({
      url: nextUrl,
      routerIdx: e.state,
      delta: 1
    })
  } else {
    navigateForward({
      url: nextUrl,
      routerIdx: e.state,
      delta: 1
    })
  }
}

(() => {
  const url = normalizeUrl(getCurrentHash())
  const currentRouterIdx = routerStore.get('current')
  stack.push(createLocation(url, currentRouterIdx))
  history.replaceState(currentRouterIdx, null, null)
  currentStackIdx = 0

  window.addEventListener('hashchange', onHashchange)
  window.addEventListener('popstate', onPopstate)
})()

let navigateLock = false
const waitForlock = (fn) => {
  if (navigateLock) return false
  navigateLock = true
  setTimeout(() => {
    navigateLock = false
  }, 300)
  return fn()
}

const navigateTo = function (opts) {
  waitForlock(() => {
    const url = opts.url
    const success = opts.success
    const fail = opts.fail
    const complete = opts.complete

    const current = now()
    const currentUrl = current.url
    push({
      url: resolvePathname(url, currentUrl),
      success,
      fail,
      complete
    })
  })
}

const navigateBack = function (opts) {
  return waitForlock(() => {
    goBack(opts)
  })
}

const navigateForward = function (opts) {
  return waitForlock(() => {
    goForward(opts)
  })
}

const redirectTo = function (opts) {
  waitForlock(() => {
    const success = opts.success
    const fail = opts.fail
    const complete = opts.complete

    replace({
      url: opts.url,
      success,
      fail,
      complete
    })
  })
}

export {
  navigateTo,
  navigateBack,
  redirectTo
}

export default {
  now,
  nowIdx,
  len,

  push,
  replace,
  goBack,

  listen,
  unlisten
}
