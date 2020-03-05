/* eslint-disable dot-notation */
import * as React from 'react'
import { isFunction, EMPTY_OBJ, ensure, Shortcuts, isUndefined } from '@tarojs/shared'
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

function safeExecute (instance: Instance, lifecycle: keyof PageInstance, ...args: unknown[]) {
  const isReact = process.env.FRAMEWORK !== 'vue' // isReact means all kind of react-like library

  if (instance == null) {
    return
  }

  if (isReact) {
    if (lifecycle === 'onShow') {
      lifecycle = 'componentDidShow'
    } else if (lifecycle === 'onHide') {
      lifecycle = 'componentDidHide'
    }
  }

  const func = isReact ? instance[lifecycle] : instance.$options[lifecycle]
  if (!isFunction(func)) {
    return
  }

  return func.apply(instance, args)
}

export function createPageConfig (component: React.ComponentClass, pageName?: string, data?: Record<string, unknown>) {
  const id = pageName ?? `taro_page_${pageId()}`
  // 小程序 Page 构造器是一个傲娇小公主，不能把复杂的对象挂载到参数上
  let pageElement: TaroRootElement | null = null
  let instance: Instance = instances.get(id)!

  const config: PageInstance = {
    onLoad (this: MpInstance, options, cb?: Function) {
      Current.router = {
        params: options,
        path: addLeadingSlash(this.route || this.__route__)
      }

      perf.start(PAGE_INIT)

      Current.app!.mount(component, id, () => {
        pageElement = document.getElementById<TaroRootElement>(id)
        instance = instances.get(id) || EMPTY_OBJ

        ensure(pageElement !== null, '没有找到页面实例。')
        safeExecute(instance, 'onLoad', options)
        if (!isBrowser) {
          pageElement.ctx = this
          pageElement.performUpdate(true, cb)
        }
      })
    },
    onUnload () {
      Current.app!.unmount(id, () => {
        if (pageElement) {
          pageElement.ctx = null
        }
      })
    },
    onShow () {
      Current.page = this as any
      safeExecute(instance, 'onShow')
    },
    onHide () {
      Current.page = null
      Current.router = null
      safeExecute(instance, 'onHide')
    },
    onPullDownRefresh () {
      return safeExecute(instance, 'onPullDownRefresh')
    },
    onReachBottom () {
      return safeExecute(instance, 'onReachBottom')
    },
    onPageScroll (options) {
      return safeExecute(instance, 'onPageScroll', options)
    },
    onShareAppMessage (options) {
      const id = options.target.id
      const element = document.getElementById(id)
      if (element) {
        options.target.dataset = element.dataset
      }
      return safeExecute(instance, 'onShareAppMessage', options)
    },
    onResize (options) {
      return safeExecute(instance, 'onResize', options)
    },
    onTabItemTap (options) {
      return safeExecute(instance, 'onTabItemTap', options)
    },
    onTitleClick () {
      return safeExecute(instance, 'onTitleClick')
    },
    onOptionMenuClick () {
      return safeExecute(instance, 'onOptionMenuClick')
    },
    onPopMenuClick () {
      return safeExecute(instance, 'onPopMenuClick')
    },
    onPullIntercept () {
      return safeExecute(instance, 'onPullIntercept')
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
  let instance: Instance = instances.get(id)!

  const config: any = {
    attached () {
      perf.start(PAGE_INIT)
      Current.app!.mount(component, id, () => {
        componentElement = document.getElementById<TaroRootElement>(id)
        instance = instances.get(id) || EMPTY_OBJ
        ensure(componentElement !== null, '没有找到组件实例。')
        safeExecute(instance, 'onLoad')
        if (!isBrowser) {
          componentElement.ctx = this
          componentElement.performUpdate(true)
        }
      })
    },
    detached () {
      Current.app!.unmount(id, () => {
        if (componentElement) {
          componentElement.ctx = null
        }
      })
    },
    pageLifetimes: {
      show () {
        safeExecute(instance, 'onShow')
      },
      hide () {
        safeExecute(instance, 'onHide')
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
    options: {
      addGlobalClass: true
    },
    methods: {
      eh: eventHandler
    }
  }
}
