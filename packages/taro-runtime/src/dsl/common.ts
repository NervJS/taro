/* eslint-disable dot-notation */
import { isFunction, EMPTY_OBJ, ensure, Shortcuts, isUndefined, isArray } from '@tarojs/shared'
import container from '../container'
import SERVICE_IDENTIFIER from '../constants/identifiers'
import { eventHandler } from '../dom/event'
import { Current } from '../current'
import { document } from '../bom/document'
import { incrementId } from '../utils'
import { perf } from '../perf'
import { PAGE_INIT } from '../constants'
import { isBrowser } from '../env'
import { eventCenter } from '../emitter/emitter'
import { raf } from '../bom/raf'

import type { PageConfig } from '@tarojs/taro'
import type { Instance, PageInstance, PageProps } from './instance'
import type { Func, IHooks, MpInstance } from '../interface'
import type { TaroRootElement } from '../dom/root'

const instances = new Map<string, Instance>()
const pageId = incrementId()
const hooks = container.get<IHooks>(SERVICE_IDENTIFIER.Hooks)

export function injectPageInstance (inst: Instance<PageProps>, id: string) {
  hooks.mergePageInstance?.(instances.get(id), inst)
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

export function safeExecute (path: string, lifecycle: keyof PageInstance, ...args: unknown[]) {
  const instance = instances.get(path)

  if (instance == null) {
    return
  }

  const func = hooks.getLifecycle(instance, lifecycle)

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
  let path = id
  if (!isBrowser) {
    path = id + stringify(options)
  }
  return path
}

export function getOnReadyEventKey (path: string) {
  return path + '.' + 'onReady'
}

export function getOnShowEventKey (path: string) {
  return path + '.' + 'onShow'
}

export function getOnHideEventKey (path: string) {
  return path + '.' + 'onHide'
}

export function createPageConfig (component: any, pageName?: string, data?: Record<string, unknown>, pageConfig?: PageConfig) {
  const id = pageName ?? `taro_page_${pageId()}`
  // 小程序 Page 构造器是一个傲娇小公主，不能把复杂的对象挂载到参数上
  let pageElement: TaroRootElement | null = null

  let unmounting = false
  let prepareMountList: (() => void)[] = []

  const config: PageInstance = {
    onLoad (this: MpInstance, options, cb?: Func) {
      perf.start(PAGE_INIT)

      Current.page = this as any
      this.config = pageConfig || {}
      options.$taroTimestamp = Date.now()

      // this.$taroPath 是页面唯一标识，不可变，因此页面参数 options 也不可变
      this.$taroPath = getPath(id, options)
      // this.$taroParams 作为暴露给开发者的页面参数对象，可以被随意修改
      if (this.$taroParams == null) {
        this.$taroParams = Object.assign({}, options)
      }

      const router = isBrowser ? this.$taroPath : this.route || this.__route__
      Current.router = {
        params: this.$taroParams,
        path: addLeadingSlash(router),
        onReady: getOnReadyEventKey(id),
        onShow: getOnShowEventKey(id),
        onHide: getOnHideEventKey(id)
      }

      const mount = () => {
        Current.app!.mount!(component, this.$taroPath, () => {
          pageElement = document.getElementById<TaroRootElement>(this.$taroPath)

          ensure(pageElement !== null, '没有找到页面实例。')
          safeExecute(this.$taroPath, 'onLoad', this.$taroParams)
          if (!isBrowser) {
            pageElement.ctx = this
            pageElement.performUpdate(true, cb)
          }
        })
      }
      if (unmounting) {
        prepareMountList.push(mount)
      } else {
        mount()
      }
    },
    onReady () {
      raf(() => {
        eventCenter.trigger(getOnReadyEventKey(id))
      })

      safeExecute(this.$taroPath, 'onReady')
      this.onReady.called = true
    },
    onUnload () {
      unmounting = true
      Current.app!.unmount!(this.$taroPath, () => {
        unmounting = false
        instances.delete(this.$taroPath)
        if (pageElement) {
          pageElement.ctx = null
        }
        if (prepareMountList.length) {
          prepareMountList.forEach(fn => fn())
          prepareMountList = []
        }
      })
    },
    onShow () {
      Current.page = this as any
      this.config = pageConfig || {}
      const router = isBrowser ? this.$taroPath : this.route || this.__route__
      Current.router = {
        params: this.$taroParams,
        path: addLeadingSlash(router),
        onReady: getOnReadyEventKey(id),
        onShow: getOnShowEventKey(id),
        onHide: getOnHideEventKey(id)
      }

      raf(() => {
        eventCenter.trigger(getOnShowEventKey(id))
      })

      safeExecute(this.$taroPath, 'onShow')
    },
    onHide () {
      Current.page = null
      Current.router = null
      safeExecute(this.$taroPath, 'onHide')
      eventCenter.trigger(getOnHideEventKey(id))
    },
    onPullDownRefresh () {
      return safeExecute(this.$taroPath, 'onPullDownRefresh')
    },
    onReachBottom () {
      return safeExecute(this.$taroPath, 'onReachBottom')
    },
    onPageScroll (options) {
      return safeExecute(this.$taroPath, 'onPageScroll', options)
    },
    onResize (options) {
      return safeExecute(this.$taroPath, 'onResize', options)
    },
    onTabItemTap (options) {
      return safeExecute(this.$taroPath, 'onTabItemTap', options)
    },
    onTitleClick () {
      return safeExecute(this.$taroPath, 'onTitleClick')
    },
    onOptionMenuClick () {
      return safeExecute(this.$taroPath, 'onOptionMenuClick')
    },
    onPopMenuClick () {
      return safeExecute(this.$taroPath, 'onPopMenuClick')
    },
    onPullIntercept () {
      return safeExecute(this.$taroPath, 'onPullIntercept')
    },
    onAddToFavorites () {
      return safeExecute(this.$taroPath, 'onAddToFavorites')
    }
  }

  // onShareAppMessage 和 onShareTimeline 一样，会影响小程序右上方按钮的选项，因此不能默认注册。
  if (component.onShareAppMessage ||
      component.prototype?.onShareAppMessage ||
      component.enableShareAppMessage) {
    config.onShareAppMessage = function (options) {
      const target = options?.target
      if (target != null) {
        const id = target.id
        const element = document.getElementById(id)
        if (element != null) {
          options.target!.dataset = element.dataset
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

  if (isBrowser) {
    config.path = id
  }

  return config
}

export function createComponentConfig (component: React.ComponentClass, componentName?: string, data?: Record<string, unknown>) {
  const id = componentName ?? `taro_component_${pageId()}`
  let componentElement: TaroRootElement | null = null

  const config: any = {
    attached () {
      perf.start(PAGE_INIT)
      const path = getPath(id, { id: this.getPageId() })
      Current.app!.mount!(component, path, () => {
        componentElement = document.getElementById<TaroRootElement>(path)
        ensure(componentElement !== null, '没有找到组件实例。')
        safeExecute(path, 'onLoad')
        if (!isBrowser) {
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
    pageLifetimes: {
      show () {
        safeExecute(id, 'onShow')
      },
      hide () {
        safeExecute(id, 'onHide')
      }
    },
    methods: {
      eh: eventHandler
    }
  }
  if (!isUndefined(data)) {
    config.data = data
  }

  config['options'] = component?.['options'] ?? EMPTY_OBJ
  config['externalClasses'] = component?.['externalClasses'] ?? EMPTY_OBJ
  config['behaviors'] = component?.['behaviors'] ?? EMPTY_OBJ
  return config
}

export function createRecursiveComponentConfig (componentName?: string) {
  return {
    properties: {
      i: {
        type: Object,
        value: {
          [Shortcuts.NodeName]: 'view'
        }
      },
      l: {
        type: String,
        value: ''
      }
    },
    options: {
      addGlobalClass: true,
      virtualHost: componentName !== 'custom-wrapper'
    },
    methods: {
      eh: eventHandler
    }
  }
}
