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
}

declare module '@tarojs/runtime' {
  function initHarmonyElement()
  function initStyleSheetConfig(size: any, navHeight: any)
  enum NodeType {
    ELEMENT_NODE = 1,
    ATTRIBUTE_NODE = 2,
    TEXT_NODE = 3,
    CDATA_SECTION_NODE = 4,
    ENTITY_REFERENCE_NODE = 5,
    PROCESSING_INSTRUCTION_NODE = 7,
    COMMENT_NODE = 8,
    DOCUMENT_NODE = 9,
    DOCUMENT_TYPE_NODE = 10,
    DOCUMENT_FRAGMENT_NODE = 11
  }
  type TFunc = (...args: any[]) => any
  type TaroRichTextElement = any
  type EventOptions = any
  const context: {
    resolver: Promise.resolve
    value: any
  }
  const TaroWindowUtil: {
    resolver: Promise.resolve
  }

  const uiContext: typeof context
  declare const Current: {
    app: AppInstance | null
    entryAsync: AppInstance | null
    isDebug: boolean
    uiContext: any
    router: Router | null
    taro: any
    contextPromise: Promise<any>
    uiContextPromise: Promise<any>
    nativeModule: any
    createHarmonyElement: null
    page: PageInstance | null
    preloadData?: any
  }

  function getPageById(pageId: string): any
  function setPageById(inst: any, id: string): any
  function removePageById(pageId: string): any

  // cpp/types/taro-native-node/index.d.ts
  const TaroNativeModule: any
  const systemContext: {
    resolve: Promise.resolve
    reject: Promise.reject
    densityPixels: number
    safeArea: any
    statusBarHeight: number
    windowWidth: number
    windowHeight: number
  }
  const systemPromise: typeof context
  const TaroWindowUtil: typeof TaroWindowUtil

}

declare module '@tarojs/taro' {
  interface TaroStatic {
    /** 尺寸转换
     * @supported global
     */
    pxTransform(size: number, designWidth?: number): number | string
  }
}

declare global {
  function $r(resourcePath: string): any
  function getUIContext(): any
  function canIUse(name: string): boolean
}
