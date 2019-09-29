import { eventSource, createEvent } from 'src/dom/event'
import { TaroElement } from 'src/dom/element'
import { isUndefined } from 'src/utils/is'
import { Current } from 'src/current'
import { document } from 'src/bom/document'
import { TaroRootElement } from 'src/dom/root'
import { ComponentClass, Component } from 'react'

interface Props {
  children?: unknown;
}

export function wrapReactPageComponent (h: Function, derivedIDfromCompiler: string, component: Component, PureComponent: ComponentClass) {
  // 只有传入 props 产生变化才触发 render
  class Comp extends PureComponent {
    public render () {
      return h(component, this.props, this.props.children)
    }
  }

  return (props: Props) => {
    return Current.pages.has(derivedIDfromCompiler)
      ? h(
        'root', {
          id: derivedIDfromCompiler
        },
        h(Comp, props, props.children)
      )
      : null
  }
}

export function createPageConfig (derivedIDfromCompiler: string) {
  // 把 DOM 挂载在小程序实例上可能会有意料之外的错误
  let page: TaroRootElement

  const config = {
    eh (event) {
      const node = eventSource.get(event.currentTarget.id) as TaroElement
      if (isUndefined(node)) {
        return
      }
      node.dispatchEvent(createEvent(event))
    },
    onLoad () {
      Current.pages.add(derivedIDfromCompiler)
      const render = () => {
        page = document.getElementById(derivedIDfromCompiler)! as TaroRootElement
        if (isUndefined(page)) {
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
      page.ctx = null
    }
  }

  return config
}
