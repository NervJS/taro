import warning from 'warning';
import Taro from '@tarojs/taro-h5';
import assign from 'lodash/assign';

import { Action, History, HistoryState, Location, CustomRoutes } from '../utils/types';
import createTransitionManager from './createTransitionManager';
import { createLocation } from './LocationUtils';
import { addLeadingSlash, createPath, hasBasename, stripBasename, stripTrailingSlash } from './PathUtils';
import { tryToCall } from '../utils'

type Callback = (ok: boolean) => void
type CurrentRoute = Taro.Page | { beforeRouteLeave?: Function }

const PopStateEvent = 'popstate'
const defaultStoreKey = 'taroRouterStore'

const globalHistory = window.history

const getHashPath = (): string => {
  const href = window.location.href
  const hashIndex = href.indexOf('#')
  return hashIndex === -1 ? '' : href.substring(hashIndex + 1)
}

let stateKey = 0

/**
 * 获取state key
 */
const createKey = () => String(++stateKey)

const getHistoryState = () => {
  try {
    const state = globalHistory.state || {}
    if (typeof state.key !== 'string') {
      state.key = String(stateKey)
    } else {
      stateKey = state.key
    }
    return state
  } catch (e) {
    // IE 11 sometimes throws when accessing window.history.state
    // See https://github.com/ReactTraining/history/pull/289
    return {
      key: String(stateKey)
    }
  }
}

const tryToParseStore = (state: HistoryState) => {
  let store: HistoryState = { key: '0' }
  try {
    const storeObj = JSON.parse(localStorage.getItem(defaultStoreKey)!)
    if (typeof storeObj === 'object' && typeof storeObj.key === 'string') {
      store = storeObj
    }
  } catch (e) {}

  const isValid = store.key === state.key

  // warning(isValid, 'Invalid location store, it is rewrote')

  if (!isValid) {
    store.key = state.key!
  }

  return store
}

/**
 * 创建对象序列化的函数
 *
 * @param storeObj 需要序列化的对象引用
 */
const createHistorySerializer = (storeObj: HistoryState) => {
  let serialize = () => {
    try {
      localStorage.setItem(defaultStoreKey, JSON.stringify(storeObj))
    } catch (e) {}
  }
  serialize()
  return serialize
}

const createHistory = (props: { basename?: string, mode: "hash" | "browser" | "multi", firstPagePath: string, customRoutes: CustomRoutes }) => {
  const transitionManager = createTransitionManager()
  transitionManager.setPrompt('')
  const basename = props.basename ? stripTrailingSlash(addLeadingSlash(props.basename)) : ''
  const customRoutes = props.customRoutes || {}
  let listenerCount = 0
  let serialize

  props.mode = props.mode || "hash"
  const getDOMLocation = (historyState: HistoryState): Location => {
    const { key } = historyState
    const { pathname, search, hash } = window.location
    let path = props.mode === "hash"
      ? addLeadingSlash(getHashPath())
      : pathname + search + hash

    if (props.mode === 'browser') {
      warning(hasBasename(path, basename), 'You are attempting to use a basename on a page whose URL path does not begin ' + 'with the basename. Expected path "' + path + '" to begin with "' + basename + '".')
    }

    path = stripBasename(path, basename)

    if (path === '/') {
      path = props.firstPagePath + search + hash
    }

    return createLocation(path, key)
  }

  const initState = getHistoryState()

  const initialLocation = getDOMLocation(initState)
  let lastLocation = initialLocation
  Taro._$router = initialLocation

  let store = tryToParseStore(initState)

  serialize = createHistorySerializer(store)

  globalHistory.replaceState(initialLocation.state, '')

  const createHref = props.mode === "hash"
    ? location => '#' + addLeadingSlash(basename + createPath(location))
    : location => basename + createPath(location)

  const setState = (nextState: { action: 'POP' | 'PUSH' | 'REPLACE'; location: Location }): void => {
    assign(history, nextState)

    const fromLocation = {...lastLocation}

    // 记录最后一个location，浏览器前进后退按钮用
    lastLocation = {...nextState.location}

    stateKey = Number(nextState.location.state!.key)

    serialize()

    history.length = globalHistory.length
    const params = {
      fromLocation,
      toLocation: history.location,
      action: history.action
    }

    Taro._$router = history.location
    Taro.eventCenter.trigger('__taroRouterChange', {...params})
    transitionManager.notifyListeners({...params})
  }

  function getCurrentRoute(): CurrentRoute {
    if (Taro && typeof Taro.getCurrentPages === 'function') {
      const currentPageStack = Taro.getCurrentPages()
      const stackTop = currentPageStack.length - 1
      return currentPageStack[stackTop]
    }
    
    return {}
  }

  function getUserConfirmation(next: Callback, fromLocation: Location, toLocation: Location): void {
    const currentRoute = getCurrentRoute() || {}
    const leaveHook = currentRoute.beforeRouteLeave

    if (typeof leaveHook === 'function') {
      tryToCall(leaveHook, currentRoute, fromLocation, toLocation, next)
    } else {
      next(true)
    }
  }

  const push = (path: string) => {
    const action = 'PUSH'
    const key = createKey()
    const location = createLocation(path, key, history.location)
    const originalPath = location.path
    if (originalPath in customRoutes) {
      location.path = customRoutes[originalPath]
    }

    transitionManager.confirmTransitionTo(
      location,
      action,
      (result, callback) => {
        getUserConfirmation(callback, lastLocation, location)
      },
      ok => {
        if (!ok) {
          stateKey--
          return
        }

        const href = createHref(location)

        globalHistory.pushState({ key }, '', href)
    
        store.key = key!
    
        setState({ action, location })
      }
    )
  }

  const replace = (path: string) => {
    const action = 'REPLACE'
    const key = store.key
    const location = createLocation(path as string, key, history.location)
    const originalPath = location.path
    if (originalPath in customRoutes) {
      location.path = customRoutes[originalPath]
    }

    transitionManager.confirmTransitionTo(
      location,
      action,
      (result, callback) => {
        getUserConfirmation(callback, lastLocation, location)
      },
      ok => {
        if (!ok) return

        const href = createHref(location)

        globalHistory.replaceState({ key }, '', href)
    
        setState({ action, location })
      }
    )
  }

  const go = (num: number) => {
    globalHistory.go(num)
  }

  const goBack = () => go(-1)
  const goForward = () => go(1)

  const handlePopState: WindowEventHandlers['onpopstate'] = (e: { state: HistoryState }) => {
    // history.pushState和history.replaceState不会触发这个事件
    // 仅在浏览器前进后退操作、history.go/back/forward调用、hashchange的时候触发
    // 这里的window.location已经是新的了

    let state = e.state
    if (!state) {
      state = {
        key: createKey()
      }
      globalHistory.replaceState(state, '', '')
    }
    const currentKey = Number(lastLocation.state.key)
    const nextKey = Number(state.key)
    const nextLocation = getDOMLocation(state)
    let action: Action
    if (nextKey > currentKey) {
      action = 'PUSH'
    } else if (nextKey < currentKey) {
      action = 'POP'
    } else {
      action = 'REPLACE'
    }

    store.key = String(nextKey)

    transitionManager.confirmTransitionTo(
      nextLocation,
      action,
      (result, callback) => {
        getUserConfirmation(callback, lastLocation, nextLocation)
      },
      ok => {
        if (ok) {
          setState({
            action,
            location: nextLocation
          })
        } else {
          revertPop()
        }
      }
    )
  }

  const revertPop = (): void => {
    const toLocation = history.location

    const key = toLocation.state.key

    const href = createHref(toLocation)

    globalHistory.pushState({ key }, '', href)
  }

  const checkDOMListeners = delta => {
    listenerCount += delta

    if (listenerCount === 1) {
      const isSafari = /^((?!chrome).)*safari/i.test(navigator.userAgent)
      if (isSafari) {
        window.addEventListener('load', function() {
          setTimeout(function() {
            window.addEventListener(PopStateEvent, handlePopState)
          }, 0);
        });
      } else {
        window.addEventListener(PopStateEvent, handlePopState)
      }
    } else if (listenerCount === 0) {
      window.removeEventListener(PopStateEvent, handlePopState)
    }
  }

  const listen = listener => {
    const unlisten = transitionManager.appendListener(listener)
    checkDOMListeners(1)

    return () => {
      checkDOMListeners(-1)
      unlisten()
    }
  }

  let isBlocked = false

  const block = (prompt = false) => {
    const unblock = transitionManager.setPrompt(prompt)

    if (!isBlocked) {
      checkDOMListeners(1)
      isBlocked = true
    }

    return () => {
      if (isBlocked) {
        isBlocked = false
        checkDOMListeners(-1)
      }

      return unblock()
    }
  }

  const history: History = {
    action: 'POP',
    block,
    createHref,
    go,
    goBack,
    goForward,
    length: globalHistory.length,
    listen,
    location: initialLocation,
    push,
    replace
  }

  return history
}

export default createHistory
