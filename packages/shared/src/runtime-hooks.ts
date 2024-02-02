import { Events } from './event-emitter'
import { isFunction } from './is'

import type { Shortcuts } from './template'

// Note: @tarojs/runtime 不依赖 @tarojs/taro, 所以不能改为从 @tarojs/taro 引入 (可能导致循环依赖)
type TFunc = (...args: any[]) => any

export enum HOOK_TYPE {
  SINGLE,
  MULTI,
  WATERFALL
}

interface Hook {
  type: HOOK_TYPE
  initial?: TFunc | null
}

interface Node {
  next: Node
  context?: any
  callback?: TFunc
}

interface MiniLifecycle {
  app: [
    string, /** onLaunch */
    string, /** onShow */
    string /** onHide */
  ]
  page: [
    string, /** onLoad */
    string, /** onUnload */
    string, /** onReady */
    string, /** onShow */
    string, /** onHide */
    string[], /** others */
    string[] /** side-effects */
  ]
  component: [
    string, /** attached */
    string, /** detached */
  ]
}

interface MiniElementData {
  [Shortcuts.Childnodes]?: MiniData[]
  [Shortcuts.NodeName]: string
  [Shortcuts.Class]?: string
  [Shortcuts.Style]?: string
  uid?: string
  sid: string
  [key: string]: unknown
}

interface MiniTextData {
  [Shortcuts.Text]: string
  [Shortcuts.NodeName]: string
}

type MiniData = MiniElementData | MiniTextData

interface UpdatePayload {
  path: string
  value: string | boolean | (() => MiniData | MiniData[])
}

type Target = Record<string, unknown> & { dataset: Record<string, unknown>, id: string }

interface MpEvent {
  type: string
  detail: Record<string, unknown>
  target: Target
  currentTarget: Target
}

const defaultMiniLifecycle: MiniLifecycle = {
  app: [
    'onLaunch',
    'onShow',
    'onHide'
  ],
  page: [
    'onLoad',
    'onUnload',
    'onReady',
    'onShow',
    'onHide',
    [
      'onPullDownRefresh',
      'onReachBottom',
      'onPageScroll',
      'onResize',
      'defer:onTabItemTap', // defer: 需要等页面组件挂载后再调用
      'onTitleClick',
      'onOptionMenuClick',
      'onPopMenuClick',
      'onPullIntercept',
      'onAddToFavorites'
    ],
    [
      'onShareAppMessage',
      'onShareTimeline'
    ]
  ],
  component: [
    'attached',
    'detached'
  ]
}

export function TaroHook (type: HOOK_TYPE, initial?: TFunc): Hook {
  return {
    type,
    initial: initial || null
  }
}

export class TaroHooks<T extends Record<string, TFunc> = any> extends Events {
  hooks: Record<keyof T, Hook>

  constructor (hooks: Record<keyof T, Hook>, opts?) {
    super(opts)
    this.hooks = hooks
    for (const hookName in hooks) {
      const { initial } = hooks[hookName]
      if (isFunction(initial)) {
        this.on(hookName, initial)
      }
    }
  }

  private tapOneOrMany<K extends Extract<keyof T, string>> (hookName: K, callback: T[K] | T[K][]) {
    const list = isFunction(callback) ? [callback] : callback
    list.forEach(cb => this.on(hookName, cb))
  }

  tap<K extends Extract<keyof T, string>> (hookName: K, callback: T[K] | T[K][]) {
    const hooks = this.hooks
    const { type, initial } = hooks[hookName]
    if (type === HOOK_TYPE.SINGLE) {
      this.off(hookName)
      this.on(hookName, isFunction(callback) ? callback : callback[callback.length - 1])
    } else {
      initial && this.off(hookName, initial)
      this.tapOneOrMany(hookName, callback)
    }
  }

  call<K extends Extract<keyof T, string>> (hookName: K, ...rest: Parameters<T[K]>): ReturnType<T[K]> | undefined {
    const hook = this.hooks[hookName]
    if (!hook) return

    const { type } = hook

    const calls = this.callbacks
    if (!calls) return

    const list = calls[hookName] as { tail: Node, next: Node }

    if (list) {
      const tail = list.tail
      let node: Node = list.next
      let args = rest
      let res

      while (node !== tail) {
        res = node.callback?.apply(node.context || this, args)
        if (type === HOOK_TYPE.WATERFALL) {
          const params: any = [res]
          args = params
        }
        node = node.next
      }
      return res
    }
  }

  isExist (hookName: string) {
    return Boolean(this.callbacks?.[hookName])
  }
}

type ITaroHooks = {
  /** 小程序端 App、Page 构造对象的生命周期方法名称 */
  getMiniLifecycle: (defaultConfig: MiniLifecycle) => MiniLifecycle
  getMiniLifecycleImpl: () => MiniLifecycle
  /** 解决 React 生命周期名称的兼容问题 */
  getLifecycle: (instance, lifecyle) => TFunc | Array<TFunc> | undefined
  /** 提供Hook，为不同平台提供修改生命周期配置 */
  modifyRecursiveComponentConfig: (defaultConfig:MiniLifecycle, options:any) => any
  /** 解决百度小程序的模版语法问题 */
  getPathIndex: (indexOfNode: number) => string
  /** 解决支付宝小程序分包时全局作用域不一致的问题 */
  getEventCenter: (EventsClass: typeof Events) => Events
  isBubbleEvents: (eventName: string) => boolean
  getSpecialNodes: () => string[]
  /** 解决 Vue2 布尔值属性值的设置问题 */
  onRemoveAttribute: (element, qualifiedName: string) => boolean
  /** 用于把 React 同一事件回调中的所有 setState 合并到同一个更新处理中 */
  batchedEventUpdates: (cb: TFunc) => void
  /** 用于处理 React 中的小程序生命周期 hooks */
  mergePageInstance: (prev, next) => void
  /** 用于修改传递给小程序 Page 构造器的对象 */
  modifyPageObject: (config: Record<any, any>) => void
  /** H5 下拉刷新 wrapper */
  createPullDownComponent: (el, path: string, framework, customWrapper?: any, stampId?: string) => void
  /** H5 获取原生 DOM 对象 */
  getDOMNode: (instance) => any
  /**
   * @todo: multi
   * 修改 Taro DOM 序列化数据
   **/
  modifyHydrateData:(data: Record<string, any>, node) => void
  /**
   * 自定义处理 Taro DOM 序列化数据，如使其脱离 data 树
   */
  transferHydrateData: (data: Record<string, any>, element, componentsAlias: Record<string, any>) => void
  /**
    * @todo: multi
    * 修改 Taro DOM 序列化数据
    **/
  modifySetAttrPayload: (element, key: string, payload: UpdatePayload, componentsAlias: Record<string, any>) => void
  /**
    * @todo: multi
    * 修改 Taro DOM 序列化数据
    **/
  modifyRmAttrPayload: (element, key: string, payload: UpdatePayload, componentsAlias: Record<string, any>) => void
  /**
    * @todo: multi
    * 调用 addEventListener 时触发
    **/
  onAddEvent: (type: string, handler, options: any, node) => void
  /** 用于修改小程序原生事件对象 */
  modifyMpEvent: (event: MpEvent) => void
  modifyMpEventImpl: (event: MpEvent) => void
  /** 用于修改 Taro DOM 事件对象 */
  modifyTaroEvent: (event, element) => void

  dispatchTaroEvent: (event, element) => void
  dispatchTaroEventFinish: (event, element) => void
  modifyTaroEventReturn: (node, event, returnVal) => any

  modifyDispatchEvent: (event, element) => void
  injectNewStyleProperties: (styleProperties: string[]) => void
  initNativeApi: (taro: Record<string, any>) => void
  patchElement: (node) => void

  /** 解 Proxy */
  proxyToRaw: (proxyObj) => Record<any, any>
  /** 元素增加事件监听钩子 */
  modifyAddEventListener: (element, sideEffect: boolean, getComponentsAlias: () => Record<string, any>) => void
  /** 元素删除事件监听钩子 */
  modifyRemoveEventListener: (element, sideEffect: boolean, getComponentsAlias: () => Record<string, any>) => void
}

export const hooks = new TaroHooks<ITaroHooks>({
  getMiniLifecycle: TaroHook(HOOK_TYPE.SINGLE, defaultConfig => defaultConfig),

  getMiniLifecycleImpl: TaroHook(HOOK_TYPE.SINGLE, function (this: TaroHooks<ITaroHooks>) {
    return this.call('getMiniLifecycle', defaultMiniLifecycle)
  }),

  getLifecycle: TaroHook(HOOK_TYPE.SINGLE, (instance, lifecycle) => instance[lifecycle]),

  modifyRecursiveComponentConfig: TaroHook(HOOK_TYPE.SINGLE, (defaultConfig) => defaultConfig),

  getPathIndex: TaroHook(HOOK_TYPE.SINGLE, indexOfNode => `[${indexOfNode}]`),

  getEventCenter: TaroHook(HOOK_TYPE.SINGLE, Events => new Events()),

  isBubbleEvents: TaroHook(HOOK_TYPE.SINGLE, eventName => {
    /**
     * 支持冒泡的事件, 除 支付宝小程序外，其余的可冒泡事件都和微信保持一致
     * 详见 见 https://developers.weixin.qq.com/miniprogram/dev/framework/view/wxml/event.html
     */
    const BUBBLE_EVENTS = new Set([
      'touchstart',
      'touchmove',
      'touchcancel',
      'touchend',
      'touchforcechange',
      'tap',
      'longpress',
      'longtap',
      'transitionend',
      'animationstart',
      'animationiteration',
      'animationend'
    ])

    return BUBBLE_EVENTS.has(eventName)
  }),

  getSpecialNodes: TaroHook(HOOK_TYPE.SINGLE, () => ['view', 'text', 'image']),

  onRemoveAttribute: TaroHook(HOOK_TYPE.SINGLE),

  batchedEventUpdates: TaroHook(HOOK_TYPE.SINGLE),

  mergePageInstance: TaroHook(HOOK_TYPE.SINGLE),

  modifyPageObject: TaroHook(HOOK_TYPE.SINGLE),

  createPullDownComponent: TaroHook(HOOK_TYPE.SINGLE),

  getDOMNode: TaroHook(HOOK_TYPE.SINGLE),

  modifyHydrateData: TaroHook(HOOK_TYPE.SINGLE),

  transferHydrateData: TaroHook(HOOK_TYPE.SINGLE),

  modifySetAttrPayload: TaroHook(HOOK_TYPE.SINGLE),

  modifyRmAttrPayload: TaroHook(HOOK_TYPE.SINGLE),

  onAddEvent: TaroHook(HOOK_TYPE.SINGLE),

  proxyToRaw: TaroHook(HOOK_TYPE.SINGLE, function (proxyObj) {
    return proxyObj
  }),

  modifyMpEvent: TaroHook(HOOK_TYPE.MULTI),

  modifyMpEventImpl: TaroHook(HOOK_TYPE.SINGLE, function (this: TaroHooks<ITaroHooks>, e: MpEvent) {
    try {
      // 有些小程序的事件对象的某些属性只读
      this.call('modifyMpEvent', e)
    } catch (error) {
      console.warn('[Taro modifyMpEvent hook Error]: ' + error?.message)
    }
  }),

  injectNewStyleProperties: TaroHook(HOOK_TYPE.SINGLE),

  modifyTaroEvent: TaroHook(HOOK_TYPE.MULTI),

  dispatchTaroEvent: TaroHook(HOOK_TYPE.SINGLE, (e, node) => {
    node.dispatchEvent(e)
  }),

  dispatchTaroEventFinish: TaroHook(HOOK_TYPE.MULTI),

  modifyTaroEventReturn: TaroHook(HOOK_TYPE.SINGLE, () => undefined),

  modifyDispatchEvent: TaroHook(HOOK_TYPE.MULTI),

  initNativeApi: TaroHook(HOOK_TYPE.MULTI),

  patchElement: TaroHook(HOOK_TYPE.MULTI),

  modifyAddEventListener: TaroHook(HOOK_TYPE.SINGLE),

  modifyRemoveEventListener: TaroHook(HOOK_TYPE.SINGLE),
})
