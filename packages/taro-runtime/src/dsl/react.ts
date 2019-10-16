import { Current } from '../current'
import { ComponentClass, Component } from 'react'

interface Props {
  children?: unknown;
}

export function connectReactPage (
  h: Function, // 为了支持 React 和 React-like
  derivedIDfromCompiler: string,
  PureComponent: ComponentClass
) {
  return (component: Component) => {
    // 只有传入 props 产生变化才触发 render
    class PageContainer extends PureComponent {
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
          h(PageContainer, props, props.children)
        )
        : null
    }
  }
}
