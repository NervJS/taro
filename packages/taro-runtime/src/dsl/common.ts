import { CommonEvent } from '@tarojs/components'
import * as React from 'react'
import { isFunction, EMPTY_OBJ } from '@tarojs/shared'
import { createEvent } from '../dom/event'
import { Current } from '../current'
import { document } from '../bom/document'
import { TaroRootElement } from '../dom/root'
import { MpInstance } from '../render'
import { Instance, PageInstance, PageProps } from './instance'
// import { updateVuePages } from '../dsl/vue'
import { incrementId } from '../utils'

const instances = new Map<string, Instance>()

export function injectPageInstance (inst: Instance<PageProps>) {
  const id = inst.props && inst.props.tid
  if (id != null) {
    instances.set(id, inst)
  }
}

const pageId = incrementId()

export function createPageConfig (component: React.ComponentClass) {
  const id = `taro_page_${pageId()}`
  // 把复杂的 JavaScript 对象挂载在小程序实例上可能会触发意料之外的错误
  let page: TaroRootElement
  let instance: Instance = EMPTY_OBJ
  const isReact = process.env.framework !== 'vue'

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

      // if (isVue) {
      //   updateVuePages(render)
      // }
    },
    onUnload () {
      Current.app!.unmount(id, () => {
        page.ctx = null
      })

      // if (isVue) {
      //   updateVuePages(() => (page.ctx = null))
      // }
    },
    onShow () {
      safeExecute(isReact ? instance.componentDidShow : instance.onShow)
    },
    onHide () {
      safeExecute(isReact ? instance.componentDidHide : instance.onHide)
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
