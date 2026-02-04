import { View } from '@tarojs/components'
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
 * useRefresher - 平台适配的下拉刷新
 *
 * - 小程序：weapp / jd / tt 使用 ScrollView 原生 refresher-*
 * - H5：对齐 taro-components-react pull-down-refresh（2.x 同源）逻辑：触顶 + 增量拖拽 + 阻尼 + 释放保持高度再回弹
 */

const BOUNCE_MS = 300
const AT_TOP_THRESHOLD = 3
/** 最大下拉距离（px） */
const DISTANCE_Y_MAX_LIMIT = 150
/** 阻尼系数：超过此值不再累加位移，与 2.x default damping 一致 */
const DAMPING = 100
/** 角度上限（度），小于此值才视为下拉意图 */
const DEG_LIMIT = 40
/** 默认刷新层高度（对齐 Dynamic），无自定义 children 时使用 */
export const DEFAULT_REFRESHER_HEIGHT = 50

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

/**
 * 单次位移的阻尼（与 2.x PullDownRefresh.damping 一致）
 * ratio = 已拖拽总距离 / 屏幕高度，damped = diff * (1 - ratio) * 0.6；且当已超过 DAMPING 时不再加
 */
function dampIncrement(
  diff: number,
  totalMove: number,
  currentPull: number,
  screenHeight: number
): number {
  if (diff <= 0) return 0
  if (currentPull >= DAMPING) return 0
  const ratio = Math.min(totalMove / screenHeight, 1)
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
  scrollTopAtLogicalTop: number
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

  /** H5：触发 onRefresherStatusChange 回调（仅状态变化时触发） */
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

  // ========================================
  // 小程序：原生 refresher-* API
  // ========================================
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

  // ========================================
  // H5：单一结构 + 原生 touch 监听（passive: false）；refresherEnabled=false 时不挂
  // ========================================
  const addImperativeTouchListeners = React.useCallback((el: HTMLElement) => {
    if (supportsNativeRefresher || !configRef.current || !h5RefresherEnabled) return () => {}
    const scrollEl = el as HTMLDivElement
    const startY = { current: 0 }
    const startX = { current: 0 }
    const lastY = { current: 0 }
    let touchStartedAtTop = false
    let dragOnEdge = false
    let lastPull = 0
    /** 用于 onTouchEnd 判断是否触发刷新；刷新完成后必须置 0，否则下次点击（无 touchMove）会误用上次的 lastPull 再次触发 */
    const lastPullRef = { current: 0 }
    const pullAtReleaseRef = { current: 0 }
    const screenHeight = typeof window !== 'undefined' ? window.screen?.height ?? 600 : 600

    const setPull = (v: number) => {
      lastPull = v
      lastPullRef.current = v
      setPullDistanceRef.current(v)
    }

    const runBounceBack = (fromValue: number, onComplete?: () => void) => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
      const startTime = performance.now()
      const animate = () => {
        const t = Math.min((performance.now() - startTime) / BOUNCE_MS, 1)
        const ease = 1 - Math.pow(1 - t, 3)
        const v = fromValue * (1 - ease)
        setPullDistanceRef.current(v)
        lastPullRef.current = v
        lastPull = v
        if (t < 1) {
          rafRef.current = requestAnimationFrame(animate)
        } else {
          setPullDistanceRef.current(0)
          // 修复闭包问题：使用 ref 获取最新值
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
      const startTime = performance.now()
      const animate = () => {
        const t = Math.min((performance.now() - startTime) / BOUNCE_MS, 1)
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
          // 状态变化：回到 Idle
          emitStatusChangeRef.current(RefreshStatus.Idle, 0)
        }
      }
      rafRef.current = requestAnimationFrame(animate)
    }

    /** 先动画到 refresherHeight（加载中保持高度），再执行刷新，完成后回弹；与 2.x release 时 setContentStyle(distanceToRefresh+1) 一致 */
    const runBounceToLoading = (fromValue: number, toValue: number, onReach: () => void) => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
      const startTime = performance.now()
      const animate = () => {
        const t = Math.min((performance.now() - startTime) / BOUNCE_MS, 1)
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
      const t0 = e.touches[0]
      if (t0) {
        startY.current = t0.clientY
        startX.current = t0.clientX
        lastY.current = t0.clientY
      }
    }

    const onTouchMove = (ev: TouchEvent) => {
      if (refreshingLockRef.current || isRefreshingRef.current) return
      const touch = ev.touches[0]
      if (!touch) return
      const currentY = touch.clientY
      const currentX = touch.clientX
      if (!touchStartedAtTop || !isEdge()) {
        setPull(0)
        dragOnEdge = false
        return
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
      const damped = dampIncrement(dy, totalMove, lastPull, screenHeight)
      const next = Math.min(lastPull + damped, DISTANCE_Y_MAX_LIMIT)
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
      // 状态变化：Refreshing
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
          // 状态变化：回到 Idle
          emitStatusChangeRef.current(RefreshStatus.Idle, 0)
        }
        const timeoutId = setTimeout(safeReset, BOUNCE_MS + 400)
        Promise.resolve(configRef.current?.onRefresherRefresh?.())
          .then(
            () => {
              // 若已经通过 safeReset 提前结束刷新（例如超时），则不再执行回弹动画，避免二次「吐舌头」闪现
              if (!refreshingLockRef.current) return
              // 状态变化：Completed
              emitStatusChangeRef.current(RefreshStatus.Completed, DEFAULT_REFRESHER_HEIGHT)
              requestAnimationFrame(() =>
                runBounceBack(DEFAULT_REFRESHER_HEIGHT, () => {
                  clearTimeout(timeoutId)
                  refreshingLockRef.current = false
                  lastPullRef.current = 0
                  lastPull = 0
                  pullAtReleaseRef.current = 0
                  configRef.current?.onRefresherRestore?.()
                  // 状态变化：回到 Idle
                  emitStatusChangeRef.current(RefreshStatus.Idle, 0)
                })
              )
            },
            () => {
              clearTimeout(timeoutId)
              safeReset()
            }
          )
      })
    }

    const onTouchEnd = () => {
      if (refreshingLockRef.current) return
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

    // 小程序：自定义内容时返回带 slot="refresher" 的 children，否则使用原生 refresher
    if (supportsNativeRefresher) {
      // 小程序需要 slot="refresher" 来指定自定义刷新内容
      return hasCustomChildren && defaultStyle === 'none'
        ? <View slot="refresher">{config.children}</View>
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
        data-testid="list-refresher"
      >
        {hasCustomChildren ? config.children : (
          defaultText ? <View style={textColor ? { color: textColor } : undefined}>{defaultText}</View> : null
        )}
      </View>
    )
  }, [config, pullDistance, isRefreshing])

  // 受控 refresherTriggered：设为 true 时立即展示顶部加载指示器（对齐小程序：无需下拉即显示、固定在顶部）
  React.useEffect(() => {
    if (!isControlled || !config || config.refresherTriggered !== true) return
    if (pullDistanceRef.current >= DEFAULT_REFRESHER_HEIGHT) return
    setPullDistanceRef.current(DEFAULT_REFRESHER_HEIGHT)
    pullDistanceRef.current = DEFAULT_REFRESHER_HEIGHT
    // 触发 Refreshing 状态变化
    emitStatusChangeRef.current(RefreshStatus.Refreshing, DEFAULT_REFRESHER_HEIGHT)
  }, [isControlled, config?.refresherTriggered])

  // 受控 refresherTriggered：父组件设为 false 时同步回弹并清零
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
      // 触发 Completed 状态变化
      emitStatusChangeRef.current(RefreshStatus.Completed, from)
      const startTime = performance.now()
      const animate = () => {
        const t = Math.min((performance.now() - startTime) / BOUNCE_MS, 1)
        const ease = 1 - Math.pow(1 - t, 3)
        const v = from * (1 - ease)
        setPullDistanceRef.current(v)
        pullDistanceRef.current = v
        if (t < 1) rafRef.current = requestAnimationFrame(animate)
        else {
          setPullDistanceRef.current(0)
          pullDistanceRef.current = 0
          // 修复闭包问题：使用 ref 获取最新值
          if (!isControlledRef.current) setInternalRefreshingRef.current(false)
          rafRef.current = null
          config.onRefresherRestore?.()
          // 触发 Idle 状态变化
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
