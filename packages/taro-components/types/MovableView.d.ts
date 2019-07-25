import { ComponentType } from 'react'
import { StandardProps, CommonEventFunction, TouchEventFunction, Omit } from './common'

export interface MovableAreaProps extends StandardProps {

  /**
   * 当里面的movable-view设置为支持双指缩放时，设置此值可将缩放手势生效区域修改为整个movable-area
   *
   * 默认值：`false`
   */
  scaleArea?: boolean
}


export interface MovableViewProps extends Omit<StandardProps, 'animation'> {

  /**
   * movable-view的移动方向，属性值有`all`、`vertical`、`horizontal`、`none`
   *
   * 默认值：`none`
   */
  direction?: 'all' | 'vertical' | 'horizontal' | 'none',

  /**
   * movable-view是否带有惯性
   *
   * 默认值：`false`
   */
  inertia?: boolean,

  /**
   * 超过可移动区域后，movable-view是否还可以移动
   *
   * 默认值：`false`
   */
  outOfBounds?: boolean

  /**
   * 	定义x轴方向的偏移，如果x的值不在可移动范围内，会自动移动到可移动范围；改变x的值会触发动画
   */
  x?: number | string,

  /**
   * 	定义y轴方向的偏移，如果y的值不在可移动范围内，会自动移动到可移动范围；改变y的值会触发动画
   */
  y?: number | string,

  /**
   * 阻尼系数，用于控制x或y改变时的动画和过界回弹的动画，值越大移动越快
   *
   * 默认值：`20`
   */
  damping?: number,

  /**
   * 摩擦系数，用于控制惯性滑动的动画，值越大摩擦力越大，滑动越快停止；必须大于0，否则会被设置成默认值
   *
   * 默认值：`2`
   */
  friction?: number,

  /**
   * 是否禁用
   *
   * 默认值：`false`
   */
  disabled?: boolean,

  /**
   * 是否支持双指缩放，默认缩放手势生效区域是在movable-view内
   *
   * 默认值：`fasle`
   */
  scale?: boolean,

  /**
   * 定义缩放倍数最小值
   *
   * 默认值：`0.5`
   */
  scaleMin?: number,

  /**
   * 定义缩放倍数最大值
   *
   * 默认值：`10`
   */
  scaleMax?: number,

  /**
   * 定义缩放倍数，取值范围为 0.5 - 10
   *
   * 默认值：`1`
   */
  scaleValue?: number,

  /**
   * 是否使用动画
   *
   * 基础库: 2.1.0
   *
   * 默认值：`true`
   */
  animation?: boolean;

  /**
   * 拖动过程中触发的事件，event.detail = `{x: x, y: y, source: source}`，其中source表示产生移动的原因，值可为touch（拖动）、touch-out-of-bounds（超出移动范围）、out-of-bounds（超出移动范围后的回弹）、friction（惯性）和空字符串（setData）
   *
   */
  onChange?: CommonEventFunction,

  /**
   * 缩放过程中触发的事件，event.detail = `{scale: scale}`
   *
   */
  onScale?: CommonEventFunction,

  /**
   * 初次手指触摸后移动为横向的移动，如果catch此事件，则意味着touchmove事件也被catch
   */
  onHTouchMove?: TouchEventFunction,

  /**
   * 初次手指触摸后移动为纵向的移动，如果catch此事件，则意味着touchmove事件也被catch
   */
  onVTouchMove?: TouchEventFunction,
}

declare const MovableArea: ComponentType<MovableAreaProps>

declare const MovableView: ComponentType<MovableViewProps>

export { MovableArea, MovableView }
