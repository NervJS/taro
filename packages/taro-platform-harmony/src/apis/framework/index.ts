import { temporarilyNotSupport } from '../utils'

export const ENV_TYPE = {
  WEAPP: 'WEAPP',
  SWAN: 'SWAN',
  ALIPAY: 'ALIPAY',
  TT: 'TT',
  QQ: 'QQ',
  JD: 'JD',
  WEB: 'WEB',
  RN: 'RN',
  HARMONY: 'HARMONY',
  QUICKAPP: 'QUICKAPP'
}

export function getEnv () {
  return ENV_TYPE.HARMONY
}

// TODO
export const getCurrentPages = () => []

export { Current, getCurrentInstance } from '@tarojs/runtime'

export const requirePlugin = temporarilyNotSupport('requirePlugin')

export { eventCenter, Events, History } from '@tarojs/runtime'
