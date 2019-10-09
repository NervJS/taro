import { createEvent } from '../dom/event'
import { Current } from '../current'
import { document } from '../bom/document'
import { TaroRootElement } from '../dom/root'
import { ComponentClass, Component } from 'react'
import { MpInstance } from '../render'
import { CommonEvent } from '@tarojs/components'

interface Props {
  children?: unknown;
}

export function wrapReactPageComponent (
  h: Function,
  derivedIDfromCompiler: string,
  component: Component,
  PureComponent: ComponentClass
) {
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

export function createPageConfig (derivedIDfromCompiler: string) {
  // 把复杂的 JavaScript 对象挂载在小程序实例上可能会触发意料之外的错误
  let page: TaroRootElement

  const config = {
    eh (event: CommonEvent) {
      const node = document.getElementById(event.currentTarget.id)
      if (node !== null) {
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
      }

      Current.app!.forceUpdate(render)
    },
    onUnload () {
      Current.pages.delete(derivedIDfromCompiler)
      Current.app!.forceUpdate(() => (page.ctx = null))
    }
  }

  return config
}
