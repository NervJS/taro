import { ComponentType } from 'react'
import { StandardProps, CommonEventFunction, FormItemProps } from './common'

export interface RadioGroupProps extends StandardProps, FormItemProps {
  onChange?: CommonEventFunction
}

declare const RadioGroup: ComponentType<RadioGroupProps>

export interface RadioProps extends StandardProps {

  /**
   * `<radio/>` 标识。当该`<radio/>` 选中时，`<radio-group/>`的 change 事件会携带`<radio/>`的value
   */
  value: string,

  /**
   * 当前是否选中
   *
   * 默认值：`fasle`
   */
  checked?: boolean,

  /**
   * 是否禁用
   *
   * 默认值：`false`
   */
  disabled?: boolean,

  /**
   * radio的颜色，同css的color
   *
   */
  color?: string
}

declare const Radio: ComponentType<RadioProps>

export { RadioGroup, Radio }
