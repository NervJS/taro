import Taro from '@tarojs/taro'
import React from 'react'

/**
 * iOS Duo（折叠屏 iPhone）下 Picker 半弹面板的布局。
 *
 * 规则（与 jdtaro-ui 的 Popup 底部半弹一致）：
 * - 仅 iOS 且 getSystemInfo 带有 foldState（closed / halfOpen / fullyOpen）时生效，否则返回 null，样式与改前一致；
 * - 内容区 base：半折叠横屏为折叠中缝左侧（screenWidth / 2），其余为整窗；
 * - 面板默认撑满 base 宽，超过 653 后限宽并在 base 内水平居中，贴底；
 * - 蒙层仍是整窗，不改。
 *
 * 单位：getSystemInfo 的 window / screen / avoidAreas 是屏幕 dp，而写进 style 的 px
 * 会被引擎再乘 lengthScaleRatio，所以这里先除以 lengthScaleRatio 换成 CSS px。
 */

/** 半弹面板最大宽度：设计稿 653dp × lengthScaleRatio，换算成 CSS px 后 ratio 约掉 */
export const HALF_SHEET_MAX_CSS_PX = 653

const LAYOUT_ANIM_MS = 250
/** 打开期间兜底巡检系统信息的间隔：折叠状态落定可能晚于 resize 回调，或回调漏发 */
const WATCH_INTERVAL_MS = 250

export interface DuoSheetLayout {
  /** 面板左边缘（CSS px，相对整窗左边） */
  left: number
  /** 面板宽度（CSS px） */
  width: number
}

interface SystemInfoLike {
  platform?: string
  foldState?: string
  deviceOrientation?: string
  windowWidth?: number
  windowHeight?: number
  screenWidth?: number
  lengthScaleRatio?: number
  avoidAreas?: Array<{ left?: number, top?: number, width?: number, height?: number }>
}

const ACTIVE_FOLD_STATES = new Set(['closed', 'halfopen', 'fullyopen'])

function normalizeFold(state: unknown): string {
  if (state == null || state === '') return ''
  return String(state).replace(/[_\s-]/g, '').toLowerCase()
}

function isLandscape(info: SystemInfoLike): boolean {
  const orientation = String(info.deviceOrientation ?? '').toLowerCase()
  if (orientation) return orientation.includes('landscape')
  return (info.windowWidth ?? 0) > (info.windowHeight ?? 0)
}

/** 纯函数：由系统信息算出面板布局；非 Duo 返回 null */
export function resolveDuoSheetLayout(info: SystemInfoLike | null | undefined): DuoSheetLayout | null {
  if (!info) return null
  if (String(info.platform ?? '').toLowerCase() !== 'ios') return null
  if (!('foldState' in info)) return null
  const fold = normalizeFold(info.foldState)
  if (!ACTIVE_FOLD_STATES.has(fold)) return null

  const ratio = info.lengthScaleRatio && info.lengthScaleRatio > 0 ? info.lengthScaleRatio : 1
  const windowWidth = (info.windowWidth ?? 0) / ratio
  if (!(windowWidth > 0)) return null

  let baseWidth = windowWidth
  if (fold === 'halfopen' && isLandscape(info)) {
    // 折叠中缝在整块屏幕的一半处；window 可能比 screen 窄（如右侧状态栏列）
    const screenWidth = info.screenWidth && info.screenWidth > 0 ? info.screenWidth / ratio : windowWidth
    const hingeX = Math.floor(screenWidth / 2)
    baseWidth = Math.min(hingeX, windowWidth)
    // 存在 avoidAreas 且落在中缝右侧时，把 base 右边界收到避让区左边
    if (Array.isArray(info.avoidAreas)) {
      for (const area of info.avoidAreas) {
        if (!area || typeof area.left !== 'number') continue
        const left = area.left / ratio
        const centerX = left + (area.width ?? 0) / ratio / 2
        if (centerX < hingeX) continue
        if (left < baseWidth) baseWidth = Math.max(0, left)
      }
    }
  }

  const width = Math.min(baseWidth, HALF_SHEET_MAX_CSS_PX)
  return { left: (baseWidth - width) / 2, width }
}

function shouldAnimate(from: DuoSheetLayout, to: DuoSheetLayout): boolean {
  return Math.abs(from.left - to.left) >= 0.5 || Math.abs(from.width - to.width) >= 0.5
}

const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)

const raf = (cb: () => void): number =>
  typeof requestAnimationFrame === 'function'
    ? requestAnimationFrame(cb)
    : (setTimeout(cb, 16) as unknown as number)

const caf = (id: number) => {
  if (typeof cancelAnimationFrame === 'function') cancelAnimationFrame(id)
  else clearTimeout(id)
}

/** 影响面板布局的系统信息签名，用于判断「读到的是不是新状态」 */
export function duoInfoSignature(info: SystemInfoLike | null | undefined): string {
  if (!info) return ''
  return [
    info.platform,
    info.foldState,
    info.deviceOrientation,
    info.windowWidth,
    info.windowHeight,
    info.screenWidth,
    info.lengthScaleRatio,
    JSON.stringify(info.avoidAreas ?? null)
  ].join('|')
}

function readInfo(): SystemInfoLike | null {
  try {
    return Taro.getSystemInfoSync() as SystemInfoLike
  } catch {
    return null
  }
}

/**
 * 返回面板应追加的内联样式（left / width，px 字符串）；非 Duo 返回 undefined。
 * 打开时直接落到当前布局；打开期间折叠 / 旋转时在 250ms 内对 left / width 插值。
 */
export function useDuoSheetLayout(active: boolean): React.CSSProperties | undefined {
  const [layout, setLayout] = React.useState<DuoSheetLayout | null>(null)
  const displayedRef = React.useRef<DuoSheetLayout | null>(null)
  const activeRef = React.useRef(active)
  activeRef.current = active
  const animRef = React.useRef<number | null>(null)
  const resizeRef = React.useRef<number | null>(null)

  const cancelAnim = React.useCallback(() => {
    if (animRef.current != null) {
      caf(animRef.current)
      animRef.current = null
    }
  }, [])

  const show = React.useCallback((next: DuoSheetLayout | null) => {
    displayedRef.current = next
    setLayout(next)
  }, [])

  const signatureRef = React.useRef('')

  const refresh = React.useCallback((animate: boolean) => {
    const info = readInfo()
    signatureRef.current = duoInfoSignature(info)
    const next = resolveDuoSheetLayout(info)
    const from = displayedRef.current
    cancelAnim()
    if (!animate || !from || !next || !shouldAnimate(from, next)) {
      show(next)
      return
    }
    const startedAt = Date.now()
    const step = () => {
      const t = Math.min(1, (Date.now() - startedAt) / LAYOUT_ANIM_MS)
      if (t >= 1) {
        animRef.current = null
        show(next)
        return
      }
      const k = easeInOut(t)
      show({
        left: from.left + (next.left - from.left) * k,
        width: from.width + (next.width - from.width) * k
      })
      animRef.current = raf(step)
    }
    animRef.current = raf(step)
  }, [cancelAnim, show])

  React.useLayoutEffect(() => {
    if (active) refresh(false)
    else cancelAnim()
  }, [active, cancelAnim, refresh])

  React.useEffect(() => () => {
    cancelAnim()
    if (resizeRef.current != null) caf(resizeRef.current)
  }, [cancelAnim])

  // 兜底：打开期间定时比对系统信息签名。fold 过程中 resize 回调读到的可能还是中间态
  // （窗口已变、foldState 未变），且之后不再有回调，面板就会一直停在错误位置直到重新打开。
  React.useEffect(() => {
    if (!active) return
    const timer = setInterval(() => {
      if (duoInfoSignature(readInfo()) !== signatureRef.current) refresh(true)
    }, WATCH_INTERVAL_MS)
    return () => clearInterval(timer)
  }, [active, refresh])

  Taro.useResize(() => {
    if (!activeRef.current) return
    if (resizeRef.current != null) caf(resizeRef.current)
    resizeRef.current = raf(() => {
      resizeRef.current = null
      refresh(true)
    })
  })

  if (!active || !layout) return undefined
  return { left: `${layout.left}px`, width: `${layout.width}px` }
}
