import * as React from 'react'

interface Options {
  range: string[]
  selectedIndex: number
  columnId: string
  updateDay?: (value: number, column: number) => void
  scrollViewRef: React.MutableRefObject<any>
  isTouchingRef: React.MutableRefObject<boolean>
  readIndex: () => number
  align: (index: number) => void
  onSelect?: (index: number) => void
}

/** 日期列的视觉高亮不等于选择意图：初始化/缩放动画中的途经项不得提交。 */
export function usePickerDateSync(options: Options) {
  const optionsRef = React.useRef(options)
  optionsRef.current = options
  const alignmentIndexRef = React.useRef(options.selectedIndex)
  const [currentIndex, setCurrentIndex] = React.useState(options.selectedIndex)
  const focusTargetRef = React.useRef<number | null>(null)
  const previousRangeRef = React.useRef(JSON.stringify(options.range))
  const settleRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearSettle = React.useCallback(() => {
    if (settleRef.current != null) clearTimeout(settleRef.current)
    settleRef.current = null
  }, [])
  const clamp = React.useCallback((index: number) => {
    const length = optionsRef.current.range.length
    return length > 0 && Number.isFinite(index) ? Math.max(0, Math.min(Math.round(index), length - 1)) : -1
  }, [])
  const alignTarget = React.useCallback(() => {
    const o = optionsRef.current
    const index = clamp(alignmentIndexRef.current)
    if (index < 0 || o.isTouchingRef.current || !o.scrollViewRef.current) return
    alignmentIndexRef.current = index
    o.align(index)
  }, [clamp])

  // 父级经常创建同内容的range数组，不能因此取消拖动或重发初始化目标。
  const rangeKey = JSON.stringify(options.range)
  React.useLayoutEffect(() => {
    clearSettle()
    optionsRef.current.isTouchingRef.current = false
    const next = clamp(optionsRef.current.selectedIndex)
    if (next !== alignmentIndexRef.current || previousRangeRef.current !== rangeKey) focusTargetRef.current = null
    previousRangeRef.current = rangeKey
    alignmentIndexRef.current = next
    setCurrentIndex(alignmentIndexRef.current)
    alignTarget()
  }, [options.selectedIndex, rangeKey, options.columnId, alignTarget, clamp, clearSettle])
  React.useEffect(() => clearSettle, [clearSettle])

  const focusIfAligned = React.useCallback(() => {
    const o = optionsRef.current
    const target = focusTargetRef.current
    if (target == null || !o.scrollViewRef.current || clamp(o.readIndex()) !== target) return
    focusTargetRef.current = null
    o.onSelect?.(target)
  }, [clamp])

  const selectIndex = React.useCallback((index: number) => {
    const o = optionsRef.current
    const next = clamp(index)
    if (next < 0) return false
    clearSettle()
    o.isTouchingRef.current = false
    const changed = next !== alignmentIndexRef.current
    alignmentIndexRef.current = next
    setCurrentIndex(next)
    alignTarget()
    if (changed) {
      const numericValue = parseInt(String(o.range[next]).replace(/[^0-9]/g, ''), 10)
      if (Number.isFinite(numericValue)) o.updateDay?.(numericValue, parseInt(o.columnId, 10))
      // legacy焦点在目标实际落位后请求，不能在点击滚动途中抢焦点。
      focusTargetRef.current = o.onSelect ? next : null
      focusIfAligned()
    }
    return changed
  }, [alignTarget, clamp, clearSettle, focusIfAligned])

  const handleTouchStart = React.useCallback(() => {
    clearSettle()
    // 直到惯性停稳才解除；resize不能抢回手势前的旧目标。
    focusTargetRef.current = null
    optionsRef.current.isTouchingRef.current = true
  }, [clearSettle])
  const handleScroll = React.useCallback(() => {
    clearSettle()
    const o = optionsRef.current
    if (o.scrollViewRef.current) setCurrentIndex(clamp(o.readIndex()))
  }, [clamp, clearSettle])
  const handleScrollEnd = React.useCallback(() => {
    clearSettle()
    const o = optionsRef.current
    // 点击/无障碍在入口已提交；初始化/缩放只对齐，不从动画中间位置提交。
    if (!o.scrollViewRef.current) return
    if (!o.isTouchingRef.current) {
      focusIfAligned()
      return
    }
    settleRef.current = setTimeout(() => {
      settleRef.current = null
      const latest = optionsRef.current
      if (latest.scrollViewRef.current && latest.isTouchingRef.current) selectIndex(latest.readIndex())
    }, 100)
  }, [clearSettle, selectIndex, focusIfAligned])

  return { alignmentIndexRef, currentIndex, alignTarget, selectIndex, handleTouchStart, handleScroll, handleScrollEnd }
}
