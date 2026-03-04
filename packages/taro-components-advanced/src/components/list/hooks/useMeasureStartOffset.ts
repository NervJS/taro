import { useEffect, useState } from 'react'

import type { RefObject } from 'react'

/**
 * 测量 scrollElement 内 content 节点之前所有兄弟的高度/宽度之和，作为 startOffset。
 * 用于 scrollElement 模式下无 Context 时自动计算上方内容高度（与下方 DOM stacking 对称）。
 * 用「累加前兄弟尺寸」替代 offsetTop/offsetLeft，避免 offsetParent 包含外部区域导致偏大。
 */
export function useMeasureStartOffset(
  scrollElRef: RefObject<HTMLElement | null>,
  contentRef: RefObject<HTMLElement | null>,
  options: { enabled: boolean, isHorizontal?: boolean }
): number {
  const { enabled, isHorizontal = false } = options
  const [measuredStartOffset, setMeasuredStartOffset] = useState(0)

  useEffect(() => {
    if (!enabled) return
    const scrollEl = scrollElRef.current
    const contentEl = contentRef.current
    if (!scrollEl || !contentEl) return

    const measure = () => {
      const el = contentRef.current
      if (!el || el.parentElement !== scrollEl) return
      let offset = 0
      let prev: Element | null = el.previousElementSibling
      while (prev) {
        offset += isHorizontal ? (prev as HTMLElement).offsetWidth : (prev as HTMLElement).offsetHeight
        prev = prev.previousElementSibling
      }
      setMeasuredStartOffset((prevVal) => (Math.abs(prevVal - offset) < 1 ? prevVal : offset))
    }
    measure()
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null
    if (ro) {
      ro.observe(scrollEl)
      // 同时观察 scrollEl 的直系子节点：图片加载、展开/收起等会改变兄弟高度，但 scrollEl 自身 clientHeight 不变，需观察子节点
      Array.from(scrollEl.children).forEach((child) => ro.observe(child))
      return () => ro.disconnect()
    }
  }, [enabled, scrollElRef, contentRef, isHorizontal])

  return measuredStartOffset
}
