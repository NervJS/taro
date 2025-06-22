/// <reference types="@tarojs/runtime" />

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

  const TaroElement: any
  type TaroElement = any
  type TaroVideoElement = typeof TaroElement
}
