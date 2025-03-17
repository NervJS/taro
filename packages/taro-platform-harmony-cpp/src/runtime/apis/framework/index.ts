import { Current, getCurrentInstance } from '@tarojs/runtime'

import { temporarilyNotSupport } from '../utils'

import type { TaroAny } from '@tarojs/runtime'

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

export { Current, getCurrentInstance }

export const requirePlugin = temporarilyNotSupport('requirePlugin')

/** 鸿蒙专属 */
export function updatePageSync () {
  const node = (getCurrentInstance()?.page as TaroAny)?.node

  if (!node) return

  Current.nativeModule.updatePageSync(node)
}

export function unstable_SetPageIsTextNeedLayout(isNeed: boolean) {
  const node = (getCurrentInstance()?.page as TaroAny)?.node

  if (!node) return

  Current.nativeModule.unstable_SetPageIsTextNeedLayout(node, isNeed)
}

export { eventCenter, Events, History } from '@tarojs/runtime'
