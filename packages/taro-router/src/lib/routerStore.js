/**
 * Filename: /src/src/lib/routerStore.js
 * Created Date: 2018-05-27 00:21:59
 * Author: Littly
 * Copyright (c) 2018 JD.COM
 */
const STOREKEY = 'taroRouterStats'

const localStorage = window.localStorage
const defaultRouterStore = { current: 0 }
let routerStore

const initRouterStore = () => {
  routerStore = defaultRouterStore
  localStorage.setItem(STOREKEY, JSON.stringify(routerStore))
}

const restoreRouterStore = () => {
  try {
    const routerStoreStr = localStorage.getItem(STOREKEY)
    routerStore = JSON.parse(routerStoreStr)

    /* validate router status */
    if (routerStore && typeof routerStore.current === 'number') return
    initRouterStore()
  } catch (e) {
    initRouterStore()
  }
}

restoreRouterStore()

const set = (...args) => {
  try {
    if (args.length === 1) {
      const rs = args[0]
      localStorage.setItem(STOREKEY, JSON.stringify(Object.assign(routerStore, rs)))
    } else if (args.length === 2) {
      const [ key, value ] = args
      routerStore[key] = value
      localStorage.setItem(STOREKEY, JSON.stringify(routerStore))
    }
    return true
  } catch (e) {
    return false
  }
}

const get = (key = undefined) => {
  if (key === undefined) return routerStore
  return routerStore[key]
}

export {
  set,
  get,
  initRouterStore
}

export default {
  set,
  get,
  initRouterStore
}
