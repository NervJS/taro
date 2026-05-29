/* eslint-disable simple-import-sort/exports */
import _display from '@ohos.display'

import { FOLD_SPLIT_MAX_WIDTH } from './constant'
import { Current } from './current'
import { systemContext, systemPromise, TaroWindowUtil } from './system'

export function initStyleSheetConfig (layout: { width: number, height: number} = { width: 0, height: 0 }, navHeight = 0) {
  const display = _display.getDefaultDisplaySync()

  let logicWidth = layout.width ? layout.width : display.width / display.densityPixels
  const logicHeight = layout.height ? layout.height : display.height / display.densityPixels
  // 断点区间
  if (logicWidth >= FOLD_SPLIT_MAX_WIDTH && logicHeight <= (FOLD_SPLIT_MAX_WIDTH * 10.8)) {
    logicWidth = logicWidth / 2
  }
  const designWidth = typeof Current.taro.config.designWidth === 'function' ? Current.taro.config.designWidth(0) : Current.taro.config.designWidth
  const deviceRatio = Current.taro.config.deviceRatio ? Current.taro.config.deviceRatio[designWidth] || 1 : 1

  return {
    // 设计稿比例基准
    designRatio: logicWidth / (designWidth * deviceRatio),
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
    safeArea: systemContext.safeArea,
    // 显示设备的显示字体的缩放因子。该参数为浮点数，通常与densityPixels相同
    scaledDensity: display.scaledDensity,
    // 表示屏幕当前显示的方向
    orientation: display.orientation,
    // 显示设备屏幕的物理像素密度，表示每英寸上的像素点数。该参数为浮点数，单位为px，支持的范围为[80.0，640.0]。一般取值160.0、480.0等，实际能取到的值取决于不同设备设置里提供的可选值
    densityDPI: display.densityDPI
  }
}

export { systemContext, systemPromise, TaroWindowUtil }

// Current必须放在前面初始化
export * from './current'
export { hooks } from '@tarojs/shared'
// bom
export * from './bom/document'
export * from './bom/history'
export * from './bom/location'
export * from './bom/navigator'
export * from './bom/raf'
export * from './bom/URL'
export * from './bom/window'
// dom
export * from './dom/element'
export * from './dom/event'
export * from './dom/event-source'
export * from './dom/node'
export * from './dom/stylesheet'
// others
export * from './env'
export * from './constant'
export * from './emitter/emitter'
export { nextTick } from './next-tick'
export * from './utils'
export * from './utils/page'
export * from './harmony-library'
export * from './system'
// typings
export * from './interface'
export {
  Instance, PageProps,
  ReactPageComponent, ReactPageInstance, ReactAppInstance,
  PageLifeCycle, PageInstance,
  AppInstance,
} from '@tarojs/runtime/dist/runtime.esm'
