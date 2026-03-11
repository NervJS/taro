import { useEffect, useRef, useState } from 'react'

import { findScrollParent, findScrollParentTaro } from '../../../utils/scrollParent'
import { isWeapp } from '../utils'

import type { RefObject } from 'react'

const MAX_RETRY = 20
const RETRY_DELAY = 50

export type ScrollParentAutoFindStatus = 'pending' | 'found' | 'not-found'

/**
 * 自动查找 content 元素的真实滚动父节点。
 * 用于 nestedScroll 模式下无 scrollElement props/Context 时，作为第三优先级来源。
 *
 * - H5：DOM 遍历 findScrollParent(contentEl)
 * - 小程序：Taro 虚拟 DOM findScrollParentTaro(contentId)
 * - ref 未就绪时自动重试
 * - 找到后通过 setState 触发 re-render，供 effectiveScrollElement 读取
 * - status 用于 probe 阶段：pending=尚未完成，found=已找到，not-found=已尝试未找到
 */
export function useScrollParentAutoFind(
  contentRef: RefObject<HTMLElement | null>,
  options: { enabled: boolean, isHorizontal?: boolean, contentId?: string }
): { scrollParentRef: RefObject<HTMLElement | null>, status: ScrollParentAutoFindStatus } {
  const { enabled, isHorizontal = false, contentId } = options
  const scrollParentRef = useRef<HTMLElement | null>(null)
  const [status, setStatus] = useState<ScrollParentAutoFindStatus>('pending')
  const [retryTrigger, setRetryTrigger] = useState(0)
  const retryCountRef = useRef(0)

  useEffect(() => {
    if (!enabled) {
      retryCountRef.current = 0
      scrollParentRef.current = null
      setStatus('pending')
      return
    }

    if (isWeapp) {
      // 小程序：基于 contentId 在 Taro 虚拟 DOM 中查找 scroll-view
      if (!contentId) {
        setStatus('not-found')
        return
      }
      const found = findScrollParentTaro(contentId)
      if (found) {
        retryCountRef.current = 0
        scrollParentRef.current = found as unknown as HTMLElement
        setStatus('found')
      } else {
        if (retryCountRef.current < MAX_RETRY) {
          retryCountRef.current += 1
          const id = setTimeout(() => setRetryTrigger((t) => t + 1), RETRY_DELAY)
          return () => clearTimeout(id)
        }
        scrollParentRef.current = null
        setStatus('not-found')
      }
      return
    }

    // H5：DOM 遍历
    const contentEl = contentRef.current
    if (!contentEl) {
      if (retryCountRef.current < MAX_RETRY) {
        retryCountRef.current += 1
        const id = setTimeout(() => setRetryTrigger((t) => t + 1), RETRY_DELAY)
        return () => clearTimeout(id)
      }
      setStatus('not-found')
      return
    }

    retryCountRef.current = 0
    const found = findScrollParent(contentEl, !isHorizontal)
    if (found) {
      if (found !== scrollParentRef.current) {
        scrollParentRef.current = found
        setStatus('found')
      }
    } else {
      scrollParentRef.current = null
      setStatus('not-found')
    }
  }, [enabled, contentRef, isHorizontal, contentId, retryTrigger])

  return { scrollParentRef, status }
}
