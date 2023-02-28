import { Dimensions } from 'react-native'

import { isFunction } from './utils'

import type { AppConfig } from './types/index'

const globalAny: any = global
const defaultWidth = 750
const defaultRadio = {
  640: 2.34 / 2,
  750: 1,
  828: 1.81 / 2
}

export function pxTransform (size: number): number {
  const deviceWidthDp = Dimensions.get('window').width
  const uiWidthPx = 375
  const config: AppConfig = globalAny.__taroAppConfig?.appConfig || {}
  const deviceRatio = config.deviceRatio || defaultRadio
  const designWidth = (((input = 0) => isFunction(config.designWidth)
    ? config.designWidth(input)
    : config.designWidth || defaultWidth))(size)
  if (!(designWidth in deviceRatio)) {
    throw new Error(`deviceRatio 配置中不存在 ${designWidth} 的设置！`)
  }
  const formatSize = ~~size
  const rateSize = formatSize * deviceRatio[designWidth]
  return rateSize * deviceWidthDp / (uiWidthPx * 2)
}
