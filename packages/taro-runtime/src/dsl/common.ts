/* eslint-disable dot-notation */
import {
  EMPTY_OBJ, ensure, EventChannel,
  getComponentsAlias, hooks, internalComponents,
  isArray, isFunction, isString, isUndefined, Shortcuts
} from '@tarojs/shared'

import { raf } from '../bom/raf'
import { taroWindowProvider } from '../bom/window'
import { BEHAVIORS, CONTEXT_ACTIONS, CUSTOM_WRAPPER, EXTERNAL_CLASSES, ON_HIDE, ON_LOAD, ON_READY, ON_SHOW, OPTIONS, PAGE_INIT, VIEW } from '../constants'
import { Current } from '../current'
import { eventHandler } from '../dom/event'
import { eventCenter } from '../emitter/emitter'
import env from '../env'
import { perf } from '../perf'
import { customWrapperCache, incrementId } from '../utils'
import { addLeadingSlash } from '../utils/router'

import type { TaroRootElement } from '../dom/root'
import type { MpInstance, PageConfig, TFunc } from '../interface'
import type { Instance, PageInstance, PageProps } from './instance'

const instances = new Map<string, Instance>()
const pageId = incrementId()

export function injectPageInstance (inst: Instance<PageProps>, id: string) {
  hooks.call('mergePageInstance', instances.get(id), inst)
  instances.set(id, inst)
}

export function getPageInstance (id: string): Instance | undefined {
  return instances.get(id)
}

export function removePageInstance (id: string) {
  instances.delete(id)
}

export function safeExecute (path: string, lifecycle: string, ...args: unknown[]) {
  const instance = instances.get(path)

  if (instance == null) {
    return
  }

  const func = hooks.call('getLifecycle', instance, lifecycle as keyof PageInstance)

  if (isArray(func)) {
    const res = func.map(fn => fn.apply(instance, args))
    return res[0]
  }

  if (!isFunction(func)) {
    return
  }

  return func.apply(instance, args)
}

export function stringify (obj?: Record<string, unknown>) {
  if (obj == null) {
    return ''
  }
  const path = Object.keys(obj).map((key) => {
    return key + '=' + obj[key]
  }).join('&')
  return path === '' ? path : '?' + path
}

export function getPath (id: string, options?: Record<string, unknown>): string {
  const idx = id.indexOf('?')
  if (process.env.TARO_PLATFORM === 'web') {
    return `${idx > -1 ? id.substring(0, idx) : id}${stringify(options?.stamp ? { stamp: options.stamp } : {})}`
  } else {
    return `${idx > -1 ? id.substring(0, idx) : id}${stringify(options)}`
  }
}

export function getOnReadyEventKey (path: string) {
  return path + '.' + ON_READY
}

export function getOnShowEventKey (path: string) {
  return path + '.' + ON_SHOW
}

export function getOnHideEventKey (path: string) {
  return path + '.' + ON_HIDE
}

export function createPageConfig (component: any, pageName?: string, data?: Record<string, unknown>, pageConfig?: PageConfig) {
  // 小程序 Page 构造器是一个傲娇小公主，不能把复杂的对象挂载到参数上
  const id = pageName ?? `taro_page_${pageId()}`
  const [
    ONLOAD,
    ONUNLOAD,
    ONREADY,
    ONSHOW,
    ONHIDE,
    LIFECYCLES,
    SIDE_EFFECT_LIFECYCLES,
  ] = hooks.call('getMiniLifecycleImpl')!.page
  let pageElement: TaroRootElement | null = null
  let unmounting = false
  let prepareMountList: (() => void)[] = []

  function setCurrentRouter (page: MpInstance) {
    const router = process.env.TARO_PLATFORM === 'web' ? page.$taroPath : page.route || page.__route__ || page.$taroPath
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
  let loadResolver: (...args: unknown[]) => void
  let hasLoaded: Promise<void>
  const config: PageInstance = {
    [ONLOAD] (this: MpInstance, options: Readonly<Record<string, unknown>> = {}, cb?: TFunc) {
      hasLoaded = new Promise(resolve => { loadResolver = resolve })

      perf.start(PAGE_INIT)

      Current.page = this as any
      this.config = pageConfig || {}

      // this.$taroPath 是页面唯一标识
      const uniqueOptions = Object.assign({}, options, { $taroTimestamp: Date.now() })
      const $taroPath = this.$taroPath = getPath(id, uniqueOptions)
      if (process.env.TARO_PLATFORM === 'web') {
        config.path = $taroPath
      }
      // this.$taroParams 作为暴露给开发者的页面参数对象，可以被随意修改
      if (this.$taroParams == null) {
        this.$taroParams = uniqueOptions
      }

      setCurrentRouter(this)

      // 初始化当前页面的上下文信息
      if (process.env.TARO_PLATFORM !== 'web') {
        taroWindowProvider.trigger(CONTEXT_ACTIONS.INIT, $taroPath)
      }

      const mount = () => {
        Current.app!.mount!(component, $taroPath, () => {
          pageElement = env.document.getElementById<TaroRootElement>($taroPath)

          ensure(pageElement !== null, '没有找到页面实例。')
          safeExecute($taroPath, ON_LOAD, this.$taroParams)
          loadResolver()
          if (process.env.TARO_PLATFORM !== 'web') {
            pageElement.ctx = this
            pageElement.performUpdate(true, cb)
          } else {
            isFunction(cb) && cb()
          }
        })
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
      if (process.env.TARO_PLATFORM !== 'web') {
        taroWindowProvider.trigger(CONTEXT_ACTIONS.DESTORY, $taroPath)
      }
      // 触发onUnload生命周期
      safeExecute($taroPath, ONUNLOAD)
      unmounting = true
      Current.app!.unmount!($taroPath, () => {
        unmounting = false
        instances.delete($taroPath)
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
        raf(() => eventCenter.trigger(getOnReadyEventKey(id)))
        this.onReady.called = true
      })
    },
    [ONSHOW] (options = {}) {
      hasLoaded.then(() => {
        // 设置 Current 的 page 和 router
        Current.page = this as any
        setCurrentRouter(this)
        // 恢复上下文信息
        if (process.env.TARO_PLATFORM !== 'web') {
          taroWindowProvider.trigger(CONTEXT_ACTIONS.RECOVER, this.$taroPath)
        }
        // 触发生命周期
        safeExecute(this.$taroPath, ON_SHOW, options)
        // 通过事件触发子组件的生命周期
        raf(() => eventCenter.trigger(getOnShowEventKey(id)))
      })
    },
    [ONHIDE] () {
      // 缓存当前页面上下文信息
      if (process.env.TARO_PLATFORM !== 'web') {
        taroWindowProvider.trigger(CONTEXT_ACTIONS.RESTORE, this.$taroPath)
      }
      // 设置 Current 的 page 和 router
      if (Current.page === this) {
        Current.page = null
        Current.router = null
      }
      // 触发生命周期
      safeExecute(this.$taroPath, ON_HIDE)
      // 通过事件触发子组件的生命周期
      eventCenter.trigger(getOnHideEventKey(id))
    }
  }

  if (process.env.TARO_PLATFORM === 'web') {
    config.getOpenerEventChannel = () => {
      return EventChannel.pageChannel
    }
  }

  LIFECYCLES.forEach((lifecycle) => {
    let isDefer = false
    lifecycle = lifecycle.replace(/^defer:/, () => {
      isDefer = true
      return ''
    })
    config[lifecycle] = function () {
      const exec = () => safeExecute(this.$taroPath, lifecycle, ...arguments)
      if (isDefer) {
        hasLoaded.then(exec)
      } else {
        return exec()
      }
    }
  })

  // onShareAppMessage 和 onShareTimeline 一样，会影响小程序右上方按钮的选项，因此不能默认注册。
  SIDE_EFFECT_LIFECYCLES.forEach(lifecycle => {
    if (component[lifecycle] ||
      component.prototype?.[lifecycle] ||
      component[lifecycle.replace(/^on/, 'enable')] ||
      pageConfig?.[lifecycle.replace(/^on/, 'enable')]
    ) {
      config[lifecycle] = function (...args) {
        const target = args[0]?.target
        if (target?.id) {
          const id = target.id
          const element = env.document.getElementById(id)
          if (element) {
            target.dataset = element.dataset
          }
        }
        return safeExecute(this.$taroPath, lifecycle, ...args)
      }
    }
  })

  config.eh = eventHandler

  if (!isUndefined(data)) {
    config.data = data
  }

  hooks.call('modifyPageObject', config)

  return config
}

export function createComponentConfig (component: React.ComponentClass, componentName?: string, data?: Record<string, unknown>) {
  const id = componentName ?? `taro_component_${pageId()}`
  let componentElement: TaroRootElement | null = null
  const [ATTACHED, DETACHED] = hooks.call('getMiniLifecycleImpl')!.component

  const config: any = {
    [ATTACHED] () {
      perf.start(PAGE_INIT)
      this.pageIdCache = this.getPageId?.() || pageId()

      const path = getPath(id, { id: this.pageIdCache })

      Current.app!.mount!(component, path, () => {
        componentElement = env.document.getElementById<TaroRootElement>(path)
        ensure(componentElement !== null, '没有找到组件实例。')
        this.$taroInstances = instances.get(path)
        safeExecute(path, ON_LOAD)
        if (process.env.TARO_PLATFORM !== 'web') {
          componentElement.ctx = this
          componentElement.performUpdate(true)
        }
      })
    },
    [DETACHED] () {
      const path = getPath(id, { id: this.pageIdCache })

      Current.app!.unmount!(path, () => {
        instances.delete(path)
        if (componentElement) {
          componentElement.ctx = null
        }
      })
    },
    methods: {
      eh: eventHandler
    }
  }

  if (!isUndefined(data)) {
    config.data = data
  }

  [OPTIONS, EXTERNAL_CLASSES, BEHAVIORS].forEach(key => {
    config[key] = component[key] ?? EMPTY_OBJ
  })

  return config
}

export function createRecursiveComponentConfig (componentName?: string) {
  const isCustomWrapper = componentName === CUSTOM_WRAPPER
  const [ATTACHED, DETACHED] = hooks.call('getMiniLifecycleImpl')!.component

  const lifeCycles = isCustomWrapper
    ? {
      [ATTACHED] () {
        const componentId = this.data.i?.sid || this.props.i?.sid
        if (isString(componentId)) {
          customWrapperCache.set(componentId, this)
          const el = env.document.getElementById(componentId)
          if (el) {
            el.ctx = this
          }
        }
      },
      [DETACHED] () {
        const componentId = this.data.i?.sid || this.props.i?.sid
        if (isString(componentId)) {
          customWrapperCache.delete(componentId)
          const el = env.document.getElementById(componentId)
          if (el) {
            el.ctx = null
          }
        }
      }
    }
    : EMPTY_OBJ

  // 不同平台的个性化配置
  const extraOptions: { [key: string]: any } = {}
  if (process.env.TARO_ENV === 'jd') {
    extraOptions.addGlobalClass = true
  }

  return hooks.call('modifyRecursiveComponentConfig',
    {
      properties: {
        i: {
          type: Object,
          value: {
            [Shortcuts.NodeName]: getComponentsAlias(internalComponents)[VIEW]._num
          }
        },
        l: {
          type: String,
          value: ''
        }
      },
      options: {
        ...extraOptions,
        virtualHost: !isCustomWrapper
      },
      methods: {
        eh: eventHandler
      },
      ...lifeCycles
    }, { isCustomWrapper })
}
