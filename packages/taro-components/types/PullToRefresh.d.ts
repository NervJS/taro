import { ComponentType } from 'react'

interface Indicator {
  activate?: React.ReactNode
  deactivate?: React.ReactNode
  release?: React.ReactNode
  finish?: React.ReactNode
}

interface PullToRefreshProps {
  refreshing?: boolean
  distanceToRefresh: number
  onRefresh: () => void
  indicator: Indicator
  prefixCls?: string
  className?: string
  style?: React.CSSProperties
  damping: number
}

/** 下拉组件
 * @ignore
 */
declare const PullToRefresh: ComponentType<PullToRefreshProps>

export { PullToRefresh, PullToRefreshProps }
