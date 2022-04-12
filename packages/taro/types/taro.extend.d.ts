import Taro, { Component } from './index'

declare module './index' {
  type MessageType = 'info' | 'success' | 'error' | 'warning'

  interface AtMessageOptions {
    message: string
    type?: MessageType
    duration?: number
  }

  interface RequestParams<T> extends request.Option<T, any> {
    [propName: string]: any
  }

  interface Current {
    app: AppInstance | null
    router: RouterInfo | null
    page: PageInstance | null
    onReady: string
    onHide: string
    onShow: string
    preloadData?: Record<any, any>
    /**
     * RN 私有对象navigationRef，用于使用底层接口控制路由
     */
    rnNavigationRef?: React.RefObject<any>
  }

  interface SetGlobalDataPlugin {
    install (app: any, data: any): void
  }

  interface TARO_ENV_TYPE {
    [TaroGeneral.ENV_TYPE.WEAPP]: TaroGeneral.ENV_TYPE.WEAPP
    [TaroGeneral.ENV_TYPE.WEB]: TaroGeneral.ENV_TYPE.WEB
    [TaroGeneral.ENV_TYPE.RN]: TaroGeneral.ENV_TYPE.RN
    [TaroGeneral.ENV_TYPE.SWAN]: TaroGeneral.ENV_TYPE.SWAN
    [TaroGeneral.ENV_TYPE.ALIPAY]: TaroGeneral.ENV_TYPE.ALIPAY
    [TaroGeneral.ENV_TYPE.TT]: TaroGeneral.ENV_TYPE.TT
    [TaroGeneral.ENV_TYPE.QQ]: TaroGeneral.ENV_TYPE.QQ
    [TaroGeneral.ENV_TYPE.JD]: TaroGeneral.ENV_TYPE.JD
  }

  interface TaroStatic {
    Events: {
      new (): TaroGeneral.Events
    }

    // eventCenter
    eventCenter: TaroGeneral.Events

    ENV_TYPE: TARO_ENV_TYPE

    getEnv(): TaroGeneral.ENV_TYPE

    render(component: Component | JSX.Element, element: Element | null): any

    internal_safe_set(...arg: any[]): any
    internal_safe_get(...arg: any[]): any

    atMessage(options: AtMessageOptions): void

    pxTransform(size: number, designWidth?: number): string
    initPxTransform(config: { designWidth: number; deviceRatio: TaroGeneral.TDeviceRatio }): void

    /**
     * 小程序引用插件 JS 接口
     */
    requirePlugin(pluginName: string): any

    setIsUsingDiff (flag: boolean)

    Current: Current

    getCurrentInstance(): Current

    /**
     * @desc Vue3 插件，用于设置 `getApp()` 中的全局变量
     * @example
     * ```js
     * // 使用插件
     * const App = createApp(...)
     * App.use(setGlobalDataPlugin, {
     *   xxx: 999
     * })
     * // 获取全局变量
     * Taro.getApp().xxx
     * ```
     */
    setGlobalDataPlugin: SetGlobalDataPlugin

    /**
     * @supported weapp
     * @desc 获取自定义 TabBar 对应的 React 或 Vue 组件实例
     * @param page 小程序页面对象，可以通过 Taro.getCurrentInstance().page 获取
     */
    getTabBar<T>(page: Current['page']): T | undefined
  }
}
