import * as React from 'react'
import { isFunction, EMPTY_OBJ, ensure, Shortcuts } from '@tarojs/shared'
import { eventHandler } from '../dom/event'
import { Current } from '../current'
import { document } from '../bom/document'
import { TaroRootElement } from '../dom/root'
import { MpInstance } from '../render'
import { Instance, PageInstance, PageProps } from './instance'
import { incrementId } from '../utils'

const instances = new Map<string, Instance>()

export function injectPageInstance (inst: Instance<PageProps>, id: string) {
  instances.set(id, inst)
}

export function getPageInstance (id: string) {
  return instances.get(id)
}

function addLeadingSlash (path: string) {
  return path.charAt(0) === '/' ? path : '/' + path
}

const pageId = incrementId()

export function createPageConfig (component: React.ComponentClass) {
  const id = `taro_page_${pageId()}`
  // 小程序 Page 构造器是一个傲娇小公主，不能把复杂的对象挂载到参数上
  let page: TaroRootElement | null = null
  let instance: Instance = EMPTY_OBJ
  const isReact = process.env.FRAMEWORK !== 'vue' // isReact means all kind of react-like library

  function safeExecute (lifecycle: keyof PageInstance, ...args: unknown[]) {
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

    func.apply(instance, args)
  }

  const config: PageInstance = {
    onLoad (this: MpInstance, options) {
      Current.router = {
        params: options,
        path: addLeadingSlash(this.route || this.__route__)
      }

      Current.app!.mount(component, id, () => {
        page = document.getElementById<TaroRootElement>(id)
        instance = instances.get(id) || EMPTY_OBJ

        ensure(page !== null, '没有找到页面实例。')
        safeExecute('onLoad', options)
        page.ctx = this
        page.performUpdate()
      })
    },
    onUnload () {
      Current.router = null

      Current.app!.unmount(id, () => {
        page!.ctx = null
      })
    },
    onShow () {
      safeExecute('onShow')
    },
    onHide () {
      safeExecute('onHide')
    },
    onPullDownRefresh () {
      safeExecute('onPullDownRefresh')
    },
    onReachBottom () {
      safeExecute('onReachBottom')
    },
    onPageScroll (options: unknown) {
      safeExecute('onPageScroll', options)
    },
    onShareAppMessage (options: unknown) {
      safeExecute('onShareAppMessage', options)
    },
    onResize (options: unknown) {
      safeExecute('onResize', options)
    },
    onTabItemTap (options: unknown) {
      safeExecute('onTabItemTap', options)
    },
    onTitleClick () {
      safeExecute('onTitleClick')
    },
    onOptionMenuClick () {
      safeExecute('onOptionMenuClick')
    },
    onPopMenuClick () {
      safeExecute('onPopMenuClick')
    },
    onPullIntercept () {
      safeExecute('onPullIntercept')
    }
  }

  config.eh = eventHandler

  return config
}

export function createComponentConfig () {
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
