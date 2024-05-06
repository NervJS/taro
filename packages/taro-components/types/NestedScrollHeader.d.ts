import { ComponentType } from 'react'
import { StandardProps, CommonEventFunction } from './common'

interface NestedScrollHeaderProps extends StandardProps {}

/**
 * 嵌套 scroll-view 场景中属于外层 scroll-view 的节点，
 * 仅支持作为 `<scroll-view type="nested">` 模式的直接子节点。
 * 不支持复数子节点，渲染时会取其第一个子节点来渲染。具体用法可参考 scroll-view
 * @classification skyline
 * @supported weapp
 * @see https://developers.weixin.qq.com/miniprogram/dev/component/nested-scroll-header.html
 */
declare const NestedScrollHeader: ComponentType<NestedScrollHeaderProps>
export { NestedScrollHeader, NestedScrollHeaderProps }
