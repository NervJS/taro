/// <reference types="react" />
/// <reference path="taro.component.d.ts" />
/// <reference path="api/network/request.d.ts" />

declare namespace Taro {
  // Events
  class Events {
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

  // eventCenter

  const eventCenter: Events

  // ENV_TYPE

  enum ENV_TYPE {
    WEAPP = 'WEAPP',
    WEB = 'WEB',
    RN = 'RN',
    SWAN = 'SWAN',
    ALIPAY = 'ALIPAY',
    TT = 'TT',
    QQ = 'QQ',
    JD = 'JD'
  }

  function getEnv(): ENV_TYPE

  function render(component: Component | JSX.Element, element: Element | null): any

  function internal_safe_set(...arg: any[]): any
  function internal_safe_get(...arg: any[]): any

  type MessageType = 'info' | 'success' | 'error' | 'warning'

  interface AtMessageOptions {
    message: string
    type?: MessageType
    duration?: number
  }

  function atMessage(options: AtMessageOptions): void

  function pxTransform(size: number, designWidth?: number): string
  function initPxTransform(config: { designWidth: number; deviceRatio: object }): void

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

  namespace interceptors {
    function logInterceptor(chain: Chain): Promise<any>

    function timeoutInterceptor(chain: Chain): Promise<any>
  }

  function addInterceptor(interceptor: interceptor): any

  /**
   * 小程序引用插件 JS 接口
   */
  function requirePlugin(pluginName: string): any

  function setIsUsingDiff (flag: boolean)

  interface Current {
    app: AppInstance | null,
    router: RouterInfo | null,
    page: PageInstance | null,
    onReady: string,
    onHide: string,
    onShow: string,
    preloadData?: Record<any, any>
  }

  const Current: Current

  function getCurrentInstance(): Current
}
