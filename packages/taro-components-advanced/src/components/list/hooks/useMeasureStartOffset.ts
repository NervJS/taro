import { useEffect, useRef, useState } from 'react'

import type { RefObject } from 'react'

const WARNED_NESTED = new WeakSet<Element>()
const MAX_RETRY = 20
const RETRY_DELAY = 50

/**
 * 测量 scrollElement 内 content 节点之前所有兄弟的高度/宽度之和，作为 startOffset。
 * 用于 scrollElement 模式下无 Context/props 时自动计算上方内容高度。
 * - 直接子节点：累加前兄弟尺寸（更稳定）
 * - 非直接子节点：getBoundingClientRect 回退，并 warning 建议传 startOffset
 * - ref 未就绪时自动重试，确保绑定到最外层滚动容器后能正确测量
 */
export function useMeasureStartOffset(
  scrollElRef: RefObject<HTMLElement | null>,
  contentRef: RefObject<HTMLElement | null>,
  options: { enabled: boolean, isHorizontal?: boolean }
): number {
  const { enabled, isHorizontal = false } = options
  const [measuredStartOffset, setMeasuredStartOffset] = useState(0)
  const [retryTrigger, setRetryTrigger] = useState(0)
  const retryCountRef = useRef(0)

  useEffect(() => {
    if (!enabled) {
      retryCountRef.current = 0
      return
    }
    const scrollEl = scrollElRef.current
    const contentEl = contentRef.current

    // ref 未就绪时重试（如 ScrollView 与 WaterFlow 异步挂载）
    if (!scrollEl || !contentEl) {
      if (retryCountRef.current < MAX_RETRY) {
        retryCountRef.current += 1
        const id = setTimeout(() => setRetryTrigger((t) => t + 1), RETRY_DELAY)
        return () => clearTimeout(id)
      }
      return
    }
    retryCountRef.current = 0

    const measure = () => {
      const el = contentRef.current
      const scroll = scrollElRef.current
      if (!el || !scroll) return

      if (el.parentElement === scroll) {
        // 直接子节点：累加前兄弟尺寸
        let offset = 0
        let prev: Element | null = el.previousElementSibling
        while (prev) {
          offset += isHorizontal ? (prev as HTMLElement).offsetWidth : (prev as HTMLElement).offsetHeight
          prev = prev.previousElementSibling
        }
        setMeasuredStartOffset((prevVal) => (Math.abs(prevVal - offset) < 1 ? prevVal : offset))
        return
      }

      // 非直接子节点：getBoundingClientRect 回退
      const scrollRect = scroll.getBoundingClientRect()
      const contentRect = el.getBoundingClientRect()
      const offset = isHorizontal
        ? contentRect.left - scrollRect.left + scroll.scrollLeft
        : contentRect.top - scrollRect.top + scroll.scrollTop
      const value = Math.max(0, offset)
      setMeasuredStartOffset((prevVal) => (Math.abs(prevVal - value) < 1 ? prevVal : value))

      if (!WARNED_NESTED.has(el)) {
        WARNED_NESTED.add(el)
        // eslint-disable-next-line no-console
        console.warn(
          '[useMeasureStartOffset] content 不是 scrollElement 的直接子节点，使用 getBoundingClientRect 测量。' +
            '建议通过 props 或 Context 传入 startOffset 以获得更稳定的布局。'
        )
      }
    }

    measure()
    scrollEl.addEventListener('scroll', measure, { passive: true })
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null
    if (ro) {
      ro.observe(scrollEl)
      Array.from(scrollEl.children).forEach((child) => ro.observe(child))
      // 非直接子节点：content 自身或其祖先变化时也需重测
      ro.observe(contentEl)
    }
    return () => {
      scrollEl.removeEventListener('scroll', measure)
      ro?.disconnect()
    }
  }, [enabled, scrollElRef, contentRef, isHorizontal, retryTrigger])

  return measuredStartOffset
}
