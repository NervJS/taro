let store = null
const appGlobal = global || {}
const globalRef = Object.getPrototypeOf(appGlobal) || appGlobal
export function getStore () {
  if (process.env.TARO_ENV === 'quickapp') {
    return globalRef.store || null
  }
  return store
}

export function setStore (arg) {
  if (process.env.TARO_ENV === 'quickapp') {
    globalRef.store = arg
  } else {
    store = arg
  }
}
