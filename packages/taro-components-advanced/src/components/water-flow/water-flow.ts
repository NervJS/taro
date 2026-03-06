import { BaseEventOrig, ScrollView, ScrollViewProps, View } from '@tarojs/components'
import { type ScrollElementContextValue, ScrollElementContext } from '@tarojs/components-react'
import { nextTick } from '@tarojs/taro'
import {
  Children,
  cloneElement,
  createElement,
  PropsWithChildren,
  ReactElement,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
} from 'react'

import { debounce, getScrollViewContextNode } from '../../utils'
import { useMeasureStartOffset } from '../list/hooks/useMeasureStartOffset'
import { useScrollParentAutoFind } from '../list/hooks/useScrollParentAutoFind'
import { _FlowSectionProps } from './flow-section'
import { Root, RootEvents } from './root'
import { Section } from './section'
import { useMemoizedFn } from './use-memoized-fn'
import { useObservedAttr } from './use-observed-attr'
import { getSysInfo, isH5 } from './utils'

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
    nestedScroll,
    scrollElement,
    startOffset,
    containerHeight,
    onScrollHeightChange,
    onScrollIntoViewComplete,
    ...rest
  } = props
  // 与 plato 对齐：nestedScroll=true 为嵌套模式，不配置则为 default
  const flowType = nestedScroll === true ? 'nested' : 'default'
  // 任务 4.1：从 ScrollElementContext 获取（List/ScrollView 内嵌时统一提供）
  const scrollElementCtx = useContext(ScrollElementContext) as ScrollElementContextValue | null
  const contentWrapperRef = useRef<HTMLDivElement>(null)
  const needAutoFind =
    flowType === 'nested' &&
    !scrollElement &&
    !scrollElementCtx?.scrollRef &&
    isH5
  const { scrollParentRef: autoFoundRef, status: autoFindStatus } = useScrollParentAutoFind(
    contentWrapperRef,
    { enabled: !!needAutoFind, isHorizontal: false }
  )
  const effectiveScrollElement =
    scrollElement ??
    scrollElementCtx?.scrollRef ??
    (needAutoFind && autoFindStatus === 'found' ? autoFoundRef : null)
  // 当 Context 的 startOffset 为 0 时也需测量：ScrollView 默认传 0，上方有固定内容时需自动测量
  const ctxStart = scrollElementCtx?.startOffset
  const hasExplicitStartOffset = ctxStart != null && ctxStart > 0
  const needMeasureStartOffset =
    flowType === 'nested' &&
    effectiveScrollElement &&
    isH5 &&
    startOffset == null &&
    !hasExplicitStartOffset
  const measuredStartOffset = useMeasureStartOffset(
    effectiveScrollElement ?? { current: null },
    contentWrapperRef,
    { enabled: !!needMeasureStartOffset, isHorizontal: false }
  )
  // 当 Context 传 0 或未传时用测量值兜底
  const effectiveStartOffset =
    startOffset ??
    (ctxStart != null && ctxStart > 0 ? ctxStart : null) ??
    measuredStartOffset ??
    0
  const effectiveContainerHeight = containerHeight ?? scrollElementCtx?.containerHeight

  const startOffsetRef = useRef(effectiveStartOffset)
  const containerHeightRef = useRef(effectiveContainerHeight)
  const lastReportedHeightRef = useRef<number>(0)
  startOffsetRef.current = effectiveStartOffset
  containerHeightRef.current = effectiveContainerHeight

  // nestedScroll 时显式开启 scrollElement 模式；否则始终用 default（自有 ScrollView）
  const useScrollElementMode =
    flowType === 'nested' && !!(effectiveScrollElement && isH5)
  if (flowType === 'nested' && !effectiveScrollElement && isH5 && autoFindStatus === 'not-found') {
    // eslint-disable-next-line no-console
    console.warn('[WaterFlow] nestedScroll 模式但无 scrollElement（props/Context/自动查找），回退为 default，将渲染自有 ScrollView')
  }
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
      skipContainerMeasure: useScrollElementMode || (!!needAutoFind && autoFindStatus === 'pending'),
    })
  }, [id, cacheCount, upperThresholdCount, lowerThresholdCount, useScrollElementMode, needAutoFind, autoFindStatus])
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
    // scrollElement 模式下需操作外部容器，且需加上 startOffset
    if (useScrollElementMode && effectiveScrollElement?.current && isH5) {
      const el = effectiveScrollElement.current
      const scrollTarget = scrollOffset + (startOffsetRef.current ?? 0)
      el.scrollTo({ top: scrollTarget })
      root.setStateBatch({ scrollOffset, isScrolling: true })
      root.sections.forEach((s) => s.getNodeRenderRange())
      return
    }
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
   * root 需入参：autoFind 从 pending→found 时 root 会重建，必须对新 root 重新订阅
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
  }, [root, onScrollToUpper, onScrollToLower])

  /**
   * 处理 scrollIntoView
   * 竞态：快速切换目标时，取消前一次滚动，避免后发先至
   */
  useEffect(() => {
    let cancelled = false
    handleScrollIntoView()
    async function handleScrollIntoView() {
      if (!scrollIntoView) return
      const targetNode = root.findNode(scrollIntoView)
      if (!targetNode) {
        nextTick(() => { if (!cancelled) onScrollIntoViewComplete?.() })
        return
      }
      const targetSection = targetNode.section
      const doScroll = () => {
        if (cancelled) return
        scrollTo(targetNode.getState().scrollTop)
        if (cancelled) return
        nextTick(() => { if (!cancelled) onScrollIntoViewComplete?.() })
      }
      if (!targetSection.getState().layouted) {
        const order = targetSection.order
        root.setStateIn('renderRange', [
          Math.min(renderRange$[0], order),
          Math.max(renderRange$[1], order),
        ])
        nextTick(async () => {
          await targetNode.section.layoutedSignal.promise
          if (cancelled) return
          doScroll()
        })
        return
      }
      await targetSection.layoutedSignal.promise
      if (cancelled) return
      doScroll()
    }
    return () => { cancelled = true }
  }, [scrollIntoView, renderRange$[0], renderRange$[1], onScrollIntoViewComplete])

  // 任务 3.3：scrollElement 模式下监听外部滚动，更新 root.scrollOffset
  // effectiveStartOffset 变化时（如自动测量完成）需重新同步
  // 内嵌时 scrollRef 可能尚未就绪（父 List 的 useLayoutEffect 晚于子 useEffect），需重试
  useEffect(() => {
    if (!useScrollElementMode || !effectiveScrollElement) return

    let cancelled = false
    let teardown: (() => void) | null = null
    const maxRetries = 20

    const tryAttach = (retryCount = 0) => {
      if (cancelled) return
      const target = effectiveScrollElement.current
      if (!target) {
        if (retryCount < maxRetries) {
          requestAnimationFrame(() => tryAttach(retryCount + 1))
        }
        return
      }

      const handler = () => {
        const scrollTop = target.scrollTop
        const offset = scrollTop - (startOffsetRef.current ?? 0)
        const effectiveOffset = Math.max(0, offset)
        const prevOffset = root.getState().scrollOffset
        const scrollDirection: ScrollDirection = prevOffset < effectiveOffset ? 'forward' : 'backward'

        root.sections.forEach((section) => section.getNodeRenderRange())
        root.setStateBatch({
          scrollDirection,
          scrollOffset: effectiveOffset,
          isScrolling: true,
        })
      }

      const initialOffset = Math.max(0, target.scrollTop - (startOffsetRef.current ?? 0))
      root.setStateBatch({ scrollOffset: initialOffset, isScrolling: true })
      root.sections.forEach((s) => s.getNodeRenderRange())
      target.addEventListener('scroll', handler, { passive: true })
      teardown = () => target.removeEventListener('scroll', handler)
    }

    tryAttach()
    return () => {
      cancelled = true
      teardown?.()
    }
  }, [useScrollElementMode, effectiveScrollElement, root, effectiveStartOffset])

  // 任务 4.2：scrollHeight 变化时回调，便于 List 动高联动（props 优先，其次从 Context 获取）
  // 防抖上报：Root 多源触发 updateScrollHeight 可能产生多轮不同值；等 150ms 无新值时上报当前值（视为布局收敛结果）
  const reportHeight = onScrollHeightChange ?? scrollElementCtx?.reportNestedHeightChange
  useEffect(() => {
    if (!reportHeight || scrollHeight$ <= 0) return
    const timer = setTimeout(() => {
      if (Math.abs(lastReportedHeightRef.current - scrollHeight$) < 1) return
      lastReportedHeightRef.current = scrollHeight$
      reportHeight(scrollHeight$)
    }, 150)
    return () => clearTimeout(timer)
  }, [scrollHeight$, reportHeight])

  // 任务 3.4：scrollElement 模式下 containerSize 从 containerHeight / scrollElement 获取
  // ResizeObserver 监听 scrollElement 尺寸变化；containerHeight prop 变化时也需同步（如 List 内嵌时父传子）
  useEffect(() => {
    if (!useScrollElementMode || !effectiveScrollElement) return
    const el = effectiveScrollElement.current
    if (!el || typeof ResizeObserver === 'undefined') return

    const update = () => {
      const height = containerHeightRef.current ?? el.clientHeight
      const width = el.clientWidth
      if (height > 0 && width > 0) {
        root.setStateIn('containerSize', { width, height })
      }
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [useScrollElementMode, effectiveScrollElement, root, effectiveContainerHeight])

  // 任务 3.2：scrollElement 模式下不渲染 ScrollView，只渲染内容 View
  // 内容高度必须为 scrollHeight，否则父 scrollElement 无法正确滚动；显式写 height 覆盖 style 中的 height
  // needAutoFind && pending：probe 阶段，渲染 View 以便 hook 能查找父滚动容器
  const renderView =
    useScrollElementMode || (!!needAutoFind && autoFindStatus === 'pending')
  if (renderView) {
    return createElement(
      View,
      {
        ref: contentWrapperRef as any,
        id: root.id,
        style: {
          ...style,
          width: '100%',
          position: 'relative',
          height: scrollHeight$,
          pointerEvents: isScrolling$ ? 'none' : 'auto',
        },
        className,
      },
      sections
    )
  }

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
