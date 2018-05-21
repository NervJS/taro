import EventEmitter from './eventEmitter'
import resolvePathname from './resolvePathname'

function pushHashPath (path) {
  window.location.hash = path
}

function getHashPath (path) {
  const hashIndex = window.location.href.indexOf('#')
  return window.location.href.slice(0, hashIndex >= 0 ? hashIndex : 0) + '#' + path
}

function replaceHashPath (path) {
  const hashIndex = window.location.href.indexOf('#')
  window.location.replace(window.location.href.slice(0, hashIndex >= 0 ? hashIndex : 0) + '#' + path)
}

function getHash () {
  const href = window.location.href
  const hashIndex = href.indexOf('#')
  return hashIndex === -1 ? '' : href.substring(hashIndex + 1)
}

function encodePath (path) {
  path = path.replace(/\?$/, '')
  return path.charAt(0) === '/' ? path : `/${path}`
}

let counter = 0
function createLocation (path) {
  path = decodeURIComponent(path)
  const pathname = path.split('?')[0]

  const params = {}
  const searchIndex = path.indexOf('?')
  if (searchIndex !== -1) {
    const queryString = path.substring(searchIndex + 1)
    queryString.split('&').forEach(pair => {
      const temp = pair.split('=')
      params[temp[0]] = temp[1]
    })
  }
  return {
    pageId: counter++,
    path,
    pathname,
    params
  }
}

class History extends EventEmitter {
  stack = []
  ignorePath = null
  current = null

  constructor () {
    super()
    if (History.instance) return History.instance
    History.instance = this

    this.init()
  }

  init () {
    const path = encodePath(getHash())
    this.stack.push(createLocation(path))
    window.history.replaceState(0, null, null)
    this.current = 0

    window.addEventListener('hashchange', () => {
      window.history.replaceState(this.current, '', '')
    }, false)

    window.addEventListener('popstate', e => {
      const currentPath = encodePath(getHash())
      if (this.ignorePath === currentPath) {
        this.ignorePath = null
        return
      }
      if (typeof e.state !== 'number') return

      let navigateResult = false
      if (e.state <= this.current) {
        navigateResult = navigateBack({ delta: 1 })
      }

      if (!navigateResult) window.history.pushState(null, null, getHashPath(history.now().path))
    }, false)
  }

  // 获取stack的当前值
  now () {
    return this.stack[this.current]
  }

  // 获取stack的长度
  len () {
    return this.stack.length
  }

  listen = (fn) => {
    this.on('change', fn)
  }

  unlisten = (fn) => {
    this.off('change', fn)
  }

  push (opts) {
    const encodedPath = encodePath(opts.url)
    const currentPath = encodePath(getHash())

    if (encodedPath !== currentPath) {
      const location = createLocation(encodedPath)
      this.current++
      this.stack.splice(this.current, this.len(), location)
      this.emit('change', location, 'PUSH', opts)
      this.ignorePath = encodedPath
      pushHashPath(encodedPath)
    } else {
      console.warn('cannot PUSH the same path')
    }
  }

  replace (opts) {
    const encodedPath = encodePath(opts.url)
    const currentPath = encodePath(getHash())

    if (encodedPath !== currentPath) {
      const location = createLocation(encodedPath)
      const len = this.stack.length
      this.stack.splice(this.current, len, location)
      this.emit('change', location, 'REPLACE', opts)
      this.ignorePath = encodedPath
      replaceHashPath(encodedPath)
    } else {
      console.warn('cannot PUSH the same path')
    }
  }

  goBack (delta) {
    if (typeof delta !== 'number' || delta < 1) {
      console.warn('goBack arg error')
      return false
    }

    if (this.current < delta) return false
    this.current -= delta
    this.stack.splice(this.current + 2)

    const backPage = this.now()
    const encodedPath = backPage.path
    this.emit('change', backPage, 'BACK', { delta })
    this.ignorePath = encodedPath
    pushHashPath(encodedPath)
    return true
  }
}

const history = new History()

window.h = history

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

    const current = history.stack[history.stack.length - 1]
    const currentUrl = current.pathname
    history.push({
      url: resolvePathname(url, currentUrl),
      success,
      fail,
      complete
    })
  })
}

const navigateBack = function (opts) {
  return waitForlock(() => history.goBack(opts.delta))
}

const redirectTo = function (opts) {
  waitForlock(() => {
    const success = opts.success
    const fail = opts.fail
    const complete = opts.complete

    history.replace({
      url: opts.url,
      success,
      fail,
      complete
    })
  })
}

export default history

export {
  pushHashPath,
  replaceHashPath,
  getHash,
  encodePath,
  createLocation,

  navigateBack,
  navigateTo,
  redirectTo
}
