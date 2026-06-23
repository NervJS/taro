import { ComponentType } from 'react'
import { StandardProps, CommonEventFunction } from './common'
interface GridBuilderProps extends StandardProps {
  /**
   * 布局方式
   * @supported weapp
   * @default "aligned"
   *
   * 可选值:
   * - aligned: 每行高度由同一行中最大高度子节点决定
   * - masonry: 瀑布流，根据子元素高度自动布局
   */
  type: 'aligned' | 'masonry'
  /**
   * 需要用于渲染的列表
   * @supported weapp
   * @default []
   */
  list: any[]
  /**
   * 完整列表的长度，如果不传则取 list 的长度作为其值
   * @supported weapp
   */
  childCount?: number
  /**
   * 交叉轴元素数量
   * @supported weapp
   * @default 2
   */
  crossAxisCount?: number
  /** 交叉轴元素最大范围
   * @supported weapp
   * @default 0
   */
  maxCrossAxisExtent?: number
  /**
   * 主轴方向间隔
   * @supported weapp
   * @default 0
   */
  mainAxisGap?: number
  /** 交叉轴方向间隔
   * @supported weapp
   * @default 0
   */
  crossAxisGap?: number
  /**
   * 长度为 4 的数组，按 top、right、bottom、left 顺序指定内边距
   * @supported weapp
   * @default [0, 0, 0, 0]
   */
  padding?: [number, number, number, number]
  /**
   * 列表项创建时触发，event.detail = {index}，index 即被创建的列表项序号
   * @supported weapp
   */
  onItemBuild?: CommonEventFunction
  /**
   * 列表项回收时触发，event.detail = {index}，index 即被回收的列表项序号
   * @supported weapp
   */
  onItemDispose?: CommonEventFunction
}

/**
 * 网格构造器，仅支持作为 `<scroll-view type="custom">` 模式的直接子节点，仅 Skyline 支持。
 * @classification skyline
 * @supported weapp
 * @see https://developers.weixin.qq.com/miniprogram/dev/component/grid-builder.html
 */
declare const GridBuilder: ComponentType<GridBuilderProps>
export { GridBuilder, GridBuilderProps }
