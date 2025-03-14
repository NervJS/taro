import _display from '@ohos.display'

import { TaroNativeModule } from './harmony-library'

import type { TaroAny } from '@tarojs/runtime'

export function getWindowInfo (): TaroAny {
  // Note: 获取实时信息，systemContext 值获取更新可能会被业务逻辑卡住
  const display = _display.getDefaultDisplaySync()

  const info: TaroAny = {
    /** 设备像素比 */
    pixelRatio: 1, // FIXME 设备像素比,number
    screenWidth: px2vp(display?.width), // 屏幕宽度，单位vp
    screenHeight: px2vp(display?.height), // 屏幕高度，单位vp
    windowWidth: px2vp(display?.width), // FIXME 可使用窗口高度，单位px
    windowHeight: px2vp(display?.height), // FIXME 可使用窗口宽度，单位px
    statusBarHeight: 0, // FIXME 状态栏的高度，单位vp
    safeArea: null, // FIXME 在竖屏正方向下的安全区域 General.SafeAreaResult 单位为vp
  }
  // Note: Harmony 端特定属性
  info.foldDisplayMode = canIUse('SystemCapability.Window.SessionManager') ? _display.getFoldDisplayMode() : 0 // 折叠屏显示模式
  info.isFoldable = _display.isFoldable()

  return info
}

export function navigateBack (): void {
  // TODO
}

export interface IPXTransformParam {
  baseFontSize?: number
  deviceRatio?: Record<string | number, number>
  designWidth?: number | ((size?: string | number) => number)
  targetUnit?: string
  unitPrecision?: number
}
export function initPxTransform (_opt: IPXTransformParam): TaroAny {
  // FIXME 页面使用，暂不移除
}

export function injectGlobalVariable(windowWidth: number, windowHeight: number, instanceId?: number) {
  const display = _display.getDefaultDisplaySync()
  TaroNativeModule.updateGlobalVariable("screen", {
    availWidth: px2vp( display.width ),
    availHeight: px2vp( display.height ),
    width: px2vp( display.width ),
    height: px2vp( display.height ),
    statusBarHeight: 0, // FIXME
    foldDisplayMode: canIUse('SystemCapability.Window.SessionManager') ? _display.getFoldDisplayMode() : 0, // 折叠屏显示模式
    isFoldable: _display.isFoldable(),
    theme: AppStorage.get('__TARO_APP_CONFIG') == ColorMode.LIGHT ? 'light' : 'dark',
    heightBreakpoint: AppStorage.get('heightBreakpoint') || 0,
    widthBreakpoint: AppStorage.get('widthBreakpoint') || 0
  }, instanceId)
  TaroNativeModule.updateGlobalVariable("devicePixelRatio", display.densityPixels, instanceId)
  TaroNativeModule.updateGlobalVariable("innerWidth", windowWidth, instanceId)
  TaroNativeModule.updateGlobalVariable("innerHeight", windowHeight, instanceId)
  return new Promise<void>(resolve => {
    display.getCutoutInfo((err, cutoutInfo: Partial<_display.CutoutInfo> = {}) => {
      const waterfallDisplayAreaRects: Partial<_display.WaterfallDisplayAreaRects> = cutoutInfo.waterfallDisplayAreaRects || {}
      if (err?.code) { return }

      const top = 0 // FIXME
      const bottom = windowHeight - 0 // FIXME
      const left = px2vp((waterfallDisplayAreaRects.left?.left || 0) + (waterfallDisplayAreaRects.left?.width || 0))
      const right = px2vp(display.width - (waterfallDisplayAreaRects.right?.left || 0))

      TaroNativeModule.updateGlobalVariable("safeArea", {
        top: top,
        left: left,
        right: right,
        bottom: bottom,
        height: bottom - top,
        width: right - left
      }, instanceId)
      TaroNativeModule.runNextTickTask(() => {
        // displayContext.resolve() FIXME
      })
      resolve()
    })
  })
}
