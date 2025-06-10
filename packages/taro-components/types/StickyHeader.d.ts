import { ComponentType } from 'react'
import { StandardProps } from './common'
interface StickyHeaderProps extends StandardProps {
   /**
    * 吸顶时与顶部的距(px)
    * @supported weapp
    * @default 0
    */
   offsetTop?: number
   /**
    * 长度为 4 的数组，按 top、right、bottom、left 顺序指定内边距
    * @supported weapp
    * @default [0, 0, 0, 0]
    */
   padding?: [number, number, number, number]
  /**
   * 吸顶状态变化事件，仅支持非 worklet 的组件方法作为回调。event.detail = { isStickOnTop }，当 sticky-header 吸顶时为 true，否则为 false。
   * @supported weapp
   * @version >=3.6.2
   */
  onStickOnTopChange?: CommonEventFunction
}

/**
 * 吸顶布局容器，仅支持作为 scroll-view 自定义模式下的直接子节点或 sticky-section 组件直接子节点。仅 Skyline 支持。
 * @classification skyline
 * @supported weapp, harmony
 * @see https://developers.weixin.qq.com/miniprogram/dev/component/sticky-header.html
 */
declare const StickyHeader: ComponentType<StickyHeaderProps>
export { StickyHeader, StickyHeaderProps }
