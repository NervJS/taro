/* eslint-disable dot-notation */
import { isFunction, EMPTY_OBJ, ensure, Shortcuts, isUndefined, isArray, warn } from '@tarojs/shared'
import { eventHandler } from '../dom/event'
import { Current } from '../current'
import { document } from '../bom/document'
import { TaroRootElement } from '../dom/root'
import { MpInstance } from '../hydrate'
import { Instance, PageInstance, PageProps } from './instance'
import { incrementId } from '../utils'
import { perf } from '../perf'
import { PAGE_INIT } from '../constants'
import { isBrowser } from '../env'
import { eventCenter } from '../emitter/emitter'
import { raf } from '../bom/raf'
import { CurrentReconciler } from '../reconciler'

const instances = new Map<string, Instance>()

export function injectPageInstance (inst: Instance<PageProps>, id: string) {
  instances.set(id, inst)
}

export function getPageInstance (id: string) {
  return instances.get(id)
}

function addLeadingSlash (path?: string) {
  if (path == null) {
    return ''
  }
  return path.charAt(0) === '/' ? path : '/' + path
}

const pageId = incrementId()

function safeExecute (path: string, lifecycle: keyof PageInstance, ...args: unknown[]) {
  const instance = instances.get(path)

  if (instance == null) {
    return
  }

  const func = CurrentReconciler.getLifecyle(instance, lifecycle)

  if (isArray(func)) {
    for (let i = 0; i < func.length; i++) {
      func[i].apply(instance, args)
    }
    return
  }

  if (!isFunction(func)) {
    return
  }

  return func.apply(instance, args)
}

function stringify (obj?: Record<string, unknown>) {
  if (obj == null) {
    return ''
  }
  const path = Object.keys(obj).map((key) => {
    return key + '=' + obj[key]
  }).join('&')
  return !path ? path : '?' + path
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

export function createPageConfig (component: React.ComponentClass, pageName?: string, data?: Record<string, unknown>) {
  const id = pageName ?? `taro_page_${pageId()}`
  // 小程序 Page 构造器是一个傲娇小公主，不能把复杂的对象挂载到参数上
  let pageElement: TaroRootElement | null = null

  const config: PageInstance = {
    onLoad (this: MpInstance, options, cb?: Function) {
      perf.start(PAGE_INIT)

      const path = getPath(id, options)

      Current.router = {
        params: options,
        path: addLeadingSlash(this.route || this.__route__),
        onReady: getOnReadyEventKey(id),
        onShow: getOnShowEventKey(id),
        onHide: getOnHideEventKey(id)
      }

      Current.app!.mount!(component, path, () => {
        pageElement = document.getElementById<TaroRootElement>(path)

        ensure(pageElement !== null, '没有找到页面实例。')
        safeExecute(path, 'onLoad', options)
        if (!isBrowser) {
          pageElement.ctx = this
          pageElement.performUpdate(true, cb)
        }
      })
    },
    onReady () {
      const path = getPath(id, this.options)

      raf(() => {
        eventCenter.trigger(getOnReadyEventKey(id))
      })

      safeExecute(path, 'onReady')
    },
    onUnload () {
      const path = getPath(id, this.options)
      Current.app!.unmount!(path, () => {
        instances.delete(path)
        if (pageElement) {
          pageElement.ctx = null
        }
      })
    },
    onShow () {
      Current.page = this as any
      const path = getPath(id, this.options)

      Current.router = {
        params: this.options,
        path: addLeadingSlash(this.route || this.__route__),
        onReady: getOnReadyEventKey(id),
        onShow: getOnShowEventKey(id),
        onHide: getOnHideEventKey(id)
      }

      raf(() => {
        eventCenter.trigger(getOnShowEventKey(id))
      })

      safeExecute(path, 'onShow')
    },
    onHide () {
      Current.page = null
      Current.router = null
      const path = getPath(id, this.options)

      raf(() => {
        eventCenter.trigger(getOnHideEventKey(id))
      })

      safeExecute(path, 'onHide')
    },
    onPullDownRefresh () {
      const path = getPath(id, this.options)
      return safeExecute(path, 'onPullDownRefresh')
    },
    onReachBottom () {
      const path = getPath(id, this.options)
      return safeExecute(path, 'onReachBottom')
    },
    onPageScroll (options) {
      const path = getPath(id, this.options)
      return safeExecute(path, 'onPageScroll', options)
    },
    onShareAppMessage (options) {
      const target = options.target
      if (target != null) {
        const id = target.id
        const element = document.getElementById(id)
        if (element != null) {
          options.target!.dataset = element.dataset
        }
      }
      const path = getPath(id, this.options)
      return safeExecute(path, 'onShareAppMessage', options)
    },
    onResize (options) {
      const path = getPath(id, this.options)
      return safeExecute(path, 'onResize', options)
    },
    onTabItemTap (options) {
      const path = getPath(id, this.options)
      return safeExecute(path, 'onTabItemTap', options)
    },
    onTitleClick () {
      const path = getPath(id, this.options)
      return safeExecute(path, 'onTitleClick')
    },
    onOptionMenuClick () {
      const path = getPath(id, this.options)
      return safeExecute(path, 'onOptionMenuClick')
    },
    onPopMenuClick () {
      const path = getPath(id, this.options)
      return safeExecute(path, 'onPopMenuClick')
    },
    onPullIntercept () {
      const path = getPath(id, this.options)
      return safeExecute(path, 'onPullIntercept')
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
      Current.app!.mount!(component, id, () => {
        componentElement = document.getElementById<TaroRootElement>(id)
        ensure(componentElement !== null, '没有找到组件实例。')
        safeExecute(id, 'onLoad')
        if (!isBrowser) {
          componentElement.ctx = this
          componentElement.performUpdate(true)
        }
      })
    },
    detached () {
      Current.app!.unmount!(id, () => {
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

export function createRecursiveComponentConfig () {
  return {
    properties: {
      i: {
        type: Object,
        value: {
          [Shortcuts.NodeName]: 'view'
        }
      }
    },
    observers: {
      i (val: Record<string, unknown>) {
        warn(
          val[Shortcuts.NodeName] === '#text',
          `请在此元素外再套一层非 Text 元素：<text>${val[Shortcuts.Text]}</text>，详情：https://github.com/NervJS/taro/issues/6054`
        )
      }
    },
    options: {
      addGlobalClass: true
    },
    methods: {
      eh: eventHandler
    }
  }
}
