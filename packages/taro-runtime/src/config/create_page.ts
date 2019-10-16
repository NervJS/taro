import { CommonEvent } from '@tarojs/components'
import { isFunction, EMPTY_OBJ } from '@tarojs/shared'
import { createEvent } from '../dom/event'
import { Current } from '../current'
import { document } from '../bom/document'
import { TaroRootElement } from '../dom/root'
import { MpInstance } from '../render'
import { Instance } from './instance'
import { updateVuePages } from '../dsl/vue'

const instances = new Map<string, Instance>()

export function injectPageInstance (derivedIDfromCompiler: string, inst: Instance) {
  instances.set(derivedIDfromCompiler, inst)
}

export function createPageConfig (derivedIDfromCompiler: string, framework = 'react') {
  // 把复杂的 JavaScript 对象挂载在小程序实例上可能会触发意料之外的错误
  let page: TaroRootElement
  let instance: Instance
  const isReact = framework === 'react'
  const isVue = framework === 'vue'

  function safeExecute (func?: Function, ...args: unknown[]) {
    if (instance != null && isFunction(func)) {
      func.apply(instance, args)
    }
  }

  const config = {
    eh (event: CommonEvent) {
      const node = document.getElementById(event.currentTarget.id)
      if (node != null) {
        node.dispatchEvent(createEvent(event))
      }
    },
    onLoad (this: MpInstance) {
      Current.pages.add(derivedIDfromCompiler)
      instance = instances.get(derivedIDfromCompiler)! || EMPTY_OBJ

      const render = () => {
        page = document.getElementById(derivedIDfromCompiler) as TaroRootElement
        if (page === null) {
          return
        }

        page.ctx = this
        page.performUpdate()
      }

      if (isReact) {
        Current.app!.forceUpdate(render)
      }

      if (isVue) {
        updateVuePages(render)
      }
    },
    onUnload () {
      Current.pages.delete(derivedIDfromCompiler)
      instances.delete(derivedIDfromCompiler)

      if (isReact) {
        Current.app!.forceUpdate(() => (page.ctx = null))
      }

      if (isVue) {
        updateVuePages(() => (page.ctx = null))
      }
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
