let store = {}
const appGlobal = global || {}
const globalRef = Object.getPrototypeOf(appGlobal) || appGlobal

export function getStore () {
  if (process.env.TARO_ENV === 'alipay') {
    return my.taroMobxStore || {}
  } else if (process.env.TARO_ENV === 'quickapp') {
    return globalRef.taroMobxStore || {}
  }
  return store
}

export function setStore (arg) {
  if (process.env.TARO_ENV === 'alipay') {
    my.taroMobxStore = arg
  } else if (process.env.TARO_ENV === 'quickapp') {
    globalRef.taroMobxStore = arg
  } else {
    store = arg
  }
}