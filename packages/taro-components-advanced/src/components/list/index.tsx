import { ScrollView, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import React from 'react'

import { useItemSizeCache } from './hooks/useItemSizeCache'
import { type ListRefresherConfig, DEFAULT_REFRESHER_HEIGHT, useRefresher } from './hooks/useRefresher'
import { useResizeObserver } from './hooks/useResizeObserver'
import { useScrollCorrection } from './hooks/useScrollCorrection'
import ListItem from './ListItem'
import NoMore, { type NoMoreProps } from './NoMore'
import StickyHeader from './StickyHeader'
import StickySection from './StickySection'
import { isH5, isWeapp, supportsNativeRefresher } from './utils'

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
  /** 透传给最外层 ScrollView 的 className，便于自定义样式 */
  className?: string

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

export interface ListHandle {
  scroll: (options?: {
    top?: number
    left?: number
  }) => void
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

// 小程序端：判断 item 是否应该执行 SelectorQuery 测量（仅检查是否已测量过）
// SelectorQuery 是只读查询，不会触发 setData，滚动期间执行是安全的
function shouldMeasureWeappItem(index: number, measuredSet: Set<number>): boolean {
  return !measuredSet.has(index)
}

// 小程序端暂不外抛 onItemSizeChange，避免父层重渲染导致 List remount 引发回顶或空白
function weappDeferItemSizeChange(_index: number, _size: number, _onItemSizeChange?: (index: number, size: number) => void) {}

const InnerList = (props: ListProps, ref: React.Ref<ListHandle | null>) => {
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
    upperThreshold = 50,
    lowerThreshold = 50,
    cacheCount = 2,
    cacheExtent,
    enableBackToTop,
    className,
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

  // 程序性滚动用的目标偏移；用户滑动期间不更新，避免与原生滚动冲突
  const [scrollViewOffset, setScrollViewOffset] = React.useState(controlledScrollTop ?? 0)

  // 用户正在滑动时不再向 ScrollView 传 scrollTop，让滚动完全由原生接管
  const [isUserScrolling, setIsUserScrolling] = React.useState(false)
  // isUserScrolling 的 ref 镜像，供异步上下文读取最新值
  const isUserScrollingRef = React.useRef(false)

  const initialContainerLength = typeof (isHorizontal ? width : height) === 'number' ? (isHorizontal ? (width as number) : (height as number)) : 400
  const [containerLength, setContainerLength] = React.useState<number>(initialContainerLength)

  // 用容器实际尺寸更新视口长度，避免 props 与 CSS 不一致导致底部空白
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
  // H5：仅程序性滚动时写回 DOM scrollTop，用户滑动结束后不写回避免卡顿
  const programmaticScrollRef = React.useRef(false)
  // 小程序端程序性滚动冷却期：handleScroll 只更新 renderOffset，避免 scrollIntoView 后被原生回调拉回
  const programmaticCooldownRef = React.useRef(false)
  const programmaticCooldownTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const scrollViewOffsetRef = React.useRef(0)
  // 处理渲染偏移量更新。
  // syncToScrollView=true：程序性滚动，立即同步 scrollViewOffset。
  // syncToScrollView=false：用户滑动，仅更新 renderOffset。weapp 采用 recycle-view 策略：不把用户滑动位置同步到 scrollViewOffset，避免「传滞后值拉回」和「从有到无归顶」。
  const updateRenderOffset = React.useCallback((newOffset: number, syncToScrollView?: boolean, source?: string) => {
    lastScrollTopRef.current = newOffset
    isScrollingRef.current = true

    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current)
    }

    setRenderOffset(newOffset) // 始终更新虚拟列表用到的偏移

    if (syncToScrollView) {
      isUserScrollingRef.current = false
      setIsUserScrolling(false)
      // 小程序：target===sv 时 ScrollView 认为无变化不滚动→白屏；imperative/scrollIntoView 时先传中间值再 RAF 传 target 强制触发
      // target=0 用 +0.01；target>0 用 -0.01（统一 +0.01 到底部会被 clamp 成同值无效）
      const same = isWeapp && Math.abs(scrollViewOffsetRef.current - newOffset) < 1
      const needForce = same && (source === 'imperative' || source === 'scrollIntoView')
      if (needForce) {
        const intermediate = newOffset > 0 ? newOffset - 0.01 : 0.01
        setScrollViewOffset(intermediate)
        requestAnimationFrame(() => {
          setScrollViewOffset(newOffset)
        })
      } else {
        setScrollViewOffset(newOffset)
      }
      programmaticScrollRef.current = true
      if (isWeapp) {
        programmaticCooldownRef.current = true
        if (programmaticCooldownTimerRef.current) {
          clearTimeout(programmaticCooldownTimerRef.current)
        }
        programmaticCooldownTimerRef.current = setTimeout(() => {
          programmaticCooldownRef.current = false
        }, 500)
      }
    } else {
      isUserScrollingRef.current = true
      setIsUserScrolling(true)
    }

    scrollTimeoutRef.current = setTimeout(() => {
      isScrollingRef.current = false
      if (!syncToScrollView) {
        isUserScrollingRef.current = false
        setIsUserScrolling(false)
        // weapp recycle-view 策略：用户滑动结束后不同步 scrollViewOffset，保持 pass 的值不变，避免 从有到无 归顶
        if (!isWeapp) {
          setScrollViewOffset(lastScrollTopRef.current)
        }
      }
    }, isWeapp ? 200 : 150)
  }, [])

  // 暴露给外部的实例方法：通过 ref.scroll({ top / left }) 进行程序性滚动
  React.useImperativeHandle(
    ref,
    () => ({
      scroll(options) {
        const opts = options ?? {}
        const isHorizontal = scrollX === true
        const top = typeof opts.top === 'number' ? opts.top : undefined
        const left = typeof opts.left === 'number' ? opts.left : undefined

        let targetOffset = 0
        if (isHorizontal) {
          if (typeof left === 'number') {
            targetOffset = left
          } else if (typeof top === 'number') {
            targetOffset = top
          }
        } else {
          if (typeof top === 'number') {
            targetOffset = top
          } else if (typeof left === 'number') {
            targetOffset = left
          }
        }

        if (!Number.isFinite(targetOffset)) {
          targetOffset = 0
        }

        updateRenderOffset(targetOffset, true, 'imperative')
      },
    }),
    [scrollX, updateRenderOffset]
  )

  // 提取 Refresher 配置（List 属性为 base，Refresher 子组件覆盖）
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
          return
        }
        const childProps = child.props as NoMoreProps
        config = { ...childProps, visible: childProps.visible !== false }
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

  // Refresher 平台适配：H5 用 addImperativeTouchListeners
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

  // H5 下拉刷新顶栏高度（默认 50px，来自 useRefresher）
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

  // 动态尺寸管理
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
  // 小程序端：已完成 SelectorQuery 测量的 item 索引集，避免 refCallback 重复触发测量导致无限循环
  const weappMeasuredItemsRef = React.useRef<Set<number>>(new Set())
  // 动态尺寸缓存更新版本：setItemSize 后递增，用于驱动 sectionOffsets/totalLength 与 item 定位重算
  const [sizeCacheVersion, setSizeCacheVersion] = React.useState(0)
  const sizeCacheRafRef = React.useRef<number | null>(null)
  // 小程序端：测量触发 re-render 时，reflow 帧传 eff 并同步 scrollViewOffset，避免下一帧传 0 导致跳变
  const measureScrollProtectRef = React.useRef(false)
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

  // ScrollTop 修正（仅 H5）：动高时尺寸变化自动修正 scrollTop
  const scrollCorrectionEnabled = !isWeapp && props.useResizeObserver === true
  const scrollCorrection = useScrollCorrection({
    enabled: scrollCorrectionEnabled,
    visibleStartIndexRef,
    setScrollOffset: (offsetOrUpdater) => {
      const newOffset = typeof offsetOrUpdater === 'function'
        ? offsetOrUpdater(renderOffset)
        : offsetOrUpdater
      updateRenderOffset(newOffset, true, 'scrollCorrection') // 程序性修正需同步到 ScrollView
    }
  })

  // 小程序 + 动高（virtual-list 风格）：测量变化后同帧重排，不做程序性 scrollTop 回拉
  const scheduleWeappDynamicReflow = React.useCallback(() => {
    if (!isWeapp || props.useResizeObserver !== true) return
    if (sizeCacheRafRef.current != null) return
    sizeCacheRafRef.current = requestAnimationFrame(() => {
      sizeCacheRafRef.current = null
      measureScrollProtectRef.current = true
      setSizeCacheVersion((v) => v + 1)
    })
  }, [isWeapp, props.useResizeObserver])

  // ResizeObserver（当启用动态测量时）
  const resizeObserver = useResizeObserver({
    enabled: props.useResizeObserver === true,
    isHorizontal,
    listId,
    onResize: (index, size) => {
      const oldSize = sizeCache.getItemSize(index)
      sizeCache.setItemSize(index, size)

      if (Math.abs(oldSize - size) >= 1) {
        if (isWeapp && props.useResizeObserver === true) {
          scheduleWeappDynamicReflow()
        } else if (sizeCacheRafRef.current == null) {
          sizeCacheRafRef.current = requestAnimationFrame(() => {
            sizeCacheRafRef.current = null
            setSizeCacheVersion((v) => v + 1)
          })
        }
      }

      // 触发 ScrollTop 修正
      scrollCorrection.recordSizeChange(index, oldSize, size)

      // 小程序：延迟 onItemSizeChange，避免父组件重渲染导致 List remount
      // H5：直接回调
      if (isWeapp) {
        weappDeferItemSizeChange(index, size, props.onItemSizeChange)
      } else {
        props.onItemSizeChange?.(index, size)
      }
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

  // 分组累积高度/宽度，sizeCacheVersion 变化时重算
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

  // 视口内可见 item 的全局索引范围（供 onScrollIndex）
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


  const handleScroll = React.useCallback((e: any) => {
    let newOffset: number
    if (e.detail) {
      newOffset = isHorizontal ? e.detail.scrollLeft : e.detail.scrollTop
    } else {
      newOffset = isHorizontal ? e.scrollLeft : e.scrollTop
    }

    const effectiveOffset = newOffset
    const diff = effectiveOffset - lastScrollTopRef.current
    scrollDiffListRef.current.shift()
    scrollDiffListRef.current.push(diff)
    const shaking = isScrollingRef.current && isShaking(scrollDiffListRef.current)
    if (shaking) return

    if (programmaticCooldownRef.current) {
      lastScrollTopRef.current = effectiveOffset
      setRenderOffset(effectiveOffset)
      onScroll?.({
        scrollTop: isHorizontal ? 0 : newOffset,
        scrollLeft: isHorizontal ? newOffset : 0
      })
      return
    }

    scrollCorrection.markUserScrolling()
    updateRenderOffset(effectiveOffset, false, 'onScroll')

    onScroll?.({
      scrollTop: isHorizontal ? 0 : newOffset,
      scrollLeft: isHorizontal ? newOffset : 0
    })
  }, [isHorizontal, onScroll, updateRenderOffset, scrollCorrection, props.useResizeObserver])

  // 小程序：onScrollEnd 优先结束 isUserScrolling，timeout 兜底
  const handleNativeScrollEnd = React.useCallback(() => {
    if (isWeapp) {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
        scrollTimeoutRef.current = null
      }
      if (isUserScrollingRef.current) {
        isScrollingRef.current = false
        isUserScrollingRef.current = false
        setIsUserScrolling(false)
        // recycle-view 策略：不把用户滑动位置同步到 scrollViewOffset
      }
    }
    onScrollEnd?.()
  }, [isWeapp, onScrollEnd])


  // controlledScrollTop 变化时同步到 ScrollView
  React.useEffect(() => {
    if (typeof controlledScrollTop === 'number') {
      const sv = scrollViewOffsetRef.current
      const same = isWeapp && Math.abs(sv - controlledScrollTop) < 1
      if (same) {
        const intermediate = controlledScrollTop > 0 ? controlledScrollTop - 0.01 : 0.01
        setRenderOffset(intermediate)
        setScrollViewOffset(intermediate)
        requestAnimationFrame(() => {
          setRenderOffset(controlledScrollTop)
          setScrollViewOffset(controlledScrollTop)
        })
      } else {
        setRenderOffset(controlledScrollTop)
        setScrollViewOffset(controlledScrollTop)
      }
      lastScrollTopRef.current = controlledScrollTop
      programmaticScrollRef.current = true
    }
  }, [controlledScrollTop])

  // 清理定时器、ResizeObserver 与尺寸缓存 RAF（仅在卸载时执行）
  React.useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
      // 小程序端冷却期定时器清理
      if (isWeapp && programmaticCooldownTimerRef.current) {
        clearTimeout(programmaticCooldownTimerRef.current)
      }
      if (sizeCacheRafRef.current != null) {
        cancelAnimationFrame(sizeCacheRafRef.current)
        sizeCacheRafRef.current = null
      }
      resizeObserver.disconnect()
      scrollCorrection.clearQueue()
    }
  }, [])

  // scrollIntoView：仅当 scrollIntoView 变化时执行一次跳动，统一转换为 scrollTop 路径（updateRenderOffset）。
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
      updateRenderOffset(targetOffset, true, 'scrollIntoView')
    }
  }, [props.scrollIntoView, totalItemCount, sections, getHeaderSize, getItemSize, space, updateRenderOffset])

  // 容器样式；H5 刷新中禁止滚动
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

  // ScrollView 属性
  const scrollViewProps: Record<string, unknown> = {
    scrollY: !scrollX && scrollY,
    scrollX,
    style: containerStyle,
    className,
    enhanced: true,
    showScrollbar,
    upperThreshold,
    lowerThreshold,
    scrollWithAnimation: false,
    onScroll: handleScroll,
    onScrollToUpper,
    onScrollToLower,
    onScrollStart,
    onScrollEnd: handleNativeScrollEnd,
    enableBackToTop,
    // 小程序端：开启滚动锚定，防止虚拟列表子节点通过 setData 更新时原生 scroll-view 重置滚动位置
    ...(isWeapp ? { scrollAnchoring: true } : {}),
    ...(typeof cacheExtent === 'number' ? { cacheExtent } : {}),
    'data-testid': 'taro-list-container',

    ...scrollViewRefresherProps,
    ...scrollViewRefresherHandlers,
  }

  // H5 对齐小程序：refresherTriggered=true 时顶部立即显示加载指示器，滚到顶部并锁定滚动直至设为 false
  React.useEffect(() => {
    if (!isH5 || !refresherConfig || supportsNativeRefresher || !h5RefresherProps.isRefreshing) return
    updateRenderOffset(0, true, 'refresher')
  }, [h5RefresherProps.isRefreshing, isH5, refresherConfig, supportsNativeRefresher, updateRenderOffset])

  // H5 下拉刷新：ref 存 addImperativeTouchListeners，避免 config 变化导致 effect 循环
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

  scrollViewOffsetRef.current = scrollViewOffset
  // scrollTop：weapp 传 scrollViewOffset（reflow 帧传 eff 防跳变）；H5 仅非用户滑动时传
  if (isWeapp) {
    if (measureScrollProtectRef.current) {
      measureScrollProtectRef.current = false
      const eff = lastScrollTopRef.current
      setScrollViewOffset(eff)
      if (isHorizontal) {
        scrollViewProps.scrollLeft = eff
      } else {
        scrollViewProps.scrollTop = eff
      }
      programmaticScrollRef.current = false
    } else {
      const sv = scrollViewOffset
      if (isHorizontal) {
        scrollViewProps.scrollLeft = sv
      } else {
        scrollViewProps.scrollTop = sv
      }
      programmaticScrollRef.current = false
    }
  } else {
    // H5：非用户滑动时传
    if (!isUserScrolling) {
      if (isHorizontal) {
        scrollViewProps.scrollLeft = scrollViewOffset
      } else {
        scrollViewProps.scrollTop = scrollViewOffset
      }
    }
  }

  // H5：程序性滚动时写回 DOM scrollTop
  React.useEffect(() => {
    if (!isH5) return
    if (isUserScrolling || !containerRef.current || typeof scrollViewOffset !== 'number') return
    if (!programmaticScrollRef.current) return
    const scrollValue = scrollViewOffset
    if (isHorizontal) {
      containerRef.current.scrollLeft = scrollValue
    } else {
      containerRef.current.scrollTop = scrollValue
    }
    programmaticScrollRef.current = false
  }, [isH5, scrollViewOffset, isHorizontal, isUserScrolling])

  // 总高度/宽度（含 NoMore）
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
            const measureAndUpdateHeader = (measured: number) => {
              if (measured > 0) {
                const oldSize = headerSizeCacheRef.current.get(sectionIndex) ?? getDefaultHeaderSize()
                if (Math.abs(oldSize - measured) >= 1) {
                  headerSizeCacheRef.current.set(sectionIndex, measured)
                  if (isWeapp && props.useResizeObserver === true) {
                    scheduleWeappDynamicReflow()
                  } else if (sizeCacheRafRef.current == null) {
                    sizeCacheRafRef.current = requestAnimationFrame(() => {
                      sizeCacheRafRef.current = null
                      setSizeCacheVersion((v) => v + 1)
                    })
                  }
                }
              }
            }
            if (isH5) {
              requestAnimationFrame(() => {
                if (!headerRefsRef.current.has(sectionIndex)) return
                const rect = el.getBoundingClientRect()
                measureAndUpdateHeader(isHorizontal ? rect.width : rect.height)
              })
            } else if (isWeapp) {
              Taro.nextTick(() => {
                if (!headerRefsRef.current.has(sectionIndex)) return
                Taro.createSelectorQuery()
                  .select(`#${listId}-list-header-inner-${sectionIndex}`)
                  .boundingClientRect((rect: any) => {
                    if (rect) {
                      measureAndUpdateHeader(isHorizontal ? rect.width : rect.height)
                    }
                  })
                  .exec()
              })
            }
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
          ? (
            isHorizontal
              // weapp 下 max-content 兼容性不稳定，改用 inline-flex 收缩包裹以测得真实宽度
              ? (isWeapp
                ? { boxSizing: 'border-box', display: 'inline-flex', height: '100%' }
                : { boxSizing: 'border-box', width: 'max-content', height: '100%' })
              : { boxSizing: 'border-box', width: '100%' }
          )
          : {}

        if (props.useResizeObserver) {
          const headerInnerProps: any = {
            ref: headerRefCallback,
            style: headerContentStyle,
            'data-index': String(-sectionIndex - 1), // 用于 unobserve 获取 index；与 observe(el, -sectionIndex-1) 对应
          }
          if (isWeapp) {
            headerInnerProps.id = `${listId}-list-header-inner-${sectionIndex}`
          }
          nodes.push(
            React.createElement(View, {
              key: section.key + '-header',
              style: sectionHeaderStyle,
            }, React.createElement(View, headerInnerProps, section.header))
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

        // ResizeObserver：绑定内层内容容器测量真实尺寸，尺寸变化时才 bump 版本
        const refCallback = (el: HTMLElement | null) => {
          if (el) {
            const capturedIndex = currentGlobalIndex
            itemRefsRef.current.set(capturedIndex, el)
            resizeObserver.observe(el, capturedIndex)

            // H5：使用 getBoundingClientRect 进行 fallback 测量
            // 小程序：使用 SelectorQuery 进行 fallback 测量（小程序没有 getBoundingClientRect）
            const measureAndUpdate = (measured: number) => {
              if (measured > 0) {
                const oldSize = sizeCache.getItemSize(capturedIndex)
                if (Math.abs(oldSize - measured) < 1) return
                sizeCache.setItemSize(capturedIndex, measured)
                scrollCorrection.recordSizeChange(capturedIndex, oldSize, measured)
                if (isWeapp && props.useResizeObserver === true) {
                  scheduleWeappDynamicReflow()
                } else if (sizeCacheRafRef.current == null) {
                  sizeCacheRafRef.current = requestAnimationFrame(() => {
                    sizeCacheRafRef.current = null
                    setSizeCacheVersion((v) => v + 1)
                  })
                }
                // 小程序：延迟 onItemSizeChange，避免父组件重渲染导致 List remount
                if (isWeapp) {
                  weappDeferItemSizeChange(capturedIndex, measured, props.onItemSizeChange)
                } else {
                  props.onItemSizeChange?.(capturedIndex, measured)
                }
              }
            }

            if (isH5) {
              requestAnimationFrame(() => {
                if (!itemRefsRef.current.has(capturedIndex)) return
                const rect = el.getBoundingClientRect()
                measureAndUpdate(isHorizontal ? rect.width : rect.height)
              })
            } else if (isWeapp) {
              // 小程序端：使用 SelectorQuery 测量内层内容容器的实际尺寸
              // 注意：必须选 inner 容器（无固定高度，由内容撑开），不能选 outer（有虚拟列表设置的固定高度）
              // 已测量过的 item 跳过，避免 refCallback 重复触发导致无限循环
              // 滚动期间跳过 SelectorQuery（不加入 weappMeasuredItemsRef），避免异步查询干扰 scroll-view
              // SelectorQuery 是只读查询，滚动期间执行安全
              if (shouldMeasureWeappItem(capturedIndex, weappMeasuredItemsRef.current)) {
                weappMeasuredItemsRef.current.add(capturedIndex)
                // 使用 Taro.nextTick 代替 setTimeout(50)：等待下一帧渲染完成后再测量
                // 比固定延时更快（减少"预估→实测"闪烁）且更可靠（保证 DOM 已更新）
                Taro.nextTick(() => {
                  if (!itemRefsRef.current.has(capturedIndex)) return
                  Taro.createSelectorQuery()
                    // 页面上可能同时存在多个 List，inner id 必须带 listId 前缀避免跨列表误命中
                    .select(`#${listId}-list-item-inner-${capturedIndex}`)
                    .boundingClientRect((rect: any) => {
                      if (rect) {
                        measureAndUpdate(isHorizontal ? rect.width : rect.height)
                      }
                    })
                    .exec()
                })
              }
            }
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
          ? (
            isHorizontal
              // weapp 下 max-content 兼容性不稳定，改用 inline-flex 收缩包裹以测得真实宽度
              ? (isWeapp
                ? { boxSizing: 'border-box', display: 'inline-flex', height: '100%' }
                : { boxSizing: 'border-box', width: 'max-content', height: '100%' })
              : { boxSizing: 'border-box', width: '100%' }
          )
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
          // 小程序端需要 id 用于 SelectorQuery 测量内容真实尺寸；H5 端不需要（用 getBoundingClientRect）
          if (isWeapp) {
            // 页面内多 List 并存时避免 id 冲突（例如 demo 同页含多个 List）
            innerProps.id = `${listId}-list-item-inner-${currentGlobalIndex}`
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

  // 可滚区域总尺寸
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
  const h5RefresherTranslateY = -refresherHeightForH5 + h5RefresherProps.pullDistance

  // 内容区域渲染
  const renderContentArea = () => (
    <View style={contentWrapperStyle}>
      {refresherHeightForH5 > 0 ? (
        <>
          {/* H5 刷新层默认上移隐藏；下拉时按 pullDistance 同步露出 */}
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: refresherHeightForH5,
              zIndex: 0,
              transform: `translateY(${h5RefresherTranslateY}px)`,
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
          {!supportsNativeRefresher && renderRefresherContent()}
          {stickyHeaderNode}
          {renderSections()}
          {renderNoMoreContent()}
        </>
      )}
    </View>
  )

  return (
    <ScrollView ref={containerRef as any} {...scrollViewProps} id={listId}>
      {/* 小程序：slot="refresher" 必须是 ScrollView 的直接子元素 */}
      {supportsNativeRefresher && renderRefresherContent()}
      {renderContentArea()}
    </ScrollView>
  )
}

const List = React.forwardRef<ListHandle, ListProps>(InnerList)

export { List, ListItem, NoMore, StickyHeader, StickySection }
export default List
