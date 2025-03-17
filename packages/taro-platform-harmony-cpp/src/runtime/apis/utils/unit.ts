import _display from '@ohos.display'
import { Current } from '@tarojs/runtime'
import { isFunction } from '@tarojs/shared'

const defaultDesignWidth = 750
const defaultDesignRatio: Record<string | number, number> = {
  640: 2.34 / 2,
  750: 1,
  828: 1.81 / 2
}
const defaultBaseFontSize = 20
const defaultUnitPrecision = 5
const defaultTargetUnit = 'vp'

export function initPxTransform ({
  designWidth = defaultDesignWidth,
  deviceRatio = defaultDesignRatio,
  baseFontSize = defaultBaseFontSize,
  unitPrecision = defaultUnitPrecision,
  targetUnit = defaultTargetUnit
}) {
  const taro = Current.taro

  if (taro) {
    taro.config ||= {}
    const config = taro.config
    config.designWidth = designWidth
    config.deviceRatio = deviceRatio
    config.baseFontSize = baseFontSize
    config.targetUnit = targetUnit
    config.unitPrecision = unitPrecision
  }
}

const display = _display.getDefaultDisplaySync()

let displayWidth = display.width
let ratioCache: number | false = false
let designWidthFunc: (input: number) => number
let designWidth = defaultDesignWidth
function getRatio (value: number, customDesignWidth?: number) {
  // Note: 提前调用 display 可能无法获取正确值
  if (ratioCache === false || displayWidth !== display.width || typeof customDesignWidth !== 'undefined') {
    const config = Current.taro?.config || {}
    if (!isFunction(designWidthFunc)) {
      designWidthFunc = isFunction(config.designWidth)
        ? config.designWidth
        : () => config.designWidth
      designWidth = designWidthFunc(value) || defaultDesignWidth
    }
    displayWidth = display.width
    // 如果大于1500，视为折叠屏，取一半作为基准值
    displayWidth = displayWidth > 1500 ? displayWidth / 2 : displayWidth
    ratioCache = displayWidth / (customDesignWidth || designWidth)
  }

  return ratioCache
}

// Note: 设置为 style 单位时会自动完成设计稿转换，设计开发者调用 API 时也许抹平差异，例如 pageScrollTo[option.offsetTop]
export function pxTransformHelper (size: number, unit?: string, isNumber = false): number | string {
  const config = Current.taro?.config || {}
  const targetUnit = unit || config.targetUnit || defaultTargetUnit

  if (targetUnit === 'PX') {
    return px2vp(size * display.scaledDensity) + 'vp'
  }
  const ratio = getRatio(size)
  let val = size * ratio

  switch (targetUnit) {
    case 'vp':
      // Note: 在应用创建前调用无效
      val = px2vp(val)
      break
    default:
  }
  return isNumber ? val : val + targetUnit
}

export function pxTransform (size: number, designWidth?: number): number | string {
  const config = Current.taro?.config || {}
  const targetUnit = config.targetUnit || defaultTargetUnit

  if (typeof designWidth !== 'undefined') {
    // 允许动态改变
    const ratio = getRatio(size, designWidth)
    let val = size * ratio
    val = px2vp(val)
    return val
  }

  const val = size
  switch (targetUnit) {
    case 'vp':
      return pxTransformHelper(size, 'vp')
    default:
      // NOTE: 鸿蒙环境下 style 会自动完成设计稿转换，无需在方法内二次调整
  }
  return val + targetUnit
}
