let store = {}

export function getStore () {
  if (process.env.TARO_ENV === 'alipay') {
    return my.taroMobxStore || {}
  } else if (process.env.TARO_ENV === 'quickapp') {
    return global.__proto__.taroMobxStore || {}
  }
  return store
}

export function setStore (arg) {
  if (process.env.TARO_ENV === 'alipay') {
    my.taroMobxStore = arg
  } else if (process.env.TARO_ENV === 'quickapp') {
    global.__proto__.taroMobxStore = arg
  } else {
    store = arg
  }
}