import React from 'react'

/**
 * Refresher 组件 - 下拉刷新（标记组件）
 *
 * 以各平台 ScrollView 的 refresher 落地为准：
 * - weapp/jd/tt: ScrollView.refresher-enabled / bindRefresherPulling 等
 * - 本组件为标记组件，不渲染 DOM，仅向 List 等传配置；实际下拉逻辑由 List/ScrollView 内 useRefresher 或原生 refresher 处理。
 *
 * 高度规则：
 * - 无 children：使用默认 50px 高度
 * - 有 children：由 children 内容撑开高度
 *
 * children：用于替换「加载楼层」中间的显示内容；不传则使用默认文案（下拉刷新/释放刷新/加载中...）。
 * 小程序自定义需配合 refresherDefaultStyle="none"。
 *
 * @example 使用默认文案（50px 高度）
 * <Refresher refresherEnabled refresherThreshold={50} onRefresherRefresh={fetchData} />
 *
 * @example 自定义内容（由内容撑开高度）
 * <Refresher refresherEnabled refresherDefaultStyle="none" onRefresherRefresh={fetchData}>
 *   <View style={{ height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
 *     <Text>下拉刷新</Text>
 *   </View>
 * </Refresher>
 */

/** 与 ScrollView.d.ts 的 refresher 相关属性、事件对齐 */
export interface RefresherProps {
  refresherEnabled?: boolean
  refresherThreshold?: number
  refresherDefaultStyle?: 'black' | 'white' | 'none'
  refresherBackground?: string
  refresherTriggered?: boolean
  /** 自定义刷新内容（替换默认「下拉刷新/释放刷新/加载中...」文案） */
  children?: React.ReactNode
  onRefresherPulling?: (e?: { detail?: { deltaY?: number } }) => void
  onRefresherRefresh?: () => void | Promise<void>
  onRefresherRestore?: () => void
  onRefresherAbort?: () => void
  onRefresherWillRefresh?: () => void
  onRefresherStatusChange?: (e?: { detail?: { status?: number, dy?: number } }) => void
}

const Refresher: React.FC<RefresherProps> = () => {
  return null
}

Refresher.displayName = 'Refresher'

export { Refresher }
export default Refresher
