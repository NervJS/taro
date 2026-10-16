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
export function resolveDuoSheetLayout(
  info: SystemInfoLike | null | undefined,
  options?: { navigationBarHidden?: boolean }
): DuoSheetLayout | null {
  if (!info) return null
  if (String(info.platform ?? '').toLowerCase() !== 'ios') return null
  if (!('foldState' in info)) return null
  const fold = normalizeFold(info.foldState)
  if (!ACTIVE_FOLD_STATES.has(fold)) return null

  const ratio = info.lengthScaleRatio && info.lengthScaleRatio > 0 ? info.lengthScaleRatio : 1
  const windowWidth = (info.windowWidth ?? 0) / ratio
  if (!(windowWidth > 0)) return null

  // 原生覆盖成功后蒙层包含侧栏，而 windowWidth 仍可能只表示业务页宽。
  // 只扩大横向全窗基准，半折叠仍按原物理中缝约束，失败/未覆盖保持原行为。
  const screenWidth = info.screenWidth
  const fullWidth = options?.navigationBarHidden && typeof screenWidth === 'number' &&
    Number.isFinite(screenWidth) && screenWidth > (info.windowWidth ?? 0)
    ? screenWidth / ratio
    : windowWidth
  let baseWidth = fullWidth
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


/* ------------------------------------------------------------------ */
/* Duo 下 Picker 打开期间屏蔽导航栏（侧边栏）并把原生背景设成蒙层色     */
/* Taro.JDNavigationBar.setIOSDialogAppearanceSync({ active, viewBackgroundColor }) */
/* 同步接口，仅返回值严格等于 true 才算成功；重复关闭安全                  */
/* ------------------------------------------------------------------ */

/** 与 style/variable.scss 的默认蒙层色一致：浅色 rgba(0,0,0,0.6) / 深色 rgba(20,20,20,0.7) */
export const DUO_MASK_COLOR_LIGHT = '#00000099'
export const DUO_MASK_COLOR_DARK = '#141414B3'

const toHex2 = (n: number) =>
  Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0').toUpperCase()

/** CSS 颜色 → #RRGGBB / #RRGGBBAA（透明度在末尾）；无法转换返回 undefined */
export function toNativeMaskColor(input: unknown): string | undefined {
  if (typeof input !== 'string') return undefined
  const text = input.trim()
  if (!text) return undefined
  const hex = /^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.exec(text)
  if (hex) {
    let digits = hex[1]
    if (digits.length <= 4) digits = digits.split('').map(c => c + c).join('')
    return `#${digits.toUpperCase()}`
  }
  const rgb = /^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+%?)\s*)?\)$/i.exec(text)
  if (rgb) {
    let alpha = 1
    if (rgb[4]) {
      alpha = rgb[4].endsWith('%') ? parseFloat(rgb[4]) / 100 : parseFloat(rgb[4])
      if (!Number.isFinite(alpha)) return undefined
      alpha = Math.max(0, Math.min(1, alpha))
    }
    const base = `#${toHex2(+rgb[1])}${toHex2(+rgb[2])}${toHex2(+rgb[3])}`
    return alpha >= 1 ? base : `${base}${toHex2(alpha * 255)}`
  }
  return undefined
}

/** 蒙层色：优先 colors.maskColor（可转换时），否则按主题取默认色 */
export function resolveDuoMaskColor(customColor: unknown, theme?: string): string {
  return toNativeMaskColor(customColor) ?? (theme === 'dark' ? DUO_MASK_COLOR_DARK : DUO_MASK_COLOR_LIGHT)
}

type AppearanceApi = (options: { active: boolean, viewBackgroundColor?: string | null }) => unknown

interface AppearanceEntry { id: number, color: string }
interface SharedAppearanceState {
  stack: AppearanceEntry[]
  seq: number
  applied: boolean
  restoreTimer?: ReturnType<typeof setTimeout>
  restoreAttempts?: number
}

// 与 @jdtaro/ui 共用同一份状态（挂在 globalThis），弹层与 Picker 叠加时最后一个关闭才恢复导航栏
const SHARED_KEY = '__JD_DUO_DIALOG_APPEARANCE__'
const globalStore = globalThis as unknown as Record<string, SharedAppearanceState | undefined>
const shared: SharedAppearanceState =
  globalStore[SHARED_KEY] || (globalStore[SHARED_KEY] = { stack: [], seq: 0, applied: false })

function getAppearanceApi(): AppearanceApi | null {
  const nav = (Taro as unknown as {
    JDNavigationBar?: { setIOSDialogAppearanceSync?: AppearanceApi }
  }).JDNavigationBar
  const fn = nav?.setIOSDialogAppearanceSync
  return typeof fn === 'function' ? fn.bind(nav) : null
}

function clearRestoreTimer() {
  if (shared.restoreTimer != null) {
    clearTimeout(shared.restoreTimer)
    shared.restoreTimer = undefined
  }
}

function flushAppearance() {
  clearRestoreTimer()
  const api = getAppearanceApi()
  const top = shared.stack[shared.stack.length - 1]
  try {
    if (api && top) {
      // 更新失败不撤销之前已成功的原生覆盖，保留最终恢复责任。
      if (api({ active: true, viewBackgroundColor: top.color }) === true) shared.applied = true
    } else if (api && shared.applied && !top) {
      if (api({ active: false }) === true) {
        shared.applied = false
        shared.restoreAttempts = 0
      }
    }
  } catch {
    // 接口异常不影响 Picker 本身；最后一层恢复失败仍走有限重试。
  }
  if (shared.applied && shared.stack.length === 0 && (shared.restoreAttempts ?? 0) < 3) {
    shared.restoreAttempts = (shared.restoreAttempts ?? 0) + 1
    shared.restoreTimer = setTimeout(() => {
      shared.restoreTimer = undefined
      if (shared.stack.length === 0 && shared.applied) flushAppearance()
    }, 250)
  }
}

interface AppearanceHandle { update: (color: string) => void, release: () => void }

/** 内部导出供回归测试，不从组件库公共入口导出。 */
export function acquireAppearance(color: string): AppearanceHandle {
  clearRestoreTimer()
  shared.restoreAttempts = 0
  const entry: AppearanceEntry = { id: ++shared.seq, color }
  shared.stack.push(entry)
  flushAppearance()
  return {
    update(next) {
      if (entry.color === next || !shared.stack.includes(entry)) return
      entry.color = next
      flushAppearance()
    },
    release() {
      const index = shared.stack.indexOf(entry)
      if (index < 0) return
      shared.stack.splice(index, 1)
      flushAppearance()
    }
  }
}

/** 屏蔽 / 恢复导航栏会改变窗口尺寸，其后的 resize 直接落位、不再插值 */
const APPEARANCE_SETTLE_MS = 500

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
export function useDuoSheetLayout(active: boolean, maskColor?: string): React.CSSProperties | undefined {
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
    const next = resolveDuoSheetLayout(info, { navigationBarHidden: shared.applied })
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

  // 仅 Duo：打开期间屏蔽导航栏并把原生背景设成蒙层色。排在「读取布局」effect 之前：
  // 先改窗口，再按新窗口尺寸算布局；窗口更新可能晚于接口返回，落定后再读一次直接落位。
  const appearanceHandleRef = React.useRef<AppearanceHandle | null>(null)
  const settleUntilRef = React.useRef(0)
  React.useLayoutEffect(() => {
    if (!active || !maskColor) return
    if (!resolveDuoSheetLayout(readInfo())) return
    settleUntilRef.current = Date.now() + APPEARANCE_SETTLE_MS
    appearanceHandleRef.current = acquireAppearance(maskColor)
    const settleTimer = setTimeout(() => {
      if (activeRef.current) refresh(false)
    }, APPEARANCE_SETTLE_MS / 4)
    return () => {
      clearTimeout(settleTimer)
      appearanceHandleRef.current?.release()
      appearanceHandleRef.current = null
      settleUntilRef.current = Date.now() + APPEARANCE_SETTLE_MS
    }
    // 颜色变化走下面的 update，避免先恢复再屏蔽造成闪动
  }, [active, !!maskColor])

  React.useLayoutEffect(() => {
    if (maskColor) appearanceHandleRef.current?.update(maskColor)
  }, [maskColor])

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
      if (duoInfoSignature(readInfo()) !== signatureRef.current) {
        refresh(Date.now() >= settleUntilRef.current)
      }
    }, WATCH_INTERVAL_MS)
    return () => clearInterval(timer)
  }, [active, refresh])

  Taro.useResize(() => {
    if (!activeRef.current) return
    if (resizeRef.current != null) caf(resizeRef.current)
    resizeRef.current = raf(() => {
      resizeRef.current = null
      refresh(Date.now() >= settleUntilRef.current)
    })
  })

  if (!active || !layout) return undefined
  return { left: `${layout.left}px`, width: `${layout.width}px` }
}
