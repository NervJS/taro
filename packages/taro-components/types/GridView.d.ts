import { ComponentType } from 'react'
import { StandardProps } from './common'
interface GridViewProps extends StandardProps {
  /** 布局方式。masonry - 瀑布流，根据子元素高度自动布局。  aligned - 每行高度由同一行中最大高度子节点决定。
   * @supported weapp
   * @default "aligned"
   */
  type: string
  /** 交叉轴元素数量
   * @supported weapp
   * @default 2
   */
  crossAxisCount?: number
  /** 主轴方向间隔
   * @supported weapp
   * @default 0
   */
  mainAxisGap?: number
  /** 交叉轴方向间隔
   * @supported weapp
   * @default 0
   */
  crossAxisGap?: number
  /** 交叉轴元素最大范围
   * @supported weapp
   * @default 0
   */
  maxCrossAxisExtent?: number
}
/**
 * 网格布局容器，仅支持作为 scroll-view 自定义模式下的直接子节点或 sticky-section 组件直接子节点。仅 Skyline 支持。
 * @classification skyline
 * @supported weapp
 * @see https://developers.weixin.qq.com/miniprogram/dev/component/grid-view.html
 */
declare const GridView: ComponentType<GridViewProps>
export { GridView, GridViewProps }
