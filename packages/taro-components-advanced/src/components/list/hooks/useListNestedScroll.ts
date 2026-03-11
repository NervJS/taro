import React, { useContext, useMemo, useRef } from 'react'

import {
  type ScrollElementContextValueShape,
  ScrollElementContextOrFallback,
} from '../../../utils/scrollElementContext'
import { isH5, isWeapp } from '../utils'
import { useMeasureStartOffset } from './useMeasureStartOffset'
import { useMeasureStartOffsetWeapp } from './useMeasureStartOffsetWeapp'
import { useScrollParentAutoFind } from './useScrollParentAutoFind'

import type { RefObject } from 'react'

const EMPTY_SCROLL_REF = { current: null as HTMLElement | null }

export interface UseListNestedScrollResult {
  effectiveScrollElement: RefObject<HTMLElement | null> | null
  effectiveStartOffset: number
  /** 小程序用：实时读取 startOffset，避免 useState 异步更新导致 useListScrollElementAttachWeapp 读到 0 */
  effectiveStartOffsetRef: React.MutableRefObject<number>
  useScrollElementMode: boolean
  needAutoFind: boolean
  autoFindStatus: 'pending' | 'found' | 'not-found'
  contentWrapperRef: RefObject<HTMLDivElement | null>
  /** 小程序自动查找用：content 节点的 id，需挂到 contentWrapper 对应的 View 上 */
  contentId: string
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
  const contentId = useMemo(() => `list-content-${Math.random().toString(36).slice(2, 11)}`, [])
  const scrollElementCtx = useContext(ScrollElementContextOrFallback) as ScrollElementContextValueShape | null
  const ctxStart = scrollElementCtx?.startOffset
  const hasExplicitCtxStartOffset = ctxStart != null && ctxStart > 0

  const needAutoFind =
    listType === 'nested' &&
    !scrollElement &&
    !scrollElementCtx?.scrollRef &&
    (isH5 || isWeapp)
  const { scrollParentRef: autoFoundRef, status: autoFindStatus } = useScrollParentAutoFind(
    contentWrapperRef,
    { enabled: !!needAutoFind, isHorizontal, contentId: isWeapp ? contentId : undefined }
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
  const needMeasureWeapp =
    listType === 'nested' &&
    effectiveScrollElement &&
    isWeapp &&
    startOffsetProp == null &&
    !hasExplicitCtxStartOffset
  const effectiveStartOffsetRef = useRef(0)
  const measuredStartOffset = useMeasureStartOffset(
    effectiveScrollElement ?? EMPTY_SCROLL_REF,
    contentWrapperRef,
    { enabled: !!needMeasure, isHorizontal }
  )
  const measuredStartOffsetWeapp = useMeasureStartOffsetWeapp(
    effectiveScrollElement ?? EMPTY_SCROLL_REF,
    contentId,
    { enabled: !!needMeasureWeapp, isHorizontal, startOffsetRef: effectiveStartOffsetRef }
  )

  const effectiveStartOffset =
    startOffsetProp ??
    (ctxStart != null && ctxStart > 0 ? ctxStart : null) ??
    measuredStartOffset ??
    measuredStartOffsetWeapp ??
    0

  // needMeasureWeapp 时由 useMeasureStartOffsetWeapp 的 exec 回调更新 ref，不在此覆盖，避免 re-render 用 stale 0 覆盖已测量的值
  if (!needMeasureWeapp) {
    effectiveStartOffsetRef.current = effectiveStartOffset
  }

  const useScrollElementMode = listType === 'nested' && !!(effectiveScrollElement && (isH5 || isWeapp))

  if (listType === 'nested' && !effectiveScrollElement && (isH5 || isWeapp) && autoFindStatus === 'not-found') {
    // eslint-disable-next-line no-console
    console.warn('[List] nestedScroll 模式但无 scrollElement（props/Context/自动查找），回退为 default')
  }

  return {
    effectiveScrollElement,
    effectiveStartOffset,
    effectiveStartOffsetRef,
    useScrollElementMode,
    needAutoFind,
    autoFindStatus,
    contentWrapperRef,
    contentId,
  }
}
