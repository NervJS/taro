import {
  addLeadingSlash, CONTEXT_ACTIONS, Current, document, eventCenter,
  eventHandler, getOnHideEventKey, getOnReadyEventKey, getOnShowEventKey, getPageInstance, getPath,
  incrementId, injectPageInstance, ON_HIDE, ON_READY, ON_SHOW,
  removePageInstance, requestAnimationFrame, safeExecute, window
} from '@tarojs/runtime'
import { EMPTY_OBJ, ensure, hooks, isUndefined } from '@tarojs/shared'

import { setReconciler } from './connect'
import { reactMeta } from './react-meta'
import { isClassComponent } from './utils'

import type { Instance, TaroRootElement } from '@tarojs/runtime' // eslint-disable-line import/no-duplicates
import type { MpInstance } from '@tarojs/runtime/dist/runtime.esm' // eslint-disable-line import/no-duplicates
import type { AppInstance, PageInstance } from '@tarojs/taro'
import type { Func } from '@tarojs/taro/types/compile'
import type React from 'react'

declare const getCurrentPages: () => PageInstance[]

const getNativeCompId = incrementId()
let h: typeof React.createElement
let ReactDOM
let nativeComponentApp: AppInstance
interface InitNativeComponentEntryParams {
  R: typeof React
  ReactDOM: typeof ReactDOM
  cb?: Func
  // 是否使用默认的 DOM 入口 - app；默认为true，false的时候，会创建一个新的dom并且把它挂载在 app 下面
  isDefaultEntryDom?: boolean
  // ---- 共享运行时 native-components 场景 ----
  // 共享运行时下每个 native-comp 业务包按 pkgId 独立挂 App:
  //   - Entry.componentDidMount 时把 this 存进 shared.__nativeComponentApps[pkgId]
  //   - container id 用 `app_${pkgId}` 隔离,避免多包共享同一 #app 覆盖(与 pages config.appId 同源)
  // vanilla 场景(isNativeShared 为 falsy)完全走原逻辑,不改动。
  isNativeShared?: boolean
  pkgId?: string
  globalKey?: string
}

function initNativeComponentEntry (params: InitNativeComponentEntryParams) {
  const { R, ReactDOM, cb, isDefaultEntryDom = true, isNativeShared = false, pkgId, globalKey } = params
  interface IEntryState {
    components: {
      compId: string
      element: React.ReactElement
    }[]
  }

  interface IWrapperProps {
    compId: string
    getCtx: () => any
    renderComponent: (ctx: any) => React.ReactElement
  }

  class NativeComponentWrapper extends R.Component<IWrapperProps, Record<any, any>> {
    root = R.createRef<TaroRootElement>()
    ctx = this.props.getCtx()

    componentDidMount () {
      this.ctx.component = this
      const rootElement = this.root.current!
      rootElement.ctx = this.ctx
      rootElement.performUpdate(true)
    }

    render () {
      return (
        h(
          'root',
          {
            ref: this.root,
            id: this.props.compId
          },
          this.props.renderComponent(this.ctx)
        )
      )
    }
  }

  class Entry extends R.Component<Record<any, any>, IEntryState> {
    state: IEntryState = {
      components: []
    }

    componentDidMount () {
      if (isNativeShared && pkgId && globalKey) {
        // 共享运行时:多个 native-comp 业务包按 pkgId 独立存表,不占用 Current.app,
        // 也不覆盖单例 nativeComponentApp。createNativeComponentConfig 里按 pkgId 查回。
        // 优先从 globalThis(node/主线程)拿;小程序端从 wx 全局对象(通过 globalThis.wx 访问)拿。
        const g = globalThis as any
        const shared = g[globalKey] || g.wx?.[globalKey]
        if (shared) {
          shared.__nativeComponentApps = shared.__nativeComponentApps || {}
          shared.__nativeComponentApps[pkgId] = this
        }
      } else if (isDefaultEntryDom) {
        Current.app = this
      } else {
        nativeComponentApp = this
      }
      cb && cb()
    }

    mount (Component, compId, getCtx, cb?) {
      const isReactComponent = isClassComponent(R, Component)
      const inject = (node?: Instance) => node && injectPageInstance(node, compId)
      const refs = isReactComponent ? { ref: inject } : {
        forwardedRef: inject,
        reactReduxForwardedRef: inject
      }
      if (reactMeta.PageContext === EMPTY_OBJ) {
        reactMeta.PageContext = R.createContext('')
      }
      const item = {
        compId,
        element: h(NativeComponentWrapper, {
          key: compId,
          compId,
          getCtx,
          renderComponent (ctx) {
            return h(
              reactMeta.PageContext.Provider,
              { value: compId },
              h(
                Component,
                {
                  ...(ctx.data ||= {}).props,
                  ...refs,
                  $scope: ctx
                }
              )
            )
          }
        })
      }
      this.setState({
        components: [...this.state.components, item]
      }, () => cb && cb())
    }

    unmount (compId, cb?) {
      const components = this.state.components
      const index = components.findIndex(item => item.compId === compId)
      const next = [...components.slice(0, index), ...components.slice(index + 1)]
      this.setState({
        components: next
      }, () => {
        removePageInstance(compId)
        cb && cb()
      })
    }

    render () {
      const components = this.state.components

      return (
        components.map(({ element }) => element)
      )
    }
  }

  setReconciler(ReactDOM)

  let app: any
  if (isNativeShared && pkgId && globalKey) {
    // 共享运行时:按 pkgId 独立 container,避免多 native-comp 业务包共享 #app 后 ReactDOM.render
    // 相互覆盖(与 pages config.appId=pkgId 同源问题)。container id 命名规则:app_<pkgId>。
    const containerId = `app_${pkgId}`
    app = document.getElementById(containerId)
    if (!app) {
      const container = document.createElement(containerId)
      container.id = containerId
      // 挂到默认 #app 之下(若存在);否则挂到 document.body 之下,与 vanilla 结构对齐。
      const root = document.getElementById('app') || document.body
      root?.appendChild(container)
      app = container
    }
  } else {
    app = document.getElementById('app')
    if (!isDefaultEntryDom && !nativeComponentApp) {
      // create
      const nativeApp = document.createElement('nativeComponent')
      // insert
      app?.parentNode?.appendChild(nativeApp)
      app = nativeApp
    }
  }
  // eslint-disable-next-line react/no-deprecated
  ReactDOM.render(
    h(Entry, {}),
    app
  )
}

export function createNativePageConfig (Component, pageName: string, data: Record<string, unknown>, react: typeof React, reactDOM: typeof ReactDOM, pageConfig) {
  reactMeta.R = react
  h = react.createElement
  ReactDOM = reactDOM
  setReconciler(ReactDOM)
  const [
    ONLOAD,
    ONUNLOAD,
    ONREADY,
    ONSHOW,
    ONHIDE,
    LIFECYCLES,
    SIDE_EFFECT_LIFECYCLES
  ] = hooks.call('getMiniLifecycleImpl')!.page
  let unmounting = false
  let prepareMountList: (() => void)[] = []
  let pageElement: TaroRootElement | null = null
  let loadResolver: (...args: unknown[]) => void
  let hasLoaded: Promise<void>
  const id = pageName ?? `taro_page_${getNativeCompId()}`
  function setCurrentRouter (page: MpInstance) {
    const router = page.route || page.__route__ || page.$taroPath
    Current.router = {
      params: page.$taroParams!,
      path: addLeadingSlash(router),
      $taroPath: page.$taroPath,
      onReady: getOnReadyEventKey(id),
      onShow: getOnShowEventKey(id),
      onHide: getOnHideEventKey(id)
    }
    if (!isUndefined(page.exitState)) {
      Current.router.exitState = page.exitState
    }
  }

  const pageObj: Record<string, any> = {
    options: pageConfig,
    [ONLOAD] (this: MpInstance, options: Readonly<Record<string, unknown>> = {}, cb?: TaroGeneral.TFunc) {
      hasLoaded = new Promise(resolve => { loadResolver = resolve })
      Current.page = this as any
      this.config = pageConfig || {}
      // this.$taroPath 是页面唯一标识
      const uniqueOptions = Object.assign({}, options, { $taroTimestamp: Date.now() })
      const $taroPath = this.$taroPath = getPath(id, uniqueOptions)

      // this.$taroParams 作为暴露给开发者的页面参数对象，可以被随意修改
      if (this.$taroParams == null) {
        this.$taroParams = uniqueOptions
      }

      setCurrentRouter(this)
      window.trigger(CONTEXT_ACTIONS.INIT, $taroPath)

      const mountCallback = () => {
        pageElement = document.getElementById($taroPath)
        ensure(pageElement !== null, '没有找到页面实例。')
        safeExecute($taroPath, ONLOAD, this.$taroParams)
        loadResolver()
        pageElement.ctx = this
        pageElement.performUpdate(true, cb)
      }

      const mount = () => {
        if (!Current.app) {
          initNativeComponentEntry({
            R: react,
            ReactDOM,
            cb: () => {
              Current.app!.mount!(Component, $taroPath, () => this, mountCallback)
            }
          })
        } else {
          Current.app!.mount!(Component, $taroPath, () => this, mountCallback)
        }
      }

      if (unmounting) {
        prepareMountList.push(mount)
      } else {
        mount()
      }
    },
    [ONUNLOAD] () {
      const $taroPath = this.$taroPath
      // 销毁当前页面的上下文信息
      window.trigger(CONTEXT_ACTIONS.DESTROY, $taroPath)
      // 触发onUnload生命周期
      safeExecute($taroPath, ONUNLOAD)
      resetCurrent()
      unmounting = true
      Current.app!.unmount!($taroPath, () => {
        unmounting = false
        removePageInstance($taroPath)
        if (pageElement) {
          pageElement.ctx = null
          pageElement = null
        }
        if (prepareMountList.length) {
          prepareMountList.forEach(fn => fn())
          prepareMountList = []
        }
      })
    },
    [ONREADY] () {
      hasLoaded.then(() => {
        // 触发生命周期
        safeExecute(this.$taroPath, ON_READY)
        // 通过事件触发子组件的生命周期
        requestAnimationFrame(() => eventCenter.trigger(getOnReadyEventKey(id)))
        this.onReady.called = true
      })
    },
    [ONSHOW] (options = {}) {
      hasLoaded.then(() => {
        // 设置 Current 的 page 和 router
        Current.page = this as any
        setCurrentRouter(this)
        // 恢复上下文信息
        window.trigger(CONTEXT_ACTIONS.RECOVER, this.$taroPath)
        // 触发生命周期
        safeExecute(this.$taroPath, ON_SHOW, options)
        // 通过事件触发子组件的生命周期
        requestAnimationFrame(() => eventCenter.trigger(getOnShowEventKey(id)))
      })
    },
    [ONHIDE] () {
      // 缓存当前页面上下文信息
      window.trigger(CONTEXT_ACTIONS.RESTORE, this.$taroPath)
      // 设置 Current 的 page 和 router
      if (Current.page === this) {
        Current.page = null
        Current.router = null
      }
      // 触发生命周期
      safeExecute(this.$taroPath, ON_HIDE)
      // 通过事件触发子组件的生命周期
      eventCenter.trigger(getOnHideEventKey(id))
    },
  }

  function resetCurrent () {
    // 小程序插件页面卸载之后返回到宿主页面时，需重置Current页面和路由。否则引发插件组件二次加载异常 fix:#11991
    Current.page = null
    Current.router = null
  }

  LIFECYCLES.forEach((lifecycle) => {
    pageObj[lifecycle] = function () {
      return safeExecute(this.$taroPath, lifecycle, ...arguments)
    }
  })

  // onShareAppMessage 和 onShareTimeline 一样，会影响小程序右上方按钮的选项，因此不能默认注册。
  SIDE_EFFECT_LIFECYCLES.forEach(lifecycle => {
    if (Component[lifecycle] ||
      Component.prototype?.[lifecycle] ||
      Component[lifecycle.replace(/^on/, 'enable')]
    ) {
      pageObj[lifecycle] = function (...args) {
        const target = args[0]?.target
        if (target?.id) {
          const id = target.id
          const element = document.getElementById(id)
          if (element) {
            target.dataset = element.dataset
          }
        }
        return safeExecute(this.$taroPath, lifecycle, ...args)
      }
    }
  })

  pageObj.eh = eventHandler

  if (!isUndefined(data)) {
    pageObj.data = data
  }

  hooks.call('modifyPageObject', pageObj)

  return pageObj
}

export function createH5NativeComponentConfig (
  Component,
  react: typeof React,
  reactDOM: typeof ReactDOM,
) {
  reactMeta.R = react
  h = react.createElement
  ReactDOM = reactDOM
  setReconciler(ReactDOM)

  return Component
}

export function createNativeComponentConfig (Component, react: typeof React, reactDOM, componentConfig) {
  reactMeta.R = react
  h = react.createElement
  ReactDOM = reactDOM
  setReconciler(ReactDOM)
  const { isNewBlended, isNativeShared, pkgId, globalKey } = componentConfig

  // 共享运行时下,按 pkgId 从共享全局的 __nativeComponentApps 表查回本包 App。
  // isNativeShared 严格 gate:老场景走 (isNewBlended ? nativeComponentApp : Current.app) 二选一,不变。
  const resolveApp = () => {
    if (isNativeShared && pkgId && globalKey) {
      const g = globalThis as any
      const shared = g[globalKey] || g.wx?.[globalKey]
      return shared?.__nativeComponentApps?.[pkgId]
    }
    return isNewBlended ? nativeComponentApp : Current.app
  }

  // 时序兜底:异步核 activate 完成后,由 async-provider 调用 shared.__flushNativeCompQueue()。
  // 此时 ReactDOM 已是真身,重建各 pkgId 的 Entry(懒建 App 存表),Entry 就位后 flush 该包排队的组件 mount。
  // 挂在 shared 上(每次 createNativeComponentConfig 覆盖,逻辑同一,幂等)。
  if (isNativeShared && pkgId && globalKey) {
    const g = globalThis as any
    const shared = g[globalKey] || g.wx?.[globalKey]
    if (shared && !shared.__flushNativeCompQueue) {
      shared.__flushNativeCompQueue = function () {
        const queue = shared.__nativeCompQueue || []
        if (!queue.length) return
        shared.__nativeCompQueue = []
        // 按 pkgId 分组:每个 pkgId 建一次 Entry,Entry 就位(componentDidMount 存表)后 flush 本组
        const byPkg: Record<string, any[]> = {}
        queue.forEach(function (item) {
          (byPkg[item.pkgId] = byPkg[item.pkgId] || []).push(item)
        })
        Object.keys(byPkg).forEach(function (pid) {
          const items = byPkg[pid]
          const existed = shared.__nativeComponentApps && shared.__nativeComponentApps[pid]
          const flushGroup = () => {
            const app = shared.__nativeComponentApps[pid]
            if (app) items.forEach(function (it) { it.doMount(app) })
          }
          if (existed) {
            flushGroup()
          } else {
            // 用真身 ReactDOM 重建 Entry;componentDidMount 存表后回调 flush
            initNativeComponentEntry({
              R: react,
              ReactDOM,
              isDefaultEntryDom: false,
              isNativeShared: true,
              pkgId: pid,
              globalKey,
              cb: flushGroup,
            })
          }
        })
      }
    }
  }

  const componentObj: Record<string, any> = {
    options: componentConfig,
    properties: {
      props: {
        type: null,
        value: null,
        observer (_newVal, oldVal) {
          if (process.env.TARO_ENV === 'swan') {
            // 百度模版传递 props 时 函数参数会被忽略，这里需要根据 id 获取 TaroElement 中的 props 赋值到 ctx.data 中
            const inst: any = document.getElementById(this.id)
            if (this.component?.ctx?.data && inst) {
              this.component.ctx.data.props = inst?.props?.props
            }
          }
          oldVal && this.component?.forceUpdate()
        }
      }
    },
    created () {
      if (process.env.TARO_ENV === 'swan') {
        const inst: any = document.getElementById(this.id)
        // 百度小程序 真机上 props中的函数会被转为Object 调用报错 导致后续组件无法渲染 这里先取TaroElement上的props，在properties中会重新赋值
        if (this.data?.props && inst) {
          this.data.props = inst.props?.props || {}
        }
      }
      const app = resolveApp()
      if (!app) {
        initNativeComponentEntry({
          R: react,
          ReactDOM,
          isDefaultEntryDom: !isNewBlended && !isNativeShared,
          isNativeShared,
          pkgId,
          globalKey,
        })
      }
    },
    attached () {
      const compId = this.compId = getNativeCompId()
      setCurrent(compId)
      this.config = componentConfig
      const ctx = this
      const doMount = (app) => {
        app.mount(Component, compId, () => ctx, () => {
          const instance = getPageInstance(compId)

          if (instance && instance.node) {
            const el = document.getElementById(instance.node.uid)

            if (el) {
              el.ctx = ctx
            }
          }
          // 时序兜底:组件在异步核就绪前被渲染时,mini-program 的 ready 早于本次(延迟的)mount
          // 触发,ready 里的 safeExecute(compId,'onReady') 因实例未注册而空跑 → useReady 丢失。
          // 此刻 mount 已完成(useReady 的 useLayoutEffect 已注册 onReady 到实例),补跑一次。
          // 仅当 ready 在 mount 前空跑过(__taroPendingReady 置位)才补,避免重复触发。
          if (ctx.__taroPendingReady) {
            ctx.__taroPendingReady = false
            safeExecute(compId, 'onReady')
          }
        })
      }
      const app = resolveApp()
      if (app) {
        doMount(app)
      } else if (isNativeShared && pkgId && globalKey) {
        // 时序兜底:host 页面在异步核(shared-async)加载完成前渲染 native-comp 时,
        // Entry 的 ReactDOM.render 打到 app-shim 占位 Proxy → noop → componentDidMount 不 fire →
        // __nativeComponentApps[pkgId] 仍空 → resolveApp 返回 undefined。此处不崩,把 mount 请求
        // 连同 compId 排队到 shared.__nativeCompQueue;异步核 activate 完成后 flush(见 async-provider.js)。
        const g = globalThis as any
        const shared = g[globalKey] || g.wx?.[globalKey]
        if (shared) {
          shared.__nativeCompQueue = shared.__nativeCompQueue || []
          // 带上 compId,供 detached 在 flush 前把本条待挂请求出队(避免挂载已销毁组件)。
          shared.__nativeCompQueue.push({ pkgId, compId, doMount })
        }
      }
    },
    ready () {
      updateCurrentRouter(this.compId)
      // 时序兜底:isNativeShared 下,若本组件在异步核就绪前渲染,attached 已把 mount 请求排入
      // 队列、尚未真正 mount,此刻实例未注册 → safeExecute 空跑。置位 __taroPendingReady,待 flush
      // mount 完成后在 doMount 回调里补跑一次 onReady(见 attached)。vanilla / 已 mount 场景实例存在,
      // 不置位,行为不变。
      if (isNativeShared && pkgId && globalKey && !getPageInstance(this.compId)) {
        this.__taroPendingReady = true
      }
      safeExecute(this.compId, 'onReady')
      requestAnimationFrame(() => eventCenter.trigger(Current.router?.onReady ?? ''))
    },
    detached () {
      resetCurrent()
      const app = resolveApp()
      if (app) {
        app.unmount!(this.compId)
      } else if (isNativeShared && pkgId && globalKey) {
        // 时序兜底:组件在异步核就绪前被销毁(如 wx:if 关闭 / 宿主页返回)。此时 App 未就位,
        // attached 里排的 mount 请求仍在 __nativeCompQueue 中——按 compId 出队,避免 flush 时
        // 挂载一个已销毁的组件(僵尸挂载)。无 app 可 unmount,出队即完成清理。
        const g = globalThis as any
        const shared = g[globalKey] || g.wx?.[globalKey]
        if (shared && shared.__nativeCompQueue) {
          shared.__nativeCompQueue = shared.__nativeCompQueue.filter(
            (it) => it.compId !== this.compId
          )
        }
      }
    },
    pageLifetimes: {
      show (options) {
        updateCurrentRouter(this.compId)
        safeExecute(this.compId, 'onShow', options)
        requestAnimationFrame(() => eventCenter.trigger(Current.router?.onShow ?? ''))
      },
      hide () {
        safeExecute(this.compId, 'onHide')
      }
    },
    methods: {
      eh: eventHandler,
      onLoad (options) {
        safeExecute(this.compId, 'onLoad', options)
      },
      onUnload () {
        safeExecute(this.compId, 'onUnload')
      }
    }
  }

  function resetCurrent () {
    // 小程序插件页面卸载之后返回到宿主页面时，需重置Current页面和路由。否则引发插件组件二次加载异常 fix:#11991
    Current.page = null
    Current.router = null
  }

  // onShareAppMessage 和 onShareTimeline 一样，会影响小程序右上方按钮的选项，因此不能默认注册。
  if (
    Component.onShareAppMessage ||
    Component.prototype?.onShareAppMessage ||
    Component.enableShareAppMessage
  ) {
    componentObj.methods.onShareAppMessage = function (options) {
      const target = options?.target
      if (target) {
        const id = target.id
        const element = document.getElementById(id)
        if (element) {
          target!.dataset = element.dataset
        }
      }
      return safeExecute(this.compId, 'onShareAppMessage', options)
    }
  }
  if (
    Component.onShareTimeline ||
    Component.prototype?.onShareTimeline ||
    Component.enableShareTimeline
  ) {
    componentObj.methods.onShareTimeline = function () {
      return safeExecute(this.compId, 'onShareTimeline')
    }
  }

  if (process.env.TARO_ENV === 'alipay') {
    /**
     * 支付宝需要修改生命周期 同时宿主需要开启component2
     * 如果不开启 props对象中的函数参数会被忽略 导致无法调用
     * @see https://opendocs.alipay.com/mini/03dbc3#compileOptions
     * @returns
     */
    componentObj.onInit = componentObj.created
    componentObj.didMount = componentObj.attached
    componentObj.didUpdate = function () {
      this.data.props = this.props.props
      this?.component?.forceUpdate?.()
    }
    componentObj.didUnmount = componentObj.detached
  }
  return componentObj
}

function updateCurrentRouter (compId: string) {
  if (!getCurrentPages || typeof getCurrentPages !== 'function') return

  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  if (!currentPage) return

  const route = (currentPage as any).route || (currentPage as any).__route__
  Current.page = currentPage
  Current.router = {
    params: currentPage.options || {},
    path: addLeadingSlash(route),
    $taroPath: compId,
    onReady: getOnReadyEventKey(route),
    onShow: getOnShowEventKey(route),
    onHide: getOnHideEventKey(route),
  }
}

function setCurrent (compId: string) {
  if (!getCurrentPages || typeof getCurrentPages !== 'function') return

  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  if (Current.page === currentPage) return

  Current.page = currentPage

  const route = (currentPage as any).route || (currentPage as any).__route__
  const router = {
    params: currentPage.options || {},
    path: addLeadingSlash(route),
    $taroPath: compId,
    onReady: getOnReadyEventKey(route),
    onShow: getOnShowEventKey(route),
    onHide: getOnHideEventKey(route),
  }
  Current.router = router

  if (!currentPage.options) {
    // 例如在微信小程序中，页面 options 的设置时机比组件 attached 慢
    Object.defineProperty(currentPage, 'options', {
      enumerable: true,
      configurable: true,
      get () {
        return this._optionsValue
      },
      set (value) {
        router.params = value
        this._optionsValue = value
      }
    })
  }
}
