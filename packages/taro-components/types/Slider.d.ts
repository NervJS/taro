import { ComponentType } from 'react'
import { StandardProps, CommonEventFunction, FormItemProps } from './common'
interface SliderProps extends StandardProps, FormItemProps {
  /** 最小值
   * @default 0
   * @supported weapp, alipay, swan, tt, qq, jd, h5, rn
   */
  min?: number
  /** 最大值
   * @default 100
   * @supported weapp, alipay, swan, tt, qq, jd, h5, rn
   */
  max?: number
  /** 步长，取值必须大于 0，并且可被(max - min)整除
   * @default 1
   * @supported weapp, alipay, swan, tt, qq, jd, h5, rn
   */
  step?: number
  /** 是否禁用
   * @default false
   * @supported weapp, alipay, swan, tt, qq, jd, h5, rn
   */
  disabled?: boolean
  /** 当前取值
   * @default 0
   * @supported weapp, alipay, swan, tt, qq, jd, h5, rn
   */
  value?: number
  /** 背景条的颜色（请使用 backgroundColor）
   * @default "#e9e9e9"
   * @supported weapp, tt, qq, jd
   */
  color?: string
  /** 已选择的颜色（请使用 activeColor）
   * @default "#1aad19"
   * @supported weapp, tt, qq, jd
   */
  selectedColor?: string
  /** 已选择的颜色
   * @default "#1aad19"
   * @supported weapp, alipay, swan, tt, qq, jd, h5, rn
   */
  activeColor?: string
  /** 背景条的颜色
   * @default "#e9e9e9"
   * @supported weapp, alipay, swan, tt, qq, jd, h5, rn
   */
  backgroundColor?: string
  /** 滑块的大小，取值范围为 12 - 28
   * @default 28
   *  @supported weapp, swan, tt, qq, jd, h5
   */
  blockSize?: number
  /** 滑块的颜色
   * @default "#ffffff"
   * @supported weapp, swan, tt, qq, jd, h5, rn
   */
  blockColor?: string
  /** 是否显示当前 value
   * @default false
   * @supported weapp, alipay, swan, tt, qq, jd, h5, rn
   */
  showValue?: boolean
  /** 组件名字，用于表单提交获取数据。
   * @supported alipay
   */
  name?: string
  /** 轨道线条高度。
   * @default 4
   * @supported alipay
   */
  trackSize?: string
  /** 滑块大小。
   * @default 22
   * @supported alipay
   */
  handleSize?: string
  /** 滑块填充色，同 CSS 色值。
   * @supported alipay
   */
  handleColor?: string
  /** 无障碍访问，（属性）元素的额外描述
   * @supported qq
   */
  ariaLabel?: string
  /** 完成一次拖动后触发的事件
   * @supported weapp, alipay, swan, tt, qq, jd, h5, rn
   */
  onChange?: CommonEventFunction<SliderProps.onChangeEventDetail>
  /** 拖动过程中触发的事件
   * @supported weapp, alipay, swan, tt, qq, jd, h5, rn
   */
  onChanging?: CommonEventFunction<SliderProps.onChangeEventDetail>
}
declare namespace SliderProps {
  interface onChangeEventDetail {
    value
  }
}
/** 滑动选择器
 * @classification forms
 * @supported weapp, alipay, swan, tt, qq, jd, h5, rn, harmony
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
 *         <Text>设置 step</Text>
 *         <Slider step={1} value={50}/>
 *         <Text>显示当前 value</Text>
 *         <Slider step={1} value={50} showValue/>
 *         <Text>设置最小/最大值</Text>
 *         <Slider step={1} value={100} showValue min={50} max={200}/>
 *       </View>
 *     )
 *   }
 * }
 * ```
 * @example_vue
 * ```html
 * <template>
 *   <view class="components-page">
 *     <text>设置 step</text>
 *     <slider step="1" value="50"/>
 *     <text>显示当前 value</text>
 *     <slider step="1" value="50" :show-value="true" />
 *     <text>设置最小/最大值</text>
 *     <slider step="1" value="100" :show-value="true" min="50" max="200"/>
 *   </view>
 * </template>
 * ```
 * @see https://developers.weixin.qq.com/miniprogram/dev/component/slider.html
 */
declare const Slider: ComponentType<SliderProps>
export { Slider, SliderProps }
