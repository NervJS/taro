import { ComponentType } from 'react'
import { StandardProps, CommonEventFunction, FormItemProps } from './common'

interface SliderProps extends StandardProps, FormItemProps {
  /** 最小值
   * @default 0
   * @supported weapp, h5, rn, swan, alipay, tt
   */
  min?: number

  /** 最大值
   * @default 100
   * @supported weapp, h5, rn, swan, alipay, tt
   */
  max?: number

  /** 步长，取值必须大于 0，并且可被(max - min)整除
   * @default 1
   * @supported weapp, h5, rn, swan, alipay, tt
   */
  step?: number

  /** 是否禁用
   * @default false
   * @supported weapp, h5, rn, swan, alipay, tt
   */
  disabled?: boolean

  /** 当前取值
   * @default 0
   * @supported weapp, h5, rn, swan, alipay, tt
   */
  value?: number

  /** 背景条的颜色（请使用 backgroundColor）
   * @default "#e9e9e9"
   * @supported weapp, tt
   */
  color?: string

  /** 已选择的颜色（请使用 activeColor）
   * @default "#1aad19"
   * @supported weapp, tt
   */
  selectedColor?: string

  /** 已选择的颜色
   * @default "#1aad19"
   * @supported weapp, h5, rn, swan, alipay, tt
   */
  activeColor?: string

  /** 背景条的颜色
   * @default "#e9e9e9"
   * @supported weapp, h5, rn, swan, alipay, tt
   */
  backgroundColor?: string

  /** 滑块的大小，取值范围为 12 - 28
   * @default 28
   *  @supported weapp, h5, swan, alipay, tt
   */
  blockSize?: number

  /** 滑块的颜色
   * @default "#ffffff"
   * @supported weapp, h5, rn, swan, alipay, tt
   */
  blockColor?: string

  /** 是否显示当前 value
   * @default false
   * @supported weapp, h5, rn, swan, alipay, tt
   */
  showValue?: boolean

  /** 完成一次拖动后触发的事件
   * @supported weapp, h5, rn, swan, alipay, tt
   */
  onChange?: CommonEventFunction<SliderProps.onChangeEventDetail>

  /** 拖动过程中触发的事件
   * @supported weapp, h5, rn, swan, alipay, tt
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
 * @supported weapp, h5, rn, swan, alipay, tt
 * @example
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
 * @see https://developers.weixin.qq.com/miniprogram/dev/component/slider.html
 */
declare const Slider: ComponentType<SliderProps>

export { Slider, SliderProps }
