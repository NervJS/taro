/* eslint-disable dot-notation */
import { isFunction, EMPTY_OBJ, ensure, Shortcuts, isUndefined, isArray, isString } from '@tarojs/shared'
import { getHooks } from '../container/store'
import { eventHandler } from '../dom/event'
import { Current } from '../current'
import { document } from '../bom/document'
import { incrementId, customWrapperCache } from '../utils'
import { perf } from '../perf'
import { eventCenter } from '../emitter/emitter'
import { raf } from '../bom/raf'
import { PAGE_INIT, CUSTOM_WRAPPER, VIEW, ON_READY, ON_SHOW, ON_HIDE, ON_LOAD, OPTIONS, EXTERNAL_CLASSES, BEHAVIORS } from '../constants'

import type { PageConfig } from '@tarojs/taro'
import type { Instance, PageInstance, PageProps } from './instance'
import type { Func, MpInstance } from '../interface'
import type { TaroRootElement } from '../dom/root'

const instances = new Map<string, Instance>()
const pageId = incrementId()

export function injectPageInstance (inst: Instance<PageProps>, id: string) {
  getHooks().mergePageInstance?.(instances.get(id), inst)
  instances.set(id, inst)
}

export function getPageInstance (id: string): Instance | undefined {
  return instances.get(id)
}

export function addLeadingSlash (path?: string): string {
  if (path == null) {
    return ''
  }
  return path.charAt(0) === '/' ? path : '/' + path
}

export function safeExecute (path: string, lifecycle: string, ...args: unknown[]) {
  const instance = instances.get(path)

  if (instance == null) {
    return
  }

  const func = getHooks().getLifecycle(instance, lifecycle as keyof PageInstance)

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
  return `${idx > -1 ? id.substring(0, idx) : id}${stringify(process.env.TARO_ENV === 'h5' ? { stamp: options?.stamp || '' } : options)}`
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
  const hooks = getHooks()
  const [
    ONLOAD,
    ONUNLOAD,
    ONREADY,
    ONSHOW,
    ONHIDE,
    LIFECYCLES
  ] = hooks.getMiniLifecycleImpl().page
  let pageElement: TaroRootElement | null = null
  let unmounting = false
  let prepareMountList: (() => void)[] = []

  function setCurrentRouter (page: MpInstance) {
    const router = process.env.TARO_ENV === 'h5' ? page.$taroPath : page.route || page.__route__ || page.$taroPath
    Current.router = {
      params: page.$taroParams!,
      path: addLeadingSlash(router),
      onReady: getOnReadyEventKey(id),
      onShow: getOnShowEventKey(id),
      onHide: getOnHideEventKey(id)
    }
  }
  let loadResolver: (...args: unknown[]) => void
  let hasLoaded: Promise<void>
  const config: PageInstance = {
    [ONLOAD] (this: MpInstance, options: Record<string, unknown> = {}, cb?: Func) {
      hasLoaded = new Promise(resolve => { loadResolver = resolve })

      perf.start(PAGE_INIT)

      Current.page = this as any
      this.config = pageConfig || {}
      options.$taroTimestamp = Date.now()

      // this.$taroPath 是页面唯一标识，不可变，因此页面参数 options 也不可变
      this.$taroPath = getPath(id, options)
      const $taroPath = this.$taroPath
      if (process.env.TARO_ENV === 'h5') {
        config.path = this.$taroPath
      }
      // this.$taroParams 作为暴露给开发者的页面参数对象，可以被随意修改
      if (this.$taroParams == null) {
        this.$taroParams = Object.assign({}, options)
      }

      setCurrentRouter(this)

      const mount = () => {
        Current.app!.mount!(component, $taroPath, () => {
          pageElement = document.getElementById<TaroRootElement>($taroPath)

          ensure(pageElement !== null, '没有找到页面实例。')
          safeExecute($taroPath, ON_LOAD, this.$taroParams)
          loadResolver()
          if (process.env.TARO_ENV !== 'h5') {
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
      // 触发生命周期
      safeExecute(this.$taroPath, ON_READY)
      // 通过事件触发子组件的生命周期
      raf(() => eventCenter.trigger(getOnReadyEventKey(id)))
      this.onReady.called = true
    },
    [ONSHOW] (options = {}) {
      hasLoaded.then(() => {
        // 设置 Current 的 page 和 router
        Current.page = this as any
        setCurrentRouter(this)
        // 触发生命周期
        safeExecute(this.$taroPath, ON_SHOW, options)
        // 通过事件触发子组件的生命周期
        raf(() => eventCenter.trigger(getOnShowEventKey(id)))
      })
    },
    [ONHIDE] () {
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

  LIFECYCLES.forEach((lifecycle) => {
    config[lifecycle] = function () {
      return safeExecute(this.$taroPath, lifecycle, ...arguments)
    }
  })

  // onShareAppMessage 和 onShareTimeline 一样，会影响小程序右上方按钮的选项，因此不能默认注册。
  if (component.onShareAppMessage ||
      component.prototype?.onShareAppMessage ||
      component.enableShareAppMessage) {
    config.onShareAppMessage = function (options) {
      const target = options?.target
      if (target) {
        const id = target.id
        const element = document.getElementById(id)
        if (element) {
          target!.dataset = element.dataset
        }
      }
      return safeExecute(this.$taroPath, 'onShareAppMessage', options)
    }
  }
  if (component.onShareTimeline ||
      component.prototype?.onShareTimeline ||
      component.enableShareTimeline) {
    config.onShareTimeline = function () {
      return safeExecute(this.$taroPath, 'onShareTimeline')
    }
  }

  config.eh = eventHandler

  if (!isUndefined(data)) {
    config.data = data
  }

  hooks.modifyPageObject?.(config)

  return config
}

export function createComponentConfig (component: React.ComponentClass, componentName?: string, data?: Record<string, unknown>) {
  const id = componentName ?? `taro_component_${pageId()}`
  let componentElement: TaroRootElement | null = null

  const config: any = {
    attached () {
      perf.start(PAGE_INIT)
      const path = getPath(id, { id: this.getPageId?.() || pageId() })
      Current.app!.mount!(component, path, () => {
        componentElement = document.getElementById<TaroRootElement>(path)
        ensure(componentElement !== null, '没有找到组件实例。')
        this.$taroInstances = instances.get(path)
        safeExecute(path, ON_LOAD)
        if (process.env.TARO_ENV !== 'h5') {
          componentElement.ctx = this
          componentElement.performUpdate(true)
        }
      })
    },
    detached () {
      const path = getPath(id, { id: this.getPageId() })
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
  const lifeCycles = isCustomWrapper
    ? {
      attached () {
        const componentId = this.data.i?.sid
        if (isString(componentId)) {
          customWrapperCache.set(componentId, this)
        }
      },
      detached () {
        const componentId = this.data.i?.sid
        if (isString(componentId)) {
          customWrapperCache.delete(componentId)
        }
      }
    }
    : EMPTY_OBJ

  return {
    properties: {
      i: {
        type: Object,
        value: {
          [Shortcuts.NodeName]: VIEW
        }
      },
      l: {
        type: String,
        value: ''
      }
    },
    options: {
      addGlobalClass: true,
      virtualHost: !isCustomWrapper
    },
    methods: {
      eh: eventHandler
    },
    ...lifeCycles
  }
}
