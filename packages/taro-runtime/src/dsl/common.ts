import { CommonEvent } from '@tarojs/components'
import * as React from 'react'
import { isFunction, EMPTY_OBJ } from '@tarojs/shared'
import { createEvent } from '../dom/event'
import { Current } from '../current'
import { document } from '../bom/document'
import { TaroRootElement } from '../dom/root'
import { MpInstance } from '../render'
import { Instance, PageInstance, PageProps } from './instance'
import { incrementId } from '../utils'

const instances = new Map<string, Instance>()

export function injectPageInstance (inst: Instance<PageProps>) {
  const id = inst.tid != null ? inst.tid : inst.props.tid
  if (id != null) {
    instances.set(id, inst)
  }
}

const pageId = incrementId()

export function createPageConfig (component: React.ComponentClass) {
  const id = `taro_page_${pageId()}`
  // 小程序 Page 构造器是一个傲娇小公主，不能把复杂的对象挂载到参数上
  let page: TaroRootElement
  let instance: Instance = EMPTY_OBJ
  const isReact = process.env.framework !== 'vue' // isReact means all kind of react-like library

  function safeExecute (func?: Function, ...args: unknown[]) {
    if (instance != null && isFunction(func)) {
      func.apply(instance, args)
    }
  }

  const config: PageInstance = {
    eh (event: CommonEvent) {
      const node = document.getElementById(event.currentTarget.id)
      if (node != null) {
        node.dispatchEvent(createEvent(event))
      }
    },
    onLoad (this: MpInstance) {
      Current.app!.mount(component, id, () => {
        page = document.getElementById(id) as TaroRootElement
        instance = instances.get(id) || EMPTY_OBJ

        if (page === null) {
          return
        }

        page.ctx = this
        page.performUpdate()
      })
    },
    onUnload () {
      Current.app!.unmount(id, () => {
        page.ctx = null
      })
    },
    onShow () {
      safeExecute(isReact ? instance.componentDidShow : instance.$options.onShow)
    },
    onHide () {
      safeExecute(isReact ? instance.componentDidHide : instance.$options.onHide)
    },
    onPullDownRefresh () {
      safeExecute(instance.onPullDownRefresh)
    },
    onReachBottom () {
      safeExecute(instance.onReachBottom)
    },
    onPageScroll (options: unknown) {
      safeExecute(instance.onPageScroll, options)
    },
    onShareAppMessage (options: unknown) {
      safeExecute(instance.onShareAppMessage, options)
    },
    onResize (options: unknown) {
      safeExecute(instance.onResize, options)
    },
    onTabItemTap (options: unknown) {
      safeExecute(instance.onTabItemTap, options)
    },
    onTitleClick () {
      safeExecute(instance.onTitleClick)
    },
    onOptionMenuClick () {
      safeExecute(instance.onOptionMenuClick)
    },
    onPopMenuClick () {
      safeExecute(instance.onPopMenuClick)
    },
    onPullIntercept () {
      safeExecute(instance.onPullIntercept)
    }
  }

  return config
}

export function createComponentConfig () {
  return {
    eh (event: CommonEvent) {
      const node = document.getElementById(event.currentTarget.id)
      if (node != null) {
        node.dispatchEvent(createEvent(event))
      }
    }
  }
}
