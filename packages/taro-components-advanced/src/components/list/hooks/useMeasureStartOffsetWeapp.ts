import { useEffect, useRef, useState } from 'react'

import { createSelectorQueryForRef } from '../utils'

import type { MutableRefObject, RefObject } from 'react'

const MAX_RETRY = 20
const RETRY_DELAY = 50
/** 与 useListScrollElementAttachWeapp 容器测量间隔一致（H5 无 interval，用 ResizeObserver+scroll 事件驱动） */
const MEASURE_INTERVAL = 150

/**
 * 小程序版 startOffset：对外层 scroll-view 与带 `contentId` 的外包各执行一次 SelectorQuery（各自 `weappScope(ref)`），
 * 再合并结果；避免二者不在同一自定义组件时，单次 `in` 链式 `select` 查不全。
 *
 * 公式：startOffset = contentRect.top - scrollRect.top + scrollTop
 */
export function useMeasureStartOffsetWeapp(
  scrollElRef: RefObject<HTMLElement | null>,
  contentId: string,
  options: {
    enabled: boolean
    isHorizontal?: boolean
    startOffsetRef?: MutableRefObject<number>
    /** 挂载 `id={contentId}` 的嵌套内容外包 View；第二次 query 用其 ref 取 content 侧 `_scope` */
    contentWrapperRef: RefObject<HTMLElement | null>
  }
): number {
  const { enabled, isHorizontal = false, startOffsetRef, contentWrapperRef } = options
  const [measuredStartOffset, setMeasuredStartOffset] = useState(0)
  const [retryTrigger, setRetryTrigger] = useState(0)
  const retryCountRef = useRef(0)
  const autoIdRef = useRef(`_ls_so_${Math.random().toString(36).slice(2, 9)}`)

  useEffect(() => {
    if (!enabled || !contentId) {
      retryCountRef.current = 0
      return
    }

    const applyRects = (scrollRect: any, scrollInfo: any, contentRect: any) => {
      if (!scrollRect || !scrollInfo || !contentRect) return
      const scrollTop = scrollInfo.scrollTop ?? 0
      const scrollLeft = scrollInfo.scrollLeft ?? 0
      const value = isHorizontal
        ? Math.max(0, contentRect.left - scrollRect.left + scrollLeft)
        : Math.max(0, contentRect.top - scrollRect.top + scrollTop)
      if (startOffsetRef) startOffsetRef.current = value
      setMeasuredStartOffset((prevVal) => (Math.abs(prevVal - value) < 1 ? prevVal : value))
    }

    const measure = () => {
      const scrollEl = scrollElRef.current as any
      if (!scrollEl) return

      if (!scrollEl.id) {
        scrollEl.id = autoIdRef.current
      }
      const scrollViewId = scrollEl.id

      createSelectorQueryForRef(scrollElRef)
        .select(`#${scrollViewId}`)
        .boundingClientRect()
        .select(`#${scrollViewId}`)
        .scrollOffset()
        .exec((scrollRes) => {
          const scrollRect = scrollRes?.[0]
          const scrollInfo = scrollRes?.[1]
          if (!scrollRect || !scrollInfo) return
          createSelectorQueryForRef(contentWrapperRef)
            .select(`#${contentId}`)
            .boundingClientRect()
            .exec((contentRes) => {
              const contentRect = contentRes?.[0]
              applyRects(scrollRect, scrollInfo, contentRect)
            })
        })
    }

    const scrollEl = scrollElRef.current
    if (!scrollEl) {
      if (retryCountRef.current < MAX_RETRY) {
        retryCountRef.current += 1
        const id = setTimeout(() => setRetryTrigger((t) => t + 1), RETRY_DELAY)
        return () => clearTimeout(id)
      }
      return
    }
    retryCountRef.current = 0
    measure()
    scrollEl.addEventListener('scroll', measure)
    const interval = setInterval(measure, MEASURE_INTERVAL)
    return () => {
      scrollEl.removeEventListener('scroll', measure)
      clearInterval(interval)
    }
  }, [enabled, scrollElRef, contentId, contentWrapperRef, isHorizontal, retryTrigger])

  return measuredStartOffset
}
