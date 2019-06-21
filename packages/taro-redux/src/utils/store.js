let store = null
const appGlobal = global || {}
const globalRef = Object.getPrototypeOf(appGlobal) || appGlobal
export function getStore () {
  if (process.env.TARO_ENV === 'quickapp') {
    return globalRef.store || null
  } else if (process.env.TARO_ENV === 'alipay') {
    return my.taroReduxStore || null
  }
  return store
}

export function setStore (arg) {
  if (process.env.TARO_ENV === 'quickapp') {
    globalRef.store = arg
  } else if (process.env.TARO_ENV === 'alipay') {
    my.taroReduxStore = arg
  } else {
    store = arg
  }
}
