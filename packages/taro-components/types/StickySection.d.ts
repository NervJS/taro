import { ComponentType } from 'react'
import { StandardProps } from './common'
interface StickySectionProps extends StandardProps {
  /** 吸顶元素重叠时是否继续上推
   * @supported weapp
   * @default true
   */
  pushPinnedHeader?: boolean
  /**
   * 长度为 4 的数组，按 top、right、bottom、left 顺序指定内边距
   * @supported weapp
   * @default [0, 0, 0, 0]
   */
  padding?: [number, number, number, number]
}
/**
 * 吸顶布局容器，仅支持作为 scroll-view 自定义模式下的直接子节点。仅 Skyline 支持。
 * @classification skyline
 * @supported weapp
 * @see https://developers.weixin.qq.com/miniprogram/dev/component/sticky-section.html
 */
declare const StickySection: ComponentType<StickySectionProps>
export { StickySection, StickySectionProps }
