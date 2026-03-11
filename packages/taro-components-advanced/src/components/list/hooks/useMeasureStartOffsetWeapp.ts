import Taro from '@tarojs/taro'
import { useEffect, useRef, useState } from 'react'

import type { MutableRefObject, RefObject } from 'react'

const MAX_RETRY = 20
const RETRY_DELAY = 50
/** 与 useListScrollElementAttachWeapp 容器测量间隔一致（H5 无 interval，用 ResizeObserver+scroll 事件驱动） */
const MEASURE_INTERVAL = 150

/**
 * 小程序版 startOffset 测量：通过 createSelectorQuery 获取 scroll-view 与 content 的位置，
 * 计算 content 相对于 scroll 内容顶部的偏移。
 *
 * 公式：startOffset = contentRect.top - scrollRect.top + scrollTop
 * （content 在屏幕上的 top - scroll 可视区 top + 已滚动距离）
 */
export function useMeasureStartOffsetWeapp(
  scrollElRef: RefObject<HTMLElement | null>,
  contentId: string,
  options: { enabled: boolean, isHorizontal?: boolean, startOffsetRef?: MutableRefObject<number> }
): number {
  const { enabled, isHorizontal = false, startOffsetRef } = options
  const [measuredStartOffset, setMeasuredStartOffset] = useState(0)
  const [retryTrigger, setRetryTrigger] = useState(0)
  const retryCountRef = useRef(0)
  const autoIdRef = useRef(`_ls_so_${Math.random().toString(36).slice(2, 9)}`)

  useEffect(() => {
    if (!enabled || !contentId) {
      retryCountRef.current = 0
      return
    }

    const measure = () => {
      const scrollEl = scrollElRef.current as any
      if (!scrollEl) return

      if (!scrollEl.id) {
        scrollEl.id = autoIdRef.current
      }
      const scrollViewId = scrollEl.id

      const instance = Taro.getCurrentInstance()
      const query = instance?.page
        ? Taro.createSelectorQuery().in(instance.page as any)
        : Taro.createSelectorQuery()
      query
        .select(`#${scrollViewId}`)
        .boundingClientRect()
        .select(`#${scrollViewId}`)
        .scrollOffset()
        .select(`#${contentId}`)
        .boundingClientRect()
        .exec((res) => {
          const scrollRect = res?.[0]
          const scrollInfo = res?.[1]
          const contentRect = res?.[2]
          if (!scrollRect || !scrollInfo || !contentRect) return

          const scrollTop = scrollInfo.scrollTop ?? 0
          const scrollLeft = scrollInfo.scrollLeft ?? 0
          const value = isHorizontal
            ? Math.max(0, contentRect.left - scrollRect.left + scrollLeft)
            : Math.max(0, contentRect.top - scrollRect.top + scrollTop)
          startOffsetRef && (startOffsetRef.current = value)
          setMeasuredStartOffset((prevVal) => (Math.abs(prevVal - value) < 1 ? prevVal : value))
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
    // 对标 H5：scroll 时触发测量（H5 用 scrollEl.addEventListener('scroll', measure)）
    scrollEl.addEventListener('scroll', measure)
    // 无 ResizeObserver，用 interval 兜底布局变化
    const interval = setInterval(measure, MEASURE_INTERVAL)
    return () => {
      scrollEl.removeEventListener('scroll', measure)
      clearInterval(interval)
    }
  }, [enabled, scrollElRef, contentId, isHorizontal, retryTrigger])

  return measuredStartOffset
}
