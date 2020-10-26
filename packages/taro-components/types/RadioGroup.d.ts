import { ComponentType } from 'react'
import { StandardProps, CommonEventFunction, FormItemProps } from './common'

interface RadioGroupProps extends StandardProps, FormItemProps {
  /** RadioGroup 中选中项发生改变时触发 change 事件，detail = {value:[选中的radio的value的数组]}
   * @supported weapp, h5
   */
  onChange?: CommonEventFunction
}

declare namespace RadioGroupProps {
  interface onChangeEventDetail {
    value: string[]
  }
}

/** 单项选择器，内部由多个 Radio 组成。
 * @classification forms
 * @supported weapp, h5, rn
 * @see https://developers.weixin.qq.com/miniprogram/dev/component/radio-group.html
 */
declare const RadioGroup: ComponentType<RadioGroupProps>

export { RadioGroup, RadioGroupProps }
