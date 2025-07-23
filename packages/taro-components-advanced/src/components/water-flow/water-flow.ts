import { BaseEventOrig, ScrollView, ScrollViewProps, View } from '@tarojs/components'
import { nextTick } from '@tarojs/taro'
import {
  Children,
  cloneElement,
  createElement,
  PropsWithChildren,
  ReactElement,
  useEffect,
  useId,
  useMemo,
  useRef,
} from 'react'

import { debounce, getScrollViewContextNode } from '../../utils'
import { _FlowSectionProps } from './flow-section'
import { Root, RootEvents } from './root'
import { Section } from './section'
import { useMemoizedFn } from './use-memoized-fn'
import { useObservedAttr } from './use-observed-attr'
import { getSysInfo } from './utils'

import type { ScrollDirection, WaterFlowProps } from './interface'

getSysInfo()

export function WaterFlow({ children, ...props }: PropsWithChildren<WaterFlowProps>) {
  const {
    id,
    style = {},
    className,
    cacheCount = 1,
    onScrollToUpper,
    onScrollToLower,
    upperThresholdCount,
    lowerThresholdCount,
    scrollIntoView,
    ...rest
  } = props
  const defaultId = useId().replace(/:/g, '')
  /**
   * 初始化数据模型
   */
  const root = useMemo(() => {
    return new Root({
      id: id ?? defaultId,
      cacheCount,
      upperThresholdCount,
      lowerThresholdCount,
    })
  }, [id, cacheCount, upperThresholdCount, lowerThresholdCount])
  const isScrolling$ = useObservedAttr(root, 'isScrolling')
  const scrollHeight$ = useObservedAttr(root, 'scrollHeight')
  const renderRange$ = useObservedAttr(root, 'renderRange')
  const refEventOrig = useRef<BaseEventOrig>()

  /**
   * 滚动事件
   */
  const handleScroll = useMemoizedFn((ev: BaseEventOrig<ScrollViewProps.onScrollDetail>) => {
    refEventOrig.current = ev
    root.sections.forEach((section) => section.getNodeRenderRange())
    const { scrollTop } = ev.detail
    // 确定滚动方向
    const scrollDirection: ScrollDirection = root.getState().scrollOffset < scrollTop ? 'forward' : 'backward'
    // 设置滚动信息，包括方向和偏移量
    root.setStateBatch({
      scrollDirection: scrollDirection,
      scrollOffset: scrollTop,
      isScrolling: true,
    })
  })

  const sections = useMemo(() => {
    const [start, end] = renderRange$
    return Children.map(children, (child: ReactElement<PropsWithChildren<_FlowSectionProps>>, order) => {
      if (Object.is(child, null)) {
        return null
      }
      const sectionProps = child.props
      const sectionId = sectionProps.id || `section-${order}`
      const childCount = Children.count(sectionProps.children)
      let section = root.findSection(sectionId)
      if (section) {
        const originalCount = section.count
        if (childCount > originalCount) {
          section.pushNodes(childCount - originalCount)
        }
      } else {
        section = new Section(root, {
          id: sectionId,
          order,
          col: sectionProps.column ?? 1,
          rowGap: sectionProps.rowGap || 0,
          columnGap: sectionProps.columnGap || 0,
          count: Children.count(sectionProps.children),
        })
      }

      return cloneElement(child, { section, key: `${props.id}-${order}` })
    })?.slice(start, end + 1)
  }, [renderRange$[0], renderRange$[1], children, root, props.id])

  const scrollTo = useMemoizedFn((scrollOffset = 0) => {
    scrollOffset = Math.max(0, scrollOffset)
    if (root.getState().scrollOffset === scrollOffset) return
    getScrollViewContextNode(`#${root.id}`).then((node: any) => {
      node.scrollTo({
        animated: true,
        duration: 300,
        top: scrollOffset,
      })
    })
  })

  const resetScrolling = useMemoizedFn(() => {
    root.setStateIn('isScrolling', false)
  })

  const debouncedResetScrolling = debounce(resetScrolling)

  useEffect(() => {
    debouncedResetScrolling()
  }, [isScrolling$])

  /**
   * 处理滚动阈值
   */
  useEffect(() => {
    const disposers = [
      root.sub(
        RootEvents.ReachUpperThreshold,
        debounce(() => {
          onScrollToUpper?.(refEventOrig.current!)
        })
      ),
      root.sub(
        RootEvents.ReachLowerThreshold,
        debounce(() => {
          onScrollToLower?.(refEventOrig.current!)
        })
      ),
    ]
    return () => {
      disposers.forEach((disposer) => {
        disposer()
      })
    }
  }, [onScrollToUpper, onScrollToLower])

  /**
   * 处理 scrollIntoView
   */
  useEffect(() => {
    handleScrollIntoView()
    async function handleScrollIntoView() {
      if (scrollIntoView) {
        if (root.getState().scrollOffset > 0) {
          // 说明在自动滚动前手动滚动过了，不应该自动滚动了，避免造成困扰
          return
        }
        const targetNode = root.findNode(scrollIntoView)
        if (targetNode) {
          const targetSection = targetNode.section
          if (!targetSection.getState().layouted) {
            const order = targetSection.order
            root.setStateIn('renderRange', [renderRange$[0], order])
            nextTick(async () => {
              await targetNode.section.layoutedSignal.promise
              scrollTo(targetNode.getState().scrollTop)
            })
            return
          }
          await targetNode.section.layoutedSignal.promise
          scrollTo(targetNode.getState().scrollTop)
        }
      }
    }
  }, [scrollIntoView, renderRange$[0]])

  return createElement(
    ScrollView,
    {
      id: root.id,
      style: {
        WebkitOverflowScrolling: 'touch',
        overflow: 'auto',
        ...style,
      },
      className,
      scrollY: true,
      onScroll: handleScroll,
      ...rest,
    },
    createElement(
      View,
      {
        id: 'waterflow-root',
        style: {
          width: '100%',
          position: 'relative',
          height: scrollHeight$,
          pointerEvents: isScrolling$ ? 'none' : 'auto',
        },
      },
      sections
    )
  )
}
