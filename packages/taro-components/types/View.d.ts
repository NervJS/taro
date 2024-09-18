import { ComponentType } from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import { CommonEventFunction, StandardProps } from './common'
interface ViewProps extends StandardProps {
  /** 指定按下去的样式类。当 `hover-class="none"` 时，没有点击态效果
   * @default none
   * @supported weapp, alipay, swan, tt, qq, jd, h5, rn, harmony_hybrid
   * @rn 由于 RN 不支持 hoverClass，故 RN 端的 View 组件实现了 `hoverStyle`属性，写法和 style 类似，只不过 `hoverStyle` 的样式是指定按下去的样式。
   */
  hoverClass?: string
  /** 由于 RN 不支持 hoverClass，故 RN 端的 View 组件实现了 `hoverStyle`属性，写法和 style 类似，只不过 `hoverStyle` 的样式是指定按下去的样式。
   * @default none
   * @supported rn
   */
  hoverStyle?: StyleProp<ViewStyle>
  /** 指定是否阻止本节点的祖先节点出现点击态
   * @default false
   * @supported weapp, alipay, swan, tt, qq, jd
   */
  hoverStopPropagation?: boolean
  /** 按住后多久出现点击态，单位毫秒
   * @default 50
   * @supported weapp, alipay, swan, tt, qq, jd, h5, rn, harmony_hybrid
   */
  hoverStartTime?: number
  /** 手指松开后点击态保留时间，单位毫秒
   * @default 400
   * @supported weapp, alipay, swan, tt, qq, jd, h5, rn, harmony_hybrid
   */
  hoverStayTime?: number
  /** 是否阻止区域内滚动页面。
   * 说明： 如果 view 中嵌套 view，外层 view 设置 disable-scroll 为 true 时禁止内部的滚动。
   * @supported alipay
   * @default false
   */
  disableScroll?: boolean
  /** 是否隐藏。
   * @supported alipay
   * @default false
   */
  hidden?: boolean
  /** 用于动画，详见 my.createAnimation 。使用 my.createAnimation 生成的动画是通过过渡（Transition）实现的，只会触发 onTransitionEnd，不会触发 onAnimationStart, onAnimationIteration, onAnimationEnd。
   * @supported alipay
   * @default {}
   */
  animation?: TaroGeneral.IAnyObject
  /** 表示组件的语义角色。设置为 img 时，组件聚焦后读屏软件会朗读出 图像 ；设置为 button 时，聚焦后读屏软件会朗读出 按钮 。详情请参见 aria-component。
   * @supported alipay
   */
  role?: string
  /** 无障碍访问，（角色）标识元素的作用
   * @supported qq
   */
  ariaRole?: string
  /** 无障碍访问，（属性）元素的额外描述
   * @supported qq
   */
  ariaLabel?: string
  /** 点击。
   * @supported alipay
   */
  onTap?: CommonEventFunction
  /** 触摸动作开始。
   * @supported alipay
   */
  onTouchStart?: CommonEventFunction
  /** 触摸后移动。
   * @supported alipay
   */
  onTouchMove?: CommonEventFunction
  /** 触摸动作结束。
   * @supported alipay
   */
  onTouchEnd?: CommonEventFunction
  /** 触摸动作被打断，如来电提醒，弹窗。
   * @supported alipay
   */
  onTouchCancel?: CommonEventFunction
  /** 长按 500ms 之后触发，触发了长按事件后进行移动将不会触发屏幕的滚动。
   * @supported alipay
   */
  onLongTap?: CommonEventFunction
  /** 过渡（Transition）结束时触发。
   * @supported alipay
   */
  onTransitionEnd?: CommonEventFunction
  /** 每开启一次新的动画过程时触发。（第一次不触发）
   * @supported alipay
   */
  onAnimationIteration?: CommonEventFunction
  /** 动画开始时触发。
   * @supported alipay
   */
  onAnimationStart?: CommonEventFunction
  /** 动画结束时触发。
   * @supported alipay
   */
  onAnimationEnd?: CommonEventFunction
  /** 当前元素可见面积超过50%时触发。
   * @supported alipay
   */
  onAppear?: CommonEventFunction
  /** 当前元素不可见面积超过50%时触发。
   * @supported alipay
   */
  onDisappear?: CommonEventFunction
  /** 当前元素首次可见面积达到50%时触发。
   * @supported alipay
   */
  onFirstAppear?: CommonEventFunction
  /** 是否以 catch 的形式绑定 touchmove 事件
   * @supported weapp, alipay, swan, tt, qq, jd
   * @version 3.1.0+
   * @unique
   */
  catchMove?: boolean
}
/** 视图容器
 * @classification viewContainer
 * @supported weapp, alipay, swan, tt, qq, jd, h5, rn, harmony, harmony_hybrid
 * @example_react
 * ```tsx
 * export default class PageView extends Component {
 *   constructor() {
 *     super(...arguments)
 *   }
 *
 *   render() {
 *     return (
 *       <View className='components-page'>
 *         <Text>flex-direction: row 横向布局</Text>
 *         <View className='flex-wrp' style='flex-direction:row;'>
 *           <View className='flex-item demo-text-1'/>
 *           <View className='flex-item demo-text-2'/>
 *           <View className='flex-item demo-text-3'/>
 *         </View>
 *         <Text>flex-direction: column 纵向布局</Text>
 *         <View className='flex-wrp' style='flex-direction:column;'>
 *           <View className='flex-item flex-item-V demo-text-1'/>
 *           <View className='flex-item flex-item-V demo-text-2'/>
 *           <View className='flex-item flex-item-V demo-text-3'/>
 *         </View>
 *       </View>
 *     )
 *   }
 * }
 * ```
 * @example_vue
 * ```html
 * <template>
 *   <view class="components-page">
 *     <text>flex-direction: row 横向布局</text>
 *     <view class="flex-wrp flex-wrp-row" hover-class="hover" >
 *       <view class="flex-item demo-text-1" :hover-stop-propagation="true" />
 *       <view class="flex-item demo-text-2" hover-start-time="1000" hover-class="hover" />
 *       <view class="flex-item demo-text-3" hover-stayTime="1000" hover-class="hover" />
 *     </view>
 *     <text>flex-direction: column 纵向布局</text>
 *     <view class="flex-wrp flex-wrp-column">
 *       <view class="flex-item flex-item-V demo-text-1" />
 *       <view class="flex-item flex-item-V demo-text-2" />
 *       <view class="flex-item flex-item-V demo-text-3" />
 *     </view>
 *   </view>
 * </template>
 *
 * <style>
 * .flex-wrp { display: flex; }
 * .flex-wrp-column{ flex-direction: column; }
 * .flex-wrp-row { flex-direction:row; padding: 20px; background: #f1f1f1; }
 * .flex-item { width: 180px; height: 90px; }
 * .demo-text-1 { background: #ccc; }
 * .demo-text-2 { background: #999; }
 * .demo-text-3 { background: #666; }
 * .hover {
 *   background: #000;
 * }
 * </style>
 * ```
 * @see https://developers.weixin.qq.com/miniprogram/dev/component/view.html
 */
declare const View: ComponentType<ViewProps>
export { View, ViewProps }
