import { ScrollView, View } from '@tarojs/components-react'
import React from 'react'

import { useItemSizeCache } from './hooks/useItemSizeCache'
import { type ListRefresherConfig, DEFAULT_REFRESHER_HEIGHT, useRefresher } from './hooks/useRefresher'
import { useResizeObserver } from './hooks/useResizeObserver'
import { useScrollCorrection } from './hooks/useScrollCorrection'
import ListItem from './ListItem'
import NoMore, { type NoMoreProps } from './NoMore'
import StickyHeader from './StickyHeader'
import StickySection from './StickySection'
import { supportsNativeRefresher } from './utils'

/** 与官方 List.d.ts / ScrollView / harmony 对齐，不增减已有语义；扩展项仅用于高级能力 */
export interface ListProps {
  // ===== 与 ScrollView / List.d.ts 一致 =====
  showScrollbar?: boolean
  scrollTop?: number
  scrollX?: boolean
  scrollY?: boolean
  onScroll?: (e: { scrollTop: number, scrollLeft: number }) => void
  onScrollToUpper?: () => void
  onScrollToLower?: () => void
  upperThreshold?: number
  lowerThreshold?: number
  /** 与 ScrollView cacheExtent 对齐（视口外渲染距离），可选 */
  cacheExtent?: number
  /** 与 ScrollView enableBackToTop 对齐 */
  enableBackToTop?: boolean
  /** 与 ScrollView onScrollStart 对齐 */
  onScrollStart?: () => void
  /** 与 ScrollView onScrollEnd 对齐 */
  onScrollEnd?: () => void
  scrollIntoView?: string

  // ===== 与 harmony-cpp ListProps / ListBuilder 对齐 =====
  stickyHeader?: boolean
  space?: number
  cacheCount?: number
  itemData?: any[]
  itemSize?: number | ((index: number, data?: any[]) => number)
  height?: number | string
  width?: number | string
  style?: React.CSSProperties
  children?: React.ReactNode
  headerHeight?: number
  headerWidth?: number
  itemHeight?: number
  itemWidth?: number

  // ===== 动态尺寸（与 type="dynamic" 语义对齐）=====
  useResizeObserver?: boolean
  estimatedItemSize?: number
  onItemSizeChange?: (index: number, size: number) => void

  // ===== NoMore 底部提示 =====
  showNoMore?: boolean
  noMoreText?: string
  noMoreStyle?: React.CSSProperties
  renderNoMore?: () => React.ReactNode

  // ===== 扩展：可见索引回调 =====
  onScrollIndex?: (start: number, end: number) => void

  // ===== 与 dynamic/harmony 对齐：List 自身可配置下拉刷新，无需 Refresher 子组件 =====
  /** 是否开启下拉刷新；与 Refresher 子组件二选一或同时存在（Refresher 子覆盖同名字段） */
  refresherEnabled?: boolean
  refresherThreshold?: number
  refresherDefaultStyle?: 'black' | 'white' | 'none'
  refresherBackground?: string
  refresherTriggered?: boolean
  onRefresherPulling?: (e?: { detail?: { deltaY?: number } }) => void
  onRefresherRefresh?: () => void | Promise<void>
  onRefresherRestore?: () => void
  onRefresherAbort?: () => void
  onRefresherWillRefresh?: () => void
  onRefresherStatusChange?: (e?: { detail?: { status?: number, dy?: number } }) => void
}

// 工具：累加数组
export function accumulate(arr: number[]) {
  const result = [0]
  for (let i = 0; i < arr.length; i++) {
    result[i + 1] = result[i] + arr[i]
  }
  return result
}

// 检测抖动
export function isShaking(diffList: number[]): boolean {
  if (diffList.length < 3) return false

  // 检查是否有连续的正负交替
  const signs = diffList.map(diff => Math.sign(diff))
  let alternations = 0
  for (let i = 1; i < signs.length; i++) {
    if (signs[i] !== 0 && signs[i] !== signs[i - 1]) {
      alternations++
    }
  }

  // 如果交替次数过多，认为是抖动
  return alternations >= 2
}

const List: React.FC<ListProps> = (props) => {
  const isH5 = process.env.TARO_ENV === 'h5'
  const {
    stickyHeader = false,
    space = 0,
    height = 400,
    width = '100%',
    showScrollbar = true,
    scrollTop: controlledScrollTop,
    scrollX = false,
    scrollY = true,
    onScroll,
    onScrollToUpper,
    onScrollToLower,
    onScrollStart,
    onScrollEnd,
    upperThreshold = 0,
    lowerThreshold = 0,
    cacheCount = 2,
    cacheExtent,
    enableBackToTop,
    style,
    children,
  } = props

  const isHorizontal = scrollX === true
  const DEFAULT_ITEM_WIDTH = 120
  const DEFAULT_ITEM_HEIGHT = 40

  // 滚动状态管理
  const containerRef = React.useRef<HTMLDivElement>(null)

  // 生成唯一 List ID（用于小程序 ResizeObserver）
  const listId = React.useMemo(() => `list-${Math.random().toString(36).slice(2, 11)}`, [])

  // 渲染偏移量 - 用于计算应该渲染哪些元素
  const [renderOffset, setRenderOffset] = React.useState(controlledScrollTop ?? 0)

  // 滚动视图偏移量 - 仅用于程序性滚动（scrollIntoView/修正/初始），用户滑动期间不更新，避免「受控 scrollTop」与原生滚动抢位置导致果冻感
  const [scrollViewOffset, setScrollViewOffset] = React.useState(controlledScrollTop ?? 0)

  // 用户正在滑动时不再向 ScrollView 传 scrollTop，让滚动完全由原生接管
  const [isUserScrolling, setIsUserScrolling] = React.useState(false)

  const initialContainerLength = typeof (isHorizontal ? width : height) === 'number' ? (isHorizontal ? (width as number) : (height as number)) : 400
  const [containerLength, setContainerLength] = React.useState<number>(initialContainerLength)

  // 用实际容器尺寸更新视口长度，避免「props 高度与 CSS 实际高度不一致」导致底部空白（虚拟列表视口 [renderOffset, renderOffset+containerLength] 小于实际可见区域）
  React.useEffect(() => {
    const el = containerRef.current
    if (!el || typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { contentRect } = entry
        const measured = isHorizontal ? contentRect.width : contentRect.height
        if (measured > 0) setContainerLength(measured)
      }
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [isHorizontal])

  // 滚动追踪相关refs
  const isScrollingRef = React.useRef(false)
  const lastScrollTopRef = React.useRef(controlledScrollTop ?? 0)
  const scrollDiffListRef = React.useRef<number[]>([0, 0, 0])
  const scrollTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  // 仅程序性滚动（scrollIntoView/修正/初始）时才把 scrollViewOffset 写回 H5 DOM，避免用户拖动结束后误把旧值写回导致卡顿/跳跃（在桌面 Chrome 模拟器下尤为明显）
  const programmaticScrollRef = React.useRef(false)

  // 处理渲染偏移量更新。策略：滑动中不同步 scrollViewOffset（避免果冻感），滚动结束后再同步。
  // syncToScrollView=true：程序性滚动（scrollIntoView/修正/初始），立即同步到 ScrollView。
  // syncToScrollView=false：用户滑动，仅更新 renderOffset；结束 150/200ms 后再同步 scrollViewOffset。
  const updateRenderOffset = React.useCallback((newOffset: number, syncToScrollView?: boolean) => {
    lastScrollTopRef.current = newOffset
    isScrollingRef.current = true

    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current)
    }

    setRenderOffset(newOffset) // 始终更新虚拟列表用到的偏移

    if (syncToScrollView) {
      setIsUserScrolling(false)
      setScrollViewOffset(newOffset)
      programmaticScrollRef.current = true
    } else {
      setIsUserScrolling(true)
    }

    const isWeapp = process.env.TARO_ENV === 'weapp'
    scrollTimeoutRef.current = setTimeout(() => {
      isScrollingRef.current = false
      if (!syncToScrollView) {
        // 滚动结束后同步：state 与真实滚动位置一致，下次程序性滚动有正确基准
        setScrollViewOffset(lastScrollTopRef.current)
        setIsUserScrolling(false)
      }
    }, isWeapp ? 200 : 150)
  }, [])

  // 提取 Refresher 配置（方案一：List 自身属性为 base，Refresher 子覆盖，对齐 dynamic/harmony）
  const refresherConfig = React.useMemo((): ListRefresherConfig | null => {
    const listRefresherEnabled = props.refresherEnabled !== false && (
      props.refresherEnabled === true || props.onRefresherRefresh != null
    )
    const baseFromList: ListRefresherConfig | null = listRefresherEnabled
      ? {
        refresherEnabled: props.refresherEnabled,
        refresherThreshold: props.refresherThreshold,
        refresherDefaultStyle: props.refresherDefaultStyle,
        refresherBackground: props.refresherBackground,
        refresherTriggered: props.refresherTriggered,
        onRefresherPulling: props.onRefresherPulling,
        onRefresherRefresh: props.onRefresherRefresh,
        onRefresherRestore: props.onRefresherRestore,
        onRefresherAbort: props.onRefresherAbort,
        onRefresherWillRefresh: props.onRefresherWillRefresh,
        onRefresherStatusChange: props.onRefresherStatusChange,
      }
      : null

    // 通过 displayName 检测 Refresher 子组件（保持与 Refresher 组件解耦）
    const isRefresherComponent = (child: React.ReactElement): boolean => {
      const type = child.type as any
      return type?.displayName === 'Refresher' || type?.name === 'Refresher'
    }

    let refresherChildProps: ListRefresherConfig | null = null
    let refresherCount = 0
    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child) && isRefresherComponent(child)) {
        refresherCount++
        if (refresherCount > 1) {
          console.warn('[List] 检测到多个 Refresher 组件，仅第一个生效')
          return
        }
        refresherChildProps = child.props as ListRefresherConfig
      }
    })

    if (refresherChildProps != null) {
      const base = baseFromList ?? {}
      // Refresher 子组件的配置覆盖 List 的配置
      return {
        ...base,
        ...refresherChildProps,
      } as ListRefresherConfig
    }
    return baseFromList
  }, [
    children,
    props.refresherEnabled,
    props.refresherThreshold,
    props.refresherDefaultStyle,
    props.refresherBackground,
    props.refresherTriggered,
    props.onRefresherPulling,
    props.onRefresherRefresh,
    props.onRefresherRestore,
    props.onRefresherAbort,
    props.onRefresherWillRefresh,
    props.onRefresherStatusChange,
  ])

  // 提取 NoMore 配置
  const noMoreConfig = React.useMemo(() => {
    let config: NoMoreProps | null = null
    let noMoreCount = 0

    // 从子组件中提取 NoMore
    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child) && child.type === NoMore) {
        noMoreCount++
        if (noMoreCount > 1) {
          console.warn('[List] 检测到多个 NoMore 组件，仅第一个生效')
          return
        }
        config = child.props as NoMoreProps
      }
    })

    // Props 方式转换为配置（优先级低于子组件）
    if (props.showNoMore && !config) {
      config = {
        visible: true,
        text: props.noMoreText,
        style: props.noMoreStyle,
        children: props.renderNoMore?.()
      }
    }

    return config
  }, [children, props.showNoMore, props.noMoreText, props.noMoreStyle, props.renderNoMore])

  // 使用 Refresher hook（平台适配）；H5 用 addImperativeTouchListeners 挂 { passive: false }，避免 preventDefault 报错
  const {
    scrollViewRefresherProps,
    scrollViewRefresherHandlers,
    h5RefresherProps,
    addImperativeTouchListeners,
    renderRefresherContent,
  } = useRefresher(refresherConfig, isH5 && refresherConfig && !supportsNativeRefresher ? 0 : renderOffset)
  const refresherTeardownRef = React.useRef<(() => void) | null>(null)
  const addImperativeTouchListenersRef = React.useRef(addImperativeTouchListeners)
  addImperativeTouchListenersRef.current = addImperativeTouchListeners
  React.useEffect(() => () => {
    if (refresherTeardownRef.current) refresherTeardownRef.current()
  }, [])

  // H5 下拉刷新时顶部 Refresher 块高度（用于总高、scroll 偏移、内容跟随手指 wrapper）；refresherEnabled=false 时不展示顶栏
  // 默认 50px（常量来自 useRefresher），有自定义 children 时由 renderRefresherContent 内容撑开
  const refresherHeightForH5 = (isH5 && refresherConfig && !supportsNativeRefresher && refresherConfig.refresherEnabled !== false) ? DEFAULT_REFRESHER_HEIGHT : 0

  // 解析分组结构，只支持 StickySection 和 ListItem 作为直接子组件
  // 过滤掉 Refresher 和 NoMore 组件
  const sections = React.useMemo(() => {
    const result: Array<{
      header: React.ReactElement | null
      items: React.ReactElement[]
      key: string
    }> = []
    const defaultItems: React.ReactElement[] = []
    React.Children.forEach(children, (child, idx) => {
      if (React.isValidElement(child) && child.type === StickySection) {
        // 分组模式
        const sectionProps = child.props as any
        let header: React.ReactElement | null = null
        const items: React.ReactElement[] = []
        React.Children.forEach(sectionProps.children, (subChild) => {
          if (React.isValidElement(subChild) && subChild.type === StickyHeader) header = subChild
          else if (React.isValidElement(subChild) && subChild.type === ListItem) items.push(subChild)
        })
        result.push({ header, items, key: child.key || String(idx) })
      } else if (React.isValidElement(child) && child.type === ListItem) {
        // 普通 ListItem
        defaultItems.push(child)
      }
      // 忽略 Refresher 和 NoMore 组件（已在上面提取配置）
    })
    if (defaultItems.length > 0) {
      result.push({ header: null, items: defaultItems, key: 'default' })
    }
    return result
  }, [children])

  // === 动态尺寸管理（新增）⭐ ===
  const defaultEstimatedSize = isHorizontal ? DEFAULT_ITEM_WIDTH : DEFAULT_ITEM_HEIGHT
  const estimatedSize = props.estimatedItemSize ?? defaultEstimatedSize

  // 计算总 item 数量（跨所有 section）
  const totalItemCount = React.useMemo(() => {
    return sections.reduce((sum, section) => sum + section.items.length, 0)
  }, [sections])

  // 存储元素引用（用于 ResizeObserver）
  const itemRefsRef = React.useRef<Map<number, HTMLElement | null>>(new Map())
  // 存储 header 元素引用（用于 ResizeObserver）
  const headerRefsRef = React.useRef<Map<number, HTMLElement | null>>(new Map())

  // 动态尺寸缓存更新版本：setItemSize 后递增，用于驱动 sectionOffsets/totalLength 与 item 定位重算
  const [sizeCacheVersion, setSizeCacheVersion] = React.useState(0)
  const sizeCacheRafRef = React.useRef<number | null>(null)

  // 动态尺寸缓存
  const sizeCache = useItemSizeCache({
    isHorizontal,
    estimatedItemSize: estimatedSize,
    itemCount: totalItemCount
  })

  // header 动态尺寸缓存（sectionIndex -> size）
  const headerSizeCacheRef = React.useRef<Map<number, number>>(new Map())

  // 滚动修正的可见起始索引（后续更新）
  const visibleStartIndexRef = React.useRef(0)

  // ScrollTop 修正
  const scrollCorrection = useScrollCorrection({
    enabled: props.useResizeObserver === true,
    visibleStartIndex: visibleStartIndexRef.current,
    setScrollOffset: (offsetOrUpdater) => {
      const newOffset = typeof offsetOrUpdater === 'function'
        ? offsetOrUpdater(renderOffset)
        : offsetOrUpdater
      updateRenderOffset(newOffset, true) // 程序性修正需同步到 ScrollView
    }
  })

  // ResizeObserver（当启用动态测量时）
  const resizeObserver = useResizeObserver({
    enabled: props.useResizeObserver === true,
    isHorizontal,
    listId,
    onResize: (index, size) => {
      const oldSize = sizeCache.getItemSize(index)
      sizeCache.setItemSize(index, size)

      // 仅当尺寸实际变化（≥1px）时才批量驱动重渲染，避免重复/微小变化导致卡顿
      if (Math.abs(oldSize - size) >= 1 && sizeCacheRafRef.current == null) {
        sizeCacheRafRef.current = requestAnimationFrame(() => {
          sizeCacheRafRef.current = null
          setSizeCacheVersion((v) => v + 1)
        })
      }

      // 触发 ScrollTop 修正
      scrollCorrection.recordSizeChange(index, oldSize, size)

      // 触发外部回调
      props.onItemSizeChange?.(index, size)
    }
  })

  // 工具：获取 header 默认/估算尺寸
  const getDefaultHeaderSize = () => {
    if (isHorizontal) {
      if (typeof props.headerWidth === 'number') return props.headerWidth
      if (typeof props.itemWidth === 'number') return props.itemWidth
      if (typeof props.itemSize === 'number') return props.itemSize
      if (typeof props.itemSize === 'function') return props.itemSize(0, props.itemData) || DEFAULT_ITEM_WIDTH
      return DEFAULT_ITEM_WIDTH
    } else {
      if (typeof props.headerHeight === 'number') return props.headerHeight
      if (typeof props.itemHeight === 'number') return props.itemHeight
      if (typeof props.itemSize === 'number') return props.itemSize
      if (typeof props.itemSize === 'function') return props.itemSize(0, props.itemData) || DEFAULT_ITEM_HEIGHT
      return DEFAULT_ITEM_HEIGHT
    }
  }

  // 工具：获取 header 尺寸（支持动态测量）
  const getHeaderSize = React.useCallback((sectionIndex: number) => {
    // 如果启用动态测量，优先从缓存读取
    if (props.useResizeObserver === true) {
      const cached = headerSizeCacheRef.current.get(sectionIndex)
      if (cached != null && cached > 0) return cached
    }
    // 否则返回默认尺寸
    return getDefaultHeaderSize()
  }, [props.useResizeObserver, props.headerHeight, props.headerWidth, props.itemHeight, props.itemWidth, props.itemSize, props.itemData, isHorizontal])

  // 工具：获取 item 尺寸，支持函数/props/默认值/动态测量
  const getItemSize = React.useCallback((index: number) => {
    // 优先级1：如果启用动态测量，从缓存读取
    if (props.useResizeObserver === true) {
      return sizeCache.getItemSize(index)
    }

    // 优先级2：固定尺寸或函数计算
    if (isHorizontal) {
      if (typeof props.itemWidth === 'number') return props.itemWidth
      if (typeof props.itemSize === 'number') return props.itemSize
      if (typeof props.itemSize === 'function') return props.itemSize(index, props.itemData) || DEFAULT_ITEM_WIDTH
      return DEFAULT_ITEM_WIDTH
    } else {
      if (typeof props.itemHeight === 'number') return props.itemHeight
      if (typeof props.itemSize === 'number') return props.itemSize
      if (typeof props.itemSize === 'function') return props.itemSize(index, props.itemData) || DEFAULT_ITEM_HEIGHT
      return DEFAULT_ITEM_HEIGHT
    }
  }, [props.useResizeObserver, props.itemWidth, props.itemHeight, props.itemSize, props.itemData, isHorizontal, sizeCache])

  // 计算分组累积高度/宽度（依赖 sizeCacheVersion，动态测量更新后重算，保证最外层容器高度与 item 定位正确）
  const sectionOffsets = React.useMemo(() => {
    const offsets: number[] = [0]
    let globalItemIndex = 0 // 累加全局索引

    sections.forEach((section, sectionIdx) => {
      const headerSize = getHeaderSize(sectionIdx)
      // 使用全局索引计算每个 item 的尺寸
      const itemSizes = section.items.map((_, localIdx) => getItemSize(globalItemIndex + localIdx))
      const groupSize = (section.header ? headerSize : 0) +
        itemSizes.reduce((a, b) => a + b, 0) +
        Math.max(0, section.items.length) * space
      offsets.push(offsets[offsets.length - 1] + groupSize)

      // 累加当前 section 的 item 数量
      globalItemIndex += section.items.length
    })
    return offsets
  }, [sections, space, isHorizontal, props.headerHeight, props.headerWidth, props.itemHeight, props.itemWidth, props.itemSize, props.itemData, getItemSize, getHeaderSize, sizeCacheVersion])

  // 外层虚拟滚动：可见分组
  const [startSection, endSection] = React.useMemo(() => {
    let start = 0; let end = sections.length - 1
    for (let i = 0; i < sections.length; i++) {
      if (sectionOffsets[i + 1] > renderOffset) {
        start = Math.max(0, i - cacheCount)
        break
      }
    }
    for (let i = start; i < sections.length; i++) {
      if (sectionOffsets[i] >= renderOffset + containerLength) {
        end = Math.min(sections.length - 1, i + cacheCount)
        break
      }
    }
    return [start, end]
  }, [renderOffset, containerLength, sectionOffsets, sections.length, cacheCount])

  // 计算视口内可见 item 的全局索引范围（用于 onScrollIndex：懒加载、埋点等）
  // 按视口 [renderOffset, renderOffset + containerLength] 精确计算，而非「可见 section 的整段 item」
  const [visibleStartItem, visibleEndItem] = React.useMemo(() => {
    const viewportTop = renderOffset
    const viewportBottom = renderOffset + containerLength
    let firstVisible = -1
    let lastVisible = -1
    let globalIndex = 0

    for (let s = 0; s < sections.length; s++) {
      const section = sections[s]
      const headerSize = getHeaderSize(s)
      const sectionStart = sectionOffsets[s] + (section.header ? headerSize : 0)
      let itemTop = sectionStart

      for (let i = 0; i < section.items.length; i++) {
        const itemSize = getItemSize(globalIndex)
        const itemBottom = itemTop + itemSize
        // 判断 item 本身（不含 space）是否与视口相交
        if (itemBottom > viewportTop && itemTop < viewportBottom) {
          if (firstVisible < 0) firstVisible = globalIndex
          lastVisible = globalIndex
        }
        // 下一个 item 的起始位置 = 当前 item 结束 + space
        itemTop = itemBottom + space
        globalIndex++
      }
    }

    if (firstVisible < 0 || lastVisible < 0) return [0, 0]
    return [firstVisible, lastVisible]
  }, [renderOffset, containerLength, sections, sectionOffsets, getHeaderSize, getItemSize, space])

  // 触发 onScrollIndex 回调（带防重复）
  const lastVisibleRangeRef = React.useRef({ start: -1, end: -1 })
  React.useEffect(() => {
    if (props.onScrollIndex) {
      // 避免重复触发
      if (lastVisibleRangeRef.current.start !== visibleStartItem ||
          lastVisibleRangeRef.current.end !== visibleEndItem) {
        lastVisibleRangeRef.current = { start: visibleStartItem, end: visibleEndItem }
        props.onScrollIndex(visibleStartItem, visibleEndItem)
      }
    }
  }, [visibleStartItem, visibleEndItem, props.onScrollIndex])

  // 触顶/触底事件
  React.useEffect(() => {
    if (onScrollToUpper && renderOffset <= (upperThreshold > 0 ? sectionOffsets[upperThreshold] : 0)) {
      onScrollToUpper()
    }
    if (onScrollToLower && renderOffset + containerLength >= sectionOffsets[sectionOffsets.length - 1] - (lowerThreshold > 0 ? sectionOffsets[sectionOffsets.length - 1] - sectionOffsets[sections.length - lowerThreshold] : 0)) {
      onScrollToLower()
    }
  }, [renderOffset, containerLength, sectionOffsets, sections.length, upperThreshold, lowerThreshold, onScrollToUpper, onScrollToLower])

  // 智能滚动处理函数（H5 下拉刷新时 scrollTop 含 Refresher 区，虚拟列表用列表内偏移）
  const handleScroll = React.useCallback((e: any) => {
    let newOffset: number
    if (e.detail) {
      newOffset = isHorizontal ? e.detail.scrollLeft : e.detail.scrollTop
    } else {
      newOffset = isHorizontal ? e.scrollLeft : e.scrollTop
    }

    // H5 顶栏悬浮：只滚列表，scrollTop 即列表偏移，无需 clamp
    const effectiveOffset = newOffset

    const diff = effectiveOffset - lastScrollTopRef.current
    scrollDiffListRef.current.shift()
    scrollDiffListRef.current.push(diff)

    if (isScrollingRef.current && isShaking(scrollDiffListRef.current)) {
      return
    }

    scrollCorrection.markUserScrolling()
    updateRenderOffset(effectiveOffset, false)

    onScroll?.({
      scrollTop: isHorizontal ? 0 : newOffset,
      scrollLeft: isHorizontal ? newOffset : 0
    })
  }, [isHorizontal, onScroll, updateRenderOffset, containerLength, scrollCorrection])

  // 初始化后的延迟同步 - 确保ScrollView正确设置初始位置
  React.useEffect(() => {
    if (typeof controlledScrollTop === 'number') {
      setScrollViewOffset(controlledScrollTop)
      lastScrollTopRef.current = controlledScrollTop
      programmaticScrollRef.current = true
    }
  }, [controlledScrollTop])

  // 清理定时器、ResizeObserver 与尺寸缓存 RAF
  React.useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
      if (sizeCacheRafRef.current != null) {
        cancelAnimationFrame(sizeCacheRafRef.current)
        sizeCacheRafRef.current = null
      }
      resizeObserver.disconnect()
      scrollCorrection.clearQueue()
    }
  }, [resizeObserver, scrollCorrection])

  // scrollIntoView：仅当 scrollIntoView 变化时执行一次跳动，避免依赖 sections/getItemSize 等导致每次渲染都重置位置、无法继续滑动
  const lastScrollIntoViewRef = React.useRef<string | null>(null)
  React.useEffect(() => {
    const targetId = props.scrollIntoView
    if (!targetId) {
      lastScrollIntoViewRef.current = null
      return
    }
    if (lastScrollIntoViewRef.current === targetId) return
    lastScrollIntoViewRef.current = targetId

    let targetIndex = -1
    if (targetId.startsWith('list-item-')) {
      targetIndex = parseInt(targetId.replace('list-item-', ''), 10)
    }

    if (targetIndex >= 0 && targetIndex < totalItemCount) {
      let targetOffset = 0
      let currentGlobalIndex = 0
      for (let s = 0; s < sections.length; s++) {
        const section = sections[s]
        const headerSize = section.header ? getHeaderSize(s) : 0
        if (currentGlobalIndex + section.items.length > targetIndex) {
          targetOffset += headerSize
          for (let i = 0; i < targetIndex - currentGlobalIndex; i++) {
            targetOffset += getItemSize(currentGlobalIndex + i) + space
          }
          break
        } else {
          targetOffset += headerSize
          for (let i = 0; i < section.items.length; i++) {
            targetOffset += getItemSize(currentGlobalIndex + i) + space
          }
          currentGlobalIndex += section.items.length
        }
      }
      updateRenderOffset(targetOffset, true)
    }
  }, [props.scrollIntoView, totalItemCount, sections, getHeaderSize, getItemSize, space, updateRenderOffset])

  // 容器样式：width/height 即视口宽高；H5 刷新中禁止容器滚动（参考《H5 下拉刷新如何实现》）
  const containerStyle: React.CSSProperties = {
    position: 'relative',
    boxSizing: 'border-box',
    height,
    width,
    ...style,
    ...(isH5 && refresherConfig && !supportsNativeRefresher && h5RefresherProps.isRefreshing
      ? { overflow: 'hidden' as const }
      : {}),
  }

  // ScrollView 属性：对齐 taro-components-react ScrollView（scrollTop/scrollLeft、upperThreshold/lowerThreshold、scrollWithAnimation）
  const scrollViewProps: Record<string, unknown> = {
    scrollY: !scrollX && scrollY,
    scrollX,
    style: containerStyle,
    enhanced: true,
    showScrollbar,
    upperThreshold,
    lowerThreshold,
    scrollWithAnimation: false,
    onScroll: handleScroll,
    onScrollToUpper,
    onScrollToLower,
    onScrollStart,
    onScrollEnd,
    enableBackToTop,
    ...(typeof cacheExtent === 'number' ? { cacheExtent } : {}),
    'data-testid': 'taro-list-container',

    ...scrollViewRefresherProps,
    ...scrollViewRefresherHandlers,

    ...(!supportsNativeRefresher && refresherConfig && !addImperativeTouchListeners ? h5RefresherProps.touchHandlers : {}),
  }

  // H5 对齐小程序：refresherTriggered=true 时顶部立即显示加载指示器，滚到顶部并锁定滚动直至设为 false
  React.useEffect(() => {
    if (!isH5 || !refresherConfig || supportsNativeRefresher || !h5RefresherProps.isRefreshing) return
    updateRenderOffset(0, true)
  }, [h5RefresherProps.isRefreshing, isH5, refresherConfig, supportsNativeRefresher, updateRenderOffset])

  // H5 下拉刷新：只挂载一次 touch 监听，用 ref 存 addImperativeTouchListeners 避免因 config 引用变化导致 effect 循环（attach/detach 刷屏）
  React.useLayoutEffect(() => {
    const attach = addImperativeTouchListenersRef.current
    if (!attach) return
    let teardown: (() => void) | null = null
    const tryAttach = () => {
      const el = containerRef.current
      if (el && !refresherTeardownRef.current) {
        teardown = attach(el)
        refresherTeardownRef.current = teardown
      }
    }
    tryAttach()
    const rafId = requestAnimationFrame(tryAttach)
    return () => {
      cancelAnimationFrame(rafId)
      if (teardown) {
        teardown()
      }
      refresherTeardownRef.current = null
    }
  }, [])

  // 仅在非用户滑动时传 scrollTop/scrollLeft；H5 顶栏悬浮时只滚列表，scrollTop 即列表偏移（不含顶栏）
  if (!isUserScrolling) {
    if (isHorizontal) {
      scrollViewProps.scrollLeft = scrollViewOffset
    } else {
      scrollViewProps.scrollTop = scrollViewOffset
    }
  }

  // H5：仅程序性滚动时写回 DOM
  if (isH5) {
    React.useEffect(() => {
      if (isUserScrolling || !containerRef.current || typeof scrollViewOffset !== 'number') return
      if (!programmaticScrollRef.current) return
      const scrollValue = isHorizontal ? scrollViewOffset : scrollViewOffset
      if (isHorizontal) {
        containerRef.current.scrollLeft = scrollValue
      } else {
        containerRef.current.scrollTop = scrollValue
      }
      programmaticScrollRef.current = false
    }, [scrollViewOffset, isHorizontal, isUserScrolling])
  }

  // 总高度/宽度（包含 NoMore）；H5 顶栏悬浮不占滚动高度，只滚列表
  const noMoreHeight = noMoreConfig?.visible ? (noMoreConfig.height || 60) : 0
  const listContentLength = sectionOffsets[sectionOffsets.length - 1] + noMoreHeight
  const totalLength = listContentLength

  // 吸顶/吸左 header
  const stickyHeaderNode = React.useMemo(() => {
    if (!stickyHeader) return null
    for (let i = 0; i < sections.length; i++) {
      if (sectionOffsets[i] <= renderOffset && renderOffset < sectionOffsets[i + 1]) {
        const section = sections[i]
        if (section.header) {
          // 吸顶 header 不设固定 height/width，由内容撑开，避免「外部 60px 容器 + 实际内容 40+px」导致 header 内空白
          const stickyHeaderStyle: React.CSSProperties = {
            position: 'sticky',
            top: 0,
            left: 0,
            zIndex: 100,
            background: '#fff',
            boxSizing: 'border-box',
            minHeight: 20,
            overflow: 'hidden',
            lineHeight: 1
          }
          return (
            <View style={stickyHeaderStyle}>
              {section.header}
            </View>
          )
        }
      }
    }
    return null
  }, [stickyHeader, renderOffset, sectionOffsets, sections, isHorizontal, props.headerHeight, props.headerWidth, props.itemHeight, props.itemWidth, props.itemSize, props.itemData])

  // 渲染分组+item双层虚拟滚动
  const renderSections = () => {
    const nodes: React.ReactNode[] = []
    let offset = sectionOffsets[startSection]
    let globalItemIndex = 0 // 全局 item 索引（跨 section）

    // 计算起始 section 之前的所有 item 数量
    for (let s = 0; s < startSection; s++) {
      globalItemIndex += sections[s].items.length
    }

    for (let s = startSection; s <= endSection; s++) {
      const section = sections[s]
      const headerSize = getHeaderSize(s)
      const itemSizes = section.items.map((_, i) => getItemSize(globalItemIndex + i))
      // header
      if (section.header) {
        const sectionIndex = s
        // 动态测量时外层定位容器不设固定高度，由内层撑开
        const sectionHeaderStyle: React.CSSProperties = {
          position: 'absolute',
          zIndex: 2,
          boxSizing: 'border-box',
          width: '100%',
          minHeight: '20px',
          overflow: 'hidden',
          lineHeight: 1,
          ...(isHorizontal
            ? { top: 0, height: '100%', left: offset, width: props.useResizeObserver ? undefined : headerSize }
            : { top: offset, height: props.useResizeObserver ? undefined : headerSize })
        }

        // header ref 回调（用于 ResizeObserver 测量）
        const headerRefCallback = props.useResizeObserver ? (el: HTMLElement | null) => {
          if (el) {
            headerRefsRef.current.set(sectionIndex, el)
            resizeObserver.observe(el, -sectionIndex - 1) // 用负数索引区分 header 和 item
            requestAnimationFrame(() => {
              if (!headerRefsRef.current.has(sectionIndex)) return
              const rect = el.getBoundingClientRect()
              const measured = isHorizontal ? rect.width : rect.height
              if (measured > 0) {
                const oldSize = headerSizeCacheRef.current.get(sectionIndex) ?? getDefaultHeaderSize()
                if (Math.abs(oldSize - measured) >= 1) {
                  headerSizeCacheRef.current.set(sectionIndex, measured)
                  if (sizeCacheRafRef.current == null) {
                    sizeCacheRafRef.current = requestAnimationFrame(() => {
                      sizeCacheRafRef.current = null
                      setSizeCacheVersion((v) => v + 1)
                    })
                  }
                }
              }
            })
          } else {
            const oldEl = headerRefsRef.current.get(sectionIndex)
            if (oldEl) {
              resizeObserver.unobserve(oldEl)
              headerRefsRef.current.delete(sectionIndex)
            }
          }
        } : undefined

        // 动态尺寸时：外层定位，内层撑开以便测量
        const headerContentStyle: React.CSSProperties = props.useResizeObserver
          ? (isHorizontal ? { boxSizing: 'border-box', width: 'max-content', height: '100%' } : { boxSizing: 'border-box', width: '100%' })
          : {}

        if (props.useResizeObserver) {
          nodes.push(
            React.createElement(View, {
              key: section.key + '-header',
              style: sectionHeaderStyle,
            }, React.createElement(View, {
              ref: headerRefCallback,
              style: headerContentStyle,
            }, section.header))
          )
        } else {
          nodes.push(
            React.createElement(View, {
              key: section.key + '-header',
              style: sectionHeaderStyle,
            }, section.header)
          )
        }
        offset += headerSize
      }
      // item offsets
      const itemOffsets = accumulate(itemSizes.map((size) => size + space))
      // 内层虚拟滚动：可见item区间
      let startItem = 0; let endItem = section.items.length - 1
      for (let i = 0; i < section.items.length; i++) {
        if (offset + itemOffsets[i + 1] > renderOffset) {
          startItem = Math.max(0, i - cacheCount)
          break
        }
      }
      for (let i = startItem; i < section.items.length; i++) {
        if (offset + itemOffsets[i] >= renderOffset + containerLength) {
          endItem = Math.min(section.items.length - 1, i + cacheCount)
          break
        }
      }

      // 更新可见起始索引（用于 ScrollCorrection）
      if (s === startSection && startItem === 0) {
        visibleStartIndexRef.current = globalItemIndex
      } else if (s === startSection) {
        visibleStartIndexRef.current = globalItemIndex + startItem
      }

      // 渲染可见item
      for (let i = startItem; i <= endItem; i++) {
        const currentGlobalIndex = globalItemIndex + i
        const itemId = `list-item-${currentGlobalIndex}`

        // 内联样式替代className
        const sectionItemStyle: React.CSSProperties = {
          position: 'absolute',
          zIndex: 1,
          boxSizing: 'border-box',
          width: '100%',
          minHeight: '20px',
          overflow: 'hidden',
          lineHeight: 1,
          ...(isHorizontal
            ? {
              top: 0,
              height: '100%',
              left: offset + itemOffsets[i],
              width: itemSizes[i],
              marginRight: space
            }
            : {
              top: offset + itemOffsets[i],
              height: itemSizes[i],
              marginBottom: space
            })
        }

        // ref 回调（用于 ResizeObserver）：绑定到「内层内容容器」，测量的是内容真实高度
        // 后加载项：挂载后单帧 RAF 备用测量；仅当尺寸实际变化时才 bump 版本，避免与 ResizeObserver 重复触发导致连续两次重渲染（卡顿）
        const refCallback = (el: HTMLElement | null) => {
          if (el) {
            itemRefsRef.current.set(currentGlobalIndex, el)
            resizeObserver.observe(el, currentGlobalIndex)
            requestAnimationFrame(() => {
              if (!itemRefsRef.current.has(currentGlobalIndex)) return
              const rect = el.getBoundingClientRect()
              const measured = isHorizontal ? rect.width : rect.height
              if (measured > 0) {
                const oldSize = sizeCache.getItemSize(currentGlobalIndex)
                sizeCache.setItemSize(currentGlobalIndex, measured)
                scrollCorrection.recordSizeChange(currentGlobalIndex, oldSize, measured)
                props.onItemSizeChange?.(currentGlobalIndex, measured)
                // 仅当测量值与缓存差异 ≥1px 时才驱动重渲染，避免 ResizeObserver 已更新后 fallback 再触发一次 bump 造成卡顿
                if (Math.abs(oldSize - measured) >= 1 && sizeCacheRafRef.current == null) {
                  sizeCacheRafRef.current = requestAnimationFrame(() => {
                    sizeCacheRafRef.current = null
                    setSizeCacheVersion((v) => v + 1)
                  })
                }
              }
            })
          } else {
            const oldEl = itemRefsRef.current.get(currentGlobalIndex)
            if (oldEl) {
              resizeObserver.unobserve(oldEl)
              itemRefsRef.current.delete(currentGlobalIndex)
            }
          }
        }

        // 动态尺寸时：外层负责定位，内层由内容撑开以便测量真实尺寸。
        // 纵向：内层 width:100% 无 height，由内容撑开，测到的是内容高度。
        // 横向：width:max-content + height:100%：
        //   - width:max-content 便于测量真实宽度；
        //   - height:100% 让测量层与外层 slot 条带高度一致，避免「外层条带 180px、内层 wrapper 只有内容高度」导致的内外高度差。
        const contentWrapperStyle: React.CSSProperties = props.useResizeObserver
          ? (isHorizontal ? { boxSizing: 'border-box', width: 'max-content', height: '100%' } : { boxSizing: 'border-box', width: '100%' })
          : {}

        const outerItemProps: any = {
          key: section.key + '-item-' + i,
          id: itemId,
          style: sectionItemStyle,
        }

        if (props.useResizeObserver) {
          const innerProps: any = {
            ref: refCallback,
            style: contentWrapperStyle,
          }
          innerProps['data-index'] = String(currentGlobalIndex)
          nodes.push(
            React.createElement(View, outerItemProps, React.createElement(View, innerProps, section.items[i]))
          )
        } else {
          nodes.push(React.createElement(View, outerItemProps, section.items[i]))
        }
      }

      globalItemIndex += section.items.length
      offset += itemOffsets[itemOffsets.length - 1]
    }

    return nodes
  }

  // 渲染 NoMore 内容
  const renderNoMoreContent = () => {
    if (!noMoreConfig || !noMoreConfig.visible) return null

    const noMoreHeightValue = noMoreConfig.height || 60
    const listContentEnd = sectionOffsets[sectionOffsets.length - 1]

    const defaultStyle: React.CSSProperties = {
      position: 'absolute',
      ...(isHorizontal
        ? { left: listContentEnd, top: 0, width: noMoreHeightValue, height: '100%' }
        : { top: listContentEnd, left: 0, width: '100%', height: noMoreHeightValue }
      ),
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      color: '#999',
      fontSize: '14px',
      boxSizing: 'border-box',
      ...noMoreConfig.style
    }

    return (
      <View style={defaultStyle} data-testid="list-nomore">
        {noMoreConfig.children || noMoreConfig.text || '没有更多了'}
      </View>
    )
  }

  // 空列表场景：仅显示 NoMore
  if (sections.length === 0 && noMoreConfig?.visible) {
    return (
      <ScrollView ref={containerRef as any} {...scrollViewProps}>
        <View style={{
          minHeight: containerLength,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          ...containerStyle
        }}>
          {renderNoMoreContent()}
        </View>
      </ScrollView>
    )
  }

  // 可滚区域总尺寸（H5 顶栏悬浮时 = 仅列表高度，顶栏不占滚动）
  const contentWrapperStyle: React.CSSProperties = isHorizontal
    ? { width: totalLength, position: 'relative', height: '100%' }
    : { height: totalLength, position: 'relative', width: '100%' }
  const listWrapperStyle: React.CSSProperties = isHorizontal
    ? { width: listContentLength, position: 'relative' as const, height: '100%' }
    : { height: listContentLength, position: 'relative' as const, width: '100%' }
  const pullTranslate: React.CSSProperties =
    refresherHeightForH5 > 0 && h5RefresherProps.pullDistance !== 0
      ? { transform: `translateY(${h5RefresherProps.pullDistance}px)` }
      : {}

  return (
    <ScrollView ref={containerRef as any} {...scrollViewProps} id={listId}>
      <View style={contentWrapperStyle}>
        {refresherHeightForH5 > 0 ? (
          <>
            {/* H5 刷新层在下方：absolute 贴顶、不占流、zIndex 低，被列表盖住 */}
            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: refresherHeightForH5,
                zIndex: 0,
              }}
            >
              {renderRefresherContent()}
            </View>
            {/* 列表在上方：zIndex 高盖住刷新层，下拉时 translateY 下移露出下面刷新内容 */}
            {/* 需要 background 遮住下方刷新层，因为 renderSections 是 absolute 定位不占流空间 */}
            <View style={{ ...listWrapperStyle, ...pullTranslate, zIndex: 1, background: style?.background ?? style?.backgroundColor ?? '#fff' }}>
              {stickyHeaderNode}
              {renderSections()}
              {renderNoMoreContent()}
            </View>
          </>
        ) : (
          <>
            {renderRefresherContent()}
            {stickyHeaderNode}
            {renderSections()}
            {renderNoMoreContent()}
          </>
        )}
      </View>
    </ScrollView>
  )
}

export { List, ListItem, NoMore, StickyHeader, StickySection }
export default List
