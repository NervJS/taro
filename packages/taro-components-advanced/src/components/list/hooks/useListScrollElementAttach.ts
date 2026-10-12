import { useEffect, useRef } from 'react'

import type { RefObject } from 'react'

export interface ListScrollElementAttachRefs {
  scrollCorrection: { markUserScrolling: () => void }
  onScroll: ((e: { scrollTop: number, scrollLeft: number, detail: { scrollTop: number, scrollLeft: number } }) => void) | undefined
  onScrollToUpper: (() => void) | undefined
  onScrollToLower: (() => void) | undefined
  threshold: { upper: number, lower: number }
  listContentLength: number
}

/**
 * scrollElement 模式下：监听外部滚动驱动 renderOffset，并从 scrollElement 获取 containerLength
 */
export function useListScrollElementAttach(
  enabled: boolean,
  effectiveScrollElement: RefObject<HTMLElement | null> | null,
  effectiveStartOffset: number,
  isHorizontal: boolean,
  setContainerLength: (v: number) => void,
  updateRenderOffset: (offset: number, sync?: boolean, source?: string) => void,
  scrollRefProp: React.MutableRefObject<HTMLElement | null> | undefined,
  refsRef: RefObject<ListScrollElementAttachRefs>
) {
  const effectiveStartOffsetRef = useRef(effectiveStartOffset)
  effectiveStartOffsetRef.current = effectiveStartOffset

  useEffect(() => {
    if (!enabled || !effectiveScrollElement) return
    const el = effectiveScrollElement.current
    if (!el || typeof ResizeObserver === 'undefined') return

    const update = () => {
      const measured = isHorizontal ? el.clientWidth : el.clientHeight
      if (measured > 0) setContainerLength(measured)
      if (scrollRefProp) scrollRefProp.current = el
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [enabled, effectiveScrollElement, isHorizontal, scrollRefProp, setContainerLength])

  useEffect(() => {
    if (!enabled || !effectiveScrollElement) return

    let cancelled = false
    let teardown: (() => void) | null = null
    const maxRetries = 20

    const tryAttach = (retryCount = 0) => {
      if (cancelled) return
      const target = effectiveScrollElement.current
      if (!target) {
        if (retryCount < maxRetries) {
          requestAnimationFrame(() => tryAttach(retryCount + 1))
        }
        return
      }

      const refs = refsRef.current
      if (!refs) return

      let inUpperZone = true
      let inLowerZone = false

      const handler = () => {
        const r = refsRef.current
        if (!r) return
        const scrollPos = isHorizontal ? target.scrollLeft : target.scrollTop
        const adjustedPos = scrollPos - effectiveStartOffsetRef.current
        const effectiveAdjusted = Math.max(0, adjustedPos)
        const clientSize = isHorizontal ? target.clientWidth : target.clientHeight
        r.scrollCorrection.markUserScrolling()
        updateRenderOffset(effectiveAdjusted, false, 'scrollElement')
        const scrollTop = isHorizontal ? 0 : scrollPos
        const scrollLeft = isHorizontal ? scrollPos : 0
        r.onScroll?.({ scrollTop, scrollLeft, detail: { scrollTop, scrollLeft } })

        const { upper, lower } = r.threshold
        const innerContentLen = r.listContentLength
        const nowInUpper = effectiveAdjusted <= upper
        const nowInLower = innerContentLen > 0 && effectiveAdjusted + clientSize >= innerContentLen - lower
        if (nowInUpper && !inUpperZone) r.onScrollToUpper?.()
        if (nowInLower && !inLowerZone) r.onScrollToLower?.()
        inUpperZone = nowInUpper
        inLowerZone = nowInLower
      }

      const initialScroll = isHorizontal ? target.scrollLeft : target.scrollTop
      const initialAdjusted = Math.max(0, initialScroll - effectiveStartOffsetRef.current)
      updateRenderOffset(initialAdjusted, false, 'scrollElement')

      target.addEventListener('scroll', handler, { passive: true })
      teardown = () => target.removeEventListener('scroll', handler)
    }

    tryAttach()
    return () => {
      cancelled = true
      teardown?.()
    }
  }, [enabled, effectiveScrollElement, isHorizontal, effectiveStartOffset, updateRenderOffset, refsRef])
}
