import resolvePathname from './resolvePathname'
import EventEmitter from './eventEmitter'
import {
  pushHash,
  replaceHash,
  getCurrentHash,
  normalizeUrl,
  createLocation
} from './utils'

const history = window.history
const eventEmitter = new EventEmitter()

let historyState = parseInt(history.state, 10) || 0
const initUrl = normalizeUrl(getCurrentHash())
const initLocation = createLocation(initUrl, historyState)

const HISTORYKEY = 'taroRouterHistory'

const generateSerializer = (obj) => {
  return () => {
    localStorage.setItem(HISTORYKEY, JSON.stringify(obj))
  }
}

class History {
  constructor () {
    history.replaceState(historyState, '', null)

    window.addEventListener('hashchange', this.onHashchange)
    window.addEventListener('popstate', this.onPopstate)

    const stack = this.deserialize()
    if (stack && stack[stack.length - 1].url === initLocation.url) {
      this.locationStack = stack
      this.serializeStack = generateSerializer(this.locationStack)
    } else {
      this.locationStack = [ initLocation ]
      this.serializeStack = generateSerializer(this.locationStack)
      this.serializeStack()
    }
  }

  deserialize () {
    try {
      const stackStr = localStorage.getItem(HISTORYKEY)
      const stack = JSON.parse(stackStr)
      return Array.isArray(stack) && stack.length > 0 ? stack : false
    } catch (e) {
      return false
    }
  }

  onHashchange = (e) => {
    history.replaceState(historyState, '', '')
  }

  onPopstate = (e) => {
    const nextUrl = normalizeUrl(getCurrentHash())
    const isBackPage = e.state < this.now().state
    if (isBackPage) {
      navigateBack({
        delta: 1,
        state: e.state,
        url: nextUrl
      })
    } else {
      navigateTo({
        url: nextUrl,
        isForward: true,
        state: e.state
      })
    }
  }

  listen = (fn) => {
    eventEmitter.on('change', fn)
  }
  unlisten = (fn) => {
    eventEmitter.off('change', fn)
  }
  emit = (location, type, opts) => {
    eventEmitter.emit('change', location, type, opts)
  }

  /**
   * 返回当前的location
   *
   * @returns {location} location对象
   */
  now () {
    const current = this.locationStack.length - 1
    return this.locationStack[current]
  }

  /**
   * 返回当前的history栈长度
   *
   * @returns {number} history.stack的长度
   */
  len () {
    return this.locationStack.length
  }

  /**
   * 在history.stack中push新的location
   *
   * @param {object} param0 push的对象
   */
  push = ({ url, isForward, state }) => {
    const nextUrl = normalizeUrl(url)
    const currentUrl = this.now().url

    if (nextUrl === currentUrl) return

    if (!state) {
      historyState += 1
    } else {
      historyState = state
    }
    const location = createLocation(nextUrl, historyState)

    this.locationStack.push(location)
    this.serializeStack()
    this.emit(location, 'PUSH')
    // ignoredUrl = nextUrl
    if (!isForward) {
      pushHash(nextUrl)
    }
  }

  /**
   * 在history.stack中replace新的location
   *
   * @param {object} param0 replace的对象
   */
  replace = ({ url }) => {
    const nextUrl = normalizeUrl(url)
    const currentUrl = this.now().url
    if (nextUrl === currentUrl) return

    const location = createLocation(nextUrl, ++historyState)
    this.locationStack.pop()
    this.locationStack.push(location)
    this.serializeStack()
    this.emit(location, 'REPLACE')
    // ignoredUrl = nextUrl
    replaceHash({
      url: nextUrl,
      state: historyState
    })
    history.replaceState
  }

  /**
   * 从history.stack中回退
   *
   * @param {object} param0 回退的配置项
   */
  goBack = ({ delta, url, state }) => {
    if (typeof delta !== 'number' || delta < 1) return console.warn('goBack delta out of range')

    const len = this.len()
    if (len > delta) {
      const location = this.now()
      this.locationStack.splice(-delta)
      this.serializeStack()

      historyState = this.now().state
      this.emit(location, 'BACK', { delta })
      // replaceHash({
      //   url: location.fullUrl,
      //   state: historyState
      // })
    } else if (delta <= 1 && url) {
      const location = createLocation(normalizeUrl(url), state)
      historyState = state
      this.locationStack.length = 1
      this.locationStack[0] = location
      this.serializeStack()

      this.emit(location, 'BACK', { delta })
      // replaceHash(location.fullUrl)
      // replaceHash({
      //   url: location.fullUrl,
      //   state: historyState
      // })
    } else {
      return console.warn('goBack delta out of range')
    }
  }
}

const h = new History()

let navigateLock = false
const waitForlock = (fn) => {
  if (navigateLock) return false
  navigateLock = true
  setTimeout(() => {
    navigateLock = false
  }, 0)
  return fn()
}

const navigateTo = function (opts) {
  waitForlock(() => {
    const current = h.now()
    const currentUrl = current.url
    opts.url = resolvePathname(opts.url, currentUrl)
    h.push(opts)
  })
}

const navigateBack = function (opts = { delta: 1 }) {
  return waitForlock(() => {
    h.goBack(opts)
  })
}

const redirectTo = function (opts) {
  waitForlock(() => {
    const success = opts.success
    const fail = opts.fail
    const complete = opts.complete

    h.replace({
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

export default h
