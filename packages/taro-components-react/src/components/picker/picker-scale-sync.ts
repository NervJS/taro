import Taro from '@tarojs/taro'
import * as React from 'react'

/**
 * 列组件只在挂载时读一次 lengthScaleRatio 并缓存。iOS Duo 在 Picker 打开期间折叠 / 展开，
 * 窗口尺寸变了、lengthScaleRatio 跟着变，缓存的比例和单项高度就过期，
 * scrollTop（= 索引 × 单项高度 × 比例）与实际单项像素高度不再对应，表现为选中项相对高亮线偏移。
 * 这里在窗口变化 / 系统信息签名变化时重新同步比例，并把当前选中项重新对齐到高亮线。
 */

const WATCH_INTERVAL_MS = 300
/** 等原生完成重新布局后再测一次单项高度 */
const SETTLE_DELAY_MS = 200

interface ScaleHelpers {
  calculateLengthScaleRatio: (res: Taro.getSystemInfo.Result) => number
  resolveUseMeasuredScale: (res: Taro.getSystemInfo.Result) => boolean
  calculateItemHeight: (scrollView: any, lengthScaleRatio: number, useMeasuredScale: boolean) => number
}

interface Options extends ScaleHelpers {
  scrollViewRef: React.MutableRefObject<any>
  lengthScaleRatioRef: React.MutableRefObject<number>
  useMeasuredScaleRef: React.MutableRefObject<boolean>
  itemHeightRef: React.MutableRefObject<number>
  isTouchingRef: React.MutableRefObject<boolean>
  currentIndex: number
  setTargetScrollTop: (value: number) => void
}

const isScaleDisabledEnv = () => process.env.TARO_ENV === 'h5' || process.env.TARO_ENV === 'weapp'

const infoSignature = (info: any): string =>
  [info?.lengthScaleRatio, info?.windowWidth, info?.windowHeight, info?.foldState, info?.deviceOrientation].join('|')

function readInfo(): Taro.getSystemInfo.Result | null {
  try {
    return Taro.getSystemInfoSync() as Taro.getSystemInfo.Result
  } catch {
    return null
  }
}

export function usePickerScaleSync(options: Options): void {
  const optionsRef = React.useRef(options)
  optionsRef.current = options
  const signatureRef = React.useRef('')
  const settleTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  const snap = React.useCallback(() => {
    const o = optionsRef.current
    if (o.isTouchingRef.current || !o.scrollViewRef.current) return
    const base = o.currentIndex * o.itemHeightRef.current
    // 随机微小偏移：保证即使数值相同也会触发 scrollTop 重新下发
    const offset = Math.random() * 0.001
    const value = process.env.TARO_PLATFORM === 'harmony' ? base : base * o.lengthScaleRatioRef.current
    o.setTargetScrollTop(value + offset)
  }, [])

  const sync = React.useCallback((remeasure: boolean) => {
    const o = optionsRef.current
    const info = readInfo()
    if (!info) return
    signatureRef.current = infoSignature(info)
    o.lengthScaleRatioRef.current = o.calculateLengthScaleRatio(info)
    o.useMeasuredScaleRef.current = o.resolveUseMeasuredScale(info)
    // harmony 的单项高度只取决于比例，可以立即换算；其余端依赖布局后的 scrollHeight，等落定后再测
    if (remeasure || process.env.TARO_PLATFORM === 'harmony') {
      o.itemHeightRef.current = o.calculateItemHeight(
        o.scrollViewRef.current,
        o.lengthScaleRatioRef.current,
        o.useMeasuredScaleRef.current
      )
    }
    snap()
  }, [snap])

  const onChanged = React.useCallback(() => {
    if (isScaleDisabledEnv()) return
    sync(false)
    if (settleTimerRef.current != null) clearTimeout(settleTimerRef.current)
    settleTimerRef.current = setTimeout(() => {
      settleTimerRef.current = null
      sync(true)
    }, SETTLE_DELAY_MS)
  }, [sync])

  // 初始签名：挂载时的系统信息
  React.useEffect(() => {
    signatureRef.current = infoSignature(readInfo())
  }, [])

  // 兜底巡检：resize 回调可能漏发，或读到的是折叠过程中的中间态
  React.useEffect(() => {
    if (isScaleDisabledEnv()) return
    const timer = setInterval(() => {
      if (infoSignature(readInfo()) !== signatureRef.current) onChanged()
    }, WATCH_INTERVAL_MS)
    return () => {
      clearInterval(timer)
      if (settleTimerRef.current != null) {
        clearTimeout(settleTimerRef.current)
        settleTimerRef.current = null
      }
    }
  }, [onChanged])

  Taro.useResize(onChanged)
}
