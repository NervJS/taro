import { Current } from '@tarojs/runtime'

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

export { Current }

// TODO
export const getCurrentPages = () => []

export const getCurrentInstance = () => Current

export const requirePlugin = temporarilyNotSupport('requirePlugin')

export { eventCenter, Events, History } from '@tarojs/runtime/dist/runtime.esm'
