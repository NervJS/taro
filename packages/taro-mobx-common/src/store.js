let store = {}

export function getStore () {
  if (process.env.TARO_ENV === 'alipay') {
    return my.taroMobxStore || {}
  }
  return store
}

export function setStore (arg) {
  if (process.env.TARO_ENV === 'alipay') {
    my.taroMobxStore = arg
  } else {
    store = arg
  }
}
