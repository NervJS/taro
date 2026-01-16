// 设备信息,从 API Version 6 开始支持
import _display from '@ohos.display'
import _window from '@ohos.window'

import { printInfo, runInDebug } from './utils'

let __windowWidth = 0
let __windowHeight = 0
let __safeArea: TaroGeneral.SafeAreaResult | null = null

export const WINDOW_STATE = 'taro-window-stage-yy-key'
export class TaroWindowUtil {
  static avoidAreaTopHeight = -1
  static resolve: (...args: any[]) => any = () => {}
  static reject: (...args: any[]) => any = () => {}
  static resolver = new Promise((resolve, reject) => {
    TaroWindowUtil.resolve = resolve
    TaroWindowUtil.reject = reject

    return resolve
  })

  static updateTopHeight = (t48) => {
    if (t48.type === _window.AvoidAreaType.TYPE_SYSTEM) {
      typeof TaroWindowUtil.resolve === 'function' && TaroWindowUtil.resolve()
      TaroWindowUtil.avoidAreaTopHeight = t48.area.topRect.height
    }
  }

  // 需要在 entryAbility 绑定 onWindowStageCreate 生命周期
  static setWindowStage(b49) {
    try {
      TaroWindowUtil.resolver = new Promise((resolve, reject) => {
        TaroWindowUtil.resolve = resolve
        TaroWindowUtil.reject = reject

        return resolve
      })
      AppStorage.setOrCreate(WINDOW_STATE, b49)
      const topHeight = b49.getMainWindowSync()?.getWindowAvoidArea(_window.AvoidAreaType.TYPE_SYSTEM)?.topRect?.height
      if (typeof topHeight !== 'undefined') {
        TaroWindowUtil.avoidAreaTopHeight = topHeight
        TaroWindowUtil.resolve()
      }
      b49?.getMainWindow().then((d49) => {
        d49?.on('avoidAreaChange', TaroWindowUtil.updateTopHeight)
      }).catch((error) => {
        console.error('Taro Failed to set window stage', error)
      })
      b49.getMainWindowSync().on('avoidAreaChange', (res) => {
        if (res.type !== _window.AvoidAreaType.TYPE_SYSTEM) return
        updateSystemInfo()
      })
    } catch (error) {
      console.error('Taro Failed to set window stage', error)
    }
  }

  static getNavigationBarHeight() {
    const a49 = AppStorage.get(WINDOW_STATE)?.getMainWindowSync()?.getWindowAvoidArea(_window.AvoidAreaType.TYPE_NAVIGATION_INDICATOR)
    return a49?.bottomRect?.height ?? 0
  }

  static getStatusBarHeight() {
    if (TaroWindowUtil.avoidAreaTopHeight === -1) {
      const z48 = AppStorage.get(WINDOW_STATE)?.getMainWindowSync()?.getWindowAvoidArea(_window.AvoidAreaType.TYPE_SYSTEM)
      return z48?.topRect?.height ?? 0
    } else {
      return TaroWindowUtil.avoidAreaTopHeight
    }
  }

  static setStatusBarColor(x48, y48) {
    AppStorage.get(WINDOW_STATE)?.getMainWindowSync()?.setWindowSystemBarProperties({
      statusBarColor: x48,
      statusBarContentColor: y48
    })
  }

  static onWindowEventListener(u48) {
    AppStorage.get(WINDOW_STATE)?.getMainWindowSync()?.on('windowEvent', (w48) => {
      if (w48 === _window.WindowEventType.WINDOW_SHOWN) {
        u48?.onBackToForeground()
      } else if (w48 === _window.WindowEventType.WINDOW_HIDDEN) {
        u48?.onForeToBackground()
      }
    })
  }

  static offWindowEventListener() {
    AppStorage.get(WINDOW_STATE)?.getMainWindowSync()?.off('windowEvent')
  }
}

_display.on('change', (status: number) => {
  runInDebug(() => {
    printInfo('foldStatusChange:', status)

    updateSystemInfo()
  })
})

export const systemContext: any = {
  resolve: null,
  reject: null,
  get windowHeight () {
    return __windowHeight
  },
  set windowHeight (value: number) {
    __windowHeight = value
  },
  get windowWidth () {
    return __windowWidth
  },
  set windowWidth (value: number) {
    __windowWidth = value
  },
  get safeArea (): TaroGeneral.SafeAreaResult | null {
    // left 和 right 通过监听 display 的变化获取，top 和 bottom 通过 TaroWindowUtil 来获取
    const left = __safeArea?.left || 0
    const right = __safeArea?.right || 0
    const top = px2vp(TaroWindowUtil.getStatusBarHeight())
    const bottom = __windowHeight - px2vp(TaroWindowUtil.getNavigationBarHeight())

    return {
      top,
      bottom,
      left,
      right,
      height: bottom - top,
      width: right - left,
    }
  },
  set safeArea ({ top, left, right, bottom }: TaroGeneral.SafeAreaResult) {
    __safeArea = {
      bottom: px2vp(bottom),
      top: px2vp(top),
      left: px2vp(left),
      right: px2vp(right),
      height: px2vp(bottom - top),
      width: px2vp(right - left),
    }
  },
  get statusBarHeight () {
    return px2vp(TaroWindowUtil.getStatusBarHeight())
  }
}

export const systemPromise = {
  resolver: new Promise((resolve, reject) => {
    systemContext.resolve = resolve
    systemContext.reject = reject

    return resolve
  }),
}

let lastUpdate = 0
async function updateSystemInfo () {
  if (Date.now() - lastUpdate < 1000) {
    // Note: 防抖, 切换折叠屏状态时 change 事件会多次触发
    return
  }
  lastUpdate = Date.now()

  try {
    const display = _display.getDefaultDisplaySync()

    // top 和 bottom 通过 TaroWindowUtil 来获取
    // Note: display.width 与 getWindowProperties().windowRect.width 一致，通过 getLastWindow 获取此时是上一个窗口的信息
    systemContext.safeArea ||= {
      top: 0,
      bottom: 0,
      left: 0,
      right: display.width,
    }

    // @ts-ignore
    display.getCutoutInfo((err, { waterfallDisplayAreaRects = {} }: _display.CutoutInfo = {}) => {
      if (err?.code) {
        console.error('Failed to get cutout info', JSON.stringify(err))
        systemContext.reject()
        return
      }
      // top 和 bottom 通过 TaroWindowUtil 来获取
      const top = 0
      const bottom = 0
      const left = waterfallDisplayAreaRects.left?.left + waterfallDisplayAreaRects.left?.width
      const right = display.width - waterfallDisplayAreaRects.right?.left

      systemContext.safeArea = {
        top,
        left,
        right,
        bottom
      }
    })
    systemContext.resolve()
  } catch (error) {
    systemContext.reject()
  }
}

try {
  const display = _display.getDefaultDisplaySync()
  systemContext.densityPixels ||= display.densityPixels
  systemContext.windowWidth ||= px2vp(display.width)
  systemContext.windowHeight ||= px2vp(display.height)
} catch (error) {
  console.error('Failed to get system info from window', error)
}

updateSystemInfo()
