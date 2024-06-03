import { ComponentType } from 'react'
import { StandardProps, CommonEventFunction } from './common'
interface ListBuilderProps extends StandardProps {
  /**
   * 布局方式
   * @supported weapp
   * @default "aligned"
   *
   * 可选值:
   * - static: 定高模式，所有列表项等高，需要传入 child-height
   * - dynamic: 不定高模式
   */
  type: 'static' | 'dynamic'
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
   * 列表项的高度，当 type 为 static 时必须传入
   * @supported weapp
   */
  childHeight?: number
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
 * 列表构造器，仅支持作为 `<scroll-view type="custom">` 模式的直接子节点，仅 Skyline 支持。
 * @classification skyline
 * @supported weapp
 * @see https://developers.weixin.qq.com/miniprogram/dev/component/list-builder.html
 */
declare const ListBuilder: ComponentType<ListBuilderProps>
export { ListBuilder, ListBuilderProps }
