import { useEffect, useRef } from 'react'

import { createSelectorQueryScoped } from '../utils'

import type { MutableRefObject, RefObject } from 'react'
import type { ListScrollElementAttachRefs } from './useListScrollElementAttach'

/**
 * 小程序版 scrollElement 模式：监听外部 scroll-view 的滚动事件驱动 renderOffset，
 * 并通过 createSelectorQuery 测量容器尺寸。
 *
 * 与 H5 版 useListScrollElementAttach 的区别：
 * - 容器尺寸通过 createSelectorQuery 测量（无 ResizeObserver）
 * - 滚动事件通过 TaroElement.addEventListener，格式为 TaroEvent（detail 合并到 target 上）
 * - 若 scroll-view 无 id，自动分配临时 id 供 SelectorQuery 使用
 */
export function useListScrollElementAttachWeapp(
  enabled: boolean,
  effectiveScrollElement: RefObject<HTMLElement | null> | null,
  effectiveStartOffsetRef: MutableRefObject<number>,
  effectiveStartOffset: number,
  isHorizontal: boolean,
  setContainerLength: (v: number) => void,
  updateRenderOffset: (offset: number, sync?: boolean, source?: string) => void,
  scrollRefProp: React.MutableRefObject<HTMLElement | null> | undefined,
  refsRef: RefObject<ListScrollElementAttachRefs>,
  /** 测量未就绪或失败时的容器长度兜底，宜与 initialContainerLength 一致 */
  fallbackContainerLength?: number,
  selectorQueryScope?: object
) {
  const containerLengthRef = useRef(0)
  const autoIdRef = useRef(`_ls_${Math.random().toString(36).slice(2, 9)}`)

  useEffect(() => {
    if (!enabled || !effectiveScrollElement) return
    const el = effectiveScrollElement.current as any
    if (!el) return
    if (scrollRefProp) scrollRefProp.current = el

    if (!el.id) {
      el.id = autoIdRef.current
    }
    const scrollViewId = el.id

    const measure = () => {
      const query = createSelectorQueryScoped(selectorQueryScope)
      query
        .select(`#${scrollViewId}`)
        .boundingClientRect()
        .exec((res) => {
          const rect = res?.[0]
          if (rect) {
            const measured = isHorizontal ? rect.width : rect.height
            if (measured > 0) {
              containerLengthRef.current = measured
              setContainerLength(measured)
              return
            }
          }
          // 兜底：rect 为空或 measured≤0 时，使用 fallback 避免 containerLengthRef 长期为 0
          if (fallbackContainerLength != null && fallbackContainerLength > 0) {
            containerLengthRef.current = fallbackContainerLength
            setContainerLength(fallbackContainerLength)
          }
        })
    }

    measure()
    const interval = setInterval(measure, 150)
    return () => clearInterval(interval)
  }, [enabled, effectiveScrollElement, isHorizontal, scrollRefProp, setContainerLength, fallbackContainerLength, selectorQueryScope])

  useEffect(() => {
    if (!enabled || !effectiveScrollElement) return

    let cancelled = false
    let teardown: (() => void) | null = null
    const maxRetries = 20

    const tryAttach = (retryCount = 0) => {
      if (cancelled) return
      const target = effectiveScrollElement.current as any
      if (!target) {
        if (retryCount < maxRetries) {
          setTimeout(() => tryAttach(retryCount + 1), 50)
        }
        return
      }

      let inUpperZone = true
      let inLowerZone = false

      const handler = (e: any) => {
        const r = refsRef.current
        if (!r) return

        const scrollPos = isHorizontal
          ? (e?.target?.scrollLeft ?? e?.mpEvent?.detail?.scrollLeft ?? 0)
          : (e?.target?.scrollTop ?? e?.mpEvent?.detail?.scrollTop ?? 0)
        const startOffset = effectiveStartOffsetRef.current
        const adjustedPos = scrollPos - startOffset
        const effectiveAdjusted = Math.max(0, adjustedPos)

        r.scrollCorrection.markUserScrolling()
        updateRenderOffset(effectiveAdjusted, false, 'scrollElement')
        const scrollTop = isHorizontal ? 0 : scrollPos
        const scrollLeft = isHorizontal ? scrollPos : 0
        r.onScroll?.({ scrollTop, scrollLeft, detail: { scrollTop, scrollLeft } })

        // 兜底：measure 未完成时 containerLengthRef 为 0，用 fallback 参与触顶/触底判断，避免漏触发
        const clientSize = containerLengthRef.current || fallbackContainerLength || 0
        if (clientSize > 0) {
          const { upper, lower } = r.threshold
          const innerContentLen = r.listContentLength
          const nowInUpper = effectiveAdjusted <= upper
          const nowInLower = innerContentLen > 0 && effectiveAdjusted + clientSize >= innerContentLen - lower
          if (nowInUpper && !inUpperZone) r.onScrollToUpper?.()
          if (nowInLower && !inLowerZone) r.onScrollToLower?.()
          inUpperZone = nowInUpper
          inLowerZone = nowInLower
        }
      }

      target.addEventListener('scroll', handler)
      teardown = () => target.removeEventListener('scroll', handler)

      // 初始 renderOffset：weapp 无法直接读 target.scrollTop，需通过 SelectorQuery 查询
      const scrollViewId = target.id || autoIdRef.current
      if (!target.id) target.id = scrollViewId
      const query = createSelectorQueryScoped(selectorQueryScope)
      query.select(`#${scrollViewId}`).scrollOffset().exec((res) => {
        const info = res?.[0]
        if (info) {
          const scrollTopVal = info.scrollTop ?? 0
          const scrollLeftVal = info.scrollLeft ?? 0
          const scrollPos = isHorizontal ? scrollLeftVal : scrollTopVal
          const startOffset = effectiveStartOffsetRef.current
          const initialAdjusted = Math.max(0, scrollPos - startOffset)
          updateRenderOffset(initialAdjusted, false, 'scrollElement')
        }
      })
    }

    tryAttach()
    return () => {
      cancelled = true
      teardown?.()
    }
  }, [enabled, effectiveScrollElement, isHorizontal, effectiveStartOffsetRef, effectiveStartOffset, updateRenderOffset, refsRef, fallbackContainerLength, selectorQueryScope])
}
