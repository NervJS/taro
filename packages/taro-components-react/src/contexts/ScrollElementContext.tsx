import React from 'react'

/**
 * ScrollElementContext：嵌套滚动场景下，父容器（ScrollView/List）向子组件提供滚动容器信息。
 * 子组件（WaterFlow/List）可从 Context 获取 scrollRef、containerHeight、startOffset，
 * 实现随父容器一起滚动，无需业务方手动传 scrollElement。
 */
export interface ScrollElementContextValue {
  /** 外层滚动容器 ref */
  scrollRef: React.MutableRefObject<HTMLElement | null>
  /** 可视区高度 */
  containerHeight: number
  /** 内容在滚动容器中的起始偏移（上方有其他内容时使用） */
  startOffset: number
  /** 内层 WaterFlow 报告 scrollHeight 时调用（List 动高联动等） */
  reportNestedHeightChange?: (scrollHeight: number) => void
}

export const ScrollElementContext = React.createContext<ScrollElementContextValue | null>(null)
