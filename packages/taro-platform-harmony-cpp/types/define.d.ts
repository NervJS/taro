/// <reference types="@tarojs/plugin-platform-harmony-ets/types" />
/// <reference path="./harmony.d.ts" />
/// <reference path="./components.d.ts" />

import '@tarojs/taro'

declare module '@tarojs/taro' {
  interface PageConfig {
    /** 是否是首页 */
    isHome?: boolean
    /** 是否开启 React 18，默认开启 */
    isUseReact18?: boolean
    /** 页面导出组件名 */
    componentName?: string
    /** 固定窗口尺寸 */
    windowArea?: {
      width?: number
      height?: number
    }
  }
  interface PageResizeObject {
    /** 屏幕旋转状态 */
    deviceOrientation?: 'portrait' | 'landscape'
    /** 尺寸信息 */
    size: {
      windowWidth: number
      windowHeight: number
      screenWidth?: number
      screenHeight?: number
    }
    /** 折叠屏信息：0 表示设备当前折叠显示模式未知；1 表示设备当前全屏显示；2 表示设备当前主屏幕显示；3 表示设备当前子屏幕显示；4 表示设备当前双屏协同显示 */
    foldDisplayMode: number
    /** 是否可分栏 */
    canSplit: bool
  }

  interface TaroStatic {
    /** 尺寸转换
     * @supported global
     */
    pxTransform(size: number, designWidth?: number): number | string
    /** Harmony 专属，刷新 Audio 状态 */
    refreshAudioSession(): void
  }
}

declare global {
  function $r(resourcePath: string): any
  function getUIContext(): any
  function canIUse(name: string): boolean
  const Observed: any
  const SwiperController: any
  const Visibility: any
  type DataChangeListener = any
  type GestureEvent = any
  type VideoController = any

  interface IDataSource {
    _isDynamicNode?: boolean
  }
}
