import Taro from '@tarojs/taro'

export function isPlainObject (value) {
  if (!value || typeof value !== 'object') {
    return false
  }
  const proto = Object.getPrototypeOf(value)
  return !proto || proto === Object.prototype
}

export function isMiniPlatform () {
  return !(/^WEB|RN$/i.test(Taro.getEnv()))
}
