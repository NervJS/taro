import { type ScrollElementContextValue, ScrollElementContext } from '@tarojs/components-react'
import { useContext, useRef } from 'react'

import { isH5 } from '../utils'
import { useMeasureStartOffset } from './useMeasureStartOffset'
import { useScrollParentAutoFind } from './useScrollParentAutoFind'

import type { RefObject } from 'react'

const EMPTY_SCROLL_REF = { current: null as HTMLElement | null }

export interface UseListNestedScrollResult {
  effectiveScrollElement: RefObject<HTMLElement | null> | null
  effectiveStartOffset: number
  useScrollElementMode: boolean
  needAutoFind: boolean
  autoFindStatus: 'pending' | 'found' | 'not-found'
  contentWrapperRef: RefObject<HTMLDivElement | null>
}

/**
 * 合并嵌套滚动相关逻辑：Context、自动查找、startOffset 测量、scrollElement 解析
 */
export function useListNestedScroll(
  listType: 'default' | 'nested',
  scrollElement?: RefObject<HTMLElement | null>,
  startOffsetProp?: number,
  isHorizontal: boolean = false
): UseListNestedScrollResult {
  const contentWrapperRef = useRef<HTMLDivElement>(null)
  const scrollElementCtx = useContext(ScrollElementContext) as ScrollElementContextValue | null
  const ctxStart = scrollElementCtx?.startOffset
  const hasExplicitCtxStartOffset = ctxStart != null && ctxStart > 0

  const needAutoFind =
    listType === 'nested' &&
    !scrollElement &&
    !scrollElementCtx?.scrollRef &&
    isH5
  const { scrollParentRef: autoFoundRef, status: autoFindStatus } = useScrollParentAutoFind(
    contentWrapperRef,
    { enabled: !!needAutoFind, isHorizontal }
  )

  const effectiveScrollElement =
    scrollElement ??
    scrollElementCtx?.scrollRef ??
    (needAutoFind && autoFindStatus === 'found' ? autoFoundRef : null)

  const needMeasure =
    listType === 'nested' &&
    effectiveScrollElement &&
    isH5 &&
    startOffsetProp == null &&
    !hasExplicitCtxStartOffset
  const measuredStartOffset = useMeasureStartOffset(
    effectiveScrollElement ?? EMPTY_SCROLL_REF,
    contentWrapperRef,
    { enabled: !!needMeasure, isHorizontal }
  )

  const effectiveStartOffset =
    startOffsetProp ??
    (ctxStart != null && ctxStart > 0 ? ctxStart : null) ??
    measuredStartOffset ??
    0

  const useScrollElementMode = listType === 'nested' && !!(effectiveScrollElement && isH5)

  if (listType === 'nested' && !effectiveScrollElement && isH5 && autoFindStatus === 'not-found') {
    // eslint-disable-next-line no-console
    console.warn('[List] nestedScroll 模式但无 scrollElement（props/Context/自动查找），回退为 default')
  }

  return {
    effectiveScrollElement,
    effectiveStartOffset,
    useScrollElementMode,
    needAutoFind,
    autoFindStatus,
    contentWrapperRef,
  }
}
