import './style/index.scss'

import { View } from '@tarojs/components'
import * as React from 'react'

import { PickerViewColumn, PickerViewColumnProps } from '../picker-view-column'

// 默认单项高度（兜底值）
const DEFAULT_ITEM_HEIGHT = 34
// harmony 无 style height / visibleItems 可倒推时的兜底可见行数（= SCSS 默认高 5 行）
const HARMONY_FALLBACK_ROWS = 5
// harmony 端：ArkUI 不解析 calc、且多级 height:100% 百分比链不成立，
// 又不能测量 DOM（见组件说明），故容器高只能由可静态读出的确定值决定。
const IS_HARMONY = process.env.TARO_PLATFORM === 'harmony'

// 同页多 PickerView 时为选项 id 提供实例前缀，避免 scrollIntoView 串到其它实例
let _pickerViewInstanceSeq = 0

export interface PickerViewProps {
  value?: number[]
  defaultValue?: number[]
  indicatorStyle?: string
  indicatorClass?: string
  maskStyle?: string
  maskClass?: string
  immediateChange?: boolean
  title?: string
  ariaLabel?: string
  onChange?: (e: { detail: { value: number[] } }) => void
  onPickStart?: (e?: unknown) => void
  onPickEnd?: (e?: unknown) => void
  // 扩展能力（超集）
  itemHeight?: number
  visibleItems?: number
  /** 点击选项是否滚至选中区，默认 true（与 Picker 对齐） */
  enableClickItemScroll?: boolean
  // StandardProps
  id?: string
  className?: string
  style?: string | React.CSSProperties
  children?: React.ReactNode
}

// 解析 indicatorStyle 字符串中的 height（纯 px 时优先用它，避免测量 DOM）
const parseHeightFromStyle = (styleStr?: string): number | null => {
  if (!styleStr) return null
  const match = styleStr.match(/height\s*:\s*(\d+(?:\.\d+)?)px/i)
  return match ? parseFloat(match[1]) : null
}

// 从对象 style 的 height 取纯数值：number 直接用，字符串取纯 px（"300px"→300）
const parseNumericHeight = (h?: string | number): number | null => {
  if (typeof h === 'number' && Number.isFinite(h)) return h
  if (typeof h === 'string') {
    const m = h.match(/^(\d+(?:\.\d+)?)px$/i)
    return m ? parseFloat(m[1]) : null
  }
  return null
}

// 将 CSS 字符串（如 "height: 50px; color: red"）解析为 React 样式对象
// H5 下 React DOM 的 style 只接受对象，不接受字符串，故需转换
const parseStyleString = (styleStr?: string): React.CSSProperties => {
  if (!styleStr) return {}
  const result: Record<string, string> = {}
  styleStr.split(';').forEach((decl) => {
    const idx = decl.indexOf(':')
    if (idx === -1) return
    const key = decl.slice(0, idx).trim()
    const val = decl.slice(idx + 1).trim()
    if (!key || !val) return
    // 转驼峰：background-color → backgroundColor
    const camelKey = key.replace(/-([a-z])/g, (_, c) => c.toUpperCase())
    result[camelKey] = val
  })
  return result as React.CSSProperties
}

// 归一化 style：字符串解析为对象，对象原样返回
const normalizeStyle = (style?: string | React.CSSProperties): React.CSSProperties => {
  if (!style) return {}
  return typeof style === 'string' ? parseStyleString(style) : style
}

export function PickerView(props: PickerViewProps) {
  const {
    value,
    defaultValue,
    indicatorStyle,
    indicatorClass,
    maskStyle,
    maskClass,
    // immediateChange：规范定义为「松手即报（依赖原生惯性预测落点）」。H5/dynamic 无法获取
    // 惯性预测终点，若在 touchend 报当前项会与最终停留项不一致，故统一在归中后上报最终项，
    // 该 prop 保留于接口（超集对齐小程序）但当前不产生行为差异。
    // title(swan)/ariaLabel(qq) 为端专属，第一版保留接口但不透传 DOM
    onChange,
    onPickStart,
    onPickEnd,
    itemHeight,
    visibleItems,
    enableClickItemScroll = true,
    id,
    className,
    style,
    children,
  } = props

  const isControlled = value !== undefined
  const indicatorRef = React.useRef<React.ElementRef<typeof View>>(null)
  const instanceIdRef = React.useRef(`pv${++_pickerViewInstanceSeq}`)

  // 过滤出有效的 PickerViewColumn 子节点
  const columns = React.Children.toArray(children).filter((child) => {
    if (!React.isValidElement(child)) return false
    if (child.type !== PickerViewColumn) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('PickerView 的直接子节点只能是 PickerViewColumn，其它节点将被忽略')
      }
      return false
    }
    return true
  }) as React.ReactElement<PickerViewColumnProps>[]

  // 每列子项数量
  const columnItemCounts = columns.map((col) =>
    React.Children.toArray(col.props.children).filter(React.isValidElement).length
  )

  // 越界 clamp：>=count→末项，<0→0
  const clampValue = (val: number, count: number): number => {
    if (count === 0) return 0
    if (val >= count) return count - 1
    if (val < 0) return 0
    return Math.floor(val)
  }

  // 归一化 value 数组：补齐列数、各列 clamp
  const normalizeValue = (raw: number[] | undefined): number[] => {
    return columnItemCounts.map((count, i) => clampValue(raw?.[i] ?? 0, count))
  }

  // 内部状态（非受控 / 滚动中暂存）
  const [innerValue, setInnerValue] = React.useState<number[]>(() =>
    normalizeValue(isControlled ? value : defaultValue)
  )
  // 最新 innerValue 的引用，供异步回调读取，避免 stale 闭包
  const innerValueRef = React.useRef(innerValue)
  innerValueRef.current = innerValue

  // itemHeight 确定：优先 prop → 解析 indicatorStyle 的 px 高 → 量 indicator offsetHeight → 兜底 34
  const [measuredItemHeight, setMeasuredItemHeight] = React.useState<number>(() => {
    if (itemHeight != null) return itemHeight
    return parseHeightFromStyle(indicatorStyle) ?? DEFAULT_ITEM_HEIGHT
  })

  React.useLayoutEffect(() => {
    if (itemHeight != null) {
      setMeasuredItemHeight(itemHeight)
      return
    }
    // indicatorStyle 是纯 px 高度时直接解析，无需测量 DOM
    const parsed = parseHeightFromStyle(indicatorStyle)
    if (parsed != null) {
      setMeasuredItemHeight(parsed)
      return
    }
    // 仅当 indicatorStyle 用了 calc/rem 等非 px 单位时才回退到测量
    const el = indicatorRef.current as unknown as HTMLElement | null
    if (el && el.offsetHeight) {
      setMeasuredItemHeight(el.offsetHeight)
    }
  }, [itemHeight, indicatorStyle])

  const effectiveItemHeight = measuredItemHeight

  // 容器高度与单项高度相互独立，滚轮始终在容器内垂直居中。
  //   - visibleItems 为正整数 → 容器高 = itemHeight × visibleItems（明确「分 N 行」意图）
  //   - 否则（未传 / 0 / 负数 / 小数 / NaN 等非法值）→ 容器高由用户 style / className / 继承决定
  //     或走 SCSS 默认高，wrapper height:100% 撑满，无需测量
  // 上下留白交给 CSS：paddingVertical = calc(50% - itemHeight/2)，让首尾项能滚到中心
  const useVisibleItems = typeof visibleItems === 'number' && Number.isInteger(visibleItems) && visibleItems > 0
  const containerHeight = useVisibleItems
    ? effectiveItemHeight * visibleItems
    : undefined

  // harmony 专用：ArkUI 不认 calc、百分比高度链不成立、又不能测量，
  // 故容器高必须解析为确定 px。优先级对齐其它端（style height > visibleItems > 兜底）：
  //   内联 style 的 px height → visibleItems×itemHeight → 兜底行数×itemHeight。
  // （className 设的高在 SCSS 里、运行时读不到，故 className 场景只能走兜底——已与用户确认接受）
  const harmonyContainerHeight = React.useMemo(() => {
    if (!IS_HARMONY) return undefined
    const styleH = parseHeightFromStyle(typeof style === 'string' ? style : undefined) ??
      (typeof style === 'object' && style ? parseNumericHeight(style.height) : null)
    if (styleH != null && styleH > 0) return styleH
    if (useVisibleItems) return effectiveItemHeight * (visibleItems as number)
    return effectiveItemHeight * HARMONY_FALLBACK_ROWS
  }, [useVisibleItems, visibleItems, effectiveItemHeight, style])

  // 受控 value 变化 → 同步内部状态（deep 比较）
  // 依赖 valueKey：对 value 做 JSON 深比较，避免引用变化但内容相同的无效同步
  const valueKey = isControlled ? JSON.stringify(value) : null
  React.useEffect(() => {
    if (isControlled) {
      const normalized = normalizeValue(value)
      innerValueRef.current = normalized
      setInnerValue(normalized)
    }
  }, [valueKey])

  // 动态增减 children / 列数 → clamp 越界并补齐，必要时触发 onChange
  const countsKey = JSON.stringify(columnItemCounts)
  const prevCountsKeyRef = React.useRef(countsKey)
  React.useEffect(() => {
    if (prevCountsKeyRef.current !== countsKey) {
      prevCountsKeyRef.current = countsKey
      const normalized = normalizeValue(innerValueRef.current)
      if (JSON.stringify(normalized) !== JSON.stringify(innerValueRef.current)) {
        innerValueRef.current = normalized
        setInnerValue(normalized)
        onChange?.({ detail: { value: normalized } })
      }
    }
  }, [countsKey])

  // 某列滚动选中 → 更新对应列索引并上报
  const handleColumnChange = (columnId: number, index: number) => {
    const prev = innerValueRef.current
    const next = columnItemCounts.map((count, i) =>
      i === columnId ? clampValue(index, count) : clampValue(prev[i] ?? 0, count)
    )
    if (JSON.stringify(next) === JSON.stringify(prev)) return
    innerValueRef.current = next
    setInnerValue(next)
    onChange?.({ detail: { value: next } })
  }

  // cloneElement 注入内部 props
  const renderedColumns = columns.map((col, columnId) =>
    React.cloneElement(col, {
      key: columnId,
      _itemHeight: effectiveItemHeight,
      _selectedIndex: clampValue(innerValue[columnId] ?? 0, columnItemCounts[columnId]),
      _columnId: columnId,
      // harmony：把解析出的确定容器高下发，列内据此用固定 px 算留白（其它端为 undefined，走 calc）
      _containerHeight: harmonyContainerHeight,
      _enableClickItemScroll: enableClickItemScroll,
      _instanceId: instanceIdRef.current,
      _onColumnChange: handleColumnChange,
      _onPickStart: onPickStart,
      _onPickEnd: onPickEnd,
    })
  )

  // indicator 的 style：用户传 indicatorStyle 则解析为对象；未指定 height 时用 itemHeight 兜底
  const parsedIndicatorStyle = normalizeStyle(indicatorStyle)
  const indicatorInlineStyle: React.CSSProperties = {
    height: effectiveItemHeight,
    ...parsedIndicatorStyle,
  }

  const normalizedRootStyle = normalizeStyle(style)
  // visibleItems 模式撑出容器高度；但用户 style 已显式设 height 时以用户为准，不注入。
  // 注入时同时解除 SCSS 的 min-height 兜底——visibleItems 是用户明确的项数意图，
  // 不应被最小高度抬高（如 visibleItems=2 不该被 min-height 撑成 3 项）。
  const rootStyle: React.CSSProperties = (useVisibleItems && normalizedRootStyle.height == null)
    ? { height: containerHeight, minHeight: 0, ...normalizedRootStyle }
    : normalizedRootStyle

  // harmony：百分比高度链不成立，需在根/wrapper/columns 逐级写死确定 px。
  // 用解析出的 harmonyContainerHeight 覆盖，并清掉 min-height（px 已确定，无需兜底抬高）。
  const rootStyleFinal: React.CSSProperties = IS_HARMONY
    ? { ...rootStyle, height: harmonyContainerHeight, minHeight: 0 }
    : rootStyle
  const chainHeightStyle: React.CSSProperties = IS_HARMONY
    ? { height: harmonyContainerHeight }
    : { height: '100%' }

  return (
    <View
      id={id}
      className={`taro-picker-view${className ? ` ${className}` : ''}`}
      style={rootStyleFinal}
    >
      <View
        className="taro-picker-view__wrapper"
        style={chainHeightStyle}
      >
        <View
          className={`taro-picker-view__mask${maskClass ? ` ${maskClass}` : ''}`}
          ariaHidden
          style={IS_HARMONY ? { ...chainHeightStyle, ...normalizeStyle(maskStyle) } : normalizeStyle(maskStyle)}
        />
        <View
          ref={indicatorRef}
          className={`taro-picker-view__indicator${indicatorClass ? ` ${indicatorClass}` : ''}`}
          ariaHidden
          style={indicatorInlineStyle}
        />
        <View
          className="taro-picker-view__columns"
          style={IS_HARMONY ? chainHeightStyle : undefined}
        >
          {renderedColumns}
        </View>
      </View>
    </View>
  )
}

PickerView.displayName = 'PickerView'

export default PickerView
