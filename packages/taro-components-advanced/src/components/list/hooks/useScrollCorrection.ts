import { type MutableRefObject, useCallback, useRef } from 'react'

/**
 * useScrollCorrection Hook - ScrollTop/Left 修正
 *
 * 当列表项尺寸变化时，自动修正滚动位置，避免视觉跳动
 *
 * 策略：
 * 1. 批量处理：100ms 窗口内的多次变化合并
 * 2. 智能判断：用户滚动后 300ms 内不修正
 * 3. 范围限制：仅修正可见区域之前的变化
 * 4. 阈值过滤：小于 1px 的变化忽略
 */

interface ScrollCorrectionItem {
  index: number
  diff: number // 尺寸变化量
}

interface UseScrollCorrectionOptions {
  /** 是否启用修正 */
  enabled: boolean

  /** 可见区域起始索引（取值时读 ref.current，避免 stale） */
  visibleStartIndexRef: MutableRefObject<number>

  /** 设置滚动位置的回调 */
  setScrollOffset: (offset: number | ((prev: number) => number)) => void
}

interface UseScrollCorrectionReturn {
  /** 记录尺寸变化 */
  recordSizeChange: (index: number, oldSize: number, newSize: number) => void

  /** 标记用户正在滚动 */
  markUserScrolling: () => void

  /** 清空修正队列 */
  clearQueue: () => void
}

export function useScrollCorrection(
  options: UseScrollCorrectionOptions
): UseScrollCorrectionReturn {
  const { enabled, visibleStartIndexRef, setScrollOffset } = options

  // 修正队列
  const queueRef = useRef<ScrollCorrectionItem[]>([])

  // 修正定时器
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // 用户最后滚动时间
  const lastUserScrollTimeRef = useRef(0)

  /**
   * 记录尺寸变化
   */
  const recordSizeChange = useCallback((
    index: number,
    oldSize: number,
    newSize: number
  ) => {
    if (!enabled) return

    const diff = newSize - oldSize

    // 阈值过滤：小于 1px 的变化忽略
    if (Math.abs(diff) < 1) return

    // 添加到队列
    queueRef.current.push({ index, diff })

    // 清除旧定时器
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }

    // 延迟执行修正（批量窗口 100ms）
    timerRef.current = setTimeout(() => {
      const now = Date.now()
      const sinceLastScroll = now - lastUserScrollTimeRef.current

      // 如果用户最近 300ms 内主动滚动，跳过修正
      if (sinceLastScroll < 300) {
        queueRef.current = []
        return
      }

      // 批量计算修正量（仅修正可见区域之前的变化；读 ref 获取最新值）
      const visibleStart = visibleStartIndexRef.current
      const totalCorrection = queueRef.current
        .filter(item => item.index < visibleStart)
        .reduce((sum, item) => sum + item.diff, 0)

      // 应用修正
      if (Math.abs(totalCorrection) > 1) {
        setScrollOffset(prev => prev + totalCorrection)
      }

      // 清空队列
      queueRef.current = []
    }, 100)
  }, [enabled, visibleStartIndexRef, setScrollOffset])

  /**
   * 标记用户正在滚动
   * 在 onScroll 事件中调用
   */
  const markUserScrolling = useCallback(() => {
    lastUserScrollTimeRef.current = Date.now()
  }, [])

  /**
   * 清空修正队列
   */
  const clearQueue = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    queueRef.current = []
  }, [])

  return {
    recordSizeChange,
    markUserScrolling,
    clearQueue
  }
}
