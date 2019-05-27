import { ComponentType } from 'react'
import { StandardProps, CommonEventFunction, FormItemProps } from './common'

export interface SliderProps extends StandardProps, FormItemProps {

  /**
   * 最小值
   *
   * 默认值：`0`
   */
  min?: number,

  /**
   * 最大值
   *
   * 默认值：`100`
   */
  max?: number,

  /**
   * 步长，取值必须大于 0，并且可被(max - min)整除
   *
   * 默认值：`1`
   */
  step?: number,

  /**
   * 是否禁用
   *
   * 默认值：`false`
   */
  disabled?: boolean,

  /**
   * 当前取值
   *
   * 默认值：`0`
   */
  value?: number,

  /**
   * 背景条的颜色（请使用 backgroundColor）
   *
   * 默认值：`#e9e9e9`
   */
  color?: string,

  /**
   * 已选择的颜色（请使用 activeColor）
   *
   * 默认值：`#1aad19`
   */
  selectedColor?: string,

  /**
   * 已选择的颜色
   *
   * 默认值：`#1aad19`
   */
  activeColor?: string,

  /**
   * 背景条的颜色
   *
   * 默认值：`#e9e9e9`
   */
  backgroundColor?: string,

  /**
   * 滑块的大小，取值范围为 12 - 28
   *
   * 默认值：`28`
   */
  blockSize?: number,

  /**
   * 滑块的颜色
   *
   * 默认值：`#ffffff`
   */
  blockColor?: string,

  /**
   * 是否显示当前 value
   *
   * 默认值：`false`
   */
  showValue?: boolean,

  /**
   * 完成一次拖动后触发的事件
   *
   * event.detail = {value: value}
   */
  onChange?: CommonEventFunction,

  /**
   * 拖动过程中触发的事件
   *
   * event.detail = {value: value}
   */
  onChanging?: CommonEventFunction
}

declare const Slider: ComponentType<SliderProps>

export { Slider }
