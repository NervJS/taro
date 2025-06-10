import { ComponentType } from 'react'
import { StandardProps, CommonEventFunction, TouchEventFunction } from './common'
interface MovableViewProps extends Omit<StandardProps, 'animation'> {
  /** movable-view 的移动方向，属性值有`all`、`vertical`、`horizontal`、`none`
   * @default none
   * @supported weapp, alipay, swan, tt, qq, h5, rn, harmony_hybrid
   */
  direction?: 'all' | 'vertical' | 'horizontal' | 'none'
  /** movable-view 是否带有惯性
   * @default false
   * @supported weapp, alipay, swan, tt, qq, h5, harmony_hybrid
   */
  inertia?: boolean
  /** 超过可移动区域后，movable-view 是否还可以移动
   * @default false
   * @supported weapp, alipay, swan, tt, qq, h5, harmony_hybrid
   */
  outOfBounds?: boolean
  /** 定义 x 轴方向的偏移，如果 x 的值不在可移动范围内，会自动移动到可移动范围；改变 x 的值会触发动画
   * @supported weapp, alipay, swan, tt, qq, h5, rn, harmony_hybrid
   */
  x?: number | string
  /** 定义 y 轴方向的偏移，如果 y 的值不在可移动范围内，会自动移动到可移动范围；改变 y 的值会触发动画
   * @supported weapp, alipay, swan, tt, qq, h5, rn, harmony_hybrid
   */
  y?: number | string
  /** 阻尼系数，用于控制x或y改变时的动画和过界回弹的动画，值越大移动越快
   * @default 20
   * @supported weapp, alipay, swan, tt, qq, h5, harmony_hybrid
   */
  damping?: number
  /** 摩擦系数，用于控制惯性滑动的动画，值越大摩擦力越大，滑动越快停止；必须大于 0，否则会被设置成默认值
   * @default 2
   * @supported weapp, alipay, swan, tt, qq, h5, harmony_hybrid
   */
  friction?: number
  /** 是否禁用
   * @default false
   * @supported weapp, alipay, swan, tt, qq, h5, rn, harmony_hybrid
   */
  disabled?: boolean
  /** 是否支持双指缩放，默认缩放手势生效区域是在 movable-view 内
   * @default false
   * @supported weapp, alipay, swan, tt, qq, h5, harmony_hybrid
   */
  scale?: boolean
  /** 定义缩放倍数最小值
   * @default 0.5
   * @supported weapp, alipay, swan, tt, qq, h5, harmony_hybrid
   */
  scaleMin?: number
  /** 定义缩放倍数最大值
   * @default 10
   * @supported weapp, alipay, swan, tt, qq, h5, harmony_hybrid
   */
  scaleMax?: number
  /** 定义缩放倍数，取值范围为 0.5 - 10
   * @default 1
   * @supported weapp, alipay, swan, tt, qq, h5, harmony_hybrid
   */
  scaleValue?: number
  /** 是否使用动画
   * @default true
   * @supported weapp, alipay, swan, tt, qq, h5, harmony_hybrid
   */
  animation?: boolean
  /** 拖动过程中触发的事件
   * @supported weapp, alipay, swan, tt, qq
   */
  onChange?: CommonEventFunction<MovableViewProps.onChangeEventDetail>
  /** 拖动结束触发的事件
   * @supported alipay
   */
  onChangeEnd?: CommonEventFunction<MovableViewProps.onChangeEventDetail>
  /** 开始拖动时触发
   * @supported rn
   */
  onDragStart?: CommonEventFunction
  /** 拖动结束时触发
   * @supported rn
   */
  onDragEnd?: CommonEventFunction
  /** 缩放过程中触发的事件
   * @supported weapp, alipay, swan, tt, qq, h5, harmony_hybrid
   */
  onScale?: CommonEventFunction<MovableViewProps.onScaleEventDetail>
  /** 触摸动作开始，事件会向父节点传递。
   * @supported alipay
   */
  onTouchStart?: CommonEventFunction
  /** 触摸动作开始，事件仅作用于组件，不向父节点传递。
   * @supported alipay
   */
  onTouchMove?: CommonEventFunction
  /** 手指触摸动作结束
   * @supported alipay, h5, harmony_hybrid
   * @h5 此事件的触发顺序会因为当前事件机制引起组件内外注册的事件执行顺序不正常，外部注册的事件可能会优先于内部执行，如需保证执行顺序一致，需要在回调函数中包裹 setTimeout 临时处理
   */
  onTouchEnd?: TouchEventFunction
  /** 触摸动作被打断，如来电提醒、弹窗。
   * @supported alipay
   */
  onTouchCancel?: CommonEventFunction
  /** 初次手指触摸后移动为横向的移动，如果 catch 此事件，则意味着 touchmove 事件也被 catch
   * @supported weapp, swan, tt, h5, harmony_hybrid
   */
  onHTouchMove?: TouchEventFunction
  /** 初次手指触摸后移动为纵向的移动，如果 catch 此事件，则意味着 touchmove 事件也被 catch
   * @supported weapp, swan, tt, h5, harmony_hybrid
   */
  onVTouchMove?: TouchEventFunction
  /** 触摸移动事件，事件仅作用于组件，不向父节点传递。
   * @supported alipay
   */
  catchTouchStart?: CommonEventFunction
  /** 触摸移动事件，事件仅作用于组件，不向父节点传递。
   * @supported alipay
   */
  catchTouchMove?: CommonEventFunction
  /** 触摸动作结束，事件仅作用于组件，不向父节点传递。
   * @supported alipay
   */
  catchTouchEnd?: CommonEventFunction
}
declare namespace MovableViewProps {
  /** 拖动过程中触发的事件 */
  interface TChangeSource {
    /** 拖动 */
    touch
    /** 超出移动范围 */
    'touch-out-of-bounds'
    /** 超出移动范围后的回弹 */
    'out-of-bounds'
    /** 惯性 */
    friction
    /** setData */
    ''
  }
  interface onChangeEventDetail {
    /** X 坐标 */
    x: number
    /** Y 坐标 */
    y: number
    /** 触发事件 */
    source: keyof MovableViewProps.TChangeSource
  }
  interface onScaleEventDetail {
    /** X 坐标 */
    x: number
    /** Y 坐标 */
    y: number
    /** 缩放比例 */
    scale: number
  }
}
/** 可移动的视图容器，在页面中可以拖拽滑动。movable-view 必须在 movable-area 组件中，并且必须是直接子节点，否则不能移动。
 * @classification viewContainer
 * @supported weapp, alipay, swan, tt, qq, h5, rn, harmony_hybrid
 * @example_react
 * ```tsx
 * class App extends Components {
 *   render () {
 *     return (
 *       <MovableArea style='height: 200px; width: 200px; background: red;'>
 *         <MovableView style='height: 50px; width: 50px; background: blue;' direction='all'></MovableView>
 *       </MovableArea>
 *     )
 *   }
 * }
 * ```
 * @example_vue
 * ```html
 *   <movable-area style='height: 200px; width: 200px; background: red;'>
 *     <movable-view style='height: 50px; width: 50px; background: blue;' direction='all'>带我走</movable-view>
 *   </movable-area>
 * ```
 * @see https://developers.weixin.qq.com/miniprogram/dev/component/movable-view.html
 */
declare const MovableView: ComponentType<MovableViewProps>
export { MovableView, MovableViewProps }
