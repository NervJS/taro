import { BaseEventOrig, ScrollView, ScrollViewProps, View } from '@tarojs/components'
import Taro, { nextTick } from '@tarojs/taro'
import {
  Children,
  cloneElement,
  createElement,
  forwardRef,
  PropsWithChildren,
  ReactElement,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
} from 'react'

import { debounce, getScrollViewContextNode } from '../../utils'
import {
  type ScrollElementContextValueShape,
  ScrollElementContextOrFallback,
} from '../../utils/scrollElementContext'
import { useMeasureStartOffset } from '../list/hooks/useMeasureStartOffset'
import { useMeasureStartOffsetWeapp } from '../list/hooks/useMeasureStartOffsetWeapp'
import { useScrollParentAutoFind } from '../list/hooks/useScrollParentAutoFind'
import { _FlowSectionProps } from './flow-section'
import { Root, RootEvents } from './root'
import { Section } from './section'
import { useMemoizedFn } from './use-memoized-fn'
import { useObservedAttr } from './use-observed-attr'
import { getSysInfo, isH5, isWeapp } from './utils'

import type { ScrollDirection, WaterFlowProps } from './interface'

getSysInfo()

const InnerWaterFlow = (
  { children, ...props }: PropsWithChildren<WaterFlowProps>,
  ref: React.ForwardedRef<HTMLElement>
) => {
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
  const flowType = nestedScroll === true ? 'nested' : 'default'
  // 从 ScrollElementContext 获取 scrollRef（List/ScrollView 内嵌时提供）；无 Context 时兜底为 fallback
  const scrollElementCtx = useContext(ScrollElementContextOrFallback) as ScrollElementContextValueShape | null
  const contentWrapperRef = useRef<HTMLDivElement>(null)
  const setContainerRef = useCallback(
    (el: HTMLElement | null) => {
      (contentWrapperRef as React.MutableRefObject<HTMLElement | null>).current = el
      if (typeof ref === 'function') ref(el)
      else if (ref) (ref as React.MutableRefObject<HTMLElement | null>).current = el
    },
    [ref]
  )
  const defaultId = useId().replace(/:/g, '')
  const contentId = useMemo(() => id ?? defaultId, [id, defaultId])
  const needAutoFind =
    flowType === 'nested' &&
    !scrollElement &&
    !scrollElementCtx?.scrollRef &&
    (isH5 || isWeapp)
  const { scrollParentRef: autoFoundRef, status: autoFindStatus } = useScrollParentAutoFind(
    contentWrapperRef,
    { enabled: !!needAutoFind, isHorizontal: false, contentId: isWeapp ? contentId : undefined }
  )
  const effectiveScrollElement =
    scrollElement ??
    scrollElementCtx?.scrollRef ??
    (needAutoFind && autoFindStatus === 'found' ? autoFoundRef : null)
  const ctxStart = scrollElementCtx?.startOffset
  const hasExplicitStartOffset = ctxStart != null && ctxStart > 0
  const needMeasureStartOffset =
    flowType === 'nested' &&
    effectiveScrollElement &&
    isH5 &&
    startOffset == null &&
    !hasExplicitStartOffset
  const needMeasureStartOffsetWeapp =
    flowType === 'nested' &&
    effectiveScrollElement &&
    isWeapp &&
    startOffset == null &&
    !hasExplicitStartOffset
  const measuredStartOffset = useMeasureStartOffset(
    effectiveScrollElement ?? { current: null },
    contentWrapperRef,
    { enabled: !!needMeasureStartOffset, isHorizontal: false }
  )
  const effectiveStartOffsetRef = useRef(0)
  const measuredStartOffsetWeapp = useMeasureStartOffsetWeapp(
    effectiveScrollElement ?? { current: null },
    contentId,
    { enabled: !!needMeasureStartOffsetWeapp, isHorizontal: false, startOffsetRef: effectiveStartOffsetRef }
  )
  const effectiveStartOffset =
    startOffset ??
    (ctxStart != null && ctxStart > 0 ? ctxStart : null) ??
    measuredStartOffset ??
    measuredStartOffsetWeapp ??
    0

  const effectiveContainerHeight = containerHeight ?? scrollElementCtx?.containerHeight

  const startOffsetRef = useRef(effectiveStartOffset)
  const containerHeightRef = useRef(effectiveContainerHeight)
  const lastReportedHeightRef = useRef<number>(0)
  startOffsetRef.current = effectiveStartOffset
  if (!needMeasureStartOffsetWeapp) {
    effectiveStartOffsetRef.current = effectiveStartOffset
  }
  containerHeightRef.current = effectiveContainerHeight

  const useScrollElementMode =
    flowType === 'nested' && !!(effectiveScrollElement && (isH5 || isWeapp))
  if (flowType === 'nested' && !effectiveScrollElement && (isH5 || isWeapp) && autoFindStatus === 'not-found') {
    // eslint-disable-next-line no-console
    console.warn('[WaterFlow] nestedScroll 模式但无 scrollElement（props/Context/自动查找），回退为 default，将渲染自有 ScrollView')
  }
  /**
   * 初始化数据模型
   */
  const root = useMemo(() => {
    return new Root({
      id: contentId,
      cacheCount,
      upperThresholdCount,
      lowerThresholdCount,
      skipContainerMeasure: useScrollElementMode || (!!needAutoFind && autoFindStatus === 'pending'),
    })
  }, [contentId, cacheCount, upperThresholdCount, lowerThresholdCount, useScrollElementMode, needAutoFind, autoFindStatus])
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
    const scrollDirection: ScrollDirection = root.getState().scrollOffset < scrollTop ? 'forward' : 'backward'
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
    if (useScrollElementMode && effectiveScrollElement?.current) {
      const el = effectiveScrollElement.current as any
      const startOff = isWeapp ? effectiveStartOffsetRef.current : (startOffsetRef.current ?? 0)
      const scrollTarget = scrollOffset + startOff
      if (isH5) {
        el.scrollTo({ top: scrollTarget })
      } else if (isWeapp) {
        const scrollViewId = el.id || `_wf_${contentId}`
        if (!el.id) el.id = scrollViewId
        getScrollViewContextNode(`#${scrollViewId}`).then((node: any) => {
          node?.scrollTo?.({ top: scrollTarget, animated: true, duration: 300 })
        })
      }
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

  // scrollElement 模式下监听外部滚动，更新 root.scrollOffset；effectiveStartOffset 变化时重新同步；内嵌时 scrollRef 可能尚未就绪，需重试
  useEffect(() => {
    if (!useScrollElementMode || !effectiveScrollElement) return

    let cancelled = false
    let teardown: (() => void) | null = null
    const maxRetries = 20

    const tryAttach = (retryCount = 0) => {
      if (cancelled) return
      const target = effectiveScrollElement.current as any
      if (!target) {
        if (retryCount < maxRetries) {
          setTimeout(() => tryAttach(retryCount + 1), 50)
        }
        return
      }

      const getStartOffset = () => (isWeapp ? effectiveStartOffsetRef.current : (startOffsetRef.current ?? 0))

      const handler = (e?: any) => {
        const scrollTop = isWeapp
          ? (e?.target?.scrollTop ?? e?.mpEvent?.detail?.scrollTop ?? 0)
          : target.scrollTop
        const offset = scrollTop - getStartOffset()
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

      if (isWeapp) {
        if (!target.id) target.id = `_wf_${contentId}`
        const scrollViewId = target.id
        const instance = Taro.getCurrentInstance()
        const query = instance?.page
          ? Taro.createSelectorQuery().in(instance.page as any)
          : Taro.createSelectorQuery()
        query.select(`#${scrollViewId}`).scrollOffset().exec((res) => {
          if (cancelled) return
          const info = res?.[0]
          if (info) {
            const scrollTopVal = info.scrollTop ?? 0
            const initialOffset = Math.max(0, scrollTopVal - getStartOffset())
            root.setStateBatch({ scrollOffset: initialOffset, isScrolling: true })
            root.sections.forEach((s) => s.getNodeRenderRange())
          }
        })
      } else {
        const initialOffset = Math.max(0, target.scrollTop - getStartOffset())
        root.setStateBatch({ scrollOffset: initialOffset, isScrolling: true })
        root.sections.forEach((s) => s.getNodeRenderRange())
      }

      target.addEventListener('scroll', handler, isWeapp ? undefined : { passive: true })
      teardown = () => target.removeEventListener('scroll', handler)
    }

    tryAttach()
    return () => {
      cancelled = true
      teardown?.()
    }
  }, [useScrollElementMode, effectiveScrollElement, root, effectiveStartOffset, contentId])

  // scrollHeight 变化时回调（props 优先，其次从 Context），便于 List 动高联动；防抖 150ms 上报
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

  // scrollElement 模式下监听容器尺寸：H5 用 ResizeObserver，小程序用 createSelectorQuery 轮询
  useEffect(() => {
    if (!useScrollElementMode || !effectiveScrollElement) return
    const el = effectiveScrollElement.current as any
    if (!el) return

    if (isWeapp) {
      if (!el.id) el.id = `_wf_${contentId}`
      const scrollViewId = el.id
      const measure = () => {
        const instance = Taro.getCurrentInstance()
        const query = instance?.page
          ? Taro.createSelectorQuery().in(instance.page as any)
          : Taro.createSelectorQuery()
        query.select(`#${scrollViewId}`).boundingClientRect().exec((res) => {
          const rect = res?.[0]
          if (rect && rect.height > 0 && rect.width > 0) {
            const height = containerHeightRef.current ?? rect.height
            root.setStateIn('containerSize', { width: rect.width, height })
          }
        })
      }
      measure()
      const interval = setInterval(measure, 150)
      return () => clearInterval(interval)
    }

    if (typeof ResizeObserver === 'undefined') return
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
  }, [useScrollElementMode, effectiveScrollElement, root, effectiveContainerHeight, contentId])

  // scrollElement 模式下只渲染内容 View（不渲染 ScrollView）；内容高度须为 scrollHeight 以支持父级滚动；needAutoFind 且 pending 时 probe 渲染以便查找父容器
  const renderView =
    useScrollElementMode || (!!needAutoFind && autoFindStatus === 'pending')
  if (renderView) {
    return createElement(
      View,
      {
        ref: setContainerRef as any,
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
        ref: setContainerRef as any,
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

export const WaterFlow = forwardRef<HTMLElement, PropsWithChildren<WaterFlowProps>>(InnerWaterFlow)
