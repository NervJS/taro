import {
  pushHash,
  replaceHash,
  getCurrentHash,
  normalizeUrl,
  createLocation
} from './utils'
import { navigateTo, NavigateOpts } from './apis'
import createTransitionManager from './transitionManager'

const history = window.history
const transitionManager = createTransitionManager()

let historyState = parseInt(history.state, 10) || 0
const initUrl = normalizeUrl(getCurrentHash())
const initLocation = createLocation(initUrl, historyState)
let ignoredUrl = null

const HISTORYKEY = 'taroRouterHistory'

const generateSerializer = (obj) => {
  return () => {
    localStorage.setItem(HISTORYKEY, JSON.stringify(obj))
  }
}

interface HistoryStack {
  url: string;
  state: number;
}

class History {
  locationStack: HistoryStack[];
  serializeStack: Function;
  unlisten: Function;

  constructor () {
    history.replaceState(historyState, '', null)

    window.addEventListener('hashchange', this.onHashchange)
    window.addEventListener('popstate', this.onPopstate)

    const stack = this.deserialize()
    if (this.validateStack(stack)) {
      this.locationStack = stack
      this.serializeStack = generateSerializer(this.locationStack)
    } else {
      console.warn('Stack in storage invalid')
      this.locationStack = [ initLocation ]
      this.serializeStack = generateSerializer(this.locationStack)
      this.serializeStack()
    }
  }

  validateStack (stack) {
    if (stack.length === 0) return false

    const historyMap = {}
    const hasDuplicateState = stack.some(v => {
      const state = v.state
      if (historyMap[state]) return true
      historyMap[state] = true
    })
    if (hasDuplicateState) return false

    const stackCurrent = stack[stack.length - 1]
    const isThisone = stackCurrent.state === initLocation.state &&
      stackCurrent.fullUrl === initLocation.fullUrl
    if (isThisone) return true
    else return false
  }

  deserialize () {
    try {
      const stackStr = localStorage.getItem(HISTORYKEY) || '[]'
      const stack = JSON.parse(stackStr)
      if (!Array.isArray(stack)) return []
      return stack
    } catch (e) {
      return []
    }
  }

  onHashchange = (e) => {
    history.replaceState(historyState, '', '')
  }

  onPopstate = (e) => {
    const nextUrl = normalizeUrl(getCurrentHash())
    if (typeof e.state !== 'number') {
      if (nextUrl === ignoredUrl) return
      ignoredUrl = null
      navigateTo({
        url: nextUrl
      })
      return
    }
    const isBackPage = e.state < historyState
    if (isBackPage) {
      this.goBack({
        url: nextUrl,
        state: e.state
      })
    } else {
      navigateTo({
        url: nextUrl,
        state: e.state,
        isForward: true
      })
    }
  }

  listen = (fn) => {
    this.unlisten = transitionManager.appendListener(fn)
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
  push = ({ url, isForward = false, state }: NavigateOpts) => {
    const nextUrl = normalizeUrl(url)
    const currentUrl = this.now().url

    if (!isForward && (nextUrl === currentUrl)) return

    /**
     * 带state 是forward 否则是navigate
     */
    if (state) {
      historyState = state
    } else {
      historyState += 1
    }
    const location = createLocation(nextUrl, historyState)

    this.locationStack.push(location)
    this.serializeStack()
    transitionManager.notifyListeners(location, 'PUSH', {})
    ignoredUrl = nextUrl
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

    const location = createLocation(nextUrl, historyState)
    this.locationStack.pop()
    this.locationStack.push(location)
    this.serializeStack()
    transitionManager.notifyListeners(location, 'REPLACE', {})
    ignoredUrl = nextUrl
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
  goBack = ({ url, state }) => {
    const len = this.len()
    const foundStateIdx = this.locationStack.findIndex(v => {
      return v.state === state
    })
    const delta = foundStateIdx > -1
      ? this.locationStack.length - foundStateIdx - 1
      : 1

    if (len > delta) {
      this.locationStack.splice(-delta)
      this.serializeStack()
      const location = this.now()
      historyState = location.state
      transitionManager.notifyListeners(location, 'BACK', { delta })
    } else if (delta <= 1 && url) {
      const location = createLocation(normalizeUrl(url), state)
      historyState = state
      this.locationStack.length = 1
      this.locationStack[0] = location
      this.serializeStack()
      transitionManager.notifyListeners(location, 'BACK', { delta })
    } else {
      return console.warn('goBack delta out of range')
    }
  }
}

export default new History()
