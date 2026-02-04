import React from 'react'

/**
 * NoMore 组件 - 底部"没有更多"提示
 *
 * 这是一个标记组件，不直接渲染内容，仅用于向 List 组件传递配置。
 * 实际渲染由 List 组件内部处理。
 *
 * @example
 * ```tsx
 * <List>
 *   <ListItem>Item 1</ListItem>
 *   <NoMore visible={!hasMore} text="没有更多了" />
 * </List>
 * ```
 */

export interface NoMoreProps {
  /** 是否显示（默认 true） */
  visible?: boolean

  /** 提示文字（默认 "没有更多了"） */
  text?: string

  /** 自定义样式 */
  style?: React.CSSProperties

  /** 自定义内容（优先级高于 text） */
  children?: React.ReactNode

  /** NoMore 区域高度（用于动态高度计算，默认 60） */
  height?: number
}

const NoMore: React.FC<NoMoreProps> = () => {
  // 标记组件，不实际渲染
  // 实际渲染由 List 组件内部的 renderNoMoreContent() 处理
  return null
}

// 设置 displayName 便于调试
NoMore.displayName = 'NoMore'

export { NoMore }
export default NoMore
