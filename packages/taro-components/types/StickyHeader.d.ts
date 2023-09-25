import { ComponentType } from 'react'
import { StandardProps } from './common'
interface StickyHeaderProps extends StandardProps {}

/**
 * 吸顶布局容器，仅支持作为 scroll-view 自定义模式下的直接子节点或 sticky-section 组件直接子节点。仅 Skyline 支持。
 * @classification skyline
 * @supported weapp
 * @see https://developers.weixin.qq.com/miniprogram/dev/component/sticky-header.html
 */
declare const StickyHeader: ComponentType<StickyHeaderProps>
export { StickyHeader, StickyHeaderProps }
