import { Slot, View } from '@tarojs/components'
import React, { useCallback, useRef, useState } from 'react'

import { supportsNativeRefresher } from '../utils'

/**
 * List 组件内部的 refresher 配置类型（独立于 Refresher 组件）
 * 与 ScrollView refresher 相关属性语义对齐
 */
export interface ListRefresherConfig {
  refresherEnabled?: boolean
  refresherThreshold?: number
  refresherDefaultStyle?: 'black' | 'white' | 'none'
  refresherBackground?: string
  refresherTriggered?: boolean
  /** 自定义刷新内容（来自 Refresher 子组件的 children） */
  children?: React.ReactNode
  onRefresherPulling?: (e?: { detail?: { deltaY?: number } }) => void
  onRefresherRefresh?: () => void | Promise<void>
  onRefresherRestore?: () => void
  onRefresherAbort?: () => void
  onRefresherWillRefresh?: () => void
  onRefresherStatusChange?: (e?: { detail?: { status?: number, dy?: number } }) => void
}

/**
 * 下拉刷新（List 内部）
 *
 * - 小程序：ScrollView 原生 refresher-*；业务 Promise reject 时补发 Failed(4)（原生不派发）
 * - H5：触顶 + touch 拖拽；最大行程 / 阻尼停拉线为视口高的 0.9 / 0.8（innerHeight）；收尾仅依赖 onRefresherRefresh 的 Promise
 * - 动画时间戳用 nowMs()：小程序部分环境无 performance，避免抛错中断回弹
 * - rafRef 与受控 refresherTriggered→false 的 effect 共用：effect 内 cancel 可能打断 H5 成功回弹，须在 effect 动画结束处释放 refreshingLockRef
 * - H5 reject：onRefresherStatusChange 顺序 Failed(4) → Completed(3) → Idle(0)
 * - emitStatusChange：仅 status 变化时回调（同 status 不重复）
 */

const BOUNCE_MS = 300
const AT_TOP_THRESHOLD = 3
const H5_PULL_DISTANCE_MAX_VH = 0.9
const H5_DAMPING_LIMIT_VH = 0.8
const VIEWPORT_HEIGHT_FALLBACK = 800
const DEG_LIMIT = 40
export const DEFAULT_REFRESHER_HEIGHT = 50

function nowMs (): number {
  if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
    return performance.now()
  }
  return Date.now()
}

/** 下拉刷新状态枚举（对齐微信小程序 RefreshStatus） */
export const enum RefreshStatus {
  /** 空闲 */
  Idle = 0,
  /** 超过下拉刷新阈值 */
  CanRefresh = 1,
  /** 刷新中 */
  Refreshing = 2,
  /** 刷新完成 */
  Completed = 3,
  /** 刷新失败 */
  Failed = 4,
}

function getViewportHeightPx (): number {
  if (typeof window === 'undefined' || !Number.isFinite(window.innerHeight) || window.innerHeight <= 0) {
    return VIEWPORT_HEIGHT_FALLBACK
  }
  return window.innerHeight
}

/** 阻尼增量：ratio=总下拉位移/视口高；超过 dampingLimit 后不再累加 */
function dampIncrement (
  diff: number,
  totalMove: number,
  currentPull: number,
  viewportHeight: number,
  dampingLimit: number
): number {
  if (diff <= 0) return 0
  if (currentPull >= dampingLimit) return 0
  const ratio = Math.min(totalMove / viewportHeight, 1)
  return diff * (1 - ratio) * 0.6
}

interface UseRefresherReturn {
  scrollViewRefresherProps: {
    refresherEnabled?: boolean
    refresherThreshold?: number
    refresherDefaultStyle?: string
    refresherBackground?: string
    refresherTriggered?: boolean
  }
  scrollViewRefresherHandlers: {
    onRefresherPulling?: (e: any) => void
    onRefresherRefresh?: (e: any) => void
    onRefresherRestore?: () => void
    onRefresherAbort?: () => void
  }
  h5RefresherProps: {
    touchHandlers: Record<string, unknown>
    pullDistance: number
    isRefreshing: boolean
    /** H5 单结构下恒为 true，仅兼容旧类型 */
    showRefresherLayer: boolean
  }
  addImperativeTouchListeners?: (el: HTMLElement) => () => void
  renderRefresherContent: () => React.ReactNode | null
}

export function useRefresher(
  config: ListRefresherConfig | null,
  /** 列表逻辑顶部对应的 scrollTop，用于触顶判断；H5「顶栏悬浮+只滚列表」时传 0，imperative 内以 DOM scrollTop 为准 */
  scrollTopAtLogicalTop: number,
  /** scrollElement 模式下可选：下拉起始点须在 List 内才触发刷新；未传时默认 true（沿用原逻辑） */
  getIsTouchInListArea?: (ev: TouchEvent) => boolean
): UseRefresherReturn {
  const [internalRefreshing, setInternalRefreshing] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const pullDistanceRef = useRef(0)
  const rafRef = useRef<number | null>(null)
  const setPullDistanceRef = useRef(setPullDistance)
  const setInternalRefreshingRef = useRef(setInternalRefreshing)
  setPullDistanceRef.current = setPullDistance
  setInternalRefreshingRef.current = setInternalRefreshing
  pullDistanceRef.current = pullDistance

  const isControlled = typeof config?.refresherTriggered === 'boolean'
  const isRefreshing = isControlled ? (config?.refresherTriggered ?? false) : internalRefreshing
  const isRefreshingRef = useRef(isRefreshing)
  isRefreshingRef.current = isRefreshing
  /** 刷新中锁：runRefresh 内同步置 true，避免 setState 未重渲染前再次触摸触发刷新 */
  const refreshingLockRef = useRef(false)
  /** H5 当前刷新状态，用于 onRefresherStatusChange 避免重复触发 */
  const refreshStatusRef = useRef<RefreshStatus>(RefreshStatus.Idle)
  /** H5 是否启用下拉刷新：refresherEnabled === false 时不挂 touch、不显示顶栏 */
  const h5RefresherEnabled = !!config && config.refresherEnabled !== false

  /** touch 只挂一次，回调里读 ref 才能拿到最新配置，避免改预设后仍用旧值 */
  const thresholdRef = useRef(config?.refresherThreshold ?? 45)
  thresholdRef.current = config?.refresherThreshold ?? 45
  const configRef = useRef(config)
  configRef.current = config

  const emitStatusChangeRef = useRef((status: RefreshStatus, dy: number) => {
    if (refreshStatusRef.current !== status) {
      refreshStatusRef.current = status
      configRef.current?.onRefresherStatusChange?.({ detail: { status, dy } })
    }
  })
  const isControlledRef = useRef(isControlled)
  isControlledRef.current = isControlled
  /** H5 顶栏悬浮时 List 传 0，触顶即 scrollTop<=0+阈值；否则由 List 传列表顶对应的 scrollTop */
  const scrollTopWhenAtTop = !supportsNativeRefresher && config ? scrollTopAtLogicalTop : 0
  const topThresholdPx = scrollTopWhenAtTop + AT_TOP_THRESHOLD
  const topThresholdPxRef = useRef(topThresholdPx)
  topThresholdPxRef.current = topThresholdPx

  const getIsTouchInListAreaRef = useRef(getIsTouchInListArea)
  getIsTouchInListAreaRef.current = getIsTouchInListArea

  const scrollViewRefresherProps = config && supportsNativeRefresher ? {
    refresherEnabled: config.refresherEnabled ?? true,
    refresherThreshold: config.refresherThreshold ?? 45,
    refresherDefaultStyle: config.refresherDefaultStyle ?? 'black',
    refresherBackground: config.refresherBackground ?? '#fff',
    refresherTriggered: isRefreshing,
  } : {}

  const scrollViewRefresherHandlers = config && supportsNativeRefresher ? {
    onRefresherPulling: (e: any) => {
      config.onRefresherPulling?.({ detail: { deltaY: e.detail?.deltaY ?? 0 } })
    },
    onRefresherRefresh: async () => {
      if (!isControlled) setInternalRefreshing(true)
      try {
        await config.onRefresherRefresh?.()
      } catch {
        // 原生不派发 Failed(4)，补发便于与 H5 一致
        config.onRefresherStatusChange?.({ detail: { status: RefreshStatus.Failed, dy: 0 } })
      } finally {
        if (!isControlled) setInternalRefreshing(false)
      }
    },
    onRefresherRestore: () => config.onRefresherRestore?.(),
    onRefresherAbort: () => config.onRefresherAbort?.(),
    // 小程序特有事件：即将触发刷新（拖动超过 threshold 时）
    onRefresherWillRefresh: () => config.onRefresherWillRefresh?.(),
    // 小程序特有事件：下拉刷新状态变化
    onRefresherStatusChange: (e: any) => {
      config.onRefresherStatusChange?.({ detail: { status: e.detail?.status, dy: e.detail?.dy } })
    },
  } : {}

  const addImperativeTouchListeners = React.useCallback((el: HTMLElement) => {
    if (supportsNativeRefresher || !configRef.current || !h5RefresherEnabled) return () => {}
    const scrollEl = el as HTMLDivElement
    const startY = { current: 0 }
    const startX = { current: 0 }
    const lastY = { current: 0 }
    let touchStartedAtTop = false
    /** 下拉起始点是否在 List 内（scrollElement 模式）；未传 getIsTouchInListArea 时恒为 true */
    let touchStartedInListArea = true
    let dragOnEdge = false
    let lastPull = 0
    /** 用于 onTouchEnd 判断是否触发刷新；刷新完成后必须置 0，否则下次点击（无 touchMove）会误用上次的 lastPull 再次触发 */
    const lastPullRef = { current: 0 }
    const pullAtReleaseRef = { current: 0 }

    const setPull = (v: number) => {
      lastPull = v
      lastPullRef.current = v
      setPullDistanceRef.current(v)
    }

    const runBounceBack = (fromValue: number, onComplete?: () => void) => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
      const startTime = nowMs()
      const animate = () => {
        const t = Math.min((nowMs() - startTime) / BOUNCE_MS, 1)
        const ease = 1 - Math.pow(1 - t, 3)
        const v = fromValue * (1 - ease)
        setPullDistanceRef.current(v)
        lastPullRef.current = v
        lastPull = v
        if (t < 1) {
          rafRef.current = requestAnimationFrame(animate)
        } else {
          setPullDistanceRef.current(0)
          if (!isControlledRef.current) setInternalRefreshingRef.current(false)
          rafRef.current = null
          onComplete?.()
        }
      }
      rafRef.current = requestAnimationFrame(animate)
    }

    /** 未达阈值松手回弹结束：通知中止 */
    const runBounceBackAbort = (fromValue: number) => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
      const startTime = nowMs()
      const animate = () => {
        const t = Math.min((nowMs() - startTime) / BOUNCE_MS, 1)
        const ease = 1 - Math.pow(1 - t, 3)
        const v = fromValue * (1 - ease)
        setPullDistanceRef.current(v)
        lastPullRef.current = v
        lastPull = v
        if (t < 1) rafRef.current = requestAnimationFrame(animate)
        else {
          setPullDistanceRef.current(0)
          rafRef.current = null
          lastPullRef.current = 0
          lastPull = 0
          configRef.current?.onRefresherAbort?.()
          emitStatusChangeRef.current(RefreshStatus.Idle, 0)
        }
      }
      rafRef.current = requestAnimationFrame(animate)
    }

    /** 收起到加载高度后再执行 onRefresherRefresh */
    const runBounceToLoading = (fromValue: number, toValue: number, onReach: () => void) => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
      const startTime = nowMs()
      const animate = () => {
        const t = Math.min((nowMs() - startTime) / BOUNCE_MS, 1)
        const ease = 1 - Math.pow(1 - t, 3)
        setPullDistanceRef.current(fromValue + (toValue - fromValue) * ease)
        if (t < 1) {
          rafRef.current = requestAnimationFrame(animate)
        } else {
          setPullDistanceRef.current(toValue)
          rafRef.current = null
          onReach()
        }
      }
      rafRef.current = requestAnimationFrame(animate)
    }

    const isEdge = () => (scrollEl.scrollTop ?? 0) <= topThresholdPxRef.current

    const onTouchStart = (e: TouchEvent) => {
      if (refreshingLockRef.current || isRefreshingRef.current) return
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
      lastPull = lastPullRef.current
      touchStartedAtTop = isEdge()
      touchStartedInListArea = getIsTouchInListAreaRef.current?.(e) ?? true
      const t0 = e.touches[0]
      if (t0) {
        startY.current = t0.clientY
        startX.current = t0.clientX
        lastY.current = t0.clientY
      }
    }

    const onTouchMove = (ev: TouchEvent) => {
      if (refreshingLockRef.current || isRefreshingRef.current) return
      if (!touchStartedInListArea) return
      const touch = ev.touches[0]
      if (!touch) return
      const currentY = touch.clientY
      const currentX = touch.clientX
      if (!isEdge()) {
        setPull(0)
        dragOnEdge = false
        return
      }
      // 到顶后：若 touch 开始时不在顶部，在首次下拉(dy>0)时「采纳」该手势，使同一手势内滚到顶后继续下拉可触发刷新
      if (!touchStartedAtTop && !dragOnEdge) {
        const dyCheck = currentY - lastY.current
        if (dyCheck <= 0) return
        touchStartedAtTop = true
        // 重置起点，避免采纳时 dy 过大导致刷新层瞬间拉满
        startY.current = currentY
        startX.current = currentX
        lastY.current = currentY
      }

      const dy = currentY - lastY.current
      // 还没进入下拉拖拽阶段（dragOnEdge=false）时，先看第一下是往上还是往下：
      // - 第一笔就是往上滑（dy<=0）：视为正常滚动，直接交给原生 Scroll，不拦截、不启动下拉逻辑
      // - 第一笔是往下滑（dy>0）：才认为是一次「下拉刷新」手势，进入拖拽模式
      if (!dragOnEdge) {
        if (dy <= 0) {
          lastY.current = currentY
          startY.current = currentY
          startX.current = currentX
          return
        }
        // 真正开始下拉刷新
        dragOnEdge = true
        startY.current = currentY
        startX.current = currentX
      }

      if (ev.cancelable) ev.preventDefault()
      const totalMove = currentY - startY.current
      const dx = currentX - startX.current
      if (dy <= 0) {
        lastY.current = currentY
        const next = Math.max(0, lastPull + dy)
        setPull(next)
        return
      }
      const deg = Math.atan(Math.abs(dx) / dy) * (180 / Math.PI)
      if (deg > DEG_LIMIT) {
        startY.current = currentY
        startX.current = currentX
        lastY.current = currentY
        return
      }
      lastY.current = currentY
      const vh = getViewportHeightPx()
      const maxPull = vh * H5_PULL_DISTANCE_MAX_VH
      const dampingLimit = vh * H5_DAMPING_LIMIT_VH
      const damped = dampIncrement(dy, totalMove, lastPull, vh, dampingLimit)
      const next = Math.min(lastPull + damped, maxPull)
      setPull(next)
      configRef.current?.onRefresherPulling?.({ detail: { deltaY: next } })
      if (next >= thresholdRef.current) {
        configRef.current?.onRefresherWillRefresh?.()
        emitStatusChangeRef.current(RefreshStatus.CanRefresh, next)
      } else {
        emitStatusChangeRef.current(RefreshStatus.Idle, next)
      }
    }

    const runRefresh = () => {
      const cfg = configRef.current
      if (!cfg || refreshingLockRef.current || isRefreshingRef.current) return
      refreshingLockRef.current = true
      const pullValue = lastPull
      const height = DEFAULT_REFRESHER_HEIGHT
      pullAtReleaseRef.current = pullValue
      if (!isControlledRef.current) setInternalRefreshingRef.current(true)
      emitStatusChangeRef.current(RefreshStatus.Refreshing, pullValue)
      runBounceToLoading(pullValue, height, () => {
        const safeReset = () => {
          setPullDistanceRef.current(0)
          if (!isControlledRef.current) setInternalRefreshingRef.current(false)
          refreshingLockRef.current = false
          lastPullRef.current = 0
          lastPull = 0
          pullAtReleaseRef.current = 0
          configRef.current?.onRefresherRestore?.()
          emitStatusChangeRef.current(RefreshStatus.Idle, 0)
        }
        Promise.resolve(configRef.current?.onRefresherRefresh?.())
          .then(
            () => {
              if (!refreshingLockRef.current) return
              emitStatusChangeRef.current(RefreshStatus.Completed, DEFAULT_REFRESHER_HEIGHT)
              requestAnimationFrame(() =>
                runBounceBack(DEFAULT_REFRESHER_HEIGHT, () => {
                  refreshingLockRef.current = false
                  lastPullRef.current = 0
                  lastPull = 0
                  pullAtReleaseRef.current = 0
                  configRef.current?.onRefresherRestore?.()
                  emitStatusChangeRef.current(RefreshStatus.Idle, 0)
                })
              )
            },
            () => {
              emitStatusChangeRef.current(RefreshStatus.Failed, pullValue)
              emitStatusChangeRef.current(RefreshStatus.Completed, DEFAULT_REFRESHER_HEIGHT)
              safeReset()
            }
          )
      })
    }

    const onTouchEnd = () => {
      if (refreshingLockRef.current) return
      if (!touchStartedInListArea) return
      dragOnEdge = false
      const current = lastPullRef.current
      if (current >= thresholdRef.current) {
        runRefresh()
      } else {
        if (current > 0) {
          runBounceBackAbort(current)
        }
      }
    }

    const optsMove = { passive: false, capture: true }
    const optsEnd = { passive: true, capture: true }
    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchmove', onTouchMove, optsMove)
    el.addEventListener('touchend', onTouchEnd, optsEnd)
    el.addEventListener('touchcancel', onTouchEnd, optsEnd)
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchmove', onTouchMove, optsMove)
      el.removeEventListener('touchend', onTouchEnd, optsEnd)
      el.removeEventListener('touchcancel', onTouchEnd, optsEnd)
    }
  }, [h5RefresherEnabled])

  const renderRefresherContent = useCallback(() => {
    if (!config) return null
    const threshold = config.refresherThreshold ?? 45
    const defaultStyle = config.refresherDefaultStyle ?? 'black'
    const background = config.refresherBackground ?? '#fff'
    const hasCustomChildren = config.children != null

    // 小程序：自定义内容时返回 Slot（name=refresher），避免 View 的 slot 属性在模板层被过滤
    // 样式对齐 H5：由内层 View 统一承载容器样式
    if (supportsNativeRefresher) {
      // 小程序需要名为 refresher 的插槽来指定自定义刷新内容
      return hasCustomChildren && defaultStyle === 'none'
        ? (
          <Slot
            name="refresher"
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              zIndex: 0,
            }}
          >
            <View
              style={{
                width: '100%',
                flexShrink: 0,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                background,
              }}
            >
              {config.children}
            </View>
          </Slot>
        )
        : null
    }

    // H5：refresherDefaultStyle 控制默认指示器样式（对齐小程序 black/white/none）
    // black=深色文案 white=浅色文案 none=仅展示 children，不展示默认「下拉/释放/加载中」
    const textColor = defaultStyle === 'white' ? '#fff' : defaultStyle === 'black' ? '#333' : undefined
    // 有自定义 children 且 style=none 时隐藏默认文字
    const showDefaultText = !(defaultStyle === 'none' && hasCustomChildren)
    const defaultText = showDefaultText
      ? (isRefreshing ? '加载中...' : pullDistance >= threshold ? '释放刷新' : '下拉刷新')
      : null

    return (
      <View
        style={{
          width: '100%',
          minHeight: hasCustomChildren ? undefined : DEFAULT_REFRESHER_HEIGHT,
          height: hasCustomChildren ? 'auto' : DEFAULT_REFRESHER_HEIGHT,
          flexShrink: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background,
        }}
      >
        {hasCustomChildren ? config.children : (
          defaultText ? <View style={textColor ? { color: textColor } : undefined}>{defaultText}</View> : null
        )}
      </View>
    )
  }, [config, pullDistance, isRefreshing])

  /** 受控 refresherTriggered=true：无下拉也显示加载条 */
  React.useEffect(() => {
    if (!isControlled || !config || config.refresherTriggered !== true) return
    if (pullDistanceRef.current >= DEFAULT_REFRESHER_HEIGHT) return
    setPullDistanceRef.current(DEFAULT_REFRESHER_HEIGHT)
    pullDistanceRef.current = DEFAULT_REFRESHER_HEIGHT
    emitStatusChangeRef.current(RefreshStatus.Refreshing, DEFAULT_REFRESHER_HEIGHT)
  }, [isControlled, config?.refresherTriggered])

  /** 受控 refresherTriggered=false：回弹清零；与 touch 共用 rafRef，cancel 时须在此释放 refreshingLockRef */
  const prevTriggeredRef = useRef(config?.refresherTriggered)
  React.useEffect(() => {
    if (!isControlled || !config || config.refresherTriggered !== false) {
      prevTriggeredRef.current = config?.refresherTriggered
      return
    }
    const prev = prevTriggeredRef.current
    prevTriggeredRef.current = false
    if (prev === true && (pullDistanceRef.current > 0 || isRefreshingRef.current)) {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
      const from = pullDistanceRef.current > 0 ? pullDistanceRef.current : DEFAULT_REFRESHER_HEIGHT
      emitStatusChangeRef.current(RefreshStatus.Completed, from)
      const startTime = nowMs()
      const animate = () => {
        const t = Math.min((nowMs() - startTime) / BOUNCE_MS, 1)
        const ease = 1 - Math.pow(1 - t, 3)
        const v = from * (1 - ease)
        setPullDistanceRef.current(v)
        pullDistanceRef.current = v
        if (t < 1) rafRef.current = requestAnimationFrame(animate)
        else {
          setPullDistanceRef.current(0)
          pullDistanceRef.current = 0
          if (!isControlledRef.current) setInternalRefreshingRef.current(false)
          rafRef.current = null
          refreshingLockRef.current = false
          config.onRefresherRestore?.()
          emitStatusChangeRef.current(RefreshStatus.Idle, 0)
        }
      }
      rafRef.current = requestAnimationFrame(animate)
    }
  }, [isControlled, config?.refresherTriggered])

  return {
    scrollViewRefresherProps,
    scrollViewRefresherHandlers,
    h5RefresherProps: {
      touchHandlers: {},
      pullDistance,
      isRefreshing,
      showRefresherLayer: !supportsNativeRefresher && !!config && h5RefresherEnabled,
    },
    addImperativeTouchListeners: !supportsNativeRefresher && config && h5RefresherEnabled ? addImperativeTouchListeners : undefined,
    renderRefresherContent,
  }
}
