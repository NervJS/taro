import { createEvent } from '../dom/event'
import { Current } from '../current'
import { document } from '../bom/document'
import { TaroRootElement } from '../dom/root'
import { ComponentClass, Component } from 'react'
import { MpInstance } from '../render'
import { CommonEvent } from '@tarojs/components'
import { Instance } from './instance'
import { isFunction } from '@tarojs/shared'

interface Props {
  children?: unknown;
}

const instances = new Map<string, Instance>()

export function injectPageInstance (derivedIDfromCompiler: string, inst: Instance) {
  instances.set(derivedIDfromCompiler, inst)
}

export function connectReactPage (
  h: Function,
  derivedIDfromCompiler: string,
  PureComponent: ComponentClass
) {
  return (component: Component) => {
    // 只有传入 props 产生变化才触发 render
    class Comp extends PureComponent {
      public render () {
        return h(component, this.props, this.props.children)
      }
    }

    return (props: Props) => {
      return Current.pages.has(derivedIDfromCompiler)
        ? h(
          'root',
          {
            id: derivedIDfromCompiler
          },
          h(Comp, props, props.children)
        )
        : null
    }
  }
}

export function createPageConfig (derivedIDfromCompiler: string) {
  // 把复杂的 JavaScript 对象挂载在小程序实例上可能会触发意料之外的错误
  let page: TaroRootElement
  let instance: Instance

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
      const render = () => {
        page = document.getElementById(derivedIDfromCompiler) as TaroRootElement
        if (page === null) {
          return
        }

        Current.root = page
        page.ctx = this
        page.performUpdate()
        instance = instances.get(derivedIDfromCompiler)! || {}
      }

      Current.app!.forceUpdate(render)
    },
    onUnload () {
      Current.pages.delete(derivedIDfromCompiler)
      instances.delete(derivedIDfromCompiler)
      Current.app!.forceUpdate(() => (page.ctx = null))
    },
    onShow () {
      safeExecute(instance.componentDidShow)
      safeExecute(instance.onShow)
    },
    onHide () {
      safeExecute(instance.componentDidShow)
      safeExecute(instance.onHide)
    },
    onPullDownRefresh () {
      safeExecute(instance.onPullDownRefresh)
    },
    onReachBottom () {
      safeExecute(instance.onReachBottom)
    },
    onPageScroll (options) {
      safeExecute(instance.onPageScroll, options)
    },
    onShareAppMessage (options) {
      safeExecute(instance.onShareAppMessage, options)
    },
    onResize (options) {
      safeExecute(instance.onResize, options)
    },
    onTabItemTap (options) {
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
