import { ComponentType } from 'react'
import { StandardProps } from './common'
interface ListViewProps extends StandardProps {}

/**
 * 列表布局容器，仅支持作为 scroll-view 自定义模式下的直接子节点或 sticky-section 组件直接子节点。仅 Skyline 支持。
 * @classification skyline
 * @supported weapp
 * @see https://developers.weixin.qq.com/miniprogram/dev/component/list-view.html
 */
declare const ListView: ComponentType<ListViewProps>
export { ListView, ListViewProps }
