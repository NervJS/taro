import Taro from '@tarojs/taro'
import * as React from 'react'

import { PickerGroupLegacy } from './picker-group-legacy'
import { PickerGroupSlider } from './picker-group-slider'

// re-export 各列变体（供单测按变体粒度直接引用，默认导出新版 slider 实现）
export {
  PickerGroupBasic,
  PickerGroupDate,
  PickerGroupRegion,
  PickerGroupTime,
} from './picker-group-slider'

export interface PickerGroupProps {
  mode?: 'basic' | 'time' | 'date' | 'region'
  range: any[]
  rangeKey?: string
  columnId: string
  updateIndex: (index: number, columnId: string, needRevise?: boolean, isUserBeginScroll?: boolean) => void // 替换updateHeight
  onColumnChange?: (e: { columnId: string, index: number }) => void // 修改回调参数名称
  updateDay?: (value: number, fields: number) => void
  selectedIndex?: number // 添加selectedIndex参数
  _updateTrigger?: any // 仅用于强制触发更新
  colors?: {
    itemDefaultColor?: string // 选项字体默认颜色
    itemSelectedColor?: string // 选项字体选中颜色
    lineColor?: string // 选中指示线颜色
  }
  /** time 限位后由父级下发，命中 columnId 的列在稳定后对该项 setAccessibilityFocus */
  timeA11yLimitFocus?: { nonce: number, columnId: string } | null
  onTimeA11yLimitFocusConsumed?: () => void
  /** time 限位单调计数：抑制非触发列在停滚时误抢无障碍焦点 */
  timeA11yLimitEventNonce?: number
  /** 点击选项是否滚至选中区，默认 true */
  enableClickItemScroll?: boolean
}

// 启用新版无障碍（slider 遮挡方案）所需的最低 app 版本；低于此版本回退旧版逐项聚焦方案
const MIN_A11Y_APP_VERSION = '15.9.50'

// 逐段比较版本号：v1 > v2 返回 1，v1 < v2 返回 -1，相等返回 0（缺失段按 0 处理）
function compareVersion(v1: string, v2: string): number {
  const a = String(v1).split('.')
  const b = String(v2).split('.')
  const len = Math.max(a.length, b.length)
  for (let i = 0; i < len; i++) {
    const n1 = parseInt(a[i], 10) || 0
    const n2 = parseInt(b[i], 10) || 0
    if (n1 > n2) return 1
    if (n1 < n2) return -1
  }
  return 0
}

// 读取运行环境判定是否启用新版无障碍：须同时满足 dynamic 模式 且 app 版本 >= 15.9.50；任一不满足或取不到版本时保守回退旧版（线上稳定实现）
function resolveUseSliderA11y(): boolean {
  // 仅 dynamic 模式启用新版无障碍
  if (process.env.TARO_ENV !== 'dynamic') return false
  try {
    const version = (Taro.getSystemInfoSync() as any).version || ''
    if (!version) return false
    return compareVersion(version, MIN_A11Y_APP_VERSION) >= 0
  } catch {
    return false
  }
}

// 默认导出：按 app 版本整体分发到新版（slider）或旧版（legacy）无障碍实现
export function PickerGroup(props: PickerGroupProps) {
  // 在组件渲染时判定（此时 Taro runtime 已就绪，避免模块加载期 API 未初始化）
  const useSliderA11y = resolveUseSliderA11y()
  return useSliderA11y
    ? <PickerGroupSlider {...props} />
    : <PickerGroupLegacy {...props} />
}
