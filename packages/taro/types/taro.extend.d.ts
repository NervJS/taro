import Taro, { Component } from './index'

// Events
export class TaroEvents {
  /**
   * 监听一个事件，接受参数
   */
  on(eventName: string, listener: (...args: any[]) => void): this

  /**
   * 添加一个事件监听，并在事件触发完成之后移除Callbacks链
   */
  once(eventName: string, listener: (...args: any[]) => void): this

  /**
   * 取消监听一个事件
   */
  off(eventName: string, listener?: (...args: any[]) => void): this

  /**
   * 取消监听的所有事件
   */
  off(): this

  /**
   * 触发一个事件，传参
   */
  trigger(eventName: string, ...args: any[]): boolean
}

// ENV_TYPE

export enum TARO_ENV_TYPE {
  WEAPP = 'WEAPP',
  WEB = 'WEB',
  RN = 'RN',
  SWAN = 'SWAN',
  ALIPAY = 'ALIPAY',
  TT = 'TT',
  QQ = 'QQ',
  JD = 'JD'
}

declare module './index' {
  type Events = TaroEvents

  type ENV_TYPE = TARO_ENV_TYPE

  type MessageType = 'info' | 'success' | 'error' | 'warning'

  interface AtMessageOptions {
    message: string
    type?: MessageType
    duration?: number
  }

  interface RequestParams extends request.Option<any> {
    [propName: string]: any
  }

  type interceptor = (chain: Chain) => any

  interface Chain {
    index: number
    requestParams: RequestParams
    interceptors: interceptor[]
    proceed(requestParams: RequestParams): any
  }

  interface interceptors {
    logInterceptor(chain: Chain): Promise<any>

    timeoutInterceptor(chain: Chain): Promise<any>
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

  interface TaroStatic {
    // eventCenter
    eventCenter: TaroEvents

    getEnv(): ENV_TYPE

    render(component: Component | JSX.Element, element: Element | null): any

    internal_safe_set(...arg: any[]): any
    internal_safe_get(...arg: any[]): any

    atMessage(options: AtMessageOptions): void

    pxTransform(size: number, designWidth?: number): string
    initPxTransform(config: { designWidth: number; deviceRatio: object }): void

    addInterceptor(interceptor: interceptor): any

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
  }
}
