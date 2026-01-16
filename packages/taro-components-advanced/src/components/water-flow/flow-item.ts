import { View } from '@tarojs/components'
import {
  type CSSProperties,
  type PropsWithChildren,
  createContext,
  createElement,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
} from 'react'

import { Node, NodeEvents } from './node'
import { useMemoizedFn } from './use-memoized-fn'
import { useObservedAttr } from './use-observed-attr'
import { isWeb } from './utils'

import type { FlowItemContainerProps } from './interface'

const FlowItemContext = createContext<{ node: Node }>(Object.create(null))
export const useFlowItemPositioner = () => {
  const nodeModel = useContext(FlowItemContext).node
  const width$ = useObservedAttr(nodeModel, 'width')
  const height$ = useObservedAttr(nodeModel, 'height')
  const top$ = useObservedAttr(nodeModel, 'top')
  const scrollTop$ = useObservedAttr(nodeModel, 'scrollTop')

  return {
    resize: useMemoizedFn(() => {
      if (!isWeb()) {
        nodeModel.pub(NodeEvents.Resize)
      }
    }),
    top: top$,
    scrollTop: scrollTop$,
    width: width$,
    height: height$,
  }
}

export function FlowItemContainer({
  children,
  ...props
}: PropsWithChildren<FlowItemContainerProps>) {
  const { node } = props
  const layouted$ = useObservedAttr(node, 'layouted')
  const top$ = useObservedAttr(node, 'top')
  const height$ = useObservedAttr(node, 'height')
  const refFlowItem = useRef<HTMLElement>()

  const itemStyle: CSSProperties = useMemo(() => {
    const baseStyle: CSSProperties = {
      width: '100%',
      minHeight: node.section.defaultSize,
    }
    if (!layouted$) {
      return baseStyle
    }
    Reflect.deleteProperty(baseStyle, 'minHeight')
    return {
      ...baseStyle,
      height: height$,
      transition: 'transform 20ms cubic-bezier(0.075, 0.82, 0.165, 1)',
      willChange: 'transform',
      position: 'absolute',
      top: 0,
      left: 0,
      transform: `translate3d(0px, ${top$}px, 0px)`,
    }
  }, [top$, layouted$, height$])

  useEffect(() => {
    let observer: ResizeObserver
    if (isWeb() && typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(() => {
        node.pub(NodeEvents.Resize)
      })
      observer.observe(refFlowItem.current!)
    }
    return () => {
      if (observer) {
        observer.disconnect()
      }
    }
  }, [node])

  useLayoutEffect(() => {
    node.measure()
  }, [node])

  return createElement(
    View,
    { style: itemStyle, key: node.id },
    createElement(
      View,
      { id: node.id, ref: refFlowItem },
      createElement(FlowItemContext.Provider, { value: { node } }, children)
    )
  )
}

export function FlowItem(props: PropsWithChildren) {
  return props.children
}
