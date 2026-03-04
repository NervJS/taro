import { ScrollViewProps } from '@tarojs/components'

import { Node } from './node'

import type { CSSProperties, RefObject } from 'react'

export interface BaseProps {
  id?: string
  className?: string
  style?: CSSProperties
}

export interface WaterFlowProps
  extends Omit<
  ScrollViewProps,
  'cacheExtent' | 'upperThreshold' | 'lowerThreshold' | 'style' | 'type'
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

  // ===== 扩展：嵌套滚动（H5，借鉴 react-virtualized scrollElement）=====
  /** 滚动模式：default=自有 ScrollView；nested=使用父级滚动（需配合 scrollElement 或 Context） */
  type?: 'default' | 'nested'
  /** 自定义滚动容器 ref，type=nested 时从 props 或 Context 获取 */
  scrollElement?: RefObject<HTMLElement | null>
  /** WaterFlow 内容在滚动容器中的起始偏移（上方有其他内容时使用） */
  startOffset?: number
  /** 可视区高度，scrollElement 模式下可选，不传则从 scrollElement.clientHeight 获取 */
  containerHeight?: number
  /** 任务 4.2：瀑布流内容高度变化时回调（便于 List 动高联动，避免底部空白） */
  onScrollHeightChange?: (height: number) => void
  /** scrollIntoView 滚动完成后回调，便于父组件清空 scrollIntoView 以支持重复点击同一目标 */
  onScrollIntoViewComplete?: () => void
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
