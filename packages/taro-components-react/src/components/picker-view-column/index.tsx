import { ScrollView, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import * as React from 'react'

import { resolveUseMeasuredScale } from '../../utils/picker-scale'

type TaroScrollView = React.ElementRef<typeof ScrollView>
type TaroView = React.ElementRef<typeof View>

function requestAccessibilityFocusOnView(node: TaroView | null | undefined): void {
  if (node == null) return
  const fn = (Taro as any).setAccessibilityFocus
  if (typeof fn !== 'function') return
  fn({ viewRef: { current: node } as React.RefObject<any> })
}

function usePickerItemScrollIntoView(): [string, (itemId: string) => void] {
  const [scrollIntoView, setScrollIntoView] = React.useState('')
  const pulseRef = React.useRef(0)
  const scrollToItemId = React.useCallback((itemId: string) => {
    pulseRef.current += 1
    const token = pulseRef.current
    setScrollIntoView('')
    setTimeout(() => {
      if (pulseRef.current !== token) return
      setScrollIntoView(itemId)
    }, 0)
  }, [])
  return [scrollIntoView, scrollToItemId]
}

// 默认单项高度（兜底值）
const DEFAULT_ITEM_HEIGHT = 34

// 启用新版无障碍（slider 遮挡方案）所需的最低 app 版本；低于此版本或非 dynamic 端不加 slider
const MIN_A11Y_APP_VERSION = '15.9.50'

// 逐段比较版本号：v1 > v2 返回 1，v1 < v2 返回 -1，相等返回 0（缺失段按 0 处理）
function compareVersion(v1: string, v2: string): number {
  const a = String(v1).split('.')
  const b = String(v2).split('.')
  const len = Math.max(a.length, b.length)
  for (let i = 0; i < len; i++) {
    const n1 = parseInt(a[i], 10) || 0
    const n2 = parseInt(b[i], 10) || 0
    if (n1 > n2) return 1
    if (n1 < n2) return -1
  }
  return 0
}

// 模块级缓存：app version 不变，只算一次，避免 column 高频 re-render 每帧都调 getSystemInfoSync。
// 未就绪（空 version / 抛错）时不写缓存、仅本次返回 false，下次 render 重试，保留 runtime 就绪后自愈能力。
let _sliderA11yResolved: boolean | undefined
function resolveUseSliderA11y(): boolean {
  if (_sliderA11yResolved !== undefined) return _sliderA11yResolved
  if (process.env.TARO_ENV !== 'dynamic') { _sliderA11yResolved = false; return false }
  try {
    const version = (Taro as any).getSystemInfoSync()?.version || ''
    if (!version) return false // 未就绪：不缓存，下次重试
    _sliderA11yResolved = compareVersion(version, MIN_A11Y_APP_VERSION) >= 0
    return _sliderA11yResolved
  } catch {
    return false // 未就绪：不缓存，下次重试
  }
}

// 从 React 节点递归收集 string/number 子节点拼接文本，供无障碍播报用。
// 复杂嵌套 / 纯图标 / 自定义组件无字符串子节点时返空，则不播报（可接受）。
function extractTextFromNode(node: React.ReactNode): string {
  if (node == null || typeof node === 'boolean') return ''
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(extractTextFromNode).join('')
  if (React.isValidElement(node)) return extractTextFromNode((node.props as any).children)
  return ''
}

// 将 CSS 字符串解析为 React 样式对象（H5 下 DOM style 只接受对象）
const normalizeStyle = (style?: string | React.CSSProperties): React.CSSProperties => {
  if (!style) return {}
  if (typeof style !== 'string') return style
  const result: Record<string, string> = {}
  style.split(';').forEach((decl) => {
    const idx = decl.indexOf(':')
    if (idx === -1) return
    const key = decl.slice(0, idx).trim()
    const val = decl.slice(idx + 1).trim()
    if (!key || !val) return
    const camelKey = key.replace(/-([a-z])/g, (_, c) => c.toUpperCase())
    result[camelKey] = val
  })
  return result as React.CSSProperties
}

// 计算 lengthScaleRatio（大屏适配缩放比）
const calculateLengthScaleRatio = (res: Taro.getSystemInfo.Result): number => {
  let lengthScaleRatio = (res as any)?.lengthScaleRatio
  if (lengthScaleRatio == null || lengthScaleRatio === 0) {
    lengthScaleRatio = 1
    if (res.windowWidth < 320) {
      lengthScaleRatio = res.windowWidth / 320
    } else if (res.windowWidth >= 400 && res.windowWidth < 600) {
      lengthScaleRatio = res.windowWidth / 400
    }
    const shortSide = res.windowWidth < res.windowHeight ? res.windowWidth : res.windowHeight
    const isBigScreen = shortSide >= 600
    if (isBigScreen) {
      lengthScaleRatio = shortSide / 720
    }
  }
  return lengthScaleRatio
}

// 设置 scrollTop（按平台决定是否乘缩放比）
const setTargetScrollTopWithScale = (
  setTargetScrollTop: (value: number) => void,
  baseValue: number,
  randomOffset?: number,
  lengthScaleRatio: number = 1,
) => {
  if (process.env.TARO_ENV === 'h5' || process.env.TARO_ENV === 'weapp') {
    const finalValue = randomOffset !== undefined ? baseValue + randomOffset : baseValue
    setTargetScrollTop(finalValue)
    return
  }
  if (process.env.TARO_PLATFORM === 'harmony') {
    const finalValue = randomOffset !== undefined ? baseValue + randomOffset : baseValue
    setTargetScrollTop(finalValue)
  } else {
    const scaledValue = baseValue * lengthScaleRatio
    const finalValue = randomOffset !== undefined ? scaledValue + randomOffset : scaledValue
    setTargetScrollTop(finalValue)
  }
}

// 根据 scrollTop 计算选中索引
const getSelectedIndex = (scrollTop: number, itemHeight: number, lengthScaleRatio: number = 1, useMeasuredScale: boolean = false): number => {
  if (!useMeasuredScale || process.env.TARO_PLATFORM === 'harmony') {
    return Math.round(scrollTop / itemHeight)
  }
  return Math.round(scrollTop / lengthScaleRatio / itemHeight)
}

export interface PickerViewColumnProps {
  children?: React.ReactNode
  id?: string
  className?: string
  style?: string | React.CSSProperties
  ariaLabel?: string
  // 以下为父组件 PickerView 通过 cloneElement 注入的内部 props
  _itemHeight?: number
  _selectedIndex?: number
  _columnId?: number
  // harmony 专用：父组件解析出的确定容器高（px）。其它端为 undefined，留白走 calc(50%)
  _containerHeight?: number
  /** 点击选项是否滚至选中区，默认 true */
  _enableClickItemScroll?: boolean
  /** 同页多实例时保证选项 id 唯一，避免 scrollIntoView 命中其它 PickerView */
  _instanceId?: string
  _onColumnChange?: (columnId: number, index: number) => void
  _onPickStart?: () => void
  _onPickEnd?: () => void
}

export function PickerViewColumn(props: PickerViewColumnProps) {
  const {
    children,
    id,
    className,
    style,
    _itemHeight = DEFAULT_ITEM_HEIGHT,
    _selectedIndex = 0,
    _columnId = 0,
    _containerHeight,
    _enableClickItemScroll = true,
    _instanceId = '0',
    _onColumnChange,
    _onPickStart,
    _onPickEnd,
  } = props

  // 过滤有效子节点，得到真实可选项
  const items = React.Children.toArray(children).filter(React.isValidElement)
  const itemCount = items.length

  // 新版无障碍（slider 遮挡方案）：仅 dynamic 且 app≥15.9.50、且列非空时启用。
  // 整列作单 slider，读屏转子 increment/decrement 切相邻项；覆盖层置于 ScrollView 下层，上层 ScrollView 接管手势滚动。
  // 须在 handleScroll / handleScrollEnd 之前定义，避免 no-use-before-define。
  const useSliderA11y = resolveUseSliderA11y() && itemCount > 0

  const [targetScrollTop, setTargetScrollTop] = React.useState(0)
  const scrollViewRef = React.useRef<TaroScrollView>(null)
  const firstItemRef = React.useRef<React.ElementRef<typeof View>>(null)
  const selectedIndexPropRef = React.useRef(_selectedIndex)
  selectedIndexPropRef.current = _selectedIndex
  const syncScrollFromPropsRef = React.useRef(false)
  const isTouchingRef = React.useRef(false)
  const itemRefs = React.useRef<Array<TaroView | null>>([])
  const pendingScrollSettleFocusRef = React.useRef(false)
  const [scrollIntoView, scrollToItemId] = usePickerItemScrollIntoView()
  const [currentIndex, setCurrentIndex] = React.useState(_selectedIndex)
  // 程序化定位（初始 / 受控跳转）不加动画，避免 dynamic 端内容尺寸就绪前动画帧被 clamp 成 0；
  // 用户手势归中吸附时才开动画，得到顺滑的吸附过渡。初值 false 保证首帧定位无滚入感。
  const [enableAnim, setEnableAnim] = React.useState(false)

  const lengthScaleRatioRef = React.useRef(1)
  const useMeasuredScaleRef = React.useRef(false)
  // 单项渲染高度：初值取注入的期望值，挂载后从 DOM 实测覆盖，
  // 以对齐 Taro rem 缩放后的真实像素（与容器高度同坐标系）。
  const itemHeightRef = React.useRef(_itemHeight)
  // 用于驱动留白 calc 重算的实测高度（渲染坐标系）
  const [renderItemHeight, setRenderItemHeight] = React.useState(_itemHeight)

  // 计算单项高度：对齐 picker-group calculateItemHeight 的平台/缩放分支，
  // 但因本组件留白是 calc(50%) 半屏高、与 item 不等高，不能用 scrollHeight/childNodes 平均，
  // 改为量单个 item 的 offsetHeight（所有 item 等高，item[0] 即代表值）。
  const measureItemHeight = React.useCallback(() => {
    let next: number
    if (process.env.TARO_PLATFORM === 'harmony') {
      // harmony：不依赖 DOM 测量，用设计值（measuredScale 时乘 ratio）
      next = useMeasuredScaleRef.current
        ? _itemHeight * lengthScaleRatioRef.current
        : _itemHeight
    } else {
      const el = firstItemRef.current as unknown as HTMLElement | null
      const h = el?.offsetHeight
      if (!h || h <= 0) return // 不可测量（native offsetHeight 缺失 / 隐藏态）：保留现值
      // measuredScale 模式下 scrollHeight 已被系统放大，需除 ratio 换算回设计坐标系
      next = useMeasuredScaleRef.current ? h / lengthScaleRatioRef.current : h
    }
    if (next > 0 && next !== itemHeightRef.current) {
      itemHeightRef.current = next
      setRenderItemHeight(next)
    }
  }, [_itemHeight])

  // 初始化缩放模式判定
  React.useEffect(() => {
    Taro.getSystemInfo({
      success: (res) => {
        lengthScaleRatioRef.current = calculateLengthScaleRatio(res)
        useMeasuredScaleRef.current = resolveUseMeasuredScale(res)
      },
      fail: () => {
        lengthScaleRatioRef.current = 1
        useMeasuredScaleRef.current = false
      }
    })
  }, [])

  // 挂载 / children 数量 / 期望高变化后，实测真实单项高度
  React.useLayoutEffect(() => {
    measureItemHeight()
  }, [measureItemHeight, itemCount, _itemHeight])

  // props selectedIndex 变化 / 实测高变化：编程式滚至对应项，400ms 内标记为程序化滚动
  React.useEffect(() => {
    if (scrollViewRef.current && itemCount > 0 && !isTouchingRef.current) {
      syncScrollFromPropsRef.current = true
      // 程序化定位不加动画：dynamic 端内容尺寸就绪前动画帧会被 clamp 成 0，直接 set 才能在
      // onContentSizeChange 后被原生补齐；初始加载也不需要滚入感。
      setEnableAnim(false)
      const baseValue = _selectedIndex * itemHeightRef.current
      setTargetScrollTopWithScale(setTargetScrollTop, baseValue, undefined, lengthScaleRatioRef.current)
      setCurrentIndex(_selectedIndex)
      const tid = setTimeout(() => {
        syncScrollFromPropsRef.current = false
      }, 400)
      return () => clearTimeout(tid)
    }
  }, [_selectedIndex, itemCount, renderItemHeight])

  // 越界 clamp：>=count→末项，<0→0
  const clampIndex = (index: number): number => {
    if (itemCount === 0 || !Number.isFinite(index)) return 0
    if (index >= itemCount) return itemCount - 1
    if (index < 0) return 0
    return index
  }

  const isCenterTimerId = React.useRef<NodeJS.Timeout | null>(null)

  // 滚动静止后归中并同步选中
  const handleScrollEnd = () => {
    if (!scrollViewRef.current) return
    if (isCenterTimerId.current) {
      clearTimeout(isCenterTimerId.current)
      isCenterTimerId.current = null
    }
    // 100ms 内无新滚动则归中并提交索引
    isCenterTimerId.current = setTimeout(() => {
      if (!scrollViewRef.current) return
      const scrollTop = scrollViewRef.current.scrollTop
      const newIndex = getSelectedIndex(scrollTop, itemHeightRef.current, lengthScaleRatioRef.current, useMeasuredScaleRef.current)
      isTouchingRef.current = false

      const clamped = clampIndex(newIndex)

      // legacy a11y: 聚焦仅依赖用户滚动标记（pending），且放在 sync 早退之前——
      // 这样即便本拍 sync 因受控回传竞态被置 true，聚焦仍能触发（修"不播报"根因）。
      const shouldFocusOnScrollSettle = pendingScrollSettleFocusRef.current
      pendingScrollSettleFocusRef.current = false
      if (!useSliderA11y && shouldFocusOnScrollSettle) {
        requestAccessibilityFocusOnView(itemRefs.current[clamped])
      }

      // 程序化滚动（受控定位 / slider 转子步进的回中）触发的 scrollEnd：不重复归中、不重复上报。
      // slider 的 commitIndexByA11y 已上报一次并置 sync=true，靠此早退去重（避免 _onPickEnd 重复）；
      // 受控回传的二次 settle 同理。早退须在归中之前，避免误开动画覆盖 effect 的 setEnableAnim(false)。
      if (syncScrollFromPropsRef.current) {
        syncScrollFromPropsRef.current = false
        isCenterTimerId.current = null
        return
      }

      const baseValue = clamped * itemHeightRef.current
      const randomOffset = Math.random() * 0.001
      // 用户手势归中：开动画，得到顺滑吸附过渡（此时内容尺寸已就绪，set 不会被 clamp）
      setEnableAnim(true)
      setTargetScrollTopWithScale(setTargetScrollTop, baseValue, randomOffset, lengthScaleRatioRef.current)
      // 惯性停下归中时上报最终停留项：保证 onChange 值 = 最终视觉项。
      // immediateChange 语义（松手即报）依赖原生惯性预测落点，H5/dynamic 无法获取，故统一走此路径。
      _onColumnChange?.(_columnId, clamped)
      _onPickEnd?.()

      isCenterTimerId.current = null
    }, 100)
  }

  // 滚动中：更新高亮索引
  const handleScroll = () => {
    if (!scrollViewRef.current) return
    if (isCenterTimerId.current) {
      clearTimeout(isCenterTimerId.current)
      isCenterTimerId.current = null
    }
    const scrollTop = scrollViewRef.current.scrollTop
    const newIndex = getSelectedIndex(scrollTop, itemHeightRef.current, lengthScaleRatioRef.current, useMeasuredScaleRef.current)
    if (newIndex !== selectedIndexPropRef.current) {
      if (!useSliderA11y) {
        if (!syncScrollFromPropsRef.current || isTouchingRef.current) {
          pendingScrollSettleFocusRef.current = true
        }
      }
      if (isTouchingRef.current) {
        syncScrollFromPropsRef.current = false
      }
    }
    const clamped = clampIndex(newIndex)
    if (clamped !== currentIndex) {
      setCurrentIndex(clamped)
    }
  }

  // 切换后主动播报当前项：焦点停在 slider 覆盖层上，aria 属性更新读屏不会自动重读，需主动触发
  const announceIndex = (index: number) => {
    const text = extractTextFromNode(items[index])
    if (!text) return
    const fn = (Taro as any).accessibilityAnnounce
    if (typeof fn !== 'function') return
    fn({ announce: text, delay: 300 })
  }

  // 无障碍步进提交：切到相邻项并上报
  const commitIndexByA11y = (nextIndex: number) => {
    const clamped = clampIndex(nextIndex)
    if (clamped === currentIndex) return
    isTouchingRef.current = false
    setCurrentIndex(clamped)
    // 标记程序化滚动：本次 setTargetScrollTop 会让 ScrollView settle 并重入 handleScrollEnd。
    // 不设此 flag 的话 handleScrollEnd 会再次上报 + 触发 _onPickEnd（_onPickEnd 无 dedup，
    // 每步误报"选择结束"）。设 true 后 handleScrollEnd 命中早退，只由本函数上报一次。
    syncScrollFromPropsRef.current = true
    // a11y 步进恒在内容就绪后，开动画得到顺滑过渡（不会被 clamp）
    setEnableAnim(true)
    const baseValue = clamped * itemHeightRef.current
    setTargetScrollTopWithScale(setTargetScrollTop, baseValue, Math.random() * 0.001, lengthScaleRatioRef.current)
    // 只上报列变更（父级 handleColumnChange 有 JSON dedup）；不调 _onPickEnd（步进非手势结束）
    _onColumnChange?.(_columnId, clamped)
    announceIndex(clamped)
  }

  const handleAriaAction = (e: any) => {
    const actionName = e?.detail?.actionName
    if (actionName === 'increment') commitIndexByA11y(currentIndex + 1)
    else if (actionName === 'decrement') commitIndexByA11y(currentIndex - 1)
  }

  // 无障碍 label：当前项文本；取不到（纯图标/复杂节点）则不挂
  const ariaLabel = useSliderA11y
    ? (extractTextFromNode(items[currentIndex]) || undefined)
    : undefined

  // 每个 child 包固定高度容器，保证 index×itemHeight 计算可靠。
  // slider 模式：整列作单 slider，item 全 ariaHidden（读屏只认覆盖层）。
  // legacy 模式：item 是独立无障碍节点,挂 ref(聚焦) + id + onClick(点击跳转)。
  //   包裹 View 的子节点是用户 children(可能是嵌套 View 而非纯文本),自身无可播报名字，
  //   聚焦它读屏会静音；故 legacy 下注入 ariaLabel(提取文本)让它成为有名字的可聚焦叶子，
  //   对齐 picker 老版"View 直接裹字符串"的隐式行为。
  const wrappedItems = items.map((child, index) => {
    const itemId = `picker-view-item-${_instanceId}-${_columnId}-${index}`
    const itemLabel = !useSliderA11y ? (extractTextFromNode(child) || undefined) : undefined
    return (
      <View
        key={index}
        id={!useSliderA11y ? itemId : undefined}
        ref={(el) => {
          if (index === 0) (firstItemRef as any).current = el
          if (!useSliderA11y) itemRefs.current[index] = el
        }}
        className="taro-picker-view__item"
        {...(useSliderA11y ? { ariaHidden: true } : {})}
        {...(itemLabel ? { ariaLabel: itemLabel } : {})}
        {...(!useSliderA11y && _enableClickItemScroll
          ? { onClick: () => scrollToItemId(itemId) }
          : {})}
        style={{ height: _itemHeight, overflow: 'hidden' }}
      >
        {child}
      </View>
    )
  })

  // 留白高度：
  //   - harmony：ArkUI 不解析 calc、百分比链不成立，用确定 px = (容器高 − 单项高)/2，
  //     使选中项（首项）中心对齐容器中线；容器高由父组件解析下发（_containerHeight）。
  //   - 其它端：calc(50% - 半项高)，依赖百分比高度链精确居中。
  const isHarmony = process.env.TARO_PLATFORM === 'harmony'
  const harmonyBlankPx = _containerHeight != null
    ? Math.max((_containerHeight - _itemHeight) / 2, 0)
    : 0
  const blankHeight: string | number = isHarmony
    ? harmonyBlankPx
    : `calc(50% - ${renderItemHeight / 2}px)`
  // harmony 上 ScrollView 自身也要确定 px（SCSS 的 height:100% 在 ArkUI 不成立）
  const columnStyle: React.CSSProperties = isHarmony && _containerHeight != null
    ? { height: _containerHeight, ...normalizeStyle(style) }
    : normalizeStyle(style)
  // harmony 嵌套滚动：selfOnly 让本列独占滚动，不把手势链传给外层 ScrollView，
  // 避免嵌在可滚动页面时父子争抢（下拉内部先、上拉外部先）。其它端不透传该属性。
  const nestedScrollProps = isHarmony
    ? { scrollForward: 'selfOnly', scrollBackward: 'selfOnly' }
    : {}

  const blankTop = (
    <View
      className="taro-picker-view__column-blank"
      {...(useSliderA11y ? { ariaHidden: true } : {})}
      style={{ height: blankHeight }}
    />
  )
  const blankBottom = (
    <View
      className="taro-picker-view__column-blank"
      {...(useSliderA11y ? { ariaHidden: true } : {})}
      style={{ height: blankHeight }}
    />
  )

  // 非 slider 模式：ScrollView 直接作列（与改造前完全一致，其它端零影响）
  // legacy a11y: enableClickItemScroll 时加 scrollIntoView + scrollIntoViewAlignment 支持点击跳转
  if (!useSliderA11y) {
    const clickScrollViewProps = _enableClickItemScroll
      ? { scrollIntoView, scrollIntoViewAlignment: 'center' as const }
      : {}
    return (
      <ScrollView
        ref={scrollViewRef}
        id={id}
        className={`taro-picker-view__column${className ? ` ${className}` : ''}`}
        scrollY
        showScrollbar={false}
        style={columnStyle}
        scrollTop={targetScrollTop}
        {...clickScrollViewProps}
        onScroll={handleScroll}
        onTouchStart={() => { isTouchingRef.current = true; _onPickStart?.() }}
        onScrollEnd={handleScrollEnd}
        scrollWithAnimation={enableAnim}
        {...nestedScrollProps}
      >
        {blankTop}
        {wrappedItems}
        {blankBottom}
      </ScrollView>
    )
  }

  // slider 模式：ScrollView 外包 relative 容器承载覆盖层。
  //   - 容器保留 taro-picker-view__column（flex:1 主轴撑宽，harmony 已证明）+ 用户 className；harmony 补 height px。
  //   - ScrollView 去掉列 class、加 a11y 隐藏；harmony 显式 height px + width:100%（harmony 上 height:100% 链失效、width:100% 有效），不依赖容器 flex 交叉轴 stretch。
  //   - id 仍落在 ScrollView（与非 slider 一致，防丢失）。
  const containerStyle: React.CSSProperties = isHarmony && _containerHeight != null
    ? { position: 'relative', height: _containerHeight, ...normalizeStyle(style) }
    : { position: 'relative', ...normalizeStyle(style) }
  const scrollViewStyle: React.CSSProperties = isHarmony && _containerHeight != null
    ? { height: _containerHeight, width: '100%' }
    : { height: '100%' }
  // 覆盖层：harmony 上 top/bottom:0 派生高度失效（同 height:100% 那类），仿 __mask 用 width:100% + 显式 px。
  // absolute 铺满整列 + zIndex:0，置于 ScrollView(relative + zIndex:1)下层：
  // 上层 ScrollView 接管手势滚动，覆盖层不设 pointerEvents 也不拦触摸；
  // 读屏因 ScrollView ariaHidden 被跳过，焦点落到下层未 hidden 的覆盖层——无需 checkIsOpenAccessibility。
  const overlayStyle: React.CSSProperties = isHarmony && _containerHeight != null
    ? { position: 'absolute', top: 0, left: 0, width: '100%', height: _containerHeight, zIndex: 0 }
    : { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }
  // ScrollView 需为定位元素(relative)且 zIndex 更高，才能真正盖在 absolute 覆盖层上层接管手势
  const scrollViewLayeredStyle: React.CSSProperties = { ...scrollViewStyle, position: 'relative', zIndex: 1 }

  return (
    <View
      className={`taro-picker-view__column${className ? ` ${className}` : ''}`}
      style={containerStyle}
    >
      {/* 无障碍焦点靶：置于 ScrollView 之前(下层)。读屏焦点落此（内部无可滚动祖先，
          左右滑=切焦点而非滚动）；上层 ScrollView 接管手势，故无需 pointerEvents:none。 */}
      <View
        className="taro-picker-view__a11y-overlay"
        style={overlayStyle}
        ariaRole="slider"
        ariaLabel={ariaLabel}
        // @ts-expect-error Taro View 未声明无障碍扩展 props
        ariaAction={[
          { name: 'increment', label: 'increment' },
          { name: 'decrement', label: 'decrement' },
        ]}
        onAriaAction={handleAriaAction}
      />
      <ScrollView
        ref={scrollViewRef}
        id={id}
        scrollY
        showScrollbar={false}
        ariaHidden
        style={scrollViewLayeredStyle}
        scrollTop={targetScrollTop}
        onScroll={handleScroll}
        onTouchStart={() => { isTouchingRef.current = true; _onPickStart?.() }}
        onScrollEnd={handleScrollEnd}
        scrollWithAnimation={enableAnim}
        {...nestedScrollProps}
      >
        {blankTop}
        {wrappedItems}
        {blankBottom}
      </ScrollView>
    </View>
  )
}

PickerViewColumn.displayName = 'PickerViewColumn'

export default PickerViewColumn
