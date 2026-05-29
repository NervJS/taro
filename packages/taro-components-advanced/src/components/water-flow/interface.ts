import { ScrollViewProps } from '@tarojs/components'

import { Node } from './node'

import type { CSSProperties } from 'react'

export interface BaseProps {
  id?: string
  className?: string
  style?: CSSProperties
}

export interface WaterFlowProps
  extends Omit<
  ScrollViewProps,
  'cacheExtent' | 'upperThreshold' | 'lowerThreshold' | 'style'
  >,
  Pick<BaseProps, 'style'> {
  /**
   * 距顶部多少个FlowItem时，触发 scrolltoupper 事件
   * @default 0
   */
  upperThresholdCount?: number
  /**
   * @default 0
   * 距底部多少个 FlowItem时，触发 scrolltolower 事件
   */
  lowerThresholdCount?: number
  /**
   * 设置预加载的 Item 条数。
   * @default 50
   */
  cacheCount?: number
}

export interface FlowSectionProps extends BaseProps {
  /**
   * 列数
   */
  column?: number
  /**
   * 该分组的行间距
   */
  rowGap?: number
  /**
   * 该分组的列间距
   */
  columnGap?: number
}

export interface FlowItemContainerProps extends BaseProps {
  node: Node
}

export interface Size {
  width: number
  height: number
}

/**
 * 滚动方向
 *
 * - forward 向下滚动
 *
 * - backward 向上滚动
 */
export type ScrollDirection = 'forward' | 'backward';
