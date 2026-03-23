import { cancelAnimationFrame, requestAnimationFrame } from '@tarojs/runtime'

import type { Root } from './root'

/** 快速滑动判定：像素/秒 */
export const WF_FAST_SCROLL_VELOCITY_PX_PER_S = 1000
/** 快速滑动时 cache 倍数 */
export const WF_FAST_SCROLL_MULTIPLIER = 2
/** 单边 Node 缓存上限 */
export const WF_FAST_SCROLL_NODE_CACHE_MAX = 30
/** 无 scroll 视为停止的等待（ms） */
export const WF_SCROLL_STOP_MS = 300
/** 停止后多久收敛回 base cache（ms） */
export const WF_CACHE_RESTORE_DELAY_MS = 2000
/** 过短间隔忽略 velocity（ms） */
export const WF_VELOCITY_MIN_DELTA_MS = 16
/** 过长间隔视为新一段滚动（ms） */
export const WF_VELOCITY_RESET_DELTA_MS = 500

export type WaterFlowNodeCacheControl = {
  onScrollSample: (scrollTop: number) => void
  dispose: () => void
}

/**
 * 快速滑动时单边放大 Node 层 cache；停止后延迟收敛。
 * 不暴露 props，内部常量可调参。
 */
export function createWaterFlowNodeCacheControl (
  root: Root,
  getBase: () => number
): WaterFlowNodeCacheControl {
  let lastProcessedScrollTop = 0
  let lastProcessedTime = 0
  let rafScheduled = false
  let rafId: number | null = null
  let pendingScrollTop = 0
  let pendingTime = 0
  let scrollStopTimer: ReturnType<typeof setTimeout> | null = null
  let restoreTimer: ReturnType<typeof setTimeout> | null = null
  let disposed = false
  /** 快滑会话：停滚收敛或长间隔重置前，轻滑仍按滚动方向维持单边放大 cache */
  let boostSessionActive = false

  function flushVelocity () {
    if (disposed) return
    rafId = null
    rafScheduled = false
    const st = pendingScrollTop
    const t = pendingTime
    const base = getBase()

    if (lastProcessedTime === 0) {
      lastProcessedScrollTop = st
      lastProcessedTime = t
      boostSessionActive = false
      root.setNodeCacheRange(base, base)
      return
    }

    const dt = t - lastProcessedTime
    const delta = Math.abs(st - lastProcessedScrollTop)

    if (dt < WF_VELOCITY_MIN_DELTA_MS) {
      lastProcessedScrollTop = st
      lastProcessedTime = t
      return
    }

    if (dt > WF_VELOCITY_RESET_DELTA_MS) {
      lastProcessedScrollTop = st
      lastProcessedTime = t
      boostSessionActive = false
      root.setNodeCacheRange(base, base)
      return
    }

    const velocity = (delta / dt) * 1000
    const boosted =
      base > 0 ? Math.min(base * WF_FAST_SCROLL_MULTIPLIER, WF_FAST_SCROLL_NODE_CACHE_MAX) : 0
    const forwardDown = st >= lastProcessedScrollTop

    let backward = base
    let forward = base
    if (base > 0) {
      if (velocity > WF_FAST_SCROLL_VELOCITY_PX_PER_S) {
        boostSessionActive = true
      }
      if (boostSessionActive) {
        if (forwardDown) {
          forward = boosted
          backward = base
        } else {
          backward = boosted
          forward = base
        }
      }
    }

    root.setNodeCacheRange(backward, forward)
    lastProcessedScrollTop = st
    lastProcessedTime = t
  }

  function onScrollSample (scrollTop: number) {
    if (disposed) return
    pendingScrollTop = scrollTop
    pendingTime = Date.now()
    if (!rafScheduled) {
      rafScheduled = true
      rafId = requestAnimationFrame(flushVelocity) as unknown as number
    }

    if (scrollStopTimer != null) {
      clearTimeout(scrollStopTimer)
      scrollStopTimer = null
    }
    if (restoreTimer != null) {
      clearTimeout(restoreTimer)
      restoreTimer = null
    }

    scrollStopTimer = setTimeout(() => {
      scrollStopTimer = null
      restoreTimer = setTimeout(() => {
        restoreTimer = null
        if (disposed) return
        boostSessionActive = false
        root.setNodeCacheRange(getBase(), getBase())
      }, WF_CACHE_RESTORE_DELAY_MS)
    }, WF_SCROLL_STOP_MS)
  }

  function dispose () {
    disposed = true
    if (rafId != null) {
      cancelAnimationFrame(rafId)
      rafId = null
    }
    rafScheduled = false
    if (scrollStopTimer != null) {
      clearTimeout(scrollStopTimer)
      scrollStopTimer = null
    }
    if (restoreTimer != null) {
      clearTimeout(restoreTimer)
      restoreTimer = null
    }
  }

  return { onScrollSample, dispose }
}
