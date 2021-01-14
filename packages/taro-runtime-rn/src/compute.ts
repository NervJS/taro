import { Dimensions } from 'react-native'
import { AppConfig } from './types/index'

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
  const { designWidth = defaultWidth, deviceRatio = defaultRadio } = config
  if (!(designWidth in deviceRatio)) {
    throw new Error(`deviceRatio 配置中不存在 ${designWidth} 的设置！`)
  }
  const formatSize = parseInt(size + '', 10)
  const rateSize = formatSize / (deviceRatio[designWidth] * 2)
  return rateSize * deviceWidthDp / uiWidthPx
}
