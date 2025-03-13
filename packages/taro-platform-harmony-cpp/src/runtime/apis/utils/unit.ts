import { Current } from '@tarojs/runtime'
import { isFunction } from '@tarojs/shared'

import { getWindowInfo } from '../base/system'
import { FOLD_SPLIT_MAX_WIDTH } from './constant'

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

const display = get('NativePackageManager').loadLibrarySync('@ohos.display', [['getDefaultDisplaySync']])

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

interface ILayout {
  width: number
  height: number
}
interface IPXTransformParam {
  baseFontSize?: number
  deviceRatio?: Record<string | number, number>
  designWidth?: number | ((size?: string | number) => number)
  targetUnit?: string
  unitPrecision?: number
}
export function initStyleSheetConfig (layout: ILayout = { width: 0, height: 0 }, config: IPXTransformParam = {}, navHeight = 0) {
  const display = get('NativePackageManager').loadLibrarySync('@ohos.display', [['getDefaultDisplaySync']])
  const windowInfo = getWindowInfo()

  let logicWidth = layout.width ? layout.width * display.densityPixels : display.width
  logicWidth = logicWidth > FOLD_SPLIT_MAX_WIDTH ? logicWidth / 2 : logicWidth
  const designWidth: number = (typeof config.designWidth === 'function' ? config.designWidth(0) : config.designWidth) || 750
  return {
    // 设计稿比例基准
    designRatio: logicWidth / designWidth / display.densityPixels,
    // vp -> px比例，逻辑像素和物理像素的比值
    densityPixels: display.densityPixels,
    // 屏幕宽度:单位vp
    deviceWidth: display.width / display.densityPixels,
    // 屏幕高度:单位vp
    deviceHeight: display.height / display.densityPixels,
    // 窗口宽度:单位vp
    viewportWidth: layout.width || (display.width / display.densityPixels),
    // 窗口高度:单位vp
    viewportHeight: (layout.height || (display.height / display.densityPixels)) - navHeight,
    // 安全区域:单位vp
    safeArea: windowInfo.safeArea,
    // 显示设备的显示字体的缩放因子。该参数为浮点数，通常与densityPixels相同
    scaledDensity: display.scaledDensity,
    // 表示屏幕当前显示的方向
    orientation: display.orientation,
    // 显示设备屏幕的物理像素密度，表示每英寸上的像素点数。该参数为浮点数，单位为px，支持的范围为[80.0，640.0]。一般取值160.0、480.0等，实际能取到的值取决于不同设备设置里提供的可选值
    densityDPI: display.densityDPI
  }
}
